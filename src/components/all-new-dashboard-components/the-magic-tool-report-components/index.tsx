import axios from "axios";
import { useEffect, useState } from "react";
import './index.css';

export interface TMTReportData {
    totalAmount: number;
    last_updated_at: string;
    percentageIncrease: number;
    }

export default function TMTReportComponent() {
    const [reportData, setReportData] = useState<TMTReportData>();
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => { // DONE
      const abortController = new AbortController();
      const signal = abortController.signal;
  
      const fetchReportData = async () => {
          setIsLoading(true);
          try {
              const response = await axios.get('https://gdcompanion-prod.onrender.com/themagictool/report/direct-payment/amount', { signal });
              setReportData(response.data);
          } catch (error) {
              console.error('Error fetching report data:', error);
          } finally {
              setIsLoading(false);
          }
      };
  
      fetchReportData();
  
      // Cleanup function
      return () => {
          abortController.abort(); // Cancela a solicitação quando o componente for desmontado
      };
  }, []);
  
  
    return (
      <div>
        {isLoading ? (
          <div>Aguarde...</div>
        ) : reportData ? (
          <div className='new-info-card-tmt'>
             <label style={{ fontSize: 30 }}>The Magic Tool</label>
            <h2 className="title-of-card-tmt">Hoje: US$ {reportData.totalAmount.toFixed(2).replace('.', ',')}</h2>
            {/* <p>Last Updated At: {reportData.last_updated_at}</p> */}
            <p > <strong>  {reportData.percentageIncrease > 0 ? '🔼' : '🔻'} </strong> {reportData.percentageIncrease.toFixed(2).replace('.', ',')}% desde ontem  </p>
          </div>
        ) : (
          <div>No data available</div>
        )}
      </div>
    );
  };