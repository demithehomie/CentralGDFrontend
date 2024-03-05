import  { useEffect } from 'react';
import './Toast.css'; // Assuma que este é o seu arquivo CSS para estilizar o toast

export function Toast({ message, duration = 3000, onDismiss }: any) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <div className="toast">
      {message}
    </div>
  );
}
