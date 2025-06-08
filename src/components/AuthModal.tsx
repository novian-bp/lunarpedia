import React, { useState } from 'react';
import { X, User, Lock, Mail, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp } = useAuth();

  const getErrorMessage = (error: any) => {
    if (error?.message?.includes('Invalid login credentials')) {
      return 'Email atau password salah. Silakan periksa kembali kredensial Anda.';
    }
    if (error?.message?.includes('Email not confirmed')) {
      return 'Silakan periksa email Anda dan klik link konfirmasi sebelum masuk.';
    }
    if (error?.message?.includes('User already registered')) {
      return 'Akun dengan email ini sudah ada. Silakan masuk sebagai gantinya.';
    }
    if (error?.message?.includes('Password should be at least')) {
      return 'Password harus minimal 6 karakter.';
    }
    if (error?.message?.includes('Unable to validate email address')) {
      return 'Format email tidak valid. Silakan masukkan email yang benar.';
    }
    if (error?.message?.includes('Signup is disabled')) {
      return 'Pendaftaran sementara dinonaktifkan. Silakan coba lagi nanti.';
    }
    return error?.message || 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;
      
      if (isLogin) {
        result = await signIn(email, password);
        
        if (result.error) {
          setError(getErrorMessage(result.error));
        } else if (result.data?.user) {
          setSuccess('Berhasil masuk! Mengarahkan ke dashboard...');
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      } else {
        // Sign up process
        result = await signUp(email, password, name);
        
        if (result.error) {
          setError(getErrorMessage(result.error));
        } else if (result.data?.user) {
          // Check if email confirmation is required
          if (result.data.user && !result.data.session) {
            setSuccess('Akun berhasil dibuat! Silakan periksa email Anda untuk konfirmasi sebelum masuk.');
            // Switch to login mode after successful signup
            setTimeout(() => {
              setIsLogin(true);
              setSuccess('');
              setEmail('');
              setPassword('');
              setName('');
            }, 3000);
          } else {
            // Direct login (email confirmation disabled)
            setSuccess('Akun berhasil dibuat! Selamat datang di Lunarpedia!');
            setTimeout(() => {
              onClose();
            }, 1000);
          }
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-white/10 p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
          </h2>
          <p className="text-white/60">
            {isLogin ? 'Masuk ke akun Lunarpedia Anda' : 'Bergabung dengan Lunarpedia hari ini'}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20 flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20 flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-400 text-sm">{error}</p>
              {error.includes('Email atau password salah') && (
                <p className="text-red-300/70 text-xs mt-1">
                  Belum punya akun?{' '}
                  <button
                    onClick={handleModeSwitch}
                    className="text-red-300 hover:text-red-200 underline"
                    disabled={loading}
                  >
                    Daftar di sini
                  </button>
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Nama Lengkap</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                  placeholder="Masukkan nama lengkap Anda"
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Alamat Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                placeholder="Masukkan email Anda"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:outline-none"
                placeholder="Masukkan password Anda"
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            {!isLogin && (
              <p className="text-white/50 text-xs mt-1">Password harus minimal 6 karakter</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isLogin ? 'Sedang Masuk...' : 'Membuat Akun...'}
              </>
            ) : (
              isLogin ? 'Masuk' : 'Buat Akun'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/60">
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
            <button
              onClick={handleModeSwitch}
              className="text-purple-400 hover:text-purple-300 ml-1 font-semibold"
              disabled={loading}
            >
              {isLogin ? 'Daftar' : 'Masuk'}
            </button>
          </p>
        </div>

        {!isLogin && (
          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-blue-400 text-sm text-center">
              Pengguna baru mendapat 250 kredit gratis untuk memulai!
            </p>
          </div>
        )}

        {isLogin && (
          <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <p className="text-amber-400 text-sm text-center">
              <strong>Tips:</strong> Pastikan Anda menggunakan email dan password yang benar. Jika belum punya akun, klik "Daftar" di atas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};