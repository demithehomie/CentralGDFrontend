import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import './ManagementReports.css'
import { useEffect, useState } from 'react';

export interface ReportData {
  id: number;
  name: string;
  whatsapp: string;
  service_provided: string;
  amount: number;
  username: string;
  pending_payments: number;
  created_at: string;
  payment_id: number;
}

function ManagementReports() {
    const navigate = useNavigate();

    const [dailyReportData, setDailyReportData] = useState<ReportData[]>([]);
    const [weeklyReportData, setWeeklyReportData] = useState<ReportData[]>([]);
    const [monthlyReportData, setMonthlyReportData] = useState<ReportData[]>([]);
    const [quarterlyReportData, setQuarterlyReportData] = useState<ReportData[]>([]);
    const [semiAnnualyReportData, setSemiAnnualyReportData] = useState<ReportData[]>([]);
    const [annualReportData, setAnnualReportData] = useState<ReportData[]>([]);
   
    const fetchReportData = async (reportType: string, setReportData: React.Dispatch<React.SetStateAction<ReportData[]>>) => {
      try {
          const response = await axios.get(`https://gdcompanion-prod.onrender.com/report/json?type=${reportType}`);
          setReportData(response.data);
          console.log('Dados do relatório:', response.data);
      } catch (error) {
          console.error('Erro ao buscar os dados do relatório:', error);
         
      }
  };

  useEffect(() => {
      // Aqui você pode definir o reportType inicial, por exemplo: 'daily'
      fetchReportData('daily', setDailyReportData);
      fetchReportData('weekly', setWeeklyReportData);
      fetchReportData('monthly', setMonthlyReportData);
      fetchReportData('quarterly', setQuarterlyReportData);
      fetchReportData('semiannual', setSemiAnnualyReportData);
      fetchReportData('annual', setAnnualReportData);
  }, []);



      const backToDashboard = () => {
        navigate('/dashboard');
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

          fileLink.href = fileURL;
          fileLink.setAttribute('download', 'report.docx'); // Set the file name for download
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

        fileLink.href = fileURL;
        fileLink.setAttribute('download', `${reportType}_report.xlsx`); // Set the file name for download
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

      fileLink.href = fileURL;
      fileLink.setAttribute('download', `${reportType}_report.pdf`); // Set the file name for download
      document.body.appendChild(fileLink);

      fileLink.click();
      fileLink.remove(); // Clean up
  } catch (error) {
      console.error('Error downloading the file:', error);
  }
};
    
  return (
    <>
        <div>
            <h3 className="title"> Todos Os Relatórios </h3>   
            <h3 className="subtitle">Relatório Diário</h3>
        
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
                            <td>R$ {item.amount.toFixed(2).replace('.', ',')}</td> 
                               {/* <td>{item.username}</td> */}
                            <td>{item.pending_payments}</td>
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
                            {/* Adicione mais colunas conforme necessário */}
                        </tr>
                    ))}
                </tbody>
            </table>
        <div className='buttons-row-rel'>
           {/* <button className='button-report'>Exibir detalhes</button>*/}  <button className='button-report' onClick={() => emitPdf('daily')}>Emitir PDF</button> <button className='button-report' onClick={() => emitDocx('daily')}>Emitir DOCX</button> <button className='button-report' onClick={() => emitExcel('daily')}>Emitir Excel</button>
        </div>
        <br />
        <hr />
        <br />
        <br />
            <h3 className="subtitle">Relatório Semanal</h3>
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
                            <td>R$ {item.amount.toFixed(2).replace('.', ',')}</td> 
                               {/* <td>{item.username}</td> */}
                            <td>{item.pending_payments}</td>
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
                            {/* Adicione mais colunas conforme necessário */}
                        </tr>
                    ))}
                </tbody>
            </table>
        <div className='buttons-row-rel'>
           {/* <button className='button-report'>Exibir detalhes</button>*/}   <button className='button-report' onClick={() => emitPdf('weekly')}>Emitir PDF</button> <button className='button-report' onClick={() => emitDocx('weekly')}>Emitir DOCX</button> <button className='button-report' onClick={() => emitExcel('weekly')}>Emitir Excel</button>
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
                            <td>R$ {item.amount.toFixed(2).replace('.', ',')}</td> 
                               {/* <td>{item.username}</td> */}
                            <td>{item.pending_payments}</td>
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
                            {/* Adicione mais colunas conforme necessário */}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        <div className='buttons-row-rel'>
           {/* <button className='button-report'>Exibir detalhes</button>*/}  <button className='button-report' onClick={() => emitPdf('monthly')}>Emitir PDF</button> <button className='button-report' onClick={() => emitDocx('monthly')}>Emitir DOCX</button> <button className='button-report' onClick={() => emitExcel('monthly')}>Emitir Excel</button>
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
                            <td>R$ {item.amount.toFixed(2).replace('.', ',')}</td> 
                               {/* <td>{item.username}</td> */}
                            <td>{item.pending_payments}</td>
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
                            {/* Adicione mais colunas conforme necessário */}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        <div className='buttons-row-rel'>
           {/* <button className='button-report'>Exibir detalhes</button>*/}  <button className='button-report' onClick={() => emitPdf('quarterly')}>Emitir PDF</button> <button className='button-report' onClick={() => emitDocx('quarterly')}>Emitir DOCX</button> <button className='button-report' onClick={() => emitExcel('quarterly')}>Emitir Excel</button>
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
                            <td>R$ {item.amount.toFixed(2).replace('.', ',')}</td> 
                               {/* <td>{item.username}</td> */}
                            <td>{item.pending_payments}</td>
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
                            {/* Adicione mais colunas conforme necessário */}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        <div className='buttons-row-rel'>
           {/* <button className='button-report'>Exibir detalhes</button>*/}  <button className='button-report' onClick={() => emitPdf('semiannual')}>Emitir PDF</button> <button className='button-report' onClick={() => emitDocx('semiannual')}>Emitir DOCX</button> <button className='button-report' onClick={() => emitExcel('semiannual')}>Emitir Excel</button>
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
                            <td>R$ {item.amount.toFixed(2).replace('.', ',')}</td> 
                               {/* <td>{item.username}</td> */}
                            <td>{item.pending_payments}</td>
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
                            {/* Adicione mais colunas conforme necessário */}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        <div className='buttons-row-rel'>
           {/* <button className='button-report'>Exibir detalhes</button>*/}  <button className='button-report' onClick={() => emitPdf('annual')}>Emitir PDF</button> <button className='button-report' onClick={() => emitDocx('annual')}>Emitir DOCX</button> <button className='button-report' onClick={() => emitExcel('annual')}>Emitir Excel</button>
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