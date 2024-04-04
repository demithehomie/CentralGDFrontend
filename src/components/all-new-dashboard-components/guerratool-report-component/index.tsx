import axios from "axios";
import { useEffect, useState } from "react";
import './index.css';

export interface GTReportData {
    totalAmount: number;
    last_updated_at: string;
    percentageIncrease: number;
    }

export default function GTReportComponent() {
    const [reportData, setReportData] = useState<GTReportData>();
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      const fetchReportData = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get('https://gdcompanion-prod.onrender.com/guerratool/report/direct-payment/amount');
          setReportData(response.data);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching report data:', error);
          setIsLoading(false);
        }
      };
  
      fetchReportData();
    }, []);
  
    return (
      <div>
        {isLoading ? (
          <div>Aguarde...</div>
        ) : reportData ? (
          <div className='new-info-card-gt'>
             <label style={{ fontSize: 30 }}>GUERRATOOL</label>
            <h2 className="title-of-card-gt">Hoje: US$ {reportData.totalAmount.toFixed(2).replace('.', ',')}</h2>
            {/* <p>Last Updated At: {reportData.last_updated_at}</p> */}
            <p> {reportData.percentageIncrease > 0 ? '🔼' : '🔻'}  <strong>{reportData.percentageIncrease.toFixed(2).replace('.', ',')}% </strong>desde ontem</p>
          </div>
        ) : (
          <div>No data available</div>
        )}
      </div>
    );
  };