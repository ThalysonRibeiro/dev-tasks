'use client'
import { ToastContainer, Bounce } from 'react-toastify';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

export function ToastProvider() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={currentTheme === 'dark' ? 'dark' : 'light'}
      transition={Bounce}
    />
  );
}