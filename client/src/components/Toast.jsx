import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Toast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="toast-container">
      <div className={`toast toast-${toastMessage.type || 'success'}`}>
        {toastMessage.type === 'info' ? (
          <Info size={18} color="var(--color-secondary)" />
        ) : (
          <CheckCircle2 size={18} color="var(--color-accent-green)" />
        )}
        <span>{toastMessage.message}</span>
      </div>
    </div>
  );
};

export default Toast;
