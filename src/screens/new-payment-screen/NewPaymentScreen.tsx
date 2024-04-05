import { useState } from 'react';

import { Component2 } from './Componente2';
import  Component3  from './Componente3';
import Component1 from './Componente1';








export default function NewPaymentScreen() {
  const [progress, setProgress] = useState(0); // Progresso inicial

  // Função para atualizar o progresso
  const updateProgress = (step: any) => {
    setProgress(progress + step);
  };

  return (
    <div style={{ height: '100vh', width: '500vh', overflowX: 'scroll' }}>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'row' }}>
        {/* Componentes renderizados */}
        <Component1 />
        <Component2 />
        <Component3 />
      </div>

      {/* Barra de progresso inferior */}
      <div style={{ backgroundColor: '#f0f0f0', padding: '10px', position: 'fixed', bottom: 0, left: 0, width: '100%' }}>
        <div style={{ backgroundColor: '#007bff', height: '10px', width: `${progress}%` }} />
      </div>
    </div>
  );
}
