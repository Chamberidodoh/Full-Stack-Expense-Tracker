import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-800/95 border border-slate-700 p-8 shadow-2xl backdrop-blur">
        <h1 className="text-3xl font-semibold">Sign in to your account</h1>
        <p className="mt-3 text-slate-400">Secure access to your expense dashboard.</p>

        <form className="space-y-5 mt-8" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="text-sm text-slate-300">Email</span>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-2 text-sm text-rose-400">{errors.email.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Password</span>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-2 text-sm text-rose-400">{errors.password.message}</p>}
          </label>

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-indigo-500 px-4 py-3 text-base font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-600"
            type="submit"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
