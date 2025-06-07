import { useState, useEffect } from 'react';
import { supabase, type Service, type ServiceType } from '../lib/supabase';

export const useServices = (userId?: string) => {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchServices();
    }
    fetchServiceTypes();
  }, [userId]);

  const fetchServices = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('service_types')
        .select('*')
        .eq('status', 'published')
        .order('name');

      if (error) throw error;
      setServiceTypes(data || []);
    } catch (error) {
      console.error('Error fetching service types:', error);
    }
  };

  const createService = async (serviceData: {
    name: string;
    type: string;
    serviceTypeId: string;
    environmentVariables: Record<string, string>;
  }) => {
    if (!userId) throw new Error('User not authenticated');

    try {
      // Get service type details
      const serviceType = serviceTypes.find(st => st.id === serviceData.serviceTypeId);
      if (!serviceType) throw new Error('Service type not found');

      // Generate unique URL
      const serviceId = crypto.randomUUID();
      const cleanName = serviceData.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      const url = `https://${cleanName}-${serviceId.substring(0, 8)}.user.lunarpedia.app`;

      const newService = {
        id: serviceId,
        user_id: userId,
        name: serviceData.name,
        type: serviceData.type,
        docker_image: serviceType.docker_image,
        status: 'pending' as const,
        credits_per_month: serviceType.credits_per_month,
        url,
        has_custom_domain: false,
        environment_variables: serviceData.environmentVariables,
        ports: serviceType.default_ports
      };

      const { data, error } = await supabase
        .from('services')
        .insert([newService])
        .select()
        .single();

      if (error) throw error;

      // Record credit usage
      await supabase
        .from('credit_transactions')
        .insert([
          {
            user_id: userId,
            type: 'usage',
            amount: -serviceType.credits_per_month,
            description: `Monthly subscription for ${serviceData.name}`,
            service_id: serviceId
          }
        ]);

      // Update user credits
      await supabase.rpc('update_user_credits', {
        user_id: userId,
        credit_change: -serviceType.credits_per_month
      });

      setServices(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const deleteService = async (serviceId: string) => {
    try {
      const service = services.find(s => s.id === serviceId);
      if (!service) throw new Error('Service not found');

      // Calculate pro-rated refund
      const now = new Date();
      const createdDate = new Date(service.created_at);
      const daysInMonth = 30;
      const daysUsed = Math.ceil((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      const remainingDays = Math.max(0, daysInMonth - (daysUsed % daysInMonth));
      const refundAmount = Math.floor((remainingDays / daysInMonth) * service.credits_per_month);

      // Delete service
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      // Record refund transaction
      if (refundAmount > 0) {
        await supabase
          .from('credit_transactions')
          .insert([
            {
              user_id: service.user_id,
              type: 'refund',
              amount: refundAmount,
              description: `Pro-rated refund for ${service.name}`,
              service_id: serviceId
            }
          ]);

        // Update user credits
        await supabase.rpc('update_user_credits', {
          user_id: service.user_id,
          credit_change: refundAmount
        });
      }

      setServices(prev => prev.filter(s => s.id !== serviceId));
      return { refundAmount, error: null };
    } catch (error) {
      return { refundAmount: 0, error };
    }
  };

  const updateServiceStatus = async (serviceId: string, status: Service['status']) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', serviceId)
        .select()
        .single();

      if (error) throw error;

      setServices(prev => prev.map(s => s.id === serviceId ? data : s));
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return {
    services,
    serviceTypes,
    loading,
    createService,
    deleteService,
    updateServiceStatus,
    refetchServices: fetchServices
  };
};