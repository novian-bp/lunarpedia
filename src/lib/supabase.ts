import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  user_id: string;
  name: string;
  type: string;
  docker_image: string;
  status: 'running' | 'stopped' | 'pending' | 'error';
  credits_per_month: number;
  url: string;
  custom_domain?: string;
  has_custom_domain: boolean;
  environment_variables: Record<string, string>;
  ports: Array<{
    internal: number;
    external: number;
    protocol: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface ServiceType {
  id: string;
  name: string;
  type: string;
  docker_image: string;
  description: string;
  credits_per_month: number;
  status: 'published' | 'draft' | 'archived';
  default_environment: Record<string, any>;
  default_ports: Array<{
    internal: number;
    external: number;
    protocol: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  type: 'purchase' | 'usage' | 'refund';
  amount: number;
  description: string;
  service_id?: string;
  created_at: string;
}

export interface UserAddon {
  id: string;
  user_id: string;
  service_id: string;
  addon_type: string;
  addon_name: string;
  credits_per_month: number;
  status: 'active' | 'cancelled';
  activated_at: string;
  next_billing: string;
  created_at: string;
  updated_at: string;
}