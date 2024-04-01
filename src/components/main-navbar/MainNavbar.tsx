import './MainNavbar.css';
//import { Navbar, Nav, Container, Modal, Button } from 'react-bootstrap';
import logo from '../../assets/fGuerra.png';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/auth/AuthContext';
import { useState } from 'react';


export default function MainNavbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [showMenu, /* setShowMenu */] = useState(false); // Estado para controle do menu

    const handleLogout = () => {
        Swal.fire({
          title: 'Você tem certeza?',
          text: "Você está prestes a abandonar a sessão!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim, sair!',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            logout();
            Swal.fire(
              'Sessão Encerrada!',
              'Você saiu da sua conta com sucesso.',
              'success'
            );
            navigate('/');
          }
        });
      };
    
    
const goToPaymentScreen = async () => {
    navigate('/payments');
    Swal.close();
}

const goToUsers = async () => {
    navigate('/users');
    Swal.close();
}

// const showAlert = () => {
//     alert('Em breve');
// }

const goBackToDashboard = () => {
    navigate('/dashboard');
    Swal.close();
}

const goToServers = () => {
  navigate('/servers-screen');
  Swal.close();
}

const goToAnalytics = () => {
  navigate('/analytics');
  Swal.close();
}

const goToAllReports = () => {
    navigate('/mgmt-reports');
    Swal.close();
}

const goToLogs= () => {
    navigate('/logs-screen');
    Swal.close();
}

const toggleMenu = () => {
  Swal.fire({
    title: 'Menu',
    html: `
    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
    <button id="home" class="swal2-confirm swal2-styled swal-button-custom" style="border: 2px solid #3085d6; color: #3085d6; background-color: transparent; width: 200px; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer;">Home</button>
    <button id="payments" class="swal2-confirm swal2-styled swal-button-custom" style="border: 2px solid #3085d6; color: #3085d6; background-color: transparent; width: 200px; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer;">Payments</button>
    <button id="reports" class="swal2-confirm swal2-styled swal-button-custom" style="border: 2px solid #3085d6; color: #3085d6; background-color: transparent; width: 200px; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer;">Reports</button>
    <button id="servers" class="swal2-confirm swal2-styled swal-button-custom" style="border: 2px solid #3085d6; color: #3085d6; background-color: transparent; width: 200px; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer;">Servers</button>
    <button id="analytics" class="swal2-confirm swal2-styled swal-button-custom" style="border: 2px solid #3085d6; color: #3085d6; background-color: transparent; width: 200px; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer;">Analytics</button>
    <button id="users" class="swal2-confirm swal2-styled swal-button-custom" style="border: 2px solid #3085d6; color: #3085d6; background-color: transparent; width: 200px; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer;">Users</button>
    <button id="logs" class="swal2-confirm swal2-styled swal-button-custom" style="border: 2px solid #3085d6; color: #3085d6; background-color: transparent; width: 200px; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer;">Logs</button>
    <button id="logout" class="swal2-confirm swal2-styled swal-button-custom" style="border: 2px solid #d33; color: #d33; background-color: transparent; width: 200px; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer;">Logout</button>
  </div>
    `,
    showConfirmButton: false,
    focusConfirm: false,
    width: 'auto',
    didOpen: () => {
      const homeButton = document.getElementById('home');
      if (homeButton) homeButton.onclick = goBackToDashboard;

      const paymentsButton = document.getElementById('payments');
      if (paymentsButton) paymentsButton.onclick = goToPaymentScreen;

      const reportsButton = document.getElementById('reports');
      if (reportsButton) reportsButton.onclick = goToAllReports;

      const serversButton = document.getElementById('servers');
      if (serversButton) serversButton.onclick = goToServers;

      const analyticsButton = document.getElementById('analytics');
      if (analyticsButton) analyticsButton.onclick = goToAnalytics;

      const usersButton = document.getElementById('users');
      if (usersButton) usersButton.onclick = goToUsers;

      const logsButton = document.getElementById('logs');
      if (logsButton) logsButton.onclick = goToLogs;

      const logoutButton = document.getElementById('logout');
      if (logoutButton) logoutButton.onclick = () => {
        logout();
        Swal.close();
      };
    }
  });
}


  return (
    <>
    <div className="navbar-toggle" onClick={toggleMenu}>
                <span className='menu-span'>Menu</span>
            </div>
    <div className='all-the-main-navbar-content'>
       

      
            <div className="logo-at-the-navbar" onClick={goBackToDashboard}>
              <img src={logo} alt="logo"  />
            </div>
      
      <div className='navbar-center-menu'>

     
                <div onClick={goBackToDashboard}>
                    <h3 className='main-navbar-menu-item-text'>Home</h3>
                </div>
                <div onClick={goToPaymentScreen}>
                    <h3 className='main-navbar-menu-item-text'>Payments</h3>
                </div>
                <div onClick={goToAllReports}>
                    <h3 className='main-navbar-menu-item-text'>Reports</h3>
                </div>
                <div onClick={goToServers}>
                    <h3 className='main-navbar-menu-item-text'>Servers</h3>
                </div>
                <div onClick={goToAnalytics}>
                    <h3 className='main-navbar-menu-item-text'>Analytics</h3>
                </div>
                <div onClick={goToUsers}>
                    <h3 className='main-navbar-menu-item-text'>Users</h3>
                </div>
                <div onClick={goToLogs}>
                    <h3 className='main-navbar-menu-item-text'>Logs</h3>
                </div>

                </div>

                <div className='logout-button' onClick={handleLogout}>
                    <h3 className='main-navbar-menu-item-text'>Logout</h3>
                </div>

         {/* Menu que será mostrado/ocultado */}
          {showMenu && (
          
            <>
            <div className='navbar-center-menu-mobile'>
                <div onClick={goBackToDashboard}>
                    <h3 className='main-navbar-menu-item-text'>Home</h3>
                </div>
                <div onClick={goToPaymentScreen}>
                    <h3 className='main-navbar-menu-item-text'>Payments</h3>
                </div>
                <div onClick={goToAllReports}>
                    <h3 className='main-navbar-menu-item-text'>Reports</h3>
                </div>
                <div onClick={goToServers}>
                    <h3 className='main-navbar-menu-item-text'>Servers</h3>
                </div>
                <div onClick={goToAnalytics}>
                    <h3 className='main-navbar-menu-item-text'>Analytics</h3>
                </div>
                <div onClick={goToUsers}>
                    <h3 className='main-navbar-menu-item-text'>Users</h3>
                </div>
                <div onClick={goToLogs}>
                    <h3 className='main-navbar-menu-item-text'>Logs</h3>
                </div>
                <div onClick={handleLogout}>
                    <h3 className='main-navbar-menu-item-text'>Logout</h3>
                </div>    
                </div>  
            </>

            )}

    </div>
    </>
    
  )
}
