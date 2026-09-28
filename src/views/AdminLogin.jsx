import React from 'react';
import { useStore } from '../context/StoreContext';
import { AdminLockModal } from '../components/AdminLockModal';

export const AdminLogin = () => {
  const { unlockAdminConsole, navigateTo, showToast } = useStore();

  return (
    <AdminLockModal 
      onUnlock={() => {
        unlockAdminConsole();
        showToast('🔓 Master Admin Console Unlocked!');
        navigateTo('admin');
      }}
      onCancel={() => navigateTo('home')}
    />
  );
};
