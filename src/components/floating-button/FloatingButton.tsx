import React from 'react';
import { Link /*, useParams, useHistory */ } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

import './FloatingButton.css'



const FloatingButtons: React.FC = () => {
    // const { destination } = useParams();
    // const history = useHistory();
  
//   // Função para tratar a navegação
//   const handleNavigation = () => {
//     // Use o valor de 'destination' para determinar para onde navegar
//     console.log(`Navegando para: ${destination}`);

//     // Use o método 'push' do histórico para navegar para a nova rota
//     history.push(`/${destination}`);
//   };
  return (
    <div className="floating-buttons-container">
      {/* Botão 1 */}
      <Link to="/dashboard" className="floating-button">
        <div className="circle-dark-navy">
        <FontAwesomeIcon icon={faHome} className="white-arrow" />

          <i className="fas fa-arrow-left white-arrow"></i>
        </div>
      </Link>

      {/* Botão 2
      <Link to="/rota-2" className="floating-button">
        <div className="circle-dark-navy">
          <i className="fas fa-arrow-right white-arrow"></i>
        </div>
      </Link> */}
    </div>
  );
};

export default FloatingButtons;
