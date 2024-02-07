import  { useState } from 'react';
import './Profile.css'

interface ProfileProps {
  nomeInicial: string;
  funcaoInicial: string;
}

const Profile: React.FC<ProfileProps> = ({ nomeInicial, funcaoInicial }) => {
  const [nome, setNome] = useState(nomeInicial);
  const [funcao, setFuncao] = useState(funcaoInicial);
  const [, setImagem] = useState<File | null>(null);
  const [previewImagem, setPreviewImagem] = useState<string>('');

  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagem(file);
      setPreviewImagem(URL.createObjectURL(file));
    }
  };

  return (
    <div className="container">
    <input type="file" id="file" className="file-input" onChange={handleImageChange} />
    <label htmlFor="file"><br />Escolha uma imagem <br /><br /></label>
    {previewImagem && <img src={previewImagem} alt="Avatar" className="profile-avatar" />}
    <div className="input-group">
      <label>Nome:</label>
      <input type="text" value={nome} onChange={e => setNome(e.target.value)} />
    </div>
    <div className="input-group">
      <label>Função:</label>
      <input type="text" value={funcao} onChange={e => setFuncao(e.target.value)} />
    </div>
    <button className="profile-button">Salvar Alterações</button>
  </div>
  
  );
};

export default Profile;
