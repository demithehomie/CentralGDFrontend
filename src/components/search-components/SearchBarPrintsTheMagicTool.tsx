import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';


const SearchInput = styled.input`
  border: 2px solid #ffffff;
  border-radius: 25px;
  padding: 15px 35px 15px 50px; /* Adjust left padding to make space for the icon */
  outline: none;
  color: #ffffff;
  background-color: transparent;
  background-image: url('../../../../src/assets/icons/grey-search.png'); /* Add the path to your icon */
  background-position: 15px center; /* Position the icon */
  background-repeat: no-repeat;
  background-size: 20px; /* Optional: Adjust the size of the icon */

  ::placeholder {
    color: #ffffff;
  }
`;


const SearchBarPrintsTheMagicTool = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
  
    navigate(`/search-prints-results?query=${encodeURIComponent(searchTerm)}`);
  };

  //const apiurldev = `https://gdcompanion-prod.onrender.com`;

  // const search = async (query: string) => {
  //   try {
  //     // Garantir que a query string é formatada corretamente
  //     const response = await axios.get(`${apiurldev}/search-users`, {
  //       params: { keyword: query }
  //     });
  //     return response.data; // Retornar os resultados da pesquisa
  //   } catch (error) {
  //     console.error('Erro na pesquisa:', error);
  //     // Trate o erro conforme necessário
  //     return null;
  //   }
  // };
  

  return (
    <form onSubmit={handleSearch}>
      <SearchInput
        type="text"
        placeholder="Pesquisar..."
        value={searchTerm}
        onChange={(e: any) => setSearchTerm(e.target.value)}
      />
    </form>
  );
};

export default SearchBarPrintsTheMagicTool;
