import MainNavbar from '../../components/main-navbar/MainNavbar'
import './MotorolaServerScreen.css'

export default function MotorolaServerScreen() {


    const goToMotorolaWebSite = () => {
        // Abre o website da Motorola em uma nova guia
        window.open('https://rsd.cloud.motorola.net/cs/jsp/health/serviceHealthDashboard.jsp', '_blank');
      };

  return (
    <>
    <MainNavbar/>
    <div className='motorola-servers-container'>
    <h1 style={{ color: "#ffffff"}}>Motorola Servers</h1>
        {/* <iframe
        src="https://rsd.cloud.motorola.net/cs/jsp/health/serviceHealthDashboard.jsp"
        title="Iframe Example"
        style={{ width: '100%', height: '100%' }}
        frameBorder="0"
         allowFullScreen
      ></iframe> */}

      <button onClick={goToMotorolaWebSite}>Click Here to Check Motorola Servers Availability</button>
    </div>
  

    </>

  )
}
