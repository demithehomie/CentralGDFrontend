import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import { Line } from 'react-chartjs-2';
import './ManagementReports.css';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import MainNavbar from '../../components/main-navbar/MainNavbar';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MyChartData extends ChartData<'line', number[], string> {}

export interface ReportData {
  id: number;
  name: string;
  whatsapp: string;
  service_provided: string;
  amount: number;
  username: string;
  pending_payments: boolean | string | any;
  created_at: string;
  payment_id: number;
}

function ManagementReports() {
    const navigate = useNavigate();

    const [showGraph, setShowGraph] = useState(false);
    const [graphData, setGraphData] = useState<MyChartData | null>(null);
    const [currentReportType, setCurrentReportType] = useState<string>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [customRangeReportData, setCustomRangeReportData] = useState<ReportData[]>([]);

    const [dailyReportData, setDailyReportData] = useState<ReportData[]>([]);
    const [weeklyReportData, setWeeklyReportData] = useState<ReportData[]>([]);
    const [monthlyReportData, setMonthlyReportData] = useState<ReportData[]>([]);
    const [quarterlyReportData, setQuarterlyReportData] = useState<ReportData[]>([]);
    const [semiAnnualyReportData, setSemiAnnualyReportData] = useState<ReportData[]>([]);
    const [annualReportData, setAnnualReportData] = useState<ReportData[]>([]);
   
    const fetchReportData = async (reportType: string, setReportData: React.Dispatch<React.SetStateAction<ReportData[]>>, signal: AbortSignal) => {
        try {
          const response = await axios.get(`https://gdcompanion-prod.onrender.com/report/json?type=${reportType}`, { signal });
          setReportData(response.data);
          console.log('Dados do relatório:', response.data);
        } catch (error: any) {
          if (error.name === 'AbortError') {
            console.log('Request aborted');
          } else {
            console.error('Erro ao buscar os dados do relatório:', error);
          }
        }
      };
      
      useEffect(() => { // DONE
        const abortController = new AbortController();
        const signal = abortController.signal;
      
        fetchReportData('customDays', setCustomRangeReportData, signal);
        fetchReportData('daily', setDailyReportData, signal);
        fetchReportData('weekly', setWeeklyReportData, signal);
        fetchReportData('monthly', setMonthlyReportData, signal);
        fetchReportData('quarterly', setQuarterlyReportData, signal);
        fetchReportData('semiannual', setSemiAnnualyReportData, signal);
        fetchReportData('annual', setAnnualReportData, signal);
      
        return () => {
          abortController.abort();
        };
      }, []);
      



      const backToDashboard = () => {
        navigate('/familiaguerra/all-new-dashboard');
      };

// Function to emit DOCX
const emitDocx = async (reportType: any) => {
    try {
        const response = await axios({
            url: `https://gdcompanion-prod.onrender.com/report/docx?type=${reportType}`, // Update with your actual endpoint
            method: 'GET',
            responseType: 'blob', // Important to handle binary response data
        });
  
        // Create a URL for the blob
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement('a');
        
        const currentDate = new Date().toLocaleString().replace(/[^\w\s]/g, '').replace(/ /g, '_'); // Format date and time
        const fileName = `${reportType}_report_${currentDate}.docx`; // Set the file name for download
  
        fileLink.href = fileURL;
        fileLink.setAttribute('download', fileName);
        document.body.appendChild(fileLink);
  
        fileLink.click();
        fileLink.remove(); // Clean up
    } catch (error) {
        console.error('Error downloading the file:', error);
    }
  };
  
  const emitExcel = async (reportType: any) => {
    try {
        const response = await axios({
            url: `https://gdcompanion-prod.onrender.com/report/xlsx?type=${reportType}`, // Update with your actual endpoint
            method: 'GET',
            responseType: 'blob', // Important to handle binary response data
        });
  
        // Create a URL for the blob
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement('a');
  
        const currentDate = new Date().toLocaleString().replace(/[^\w\s]/g, '').replace(/ /g, '_'); // Format date and time
        const fileName = `${reportType}_report_${currentDate}.xlsx`; // Set the file name for download
  
        fileLink.href = fileURL;
        fileLink.setAttribute('download', fileName);
        document.body.appendChild(fileLink);
  
        fileLink.click();
        fileLink.remove(); // Clean up
    } catch (error) {
        console.error('Error downloading the file:', error);
    }
  };
  
  const emitPdf = async (reportType: any) => {
    try {
        const response = await axios({
            url: `https://gdcompanion-prod.onrender.com/report/pdf?type=${reportType}`, // Update with your actual endpoint
            method: 'GET',
            responseType: 'blob', // Important to handle binary response data
        });
  
        // Create a URL for the blob
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement('a');
  
        const currentDate = new Date().toLocaleString().replace(/[^\w\s]/g, '').replace(/ /g, '_'); // Format date and time
        const fileName = `${reportType}_report_${currentDate}.pdf`; // Set the file name for download
  
        fileLink.href = fileURL;
        fileLink.setAttribute('download', fileName);
        document.body.appendChild(fileLink);
  
        fileLink.click();
        fileLink.remove(); // Clean up
    } catch (error) {
        console.error('Error downloading the file:', error);
    }
  };
  

const handlePendingPaymentChange = async (item: ReportData, newValue: string) => {
    const newPendingStatus = newValue === 'true' ? true : newValue === 'false' ? false : newValue;
  
    try {
      await axios.post(`https://gdcompanion-prod.onrender.com/marcar-posts-pagos-manualmente/${item.payment_id}`, {
        pending_payments: newPendingStatus
      });
  
      // Determinar a qual conjunto de dados o item pertence (exemplo usando dailyReportData)
      let updatedReportData;
      if (dailyReportData.some(reportItem => reportItem.id === item.id)) {
        updatedReportData = dailyReportData.map(reportItem => {
          if (reportItem.id === item.id) {
            return { ...reportItem, pending_payments: newPendingStatus };
          }
          return reportItem;
        });
        setDailyReportData(updatedReportData);
      }
      // Repita a lógica acima para weeklyReportData, monthlyReportData, etc., conforme necessário
  
      console.log('Status de pagamento atualizado com sucesso.');
    } catch (error) {
      console.error('Erro ao atualizar o status de pagamento:', error);
    }
  };

//   const data = {
//     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//     datasets: [
//         {
//             label: 'Demo Dataset',
//             data: [65, 59, 80, 81, 56, 55, 40],
//             fill: false,
//             borderColor: 'rgb(75, 192, 192)',
//             tension: 0.1
//         }
//     ]
// };
  

const prepareGraphData = (reportType: string) => {
    
    setCurrentReportType(reportType);
    let reportData: any[];
 
    switch(reportType) {
        case 'daily':
            reportData = dailyReportData;
            break;
        case 'weekly':
            reportData = weeklyReportData;
            break;
        case 'monthly':
            reportData = monthlyReportData;
            break;
        case 'quarterly':
            reportData = quarterlyReportData;
            break;
        case 'semiannual':
            reportData = semiAnnualyReportData;
            break;
        case 'annual':
            reportData = annualReportData;
            break;
        default:
            reportData = [];
    }

    // Assuming 'created_at' can be used to order and label the data
    // and 'amount' is the data point you want to graph
    const labels = reportData.map(item => new Date(item.created_at).toLocaleDateString());
    const dataPoints = reportData.map(item => Math.round(item.amount * 0.99));

    const data = {
        labels,
        datasets: [{
            label: 'Quantia em R$',
            data: dataPoints,
            fill: false,
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 0.2)',
        }]
    };
    setGraphData(data);
    setShowGraph(true);
};

