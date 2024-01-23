// useSendFunctions.js

import React from 'react';

const useSendFunctions = (onSendCredits: (arg0: number) => void, onSendMoney: (arg0: number) => void) => {
    const handleSendCredits = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const amount = formData.get('amount'); // Supondo que 'amount' é o nome do campo
        if (amount) {
          onSendCredits(Number(amount));
        }
      };
    
      const handleSendMoney = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const amount = formData.get('amount'); // Supondo que 'amount' é o nome do campo
        if (amount) {
          onSendMoney(Number(amount));
        }
      };

    //   const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     setAction(e.target.value);
    //   };
    
    //   const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setAmount(Number(e.target.value));
    //   };

  return { handleSendCredits, handleSendMoney };
};

export default useSendFunctions;
