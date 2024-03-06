;
import { useParams } from 'react-router-dom';
import MainNavbar from '../../components/main-navbar/MainNavbar';

const ReportView = () => {
  let { reportType } = useParams();

  // Função para transformar a primeira letra em maiúscula
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Garante que reportType é uma string antes de tentar capitalizá-la
  const capitalizedReportType = reportType ? capitalizeFirstLetter(reportType) : '';

  return (
    <>
    <MainNavbar/>
         <h1 className='title'>
         Visualizando Relatório {capitalizedReportType}
        </h1>
    </>
   
  );
};

export default ReportView;
