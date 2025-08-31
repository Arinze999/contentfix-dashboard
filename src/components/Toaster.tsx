'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast-overide.css';

export default function Toaster() {
  return (
    <ToastContainer
      position="top-right"
      newestOnTop
      closeOnClick
      draggable
      pauseOnHover
      pauseOnFocusLoss
      hideProgressBar={false}
      theme="light"
    />
  );
}
