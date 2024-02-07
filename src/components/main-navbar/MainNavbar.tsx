import './MainNavbar.css';
import logo from '../../assets/fGuerra.png';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/auth/AuthContext';


export default function MainNavbar() {
    const { logout } = useAuth();
   

    const navigate = useNavigate();

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
            // Opcional: redirecionar o usuário para a página de login ou home
          }
        });
      };
    
    
const goToPaymentScreen = async () => {
    navigate('/payments');
}

const goToUsers = async () => {
    navigate('/users');
}

// const showAlert = () => {
//     alert('Em breve');
// }

const goBackToDashboard = () => {
    navigate('/dashboard');
}

const goToAllReports = () => {
    navigate('/mgmt-reports');
}

// const goToReceiveCrypto= () => {
//     navigate('/receive-crypto');
// }


  return (
    <>
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
                <div onClick={goToUsers}>
                    <h3 className='main-navbar-menu-item-text'>Users</h3>
                </div>

                </div>

                <div className='logout-button' onClick={handleLogout}>
                    <h3 className='main-navbar-menu-item-text'>Logout</h3>
                </div>

      

    </div>
    </>
    
  )
}
