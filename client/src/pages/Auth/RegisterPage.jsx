import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage = () => {
  const { register: registerInput, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: createAccount, loading } = useAuth();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await createAccount({ name: data.name, email: data.email, password: data.password });
      toast.success('Account created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create account');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-800/95 border border-slate-700 p-8 shadow-2xl backdrop-blur">
        <h1 className="text-3xl font-semibold">Create an account</h1>
        <p className="mt-3 text-slate-400">Start tracking income and expenses instantly.</p>

        <form className="space-y-5 mt-8" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="text-sm text-slate-300">Full Name</span>
            <input
              type="text"
              {...registerInput('name', { required: 'Name is required' })}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              placeholder="Jane Doe"
            />
            {errors.name && <p className="mt-2 text-sm text-rose-400">{errors.name.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Email</span>
            <input
              type="email"
              {...registerInput('email', { required: 'Email is required' })}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-2 text-sm text-rose-400">{errors.email.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Password</span>
            <input
              type="password"
              {...registerInput('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              placeholder="Create a password"
            />
            {errors.password && <p className="mt-2 text-sm text-rose-400">{errors.password.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Confirm Password</span>
            <input
              type="password"
              {...registerInput('confirmPassword', { required: 'Please confirm your password' })}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              placeholder="Confirm password"
            />
            {errors.confirmPassword && <p className="mt-2 text-sm text-rose-400">{errors.confirmPassword.message}</p>}
          </label>

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-indigo-500 px-4 py-3 text-base font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-600"
            type="submit"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
