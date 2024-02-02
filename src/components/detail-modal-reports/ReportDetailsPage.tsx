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

  // Função para buscar dados do relatório
  const fetchReportData = async () => {
    try {
      const response = await axios.get(`https://gdcompanion-prod.onrender.com/report/json?type=${reportType}`);
      setReportData(response.data);
    } catch (error) {
      console.error('Erro ao buscar os dados do relatório:', error);
    }
  };

  // Use o useEffect para buscar os dados do relatório com base no tipo selecionado
  useEffect(() => {
    fetchReportData();
  }, [reportType]);

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
