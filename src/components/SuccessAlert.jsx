import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

const SuccessAlert = ({ success, onClose }) => {
  const lastSuccessRef = useRef(null);

  useEffect(() => {
    if (success && success !== lastSuccessRef.current) {
      toast.success(success);
      lastSuccessRef.current = success;

      if (typeof onClose === 'function') {
        const timeout = setTimeout(onClose, 5000); // auto-dismiss logic
        return () => clearTimeout(timeout);
      }
    }
  }, [success, onClose]);

  return null;
};

export default SuccessAlert;
