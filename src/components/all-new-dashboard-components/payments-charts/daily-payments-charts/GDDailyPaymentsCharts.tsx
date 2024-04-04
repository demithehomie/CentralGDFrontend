import axios from 'axios';
import { useEffect, useState } from 'react';
import './Styles.css'

interface SummaryData {
  daily: {
    totalServices: number;
    totalRevenue: number;
  };
  percentageIncrease: number; // Adicionado para armazenar o aumento percentual
}

export default function GDDailyPaymentsCharts() {
  const [summaryData, setSummaryData] = useState<SummaryData>({
    daily: { totalServices: 0, totalRevenue: 0 },
    percentageIncrease: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSummaryData = async () => {
      setIsLoading(true);
      let yesterdayResponse; // Declaração da variável fora do bloco try-catch
      try {
        // Obter os dados do dia atual
        const todayResponse = await axios.get('https://gdcompanion-prod.onrender.com/report/json?type=daily');

        // Calcular a receita total para hoje
        const totalServicesToday = todayResponse.data.filter((item: { pending_payments: string; }) => item.pending_payments === "false").reduce((acc: any, curr: { amount: any; }) => acc + curr.amount, 0);
        
        const totalRevenueToday = todayResponse.data.filter((item: { pending_payments: string; }) => item.pending_payments === "false").reduce((acc: number, curr: { amount: number; }) => acc + (curr.amount * 1), 0);

        // Obter a data do primeiro item da resposta
       // Obter a data atual
        const currentDate = new Date();

        // Calcular a data do dia anterior
        const yesterday = new Date(currentDate);
        const tomorrow = new Date(currentDate);
        console.log(`yesterday: ${yesterday}`)
        
        yesterday.setDate(currentDate.getDate() - 1);
        tomorrow.setDate(currentDate.getDate() + 1);
        console.log(`nova yesterday: ${yesterday}`)
        console.log(`nova tomorrow: ${tomorrow}`)
        // Formatar as datas para o formato 'YYYY-MM-DD'
        const formattedYesterday = formatDate(yesterday);
        const formattedTomorrowDate = formatDate(tomorrow);

        try {
          // Obter os dados do dia anterior
          yesterdayResponse = await axios.post('https://gdcompanion-prod.onrender.com/report/json/custom-range', {
              startDate: formattedYesterday,
              endDate: formattedTomorrowDate
          });
      
          // Analisar os dados da resposta para extrair startDate e endDate
          const responseData = JSON.parse(yesterdayResponse.config.data);
          const startDate = responseData.startDate;
          const endDate = responseData.endDate;
      
          console.log('StartDate:', startDate);
          console.log('EndDate:', endDate);
      
          console.log("Yesterday Response", yesterdayResponse);
      
          // Restante do código para processar os dados do dia anterior
      } catch (error) {
          // Lidar com erros aqui
          console.error('Erro ao obter os dados do dia anterior:', error);
          setIsLoading(false); // Certifique-se de definir isLoading como false para que o indicador de carregamento seja ocultado
      }
      
        // Calcular a receita total para ontem
        const totalRevenueYesterday = yesterdayResponse?.data.filter((item: { pending_payments: string; }) => item.pending_payments === "false").reduce((acc: number, curr: { amount: number; }) => acc + (curr.amount * 1), 0);

        // Calcular o aumento percentual
        const percentageIncrease = totalRevenueYesterday !== 0 ? ((totalRevenueToday - totalRevenueYesterday) / totalRevenueYesterday) * 100 : 0;

        setSummaryData({
          daily: { totalServices: totalServicesToday, totalRevenue: totalRevenueToday },
          percentageIncrease: percentageIncrease
        });
        setIsLoading(false);

            // Exibir os dados no console
            console.log('Percentage Increase:', summaryData.percentageIncrease);
            console.log('Yesterday:', formattedYesterday);
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching summary data:', error);
      }
    };

    fetchSummaryData();
  }, []);

  // Função para formatar a data no formato 'YYYY-MM-DD'
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      {isLoading ? (
        <div><h1 style={{ color: '#ffffff'}}>Loading...</h1></div>
      ) : (
        <div className='new-info-card'>
          <label style={{ fontSize: 30 }}>GUERRADONE</label>
          <p className='title-of-card'>Today:
            <strong> R${' '} 
               {summaryData.daily.totalServices.toFixed(2).replace('.', ',')}
            </strong>
          </p>
          <p> {summaryData.percentageIncrease > 0 ? 'Up' : 'Down'} <strong>
            {summaryData.percentageIncrease.toFixed(2).replace('.', ',')}%
            <span style={{ color: summaryData.percentageIncrease > 0 ? 'green' : 'red', marginLeft: '5px' }}>
              {summaryData.percentageIncrease > 0 ? '↑' : '↓'}
            </span>
          </strong> since yesterday
          </p>
        </div>
      )}
    </>
  );
}

// const styles =  StyleSheet.({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });