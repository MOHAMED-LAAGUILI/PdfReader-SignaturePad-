import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

const ErrorAlert = ({ error, onClose }) => {
  const lastErrorRef = useRef(null);

  useEffect(() => {
    if (error && error !== lastErrorRef.current) {
      toast.error(error);
      lastErrorRef.current = error;

      if (typeof onClose === 'function') {
        const timeout = setTimeout(onClose, 5000); // auto-dismiss logic
        return () => clearTimeout(timeout);
      }
    }
  }, [error, onClose]);

  return null;
};

export default ErrorAlert;
