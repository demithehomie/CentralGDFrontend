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
// C:\Users\user\Documents\CODING\BaileDoBilinha\NovoBaile\frontend-bailedobilinha-web\dist\index.html