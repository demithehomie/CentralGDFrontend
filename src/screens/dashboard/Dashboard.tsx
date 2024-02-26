  import  { useEffect, useState } from 'react';
  import './Dashboard.css';
  import { useNavigate } from 'react-router-dom';
  import logo from '../../assets/fGuerra.png';
  import axios from 'axios';
  import logo_profile from '../../assets/user_logo.jpg';
  import report from '../../assets/icons/report.png';
  import warning from '../../assets/icons/warning.png';
  import bell from '../../assets/icons/bell.png';
  //import DashboardCard from '../../components/dashboard-cards/DashboardCard';
  import DashboardCardMobile from '../../components/dashboard-cards-mobile/DashboardCardsMobile';
  import { useAuth } from '../../context/auth/AuthContext';
  import MainNavbar from '../../components/main-navbar/MainNavbar';
import { Helmet } from 'react-helmet-async';

  //import someIcon from './path-to/some-icon.png';

  interface SummaryData {
    daily: {
      totalServices: number;
      totalRevenue: number;
    };
    weekly: {
      totalServices: number;
      totalRevenue: number;
    };
    monthly: {
      totalServices: number;
      totalRevenue: number;
    };
  }
  

  const Dashboard: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [cards, setCards] = useState<CardData[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [summaryData, setSummaryData] = useState<SummaryData>({ 
      daily: { totalServices: 0, totalRevenue: 0 }, 
      weekly: { totalServices: 0, totalRevenue: 0 }, 
      monthly: { totalServices: 0, totalRevenue: 0 } 
    });
    
    const navigate = useNavigate();

    useEffect(() => {
      const fetchSummaryData = async () => {
        setIsLoading(true);
        try {
          const dailyResponse = await axios.get('https://gdcompanion-prod.onrender.com/report/json?type=daily');
          const weeklyResponse = await axios.get('https://gdcompanion-prod.onrender.com/report/json?type=weekly');
          const monthlyResponse = await axios.get('https://gdcompanion-prod.onrender.com/report/json?type=monthly');
    
          const totalServicesDaily = dailyResponse.data.filter((item: { pending_payments: string; }) => item.pending_payments === "false"  ).reduce((acc: any, curr: { amount: any; }) => acc + curr.amount, 0);
          const totalRevenueDaily = dailyResponse.data.filter((item: { pending_payments: string; }) => item.pending_payments === "false" ).reduce((acc: number, curr: { amount: number; }) => acc + (curr.amount * 1), 0);
          
          const totalServicesWeekly = weeklyResponse.data.filter((item: { pending_payments: string; }) => item.pending_payments === "false" ).reduce((acc: any, curr: { amount: any; }) => acc + curr.amount, 0);
          const totalRevenueWeekly = weeklyResponse.data.filter((item: { pending_payments: string; }) => item.pending_payments === "false" ).reduce((acc: number, curr: { amount: number; }) => acc + (curr.amount * 1), 0);
          
          const totalServicesMonthly = monthlyResponse.data.filter((item: { pending_payments: string; }) => item.pending_payments === "false" ).reduce((acc: any, curr: { amount: any; }) => acc + curr.amount, 0);
          const totalRevenueMonthly = monthlyResponse.data.filter((item: { pending_payments: string; }) => item.pending_payments === "false" ).reduce((acc: number, curr: { amount: number; }) => acc + (curr.amount * 1), 0);
          

    
          // Similar para semanal e mensal...
          // Supõe-se que você repetirá o processo acima para weeklyResponse.data e monthlyResponse.data
    
          // Atualiza o estado com os novos totais
          setSummaryData({
            daily: { totalServices: totalServicesDaily, totalRevenue: totalRevenueDaily },
            weekly: { totalServices: totalServicesWeekly, totalRevenue: totalRevenueWeekly },
            monthly: { totalServices: totalServicesMonthly, totalRevenue: totalRevenueMonthly }
          });
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.error('Error fetching summary data:', error);
        }
      };
    
      fetchSummaryData();
    }, []);
    

    
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
      category: string;
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
    
    const handleLogout = () => {
      // Chame a função de logout do contexto de autenticação
      logout();
    };
    
    if (isLoading) {
      return (
     
   
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' }}>

            <div className="logo">
              <img src={logo} alt="logo"  />
            </div>

          <h2 className='loading-text'>
              Carregando todos os dados...
          </h2>



        </div>
      );
    }
    /////

    return (
      <>
      <Helmet>
         <title>Dashboard</title>
      </Helmet>
    
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}>
       <MainNavbar/>
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
            {/* <div className="logo">
              <img src={logo} alt="logo"  />
            </div> */}
            <div className="avatar" onClick={profile}>
              <img src={logo_profile} alt="logo_profile" className='profile-picture' />
            </div>
            <div className="name">
            {currentUser?.username}
            </div> 
        <div className="role">Admin</div>
            
            <button className="button" onClick={getAllUsers}>Usuários</button>
            {/* <button className="button" onClick={prints} >Prints</button>
          <button className="button" onClick={targets}>Targets</button> */}
            <button className="button" onClick={payments}>Pagamentos</button>
            <button className="button" onClick={getAllMGMTReports}>Relatórios</button>
            <button className='button-filled' onClick={handleLogout}>Sair</button>
            
        {isMenuOpen && (
          <>
           
            <button className="button" onClick={getAllUsers}>Usuários</button>
            <button className="button" onClick={payments}>Pagamentos</button>
            <button className="button" onClick={getAllMGMTReports}>Relatórios</button>
            <button className='button-filled' onClick={handleLogout}>Sair</button>
          </>
        )}
      </div>

<div className="hamburger-button" onClick={toggleMenu}>
  <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
  <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
  <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
</div>



        <hr className='separador'/>

        {/* <div className="main-content">
          
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
        </div> */}


{/* style={{
          alignItems: 'left',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'row',
        }} */}
        <div className='row-of-frontal-buttons'>
          <div className='animated-background'>

          
           <div className='little-cards-gd' onClick={getAllMGMTReports} >
            <h2 style={{ fontSize: 30 }}>GUERRADONE</h2>
            {/* Supondo que dailySummary contém campos como totalServices e totalRevenue */}
            <p >Total Hoje: <strong>R$: {summaryData.daily.totalServices.toFixed(2).replace('.', ',')}</strong></p>
            <p >Total da Semana:<strong> R$: {summaryData.weekly.totalRevenue.toFixed(2).replace('.', ',')}</strong></p>
          </div>
          </div>

            {/* <br />
            <div className='little-cards-tmt' onClick={getAllMGMTReports}>
              <h2  >The Magic Tool</h2>
              <p >Total Hoje: R$: {summaryData.weekly.totalServices.toFixed(2).replace('.', ',')}</p>
              <p >Receita Total: R$: {summaryData.weekly.totalRevenue.toFixed(2).replace('.', ',')}</p>
            </div>
           
            <br />
            <div className='little-cards-gt' onClick={getAllMGMTReports}>
              <h2 >GuerraTool</h2>
              <p >Total Hoje: R$: {summaryData.monthly.totalServices.toFixed(2).replace('.', ',')}</p>
              <p >Receita Total: R$: {summaryData.monthly.totalRevenue.toFixed(2).replace('.', ',')}</p>
            </div> */}
          
          </div>

      </div>

      </div>
      </>
    );  
  };



  export default Dashboard;
