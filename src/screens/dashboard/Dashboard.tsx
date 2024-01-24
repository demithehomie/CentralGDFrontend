  import React from 'react';
  import './Dashboard.css';
  import { useNavigate } from 'react-router-dom';
  import logo from '../../assets/logoo.png';
  import logo_profile from '../../assets/user_logo.jpg';
  // import report from '../../assets/icons/report.png';
  // import megaphone from '../../assets/icons/megaphone.png';
  // import bell from '../../assets/icons/bell.png';
  import warning from '../../assets/icons/warning.png';
  import DashboardCard from '../../components/dashboard-cards/DashboardCard';

  //import someIcon from './path-to/some-icon.png';

  const Dashboard: React.FC = () => {
    const navigate = useNavigate();
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

     // Função para determinar a cor do texto com base na cor do cartão
     const getTextColor = (color: string) => {
      const colorsNeedingBlackText = ['#33FF57', '#FFBF00']; // Verde e Amarelo
      return colorsNeedingBlackText.includes(color.toUpperCase()) ? '#000000' : '#FFFFFF'; // Preto ou Branco
    };


    const cards: CardData[] = [
      { id: 1, badge: "2024", color: "", backgroundColor: "#FF5733", title: "Notificações e Dashboard sendo reformados..", icon: warning, ctaText: "Aguarde" },
      // { id: 2, badge: "2024", color: "", backgroundColor: "#33FF57", title: "Relatório Anual 2024", icon: bell, ctaText: "Ver Mais" },
      // { id: 3, badge: "2024", color: "", backgroundColor: "#3357FF", title: "As regras para o pix mudaram.", icon: report, ctaText: "Ver Detalhes" },
      // { id: 4, badge: "2024", color: "", backgroundColor: "#33FF57", title: "326 transferências agendadas para hoje.", icon: bell, ctaText: "Saiba Mais" },
      // { id: 5, badge: "2024", color: "", backgroundColor: "#FFBF00", title: "Ver todas as notificações.", icon: megaphone, ctaText: "Ver Detalhes" },
     
      // ...outros cards...
    ];
    
    


    const profile = async () => {
      navigate('/profile')
    }
    
    
    const prints = async () => {
      navigate('/get-prints-themagictool')
    }

    const targets = async () => {
      navigate('/target')
    }
    // const configure = async () => {
    //   navigate('/configure')
    // }

    // const scheduling = async () => {
    //   navigate('/scheduling')
    // }

    // const activity = async () => {
    //   navigate('/activity')
    // }

    const getAllUsers = async () => {
      navigate('/users')
    }

    return (
    
      <div className="dashboard-container">
        
        <div className="sidebar">
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
          {/* Botões */}
          <button className="button button-filled">Dashboard</button>
            {/* <button className="button" onClick={activity}>Atividade</button>
            <button className="button" onClick={scheduling}  >Agendamento</button>
            <button className="button" onClick={configure}>Configurar</button> */}
            <button className="button" onClick={getAllUsers}>Usuários</button>
            <button className="button" onClick={prints}  >Prints</button>
            <button className="button" onClick={targets}  >Targets</button>
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
    
    );  
  };



  export default Dashboard;
