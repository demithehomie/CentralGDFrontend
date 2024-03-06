import  { createContext, useContext, useState, ReactNode, FunctionComponent } from 'react';
import Toast from '../../components/toast/Toast'; // Verifique o caminho

// Definindo o tipo para os props do ToastProvider
interface ToastProviderProps {
  children: ReactNode;
}

// Definindo o tipo para o estado do toast
interface ToastState {
  show: boolean;
  type: string;
  message: string;
}

// Definindo o tipo para a função que será chamada para exibir o toast
type TriggerToastFunction = (type: string, message: string) => void;

// Criando o contexto com um valor padrão que tem a estrutura esperada
const ToastContext = createContext<TriggerToastFunction>(() => {});

// UseToast Hook
export const useToast = () => useContext(ToastContext);

// ToastProvider Component
export const ToastProvider: FunctionComponent<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({ show: false, type: '', message: '' });

  const triggerToast: TriggerToastFunction = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 3000);
  };

  return (
    <ToastContext.Provider value={triggerToast}>
      {children}
      <Toast show={toast.show} onClose={() => setToast({ show: false, type: '', message: '' })} type={toast.type}>
        {toast.message}
      </Toast>
    </ToastContext.Provider>
  );
};
