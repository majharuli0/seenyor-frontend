import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

export const useUserStore = create((set) => {
  const getStoredUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return { ...decoded };
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
      return null;
    }
  };

  const storedUser = getStoredUser();

  return {
    // ===== STATE =====
    token: localStorage.getItem('token') || null,
    user: storedUser,
    permissions: {},

    // ===== ACTIONS=====
    setToken: (token) => {
      localStorage.setItem('token', token);
      try {
        const decoded = jwtDecode(token);
        set({ token, user: decoded });
      } catch (error) {
        console.error('Token decode failed:', error);
        set({ token: null, user: null });
      }
    },

    setUserDetails: (userDetails) => {
      const permissions = userDetails?.monitoring_agency_access || {};
      set({ user: userDetails, permissions });
    },

    setPermissions: (permissions) => set({ permissions }),

    clearUser: () => {
      localStorage.removeItem('token');
      set({ user: null, token: null, permissions: {} });
    },

    getToken: () => localStorage.getItem('token'),
    getUser: () => getStoredUser(),
  };
});
