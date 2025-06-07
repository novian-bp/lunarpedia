import { useState, useEffect } from 'react';
import { supabase, type User } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('Found existing session for user:', session.user.id);
          await fetchUserProfile(session.user.id);
        } else {
          console.log('No existing session found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string, retryCount = 0) => {
    try {
      console.log('Fetching profile for user:', userId, 'retry:', retryCount);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If user doesn't exist and we haven't retried too many times
        if (error.code === 'PGRST116' && retryCount < 3) {
          console.log('User profile not found, retrying in 2 seconds...');
          setTimeout(() => fetchUserProfile(userId, retryCount + 1), 2000);
          return;
        }
        
        // If still no user after retries, create manually
        if (error.code === 'PGRST116' && retryCount >= 3) {
          console.log('Creating user profile manually...');
          await createUserProfile(userId);
          return;
        }
        
        throw error;
      }

      if (data) {
        console.log('User profile found:', data);
        setUser(data);
      } else if (retryCount < 3) {
        console.log('No user profile found, retrying...');
        setTimeout(() => fetchUserProfile(userId, retryCount + 1), 2000);
        return;
      } else {
        // Create user profile manually if not found after retries
        console.log('Creating user profile manually after retries...');
        await createUserProfile(userId);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setLoading(false);
    } finally {
      if (retryCount === 0) {
        setLoading(false);
      }
    }
  };

  const createUserProfile = async (userId: string) => {
    try {
      console.log('Creating user profile manually for:', userId);
      
      // Get user data from auth
      const { data: authUser } = await supabase.auth.getUser();
      
      if (!authUser.user) {
        throw new Error('No authenticated user found');
      }

      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            email: authUser.user.email || '',
            name: authUser.user.user_metadata?.name || 'User',
            credits: 250,
            role: 'user'
          }
        ])
        .select()
        .single();

      if (error) {
        // If user already exists, fetch it
        if (error.code === '23505') {
          console.log('User already exists, fetching...');
          await fetchUserProfile(userId, 0);
          return;
        }
        throw error;
      }

      console.log('User profile created successfully:', data);
      setUser(data);
    } catch (error) {
      console.error('Error creating user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      console.log('Starting sign up process for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      console.log('Sign up successful:', data);
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      console.log('Starting sign in process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Sign in successful:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut
  };
};