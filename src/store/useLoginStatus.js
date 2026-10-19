import { create } from 'zustand';

const useLoginStatus = create((set) => ({
  isLoggedIn: !!localStorage.getItem('token'),

  login: () => {
    set({ isLoggedIn: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ isLoggedIn: false });
  },
}));

export default useLoginStatus;
