import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #302F50; // Cor de fundo em toda a aplicação
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

.global-title-font {
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 2rem;
  color: #ffffff;
  text-align: center;
  margin-bottom: 1rem;
}

`;
