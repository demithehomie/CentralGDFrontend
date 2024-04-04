
import GTReportComponent from "../guerratool-report-component";
import GDDailyPaymentsCharts from "../payments-charts/daily-payments-charts/GDDailyPaymentsCharts";
import TMTReportComponent from "../the-magic-tool-report-components";
import './GuerraDoneReportComponent.css';
// import DailyPaymentsChart from "./DailyPaymentsChart";
// import DailyPaymentsTable from "./DailyPaymentsTable";

export default function GuerraDoneReportComponent() {
  return (
   
   <>
    <div className="new-dashboard-container">
        <GDDailyPaymentsCharts/>
        <br />
        <TMTReportComponent/>
        <br />
        <GTReportComponent/>
    </div>
  
   
   </>
  )
}
