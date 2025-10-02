import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const CustomToast = ({ 
  show, 
  onClose, 
  title, 
  message, 
  variant = 'success', 
  delay = 5000,
  position = 'top-end'
}) => {
  const [showToast, setShowToast] = useState(show);

  useEffect(() => {
    setShowToast(show);
  }, [show]);

  const handleClose = () => {
    setShowToast(false);
    if (onClose) onClose();
  };

  const getIcon = () => {
    switch (variant) {
      case 'success': return 'bi-check-circle-fill text-success';
      case 'error': return 'bi-x-circle-fill text-danger';
      case 'warning': return 'bi-exclamation-triangle-fill text-warning';
      case 'info': return 'bi-info-circle-fill text-info';
      default: return 'bi-info-circle-fill text-primary';
    }
  };

  return (
    <ToastContainer position={position} className="p-3">
      <Toast 
        show={showToast} 
        onClose={handleClose} 
        delay={delay} 
        autohide
        className="shadow"
      >
        <Toast.Header>
          <i className={`${getIcon()} me-2`}></i>
          <strong className="me-auto">{title}</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

// Toast hook for easy usage
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (title, message, variant = 'success') => {
    const id = Date.now();
    const newToast = { id, title, message, variant, show: true };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after delay
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5500);
  };

  const hideToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastProvider = () => (
    <>
      {toasts.map(toast => (
        <CustomToast
          key={toast.id}
          show={toast.show}
          title={toast.title}
          message={toast.message}
          variant={toast.variant}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </>
  );

  return { showToast, ToastProvider };
};

export default CustomToast;
