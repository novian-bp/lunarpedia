import { useState, useEffect } from 'react';
import { supabase, type User } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setError('Failed to get session');
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('Session found, fetching user profile...');
          await fetchUserProfile(session.user.id);
        } else {
          console.log('No session found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setError('Failed to initialize auth');
          setLoading(false);
        }
      }
    };

    const fetchUserProfile = async (userId: string) => {
      try {
        console.log('Fetching profile for user:', userId);
        
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (!mounted) return;

        if (error) {
          console.error('Error fetching user profile:', error);
          
          // If user doesn't exist in our users table, wait for trigger to create it
          if (error.code === 'PGRST116' || !data) {
            console.log('User profile not found, waiting for creation...');
            
            if (retryCount < maxRetries) {
              retryCount++;
              setTimeout(() => {
                if (mounted) {
                  fetchUserProfile(userId);
                }
              }, 2000);
              return;
            } else {
              setError('Failed to create user profile');
              setLoading(false);
              return;
            }
          }
          
          setError('Failed to fetch user profile');
          setLoading(false);
          return;
        }

        if (data) {
          console.log('User profile found:', data);
          setUser(data);
          setError(null);
        } else {
          console.log('No user profile found, waiting for creation...');
          
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(() => {
              if (mounted) {
                fetchUserProfile(userId);
              }
            }, 2000);
            return;
          } else {
            setError('User profile not found');
          }
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
        if (mounted) {
          setError('Failed to fetch user profile');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;
        
        retryCount = 0; // Reset retry count on auth change
        
        if (session?.user) {
          setLoading(true);
          setError(null);
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setError(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) throw error;

      console.log('Sign up successful:', data);
      return { data, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      console.log('Sign in successful:', data);
      return { data, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut
  };
};