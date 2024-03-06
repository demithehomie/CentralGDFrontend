import MainNavbar from "../../components/main-navbar/MainNavbar";

import {
  Box,
  Text,
  Button,
 // Heading,
  Select,
  VStack,
  Container,
} from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from "react-router-dom";

// Registrando componentes necessários para o gráfico de barras
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export default function ReportsDashboard() {

  let navigate = useNavigate();

  const handleChange = (event: { target: { value: any; }; }) => {
    const reportType = event.target.value;
    navigate(`/reports-dashboard/${reportType}`);
  };

  const barChartData = {
    labels: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
    datasets: [
      {
        label: "Relatório Diário",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };


  return (
    <>
       <MainNavbar/>
       <Container maxW="container.xl" py={6}>
      <VStack spacing={6}>
        <h1 className="title">Reports Central</h1>
        <Text>All of the reports here</Text>
        <Box width="100%" boxShadow="md" p={5} borderRadius="md">
          <Bar data={barChartData} />
        </Box>
        <Select placeholder="Selecionar tipo de relatório" onChange={handleChange}>
          <option value="semanal">Semanal</option>
          <option value="trimestral">Trimestral</option>
          <option value="semestral">Semestral</option>
          <option value="anual">Anual</option>
        </Select>
        <Button colorScheme="blue">Relatório Personalizado</Button>
      </VStack>
    </Container>
    </>

  )
}
