// Toast.js

import './Toast.css'; // Importando o CSS para o Toast

const Toast = ({ children, show, onClose, type }: any) => {
  return (
    <div className={`toast ${show ? 'show' : ''} ${type}`} onClick={onClose}>
      {children}
    </div>
  );
};

export default Toast;
