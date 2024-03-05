// import React, { useState, useCallback } from 'react';
// import ReactDOM from 'react-dom';
// import Toast from '../Toast';

// function useToast() {
//   const [toasts, setToasts] = useState([]);

// const addToast = useCallback((message) => {
//     const id = Math.random().toString(36);
//     const newToast = { id, message };
//     setToasts((currentToasts: { id: string; message: any; }[]) => [...currentToasts, newToast]);

//     setTimeout(() => {
//         setToasts((currentToasts: { id: string; message: any; }[]) => currentToasts.filter((toast) => toast.id !== id));
//     }, 3000); // Ajuste a duração conforme necessário
// }, []);

//   const ToastContainer = () => (
//     <div>
//       {toasts.map((toast) => (
//         <Toast key={toast.id} message={toast.message} onDismiss={() => setToasts((currentToasts) => currentToasts.filter((t) => t.id !== toast.id))} />
//       ))}
//     </div>
//   );

//   return { addToast, ToastContainer };
// }
