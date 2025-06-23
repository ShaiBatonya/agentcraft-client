import React from 'react';
import Toast, { type ToastMessage } from './Toast';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[60] space-y-3 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            toast={toast}
            onRemove={onRemove}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer; 