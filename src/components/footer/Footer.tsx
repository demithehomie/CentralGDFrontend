import React from 'react';
import Swal from 'sweetalert2';

// Estilos CSS para o rodapé
const footerStyles = {
  footerContainer: {
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#454545',
    borderTop: '1px solid #ddd',
    borderRadius: '25px',
  },
  footerItem: {
    margin: '10px',
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  linkButton: {
    display: 'inline-block',
    backgroundColor: '#25D366',
    color: 'white',
    padding: '10px 20px',
    margin: '5px',
    borderRadius: '5px',
    textDecoration: 'none',
  },
  magicToolButton: {
    backgroundColor: '#007bff',
  },
  aboutUsButton: {
    backgroundColor: '#eb4034',
  },
};

const Footer: React.FC = () => {

    const showAboutUsDetails = () => {
        Swal.fire({
          title: 'About GUERRADONE',
          html: `
      <p style="color: #000;">GUERRADONE is a pioneering company dedicated to providing exceptional support services for businesses involved in phone maintenance and repair. With a focus on enhancing operational efficiency and reliability, we offer comprehensive assistance tailored to the unique needs of each client.</p>
      <p style="color: #000;">Our expertise spans a wide range of services, including but not limited to:</p>
      <ul style="color: #000;">
        <li>Technical support for a variety of phone maintenance tools and software.</li>
        <li>Guidance on best practices for phone repair and maintenance to maximize service quality.</li>
        <li>Custom solutions for businesses looking to elevate their phone maintenance services.</li>
        <li>Access to cutting-edge tools and resources that empower businesses to stay ahead in the competitive market.</li>
      </ul>
      <p style="color: #000;">At GUERRADONE, we are committed to your success. Our team of experts is always ready to assist you in overcoming any challenge and seizing opportunities for growth and excellence in phone maintenance.</p>
      `,
          icon: 'info',
          confirmButtonText: 'Close'
        });
      };
      
  return (
    <footer style={footerStyles.footerContainer}>
      <div style={footerStyles.footerItem}>
        <p>GUERRADONE</p>
        <p>+1 (323) 579-0860</p>
        <p>Downtown Araruama, Rio de Janeiro, Brazil</p>
      </div>
      <div style={footerStyles.footerItem}>
        <a
          onClick={showAboutUsDetails}
          style={{...footerStyles.linkButton, ...footerStyles.aboutUsButton}}
          target="_blank"
          rel="noopener noreferrer"
        >
          About Us
        </a>
        <a
          href="https://themagictool.net"
          style={{ ...footerStyles.linkButton, ...footerStyles.magicToolButton }}
          target="_blank"
          rel="noopener noreferrer"
        >
          The Magic Tool
        </a>
        <a
          href="https://www.guerratool.com"
          style={{ ...footerStyles.linkButton }}
          target="_blank"
          rel="noopener noreferrer"
        >
          GUERRATOOL
        </a>
      </div>
    </footer>
  );
};

export default Footer;
