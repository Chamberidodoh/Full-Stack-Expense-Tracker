import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getProfile, updateProfile, changePassword } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const ProfilePage = () => {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const response = await getProfile();
        setProfile(response.data);
        reset({ name: response.data.name, email: response.data.email, avatar: response.data.avatar || '' });
      } catch (error) {
        toast.error('Unable to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const onUpdateProfile = async (data) => {
    try {
      const response = await updateProfile(data);
      setProfile(response.data);
      setUser(response.data);
      localStorage.setItem('expense_user', JSON.stringify(response.data));
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update profile');
    }
  };

  const onChangePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully');
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to change password');
    }
  };

  if (loading || !profile) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white">Profile</h2>
        <form className="mt-6 grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit(onUpdateProfile)}>
          <label className="block">
            <span className="text-sm text-slate-400">Name</span>
            <input type="text" {...register('name', { required: 'Name is required' })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none" />
            {errors.name && <p className="mt-2 text-sm text-rose-400">{errors.name.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Email</span>
            <input type="email" {...register('email', { required: 'Email is required' })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none" />
            {errors.email && <p className="mt-2 text-sm text-rose-400">{errors.email.message}</p>}
          </label>

          <label className="block lg:col-span-2">
            <span className="text-sm text-slate-400">Avatar URL</span>
            <input type="url" {...register('avatar')} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none" />
          </label>

          <button className="rounded-2xl bg-indigo-500 px-6 py-3 text-white hover:bg-indigo-400" type="submit">Update profile</button>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white">Change Password</h2>
        <form className="mt-6 grid gap-4 lg:grid-cols-2" onSubmit={handlePasswordSubmit(onChangePassword)}>
          <label className="block">
            <span className="text-sm text-slate-400">Current Password</span>
            <input type="password" {...registerPassword('currentPassword', { required: 'Current password is required' })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none" />
            {passwordErrors.currentPassword && <p className="mt-2 text-sm text-rose-400">{passwordErrors.currentPassword.message}</p>}
          </label>
          <label className="block">
            <span className="text-sm text-slate-400">New Password</span>
            <input type="password" {...registerPassword('newPassword', { required: 'New password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none" />
            {passwordErrors.newPassword && <p className="mt-2 text-sm text-rose-400">{passwordErrors.newPassword.message}</p>}
          </label>
          <label className="block lg:col-span-2">
            <span className="text-sm text-slate-400">Confirm New Password</span>
            <input type="password" {...registerPassword('confirmPassword', { required: 'Please confirm your password' })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none" />
            {passwordErrors.confirmPassword && <p className="mt-2 text-sm text-rose-400">{passwordErrors.confirmPassword.message}</p>}
          </label>
          <button className="rounded-2xl bg-indigo-500 px-6 py-3 text-white hover:bg-indigo-400" type="submit">Update password</button>
        </form>
      </section>
    </div>
  );
};
