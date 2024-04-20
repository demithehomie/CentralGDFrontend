import /*React,*/ { useEffect, useState } from 'react';
import axios from 'axios';
import {
  //LineChart,
//Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { useParams } from 'react-router-dom';
import { ReportData } from '../../screens/management-reports/ManagementReports';

// interface ReportData {
//   // Defina a mesma interface ReportData que você usou em ManagementReports
// }

function ReportDetailsPage() {
  const { reportType } = useParams();
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [ _isLoading, setIsLoading] = useState(false);

  // Função para buscar dados do relatório
const fetchReportData = async (type: any) => {
  try {
      const response = await axios.get(`https://gdcompanion-prod.onrender.com/report/json?type=${type}`);
      return response.data;
  } catch (error) {
      console.error('Erro ao buscar os dados do relatório:', error);
      throw error; // Lançar o erro para que possa ser tratado no componente
  }
};

  // Componente
useEffect(() => { // DONE
  const fetchData = async () => {
      setIsLoading(true);
      try {
          const data = await fetchReportData(reportType);
          setReportData(data);
      } catch (error) {
          // Tratar erros aqui, se necessário
      } finally {
          setIsLoading(false);
      }
  };

  fetchData();

  // Cleanup function
  return () => {
      // Qualquer limpeza necessária pode ser adicionada aqui
  };
}, [reportType]); // Certifique-se de incluir reportType na lista de dependências

  // Função para renderizar o gráfico de barras
  const renderBarChart = () => {
    // Use os dados de reportData para criar seu gráfico de barras
    return (
      <BarChart width={600} height={300} data={reportData}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='amount' fill='#8884d8' />
      </BarChart>
    );
  };

  return (
    <div>
      <h2>Detalhes do Relatório</h2>
      <h3>Tipo de Relatório: {reportType}</h3>
      {reportData.length > 0 ? (
        <>
          <h3>Gráfico de Barras</h3>
          {renderBarChart()}
          {/* Adicione outros gráficos e detalhes aqui conforme necessário */}
        </>
      ) : (
        <p>Sem dados disponíveis até o momento.</p>
      )}
    </div>
  );
}

export default ReportDetailsPage;