const formatDate = (dateString: any) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };
  

// Mantenha uma referência ao CancelToken da solicitação
let cancelToken: any;

const fetchCustomRangeReportData = async () => {
  if (!startDate || !endDate) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor, selecione as datas de início e fim.',
    });
    return;
  }

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  // Cancela a solicitação anterior se houver
  if (cancelToken) {
    cancelToken.cancel('Nova solicitação iniciada');
  }

  // Cria um novo CancelToken
  cancelToken = axios.CancelToken.source();

  try {
    const response = await axios.post('https://gdcompanion-prod.onrender.com/report/json/custom-range', {
      startDate: formattedStartDate,
      endDate: formattedEndDate
    }, {
      cancelToken: cancelToken.token // Passa o cancelToken para a configuração da solicitação
    });

    if (!response.data || response.data.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sem dados',
        text: 'Não foram encontrados dados para o período selecionado.',
      });
      return;
    }
    setCustomRangeReportData(response.data);
    console.log('Dados do relatório personalizado:', response.data);
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Solicitação cancelada:', error.message);
    } else {
      console.error('Erro ao buscar os dados do relatório personalizado:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Ocorreu um erro ao buscar os dados do relatório.',
      });
    }
  }
};

useEffect(() => { // DONE
  // Garante que ambos startDate e endDate estão preenchidos antes de fazer a requisição
  if (startDate && endDate) {
    fetchCustomRangeReportData();
  }

  // Limpa o cancelToken ao desmontar o componente
  return () => {
    if (cancelToken) {
      cancelToken.cancel('Componente desmontado');
    }
  };
}, [startDate, endDate]);

  const deleteCliente = async (paymentId: number) => {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter isso!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, delete isso!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`https://gdcompanion-prod.onrender.com/deletar-cliente/${paymentId}`);
                if (response.status === 200) {
                    Swal.fire(
                        'Deletado!',
                        'O cliente foi deletado.',
                        'success'
                    );
                    // Update your state here to remove the deleted client from the UI
                    setDailyReportData(prevData => prevData.filter(item => item.payment_id !== paymentId));
                    setWeeklyReportData(prevData => prevData.filter(item => item.payment_id !== paymentId));
                    setMonthlyReportData(prevData => prevData.filter(item => item.payment_id !== paymentId));
                    setQuarterlyReportData(prevData => prevData.filter(item => item.payment_id !== paymentId));
                    setSemiAnnualyReportData(prevData => prevData.filter(item => item.payment_id !== paymentId));
                    setAnnualReportData(prevData => prevData.filter(item => item.payment_id !== paymentId));
                    setCustomRangeReportData(prevData => prevData.filter(item => item.payment_id !== paymentId));

                        
                   
                } else {
                    Swal.fire(
                        'Erro!',
                        'Cliente não encontrado ou já foi deletado.',
                        'error'
                    );
                }
            } catch (error) {
                console.error('Erro ao deletar cliente:', error);
                Swal.fire(
                    'Erro!',
                    'Erro ao tentar deletar o cliente.',
                    'error'
                );
            }
        }
    });
};

    
  return (
    <>
    <MainNavbar/>
        <div>
            <br /><br /><br /><br />
            <h1 className="title"> Todos Os Relatórios </h1> 

            {/* Adicione isso no seu JSX, no local apropriado */}
            <h3 className="subtitle">Emitir Relatório por Intervalo de Datas</h3>
            <br />
            <div className="date-inputs-container">
            <input
                type="date"
                name="startDate"
                value={startDate} // Você precisará adicionar esses estados ao seu componente
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
            />
            <input
                type="date"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
            />
            <button onClick={fetchCustomRangeReportData} className="fetch-report-button">Buscar Relatório</button>
</div>

{/* Tabela para exibir os dados do relatório */}

<div className={`report-table-container ${customRangeReportData.length > 4 ? 'scrollable' : ''}`}>
  <table className="report-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nome</th>
        <th>WhatsApp</th>
        <th>Serviço Fornecido</th>
        <th>Quantidade</th>
        <th>É Devedor?</th>
        <th>Data de Criação</th>
        <th>ID do Pagamento</th>
                        <th>EXCLUIR</th>
      </tr>
    </thead>
    <tbody>
      {customRangeReportData.map((item, index) => (
        <tr key={index}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.whatsapp}</td>
          <td>{item.service_provided}</td>
          <td>R$ {Math.round(item.amount * 0.99).toFixed(2).replace('.', ',')}</td>
          <td>{item.pending_payments ? 'Sim' : 'Não'}</td>
          <td>{
            new Date(item.created_at).toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })
          }</td>
            <td>{item.payment_id}</td>
                        

                            <td>
                                <button onClick={() => deleteCliente(item.payment_id)} className="delete-button">Excluir</button>
                            </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

<div className='buttons-row-rel'>
           {/* <button className='button-report'>Exibir detalhes</button>*/}  
           <button className='button-report' onClick={() => emitPdf('customDays')}>Emitir PDF</button> 
           <button className='button-report' onClick={() => emitDocx('customDays')}>Emitir DOCX</button> 
           <button className='button-report' onClick={() => emitExcel('customDays')}>Emitir Excel</button>
           <button className="button-report" onClick={() => prepareGraphData('customDays')}>Exibir Gráfico Diário</button>

           {showGraph && graphData && currentReportType === 'customDays' &&  (
                <div className="graph-popup">
                    <div className="graph-popup-inner">
                        <h2>{`${currentReportType.charAt(0).toUpperCase() + currentReportType.slice(1)} Report Graph`}</h2>
                        <Line data={graphData} />
                        <button onClick={() => setShowGraph(false)}>Close</button>
                    </div>
                </div>
            )}



        </div>


            <br /><br />        <hr /><br />
            

            <h3 className="subtitle">Relatório Diário</h3>
            <div className={`report-table-container ${monthlyReportData.length > 4 ? 'scrollable' : ''}`}>
        
            <table className="report-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>WhatsApp</th>
                        <th>Serviço Fornecido</th>
                        <th>Quantidade</th>
                         {/* <th>Nome de Usuário</th> */}
                        <th>É Devedor?</th>
                        <th>Data de Criação</th>
                        <th>ID do Pagamento</th>
                        
                        <th>EXCLUIR</th>
                        {/* Adicione mais colunas conforme necessário */}
                    </tr>
                </thead>
                <tbody>
                    {dailyReportData.map((item: ReportData, index: number) => ( // Use a interface ReportData para tipar o item
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.whatsapp}</td>
                            <td>{item.service_provided}</td>
                            <td>R$ {Math.round(item.amount * 0.99).toFixed(2).replace('.', ',')}</td>
                               {/* <td>{item.username}</td> */}
                               <td>
                                <select
                                    value={item.pending_payments.toString()}
                                    onChange={(e) => handlePendingPaymentChange(item, e.target.value)}
                                >
                                    {/* Sempre inclua as opções true e false */}
                                    <option value="true">Sim</option>
                                    <option value="false">Não</option>
                                    {/* Se o valor atual não for nem true nem false, inclua uma opção para o estado atual */}
                                    {item.pending_payments !== true && item.pending_payments !== false && (
                                    <option value={item.pending_payments.toString()} disabled>
                                        {item.pending_payments.charAt(0).toUpperCase() + item.pending_payments.slice(1)}
                                    </option>
                                    )}
                                </select>
                                </td>
                              <td>
                            {
                                new Date(new Date(item.created_at).getTime() )
                                .toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                })
                            }
                            </td>
                              <td>{item.payment_id}</td>
                            {/* Existing table row code */}

                            <td>
                                <button onClick={() => deleteCliente(item.payment_id)} className="delete-button">Excluir</button>
                            </td>
                            {/* Existing table row code */}

                        

                            {/* Adicione mais colunas conforme necessário */}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <br />
        <div className='buttons-row-rel'>
           {/* <button className='button-report'>Exibir detalhes</button>*/}  
           <button className='button-report' onClick={() => emitPdf('daily')}>Emitir PDF</button> 
           <button className='button-report' onClick={() => emitDocx('daily')}>Emitir DOCX</button> 
           <button className='button-report' onClick={() => emitExcel('daily')}>Emitir Excel</button>
           <button className="button-report" onClick={() => prepareGraphData('daily')}>Exibir Gráfico Diário</button>

           {showGraph && graphData && currentReportType === 'daily' &&  (
                <div className="graph-popup">
                    <div className="graph-popup-inner">
                        <h2>{`${currentReportType.charAt(0).toUpperCase() + currentReportType.slice(1)} Report Graph`}</h2>
                        <Line data={graphData} />
                        <button onClick={() => setShowGraph(false)}>Close</button>
                    </div>
                </div>
            )}



        </div>
        <br />
        <hr />
        <br />
        <br />
            <h3 className="subtitle">Relatório Semanal</h3>
            <div className={`report-table-container ${monthlyReportData.length > 4 ? 'scrollable' : ''}`}>
            <table className="report-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>WhatsApp</th>
                        <th>Serviço Fornecido</th>
                        <th>Quantidade</th>
                         {/* <th>Nome de Usuário</th> */}
                        <th>É Devedor?</th>
                        <th>Data de Criação</th>
                        <th>ID do Pagamento</th>
                        <th>EXCLUIR</th>
                        

                        {/* Adicione mais colunas conforme necessário */}
                    </tr>
                </thead>
                <tbody>
                    {weeklyReportData.map((item: ReportData, index: number) => ( // Use a interface ReportData para tipar o item
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.whatsapp}</td>
                            <td>{item.service_provided}</td>
                            <td>R$ {Math.round(item.amount * 0.99).toFixed(2).replace('.', ',')}</td>
                               {/* <td>{item.username}</td> */}
                               <td>
                                <select
                                    value={item.pending_payments.toString()}
                                    onChange={(e) => handlePendingPaymentChange(item, e.target.value)}
                                >
                                    {/* Sempre inclua as opções true e false */}
                                    <option value="true">Sim</option>
                                    <option value="false">Não</option>
                                    {/* Se o valor atual não for nem true nem false, inclua uma opção para o estado atual */}
                                    {item.pending_payments !== true && item.pending_payments !== false && (
                                    <option value={item.pending_payments.toString()} disabled>
                                        {item.pending_payments.charAt(0).toUpperCase() + item.pending_payments.slice(1)}
                                    </option>
                                    )}
                                </select>
                                </td>
                              <td>
                            {
                                new Date(new Date(item.created_at).getTime() )
                                .toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                })
                            }
                            </td>
                              <td>{item.payment_id}</td>
                            {/* Existing table row code */}

                            <td>
                                <button onClick={() => deleteCliente(item.payment_id)} className="delete-button">Excluir</button>
                            </td>
                            {/* Adicione mais colunas conforme necessário */}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <br />
        <div className='buttons-row-rel'>
           {/* <button className='button-report'>Exibir detalhes</button>*/}   
           <button className='button-report' onClick={() => emitPdf('weekly')}>Emitir PDF</button> 
           <button className='button-report' onClick={() => emitDocx('weekly')}>Emitir DOCX</button> 
           <button className='button-report' onClick={() => emitExcel('weekly')}>Emitir Excel</button>
           <button className="button-report" onClick={() => prepareGraphData('weekly')}>Exibir Gráfico Semanal</button>

           {showGraph && graphData && currentReportType === 'weekly' &&(
                <div className="graph-popup">
                    <div className="graph-popup-inner">
                        <h2>{`${currentReportType.charAt(0).toUpperCase() + currentReportType.slice(1)} Report Graph`}</h2>
                        <Line data={graphData} />
                        <button onClick={() => setShowGraph(false)}>Close</button>
                    </div>
                </div>
            )}

        </div>
        <br />
        <hr />
        <br />
        <h3 className="subtitle">Relatório Mensal</h3>
        <div className={`report-table-container ${monthlyReportData.length > 4 ? 'scrollable' : ''}`}>
            
            <table className="report-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>WhatsApp</th>
                        <th>Serviço Fornecido</th>
                        <th>Quantidade</th>
                         {/* <th>Nome de Usuário</th> */}
                        <th>É Devedor?</th>
                        <th>Data de Criação</th>
                        <th>ID do Pagamento</th>
                        <th>EXCLUIR</th>
                        {/* Adicione mais colunas conforme necessário */}
                    </tr>
                </thead>
                <tbody>
                    {monthlyReportData.map((item: ReportData, index: number) => ( // Use a interface ReportData para tipar o item
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.whatsapp}</td>
                            <td>{item.service_provided}</td>
                            <td>R$ {Math.round(item.amount * 0.99).toFixed(2).replace('.', ',')}</td>
                               {/* <td>{item.username}</td> */}
                               <td>
                                <select
                                    value={item.pending_payments.toString()}
                                    onChange={(e) => handlePendingPaymentChange(item, e.target.value)}
                                >
                                    {/* Sempre inclua as opções true e false */}
                                    <option value="true">Sim</option>
                                    <option value="false">Não</option>
                                    {/* Se o valor atual não for nem true nem false, inclua uma opção para o estado atual */}
                                    {item.pending_payments !== true && item.pending_payments !== false && (
                                    <option value={item.pending_payments.toString()} disabled>
                                        {item.pending_payments.charAt(0).toUpperCase() + item.pending_payments.slice(1)}
                                    </option>
                                    )}
                                </select>
                                </td>
                            <td>
                            {
                                new Date(new Date(item.created_at).getTime() )
                                .toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                })
                            }
                            </td>

                              <td>{item.payment_id}</td>
                            {/* Existing table row code */}

                            <td>
                                <button onClick={() => deleteCliente(item.payment_id)} className="delete-button">Excluir</button>
                            </td>
                            {/* Adicione mais colunas conforme necessário */}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <br />
        <div className='buttons-row-rel'>
           {/* <button className='button-report'>Exibir detalhes</button>*/}  
           <button className='button-report' onClick={() => emitPdf('monthly')}>Emitir PDF</button> 
           <button className='button-report' onClick={() => emitDocx('monthly')}>Emitir DOCX</button> 
           <button className='button-report' onClick={() => emitExcel('monthly')}>Emitir Excel</button>
           <button className="button-report" onClick={() => prepareGraphData('monthly')}>Exibir Gráfico Mensal</button>

            {showGraph && graphData && currentReportType === 'monthly' &&(
                <div className="graph-popup">
                    <div className="graph-popup-inner">
                        <h2>{`${currentReportType.charAt(0).toUpperCase() + currentReportType.slice(1)} Report Graph`}</h2>
                        <Line data={graphData} />
                        <button onClick={() => setShowGraph(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
        <br />
        <hr />
        <br />
            <h3 className="subtitle">Relatório Trimestral</h3>
            <div className={`report-table-container ${quarterlyReportData.length > 4 ? 'scrollable' : ''}`}>
            <table className="report-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>WhatsApp</th>
                        <th>Serviço Fornecido</th>
                        <th>Quantidade</th>
                         {/* <th>Nome de Usuário</th> */}
                        <th>É Devedor?</th>
                        <th>Data de Criação</th>
                        <th>ID do Pagamento</th>
                        <th>EXCLUIR</th>
                        {/* Adicione mais colunas conforme necessário */}
                    </tr>
                </thead>
                <tbody>
                    {quarterlyReportData.map((item: ReportData, index: number) => ( // Use a interface ReportData para tipar o item
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.whatsapp}</td>
                            <td>{item.service_provided}</td>
                            <td>R$ {Math.round(item.amount * 0.99).toFixed(2).replace('.', ',')}</td>
                               {/* <td>{item.username}</td> */}
                               <td>
                                <select
                                    value={item.pending_payments.toString()}
                                    onChange={(e) => handlePendingPaymentChange(item, e.target.value)}
                                >
                                    {/* Sempre inclua as opções true e false */}
                                    <option value="true">Sim</option>
                                    <option value="false">Não</option>
                                    {/* Se o valor atual não for nem true nem false, inclua uma opção para o estado atual */}
                                    {item.pending_payments !== true && item.pending_payments !== false && (
                                    <option value={item.pending_payments.toString()} disabled>
                                        {item.pending_payments.charAt(0).toUpperCase() + item.pending_payments.slice(1)}
                                    </option>
                                    )}
                                </select>
                                </td>
                              <td>
                            {
                                new Date(new Date(item.created_at).getTime() )
                                .toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                })
                            }
                            </td>
                              <td>{item.payment_id}</td>
                            {/* Existing table row code */}

                            <td>
                                <button onClick={() => deleteCliente(item.payment_id)} className="delete-button">Excluir</button>
                            </td>
                            {/* Adicione mais colunas conforme necessário */}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <br />
        <div className='buttons-row-rel'>
           {/* <button className='button-report'>Exibir detalhes</button>*/}  
           <button className='button-report' onClick={() => emitPdf('quarterly')}>Emitir PDF</button> 
           <button className='button-report' onClick={() => emitDocx('quarterly')}>Emitir DOCX</button> 
           <button className='button-report' onClick={() => emitExcel('quarterly')}>Emitir Excel</button>
           <button className="button-report" onClick={() => prepareGraphData('quarterly')}>Exibir Gráfico Trimestral</button>

            {showGraph && graphData && currentReportType === 'quarterly' &&(
                <div className="graph-popup">
                    <div className="graph-popup-inner">
                        <h2>{`${currentReportType.charAt(0).toUpperCase() + currentReportType.slice(1)} Report Graph`}</h2>
                        <Line data={graphData} />
                        <button onClick={() => setShowGraph(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
        <br />
        <hr />
        <br />
            <h3 className="subtitle">Relatório Semestral</h3>
            <div className={`report-table-container ${semiAnnualyReportData.length > 4 ? 'scrollable' : ''}`}>
            <table className="report-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>WhatsApp</th>
                        <th>Serviço Fornecido</th>
                        <th>Quantidade</th>
                         {/* <th>Nome de Usuário</th> */}
                        <th>É Devedor?</th>
                        <th>Data de Criação</th>
                        <th>ID do Pagamento</th>
                        <th>EXCLUIR</th>
                        {/* Adicione mais colunas conforme necessário */}
                    </tr>
                </thead>
                <tbody>
                    {semiAnnualyReportData.map((item: ReportData, index: number) => ( // Use a interface ReportData para tipar o item
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.whatsapp}</td>
                            <td>{item.service_provided}</td>
                            <td>R$ {Math.round(item.amount * 0.99).toFixed(2).replace('.', ',')}</td>
                               {/* <td>{item.username}</td> */}
                               <td>
                                <select
                                    value={item.pending_payments.toString()}
                                    onChange={(e) => handlePendingPaymentChange(item, e.target.value)}
                                >
                                    {/* Sempre inclua as opções true e false */}
                                    <option value="true">Sim</option>
                                    <option value="false">Não</option>
                                    {/* Se o valor atual não for nem true nem false, inclua uma opção para o estado atual */}
                                    {item.pending_payments !== true && item.pending_payments !== false && (
                                    <option value={item.pending_payments.toString()} disabled>
                                        {item.pending_payments.charAt(0).toUpperCase() + item.pending_payments.slice(1)}
                                    </option>
                                    )}
                                </select>
                                </td>
                              <td>
                            {
                                new Date(new Date(item.created_at).getTime() )
                                .toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                })
                            }
                            </td>
                              <td>{item.payment_id}</td>
                            {/* Existing table row code */}

                            <td>
                                <button onClick={() => deleteCliente(item.payment_id)} className="delete-button">Excluir</button>
                            </td>
                            {/* Adicione mais colunas conforme necessário */}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <br />
        <div className='buttons-row-rel'>
           {/* <button className='button-report'>Exibir detalhes</button>*/}  
           <button className='button-report' onClick={() => emitPdf('semiannual')}>Emitir PDF</button> 
           <button className='button-report' onClick={() => emitDocx('semiannual')}>Emitir DOCX</button> 
           <button className='button-report' onClick={() => emitExcel('semiannual')}>Emitir Excel</button>
           <button className="button-report" onClick={() => prepareGraphData('semiannual')}>Exibir Gráfico Semestral</button>

            {showGraph && graphData && currentReportType === 'semiannual' &&(
                <div className="graph-popup">
                    <div className="graph-popup-inner">
                        <h2>{`${currentReportType.charAt(0).toUpperCase() + currentReportType.slice(1)} Report Graph`}</h2>
                        <Line data={graphData} />
                        <button onClick={() => setShowGraph(false)}>Close</button>
                    </div>
                </div>
            )}

        </div>
        <br />
        <br />
            <h3 className="subtitle">Relatório Anual</h3>
            <div className={`report-table-container ${annualReportData.length > 4 ? 'scrollable' : ''}`}>
            <table className="report-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>WhatsApp</th>
                        <th>Serviço Fornecido</th>
                        <th>Quantidade</th>
                         {/* <th>Nome de Usuário</th> */}
                        <th>É Devedor?</th>
                        <th>Data de Criação</th>
                        <th>ID do Pagamento</th>
                        <th>EXCLUIR</th>
                        {/* Adicione mais colunas conforme necessário */}
                    </tr>
                </thead>
                <tbody>
                    {annualReportData.map((item: ReportData, index: number) => ( // Use a interface ReportData para tipar o item
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.whatsapp}</td>
                            <td>{item.service_provided}</td>
                            <td>R$ {Math.round(item.amount * 0.99).toFixed(2).replace('.', ',')}</td>
                               {/* <td>{item.username}</td> */}
                               <td>
                                <select
                                    value={item.pending_payments.toString()}
                                    onChange={(e) => handlePendingPaymentChange(item, e.target.value)}
                                >
                                    {/* Sempre inclua as opções true e false */}
                                    <option value="true">Sim</option>
                                    <option value="false">Não</option>
                                    {/* Se o valor atual não for nem true nem false, inclua uma opção para o estado atual */}
                                    {item.pending_payments !== true && item.pending_payments !== false && (
                                    <option value={item.pending_payments.toString()} disabled>
                                        {item.pending_payments.charAt(0).toUpperCase() + item.pending_payments.slice(1)}
                                    </option>
                                    )}
                                </select>
                                </td>
                              <td>
                            {
                                new Date(new Date(item.created_at).getTime() )
                                .toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                })
                            }
                            </td>
                              <td>{item.payment_id}</td>
                            {/* Existing table row code */}

                            <td>
                                <button onClick={() => deleteCliente(item.payment_id)} className="delete-button">Excluir</button>
                            </td>
                            {/* Adicione mais colunas conforme necessário */}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <br />
        <div className='buttons-row-rel'>
           {/* <button className='button-report'>Exibir detalhes</button>*/}  
           <button className='button-report' onClick={() => emitPdf('annual')}>Emitir PDF</button> 
           <button className='button-report' onClick={() => emitDocx('annual')}>Emitir DOCX</button> 
           <button className='button-report' onClick={() => emitExcel('annual')}>Emitir Excel</button>
           <button className="button-report" onClick={() => prepareGraphData('annual')}>Exibir Gráfico Anual</button>

            {showGraph && graphData && currentReportType === 'annual' &&(
                <div className="graph-popup">
                    <div className="graph-popup-inner">
                        <h2>{`${currentReportType.charAt(0).toUpperCase() + currentReportType.slice(1)} Report Graph`}</h2>
                        <Line data={graphData} />
                        <button onClick={() => setShowGraph(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
        <br />
        <hr />
        <br />
        <button className="button" onClick={backToDashboard}>Voltar ao Início</button>
        </div>
    </>
  )
}

export default ManagementReports