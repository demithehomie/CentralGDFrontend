
import { useNavigate } from 'react-router-dom';
import './index.css';
//import { IconType } from 'react-icons';

export interface FloatingButtonProps {
    icon?:  React.ElementType<{ size?: string }>; 
    customRedirect?: string;
    size?: string;
}
  

export const CustomNavigationFloatingButton: React.FC<FloatingButtonProps> = ({ customRedirect, icon: Icon, size }: any) => {

    const navigate = useNavigate();

    const handleClick = () => {
      if (customRedirect) {
        // Redirecionar para a página personalizada usando useNavigate do React Router DOM
        navigate(customRedirect);
      } else {
        // Lógica de manipulação de clique padrão
        console.log('Button clicked!');
      }
    };
  

  return (
   <>
     <button className="custom-floating-button" onClick={handleClick}>
     {Icon && <Icon size={size} />}
    </button>
    
   </>
  )
}
