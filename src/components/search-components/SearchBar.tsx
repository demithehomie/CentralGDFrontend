import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';


const SearchInput = styled.input`
  border: 2px solid #ffffff;
  border-radius: 25px;
  padding: 15px 35px;
  outline: none;
  color: #ffffff;
  background-color: transparent;

  ::placeholder {
    color: #ffffff;
  }
`;

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
  
    navigate(`/search-results?query=${encodeURIComponent(searchTerm)}`);
  };

  //const apiurldev = `http://localhost:3001`;

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
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </form>
  );
};

export default SearchBar;
