import MainNavbar from "../../components/main-navbar/MainNavbar";
import { Box, Text, Button, Select, VStack, Container, useToast } from '@chakra-ui/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';


// Registrando componentes necessários para o gráfico de barras
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 
export default function ReportsDashboard() {

  let navigate = useNavigate();
  const toast = useToast();


  const handleChange = (event: { target: { value: any; }; }) => {
    const reportType = event.target.value;
    navigate(`/reports-dashboard/${reportType}`);
  };

  const api_url = `https://gdcompanion-prod.onrender.com`

  // Dados simulados para o gráfico de barras, você pode substituir isso pelos dados da API
  const barChartData = {
    labels: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
    datasets: [
      {
        label: "Relatório Diário",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const emitReport = async (format: string, reportType = "custom") => {
    // Aqui você pode adicionar a lógica para tratar a opção de Email quando estiver pronta
    if (format === 'email') {
      toast({
        title: 'Funcionalidade em Construção',
        description: "O envio de relatórios por email está em construção.",
        status: 'info',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios({
         url: `${api_url}/report/${format}?type=${reportType}`,
        method: 'GET',
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${reportType}.${format}`); // Ajuste para incluir a extensão correta com base no formato
      document.body.appendChild(link);
      link.click();
      link?.parentNode?.removeChild(link);
    } catch (error) {
      toast({
        title: 'Erro ao emitir relatório',
        description: "Não foi possível emitir o relatório.",
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const showReportOptions = () => {
    Swal.fire({
      title: 'Selecione o Formato do Relatório',
      showCancelButton: true,
      confirmButtonText: 'Selecionar',
      cancelButtonText: 'Cancelar',
      html:
        '<button id="pdf" class="swal2-confirm swal2-styled" style="border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);">PDF</button>' +
        '<button id="excel" class="swal2-confirm swal2-styled" style="border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);">Excel</button>' +
        '<button id="docx" class="swal2-confirm swal2-styled" style="border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);">DOCX</button>' +
        '<button id="email" class="swal2-confirm swal2-styled" style="border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);">Email (Em Construção)</button>',
      focusConfirm: false,
      preConfirm: () => false, // Evitar fechar
      didOpen: () => {
        document.getElementById('pdf')?.addEventListener('click', () => emitReport('pdf'));
        document.getElementById('excel')?.addEventListener('click', () => emitReport('xlsx'));
        document.getElementById('docx')?.addEventListener('click', () => emitReport('docx'));
        document.getElementById('email')?.addEventListener('click', () => emitReport('email'));
      },
    });
  };

  return (
    <>
       <MainNavbar/>
       <Container maxW="container.xl" py={6}>
      <VStack spacing={6}>
        <h1 className="title">Reports Central</h1>
        <Text>All of the reports here</Text>
        <Box width="100%" boxShadow="md" p={5} borderRadius="md">
            <Bar data={barChartData} options={{ responsive: true }} />
          </Box>
          <Select placeholder="Selecionar tipo de relatório" onChange={handleChange}>
            <option value="semanal">Semanal</option>
            <option value="trimestral">Trimestral</option>
            <option value="semestral">Semestral</option>
            <option value="anual">Anual</option>
          </Select>
          <Button colorScheme="blue" onClick={showReportOptions}>Relatório Rápido</Button>
      </VStack>
    </Container>
    </>

  )
}
