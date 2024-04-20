import { useState, useEffect } from 'react';

export const useTimePassed = (createdAt: any) => {
  const [timePassed, setTimePassed] = useState('');

  useEffect(() => { // DONE
    const update = () => {
      const startDate = new Date(createdAt).getTime();
      const currentDate = new Date().getTime();
      const diff = currentDate - startDate;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimePassed(`${days} dia(s) ${hours} hora(s) ${minutes} minuto(s) ${seconds} segundo(s)`);
    };

    update(); // Inicializa imediatamente
    const interval = setInterval(update, 1000); // Atualiza a cada segundo

    return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
  }, [createdAt]); // Adiciona createdAt à lista de dependências

  return timePassed;
};
