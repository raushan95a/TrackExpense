import toast from 'react-hot-toast';
import { authApi } from '../api/auth.api.js';
import Card from '../components/common/Card.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import PasswordForm from '../components/profile/PasswordForm.jsx';
import ProfileForm from '../components/profile/ProfileForm.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function ProfilePage() {
  const { user, updateUser, replaceToken } = useAuth();

  const saveProfile = async (values) => {
    const { user: updated } = await authApi.updateProfile(values);
    updateUser(updated);
    toast.success('Profile updated');
  };

  // The server revokes older tokens on password change, so store the new one.
  const changePassword = async (values) => {
    const { token } = await authApi.changePassword(values);
    replaceToken(token);
    toast.success('Password changed. Other sessions have been signed out.');
  };

  return (
    <>
      <PageHeader title="Profile" description="Manage your account details and security." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Account details">
          <ProfileForm user={user} onSubmit={saveProfile} />
        </Card>
        <Card title="Change password">
          <PasswordForm onSubmit={changePassword} />
        </Card>
      </div>
    </>
  );
}
