  import React, { useEffect, useState } from 'react';
  import './Dashboard.css';
  import { useNavigate } from 'react-router-dom';
  import logo from '../../assets/fGuerra.png';
  import axios from 'axios';
  import logo_profile from '../../assets/user_logo.jpg';
 import report from '../../assets/icons/report.png';
 import warning from '../../assets/icons/warning.png';
   import bell from '../../assets/icons/bell.png';
 import DashboardCard from '../../components/dashboard-cards/DashboardCard';
import DashboardCardMobile from '../../components/dashboard-cards-mobile/DashboardCardsMobile';

  //import someIcon from './path-to/some-icon.png';

  const Dashboard: React.FC = () => {
    const [cards, setCards] = useState<CardData[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    
  useEffect(() => {
    // Faça a solicitação HTTP para buscar as notificações mais recentes do backend
    axios.get('https://gdcompanion-prod.onrender.com/notifications') // Substitua pela rota do seu backend
      .then((response) => response.data)
      .then((data) => {
        // Mapeie os dados recebidos do backend para o formato desejado
        const mappedNotifications = data.map((notification: { categoria: any; id: any; titulo: any; }) => {
          let backgroundColor = '';
          let icon = '';

          switch (notification.categoria) {
            case 'notifications':
              backgroundColor = '#FFFF00'; // Amarelo
              icon = bell;
              break;
            case 'relatorios':
              backgroundColor = '#0000FF'; // Azul
                icon = report;
              break;
            case 'pagamentos':
              backgroundColor = '#FF0000'; // Vermelho
              icon = warning;
              break;
            // Adicione mais casos para outras categorias, seguindo o mesmo padrão
            default:
              backgroundColor = '#FFFFFF'; // Cor padrão
              icon = '';
          }

          return {
            id: notification.id,
            backgroundColor,
            color: getTextColor(backgroundColor),
            title: notification.titulo,
            icon,
            ctaText: 'Ver Mais',
          };
        });

        setCards(mappedNotifications);
      })
      .catch((error) => {
        console.error('Erro ao buscar notificações do backend:', error);
      });
  }, []);

    const handleCtaClick = (id: number) => {
      console.log(`CTA clicked for Card ${id}`);
    };

    interface CardData {
      id: number;
      // badge: string;
      //category: string;
      backgroundColor: string;
      badge: string;
      color: string;
      title: string;
      icon?: string;
      ctaText: string;
    }
    

 const getTextColor = (color: string) => {
    const colorsNeedingBlackText = ['#FFFF00', '#0000FF', '#FF0000']; // Amarelo, Azul, Vermelho
    return colorsNeedingBlackText.includes(color.toUpperCase()) ? '#000000' : '#FFFFFF'; // Preto ou Branco
  };
    const profile = async () => {
      navigate('/profile')
    }
    
    
    const prints = async () => {
      navigate('/get-prints-themagictool')
    }

    const targets = async () => {
      navigate('/target')
    }

    const payments = async () => {
      navigate('/payments')
    }

  
    const getAllMGMTReports = async () => {
      navigate('/mgmt-reports')
    }

    const getAllUsers = async () => {
      navigate('/users')
    }

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };
    

    return (
      <>
      <div className="dashboard-container-phone">

    
        
        
        <div>
             <div className="logo">
              <img src={logo} alt="logo"  />
            </div>
            <div>
        <div className="cards-container">
        {cards.map((card) => (
          <DashboardCardMobile
          badge={card.badge}
            key={card.id}
            backgroundColor={card.backgroundColor}
            color={getTextColor(card.backgroundColor)} 
            title={card.title}
            icon={card.icon}
            ctaText={card.ctaText}
            onCtaClick={() => handleCtaClick(card.id)}
            className="dashboard-card"
    />
  ))}
</div>
        </div>
        <br /><br />
        <label>Menu</label>
        <br />
       
            <button className="button-mobile" onClick={getAllMGMTReports}>Relatórios</button>
            <button className="button-mobile" onClick={getAllUsers}>Usuários</button>
            <button className="button-mobile" onClick={prints}  >Prints</button>
            <button className="button-mobile" onClick={targets}  >Targets</button>
            <button className="button-mobile" onClick={payments}>Pagamentos</button>
        </div>

      </div>
    
      <div className="dashboard-container">
        
        <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
            <div className="logo">
              <img src={logo} alt="logo"  />
            </div>
            <div className="avatar" onClick={profile}>
              <img src={logo_profile} alt="logo_profile" className='profile-picture' />
            </div>
            <div className="name">
              Leandro Guerra
            </div>
        <div className="role">Admin</div>
            <button className="button" onClick={getAllMGMTReports}>Relatórios</button>
            <button className="button" onClick={getAllUsers}>Usuários</button>
            <button className="button" onClick={prints}  >Prints</button>
            <button className="button" onClick={targets}  >Targets</button>
            <button className="button" onClick={payments}>Pagamentos</button>
        {isMenuOpen && (
          <>
            <button className="button" onClick={getAllMGMTReports}>Relatórios</button>
            <button className="button" onClick={getAllUsers}>Usuários</button>
            <button className="button" onClick={prints}  >Prints</button>
            <button className="button" onClick={targets}  >Targets</button>
            <button className="button" onClick={payments}>Pagamentos</button>
          </>
        )}
      </div>

<div className="hamburger-button" onClick={toggleMenu}>
  <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
  <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
  <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
</div>



        <hr className='separador'/>

        <div className="main-content">
          
        <div className="cards-container">
        {cards.map((card) => (
          <DashboardCard
          badge={card.badge}
            key={card.id}
            backgroundColor={card.backgroundColor}
            color={getTextColor(card.backgroundColor)} 
            title={card.title}
            icon={card.icon}
            ctaText={card.ctaText}
            onCtaClick={() => handleCtaClick(card.id)}
            className="dashboard-card"
    />
  ))}
</div>
        </div>
      </div>
      </>
    );  
  };



  export default Dashboard;
