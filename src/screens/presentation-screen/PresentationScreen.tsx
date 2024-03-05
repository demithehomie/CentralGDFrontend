import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Swal from 'sweetalert2';
import Footer from '../../components/footer/Footer';
import zero from '../../assets/zero.jpg';
import one from '../../assets/one.jpg';
import two from '../../assets/two.jpg';

const styles = {
  card: {
      padding: '20px',
      margin: '20px',
      border: '1px solid #ccc',
      borderRadius: '15px',
      maxWidth: '350px',
      textAlign: 'center' as const,
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: 'none',
    color: 'black', // Default color set to black for all buttons
    textShadow: '0 0 3px #FFF', // White outline for better visibility on dark backgrounds
},
cryptoButton: {
    backgroundColor: '#FFC107',
    color: 'black', // Specific to Crypto button
    textShadow: '0 0 3px #FFF', // White outline
},
paypalButton: {
    backgroundColor: '#003087',
    color: 'black', // Specific to PayPal button
    textShadow: '0 0 3px #FFF', // White outline
},
  title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: "#ffffff"
  },
  subTitle: {
      fontSize: '20px',
      fontWeight: 'lighter',
  },
};

// Define the component
const PresentationScreen: React.FC = () => {
  
  // Function to handle feature in development alert
  const handleFeatureInDevelopment = () => {
      Swal.fire('Feature in development', 'We are working hard to implement this feature!', 'info');
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/+13235790860', '_blank');
  };

  return (
      <>
          <div style={{ textAlign: 'center' }}>
              <h1 style={{
                color: '#ffffff',
              }}>GUERRADONE</h1>
               <h2
              >⭐⭐⭐⭐⭐</h2>
               <h6
                style={{
                  color: '#ffffff',
                }}
               >"The best support service in the market" according to our beloved customers.</h6>
              <h2>We are giving the best support for phone maintenance.</h2>
              <Carousel showArrows={true} autoPlay={true} infiniteLoop={true}>
              <div>
                        <img src={zero} alt="Item 3" />
                        <p className="legend">We have the resources your company needs for both iOS and Android phones</p>
                    </div>
                    <div>
                        <img src={one} alt="Item 1" />
                        <p className="legend">We are working everyday for deliver services of excellence</p>
                    </div>
                    <div>
                        <img src={two} alt="Item 2" />
                        <p className="legend">Reach out to our team at Rio de Janeiro!</p>
                    </div>
               
               </Carousel>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {/* Card 1 */}
                  <div style={styles.card}>
                      <h3 style={styles.title}>SUPPORT for The Magic Tool</h3>
                      <p>Unlock unparalleled efficiency and reliability for your phone maintenance business with our dedicated support for The MagicTool. Enhance your service quality today!</p>
                      <button style={{ ...styles.button, backgroundColor: '#25D366' }} onClick={handleWhatsAppClick}>Talk To Us via WhatsApp</button>
                      <button style={styles.cryptoButton} onClick={handleFeatureInDevelopment}>Pay With Crypto</button>
                      <button style={styles.paypalButton} onClick={handleFeatureInDevelopment}>Pay With PayPal</button>
                  </div>
                  {/* Card 2 - Duplicate of Card 1 for simplicity, adjust as needed */}
                  <div style={styles.card}>
                      <h3 style={styles.title}>SUPPORT for GUERRATOOL</h3>
                      <p>Experience the future of phone maintenance with our expert support for GUERRATOOL. Get ahead with cutting-edge solutions tailored for your business needs.</p>
                      <button style={{ ...styles.button, backgroundColor: '#25D366' }} onClick={handleWhatsAppClick}>Talk To Us via WhatsApp</button>
                      <button style={styles.cryptoButton} onClick={handleFeatureInDevelopment}>Pay With Crypto</button>
                      <button style={styles.paypalButton} onClick={handleFeatureInDevelopment}>Pay With PayPal</button>
                  </div>
              </div>
              <Footer />
          </div>
      </>
  );
};

export default PresentationScreen;

/*

Bilinha, cheguei no escritório. 

Aproveitei e tirei o horário de almoço.

A hora que tirei deu 1h:10m + 1h de almoço. Anotei tudo aqui direitinho. E consigo pagar tudo hoje. 

Vou guardar o celular e voltar aos trabalhos aqui.

*/