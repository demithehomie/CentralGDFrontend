import './App.css';
import axios from 'axios';


//import  { useEffect, useState } from 'react';
// import { GlobalStyle } from './components/global-style/GlobalStyle';
import LoginForm from './components/login-form/LoginForm';
import Dashboard from './screens/dashboard/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './screens/profile/Profile';
import Activity from './screens/activity/Activity';
import Scheduling from './screens/scheduling/Scheduling';
import Configure from './screens/configure/Configure';
import Users from './screens/users/Users';
import { AuthProvider } from './context/auth/AuthContext';
import SearchResults from './screens/search-results/SearchResults';
import UserProfile from './screens/user-profile/UserProfile';
import PaymentScreen from './screens/all-payments-screen/PaymentScreen';
import PrintsGuerraTool from './screens/prints-screen/guerratool/PrintsGuerraTool';
import PrintsTheMagicTool from './screens/prints-screen/themagictool/PrintsTheMagicTool';
import MiniTargetTable from './components/mni-target-table/MiniTargetTable';
import PaymentMenu from './screens/payment-menu/PaymentMenu';
import PrivateRoute from './context/auth/PrivateRoute';
import SearchPrintsResults from './screens/search-prints-results/SearchPrintsResults';
import UserPrintsPage from './screens/user-prints-page/UserPrintsPage';
import ManagementReports from './screens/management-reports/ManagementReports';
import ReportDetailsPage from './components/detail-modal-reports/ReportDetailsPage';
import GuerraToolUsers from './screens/users/GuerraTool/GuerraToolUsers';
import SearchResultsGuerraTool from './screens/search-results/SearchResultsGuerraTool/SearchResultsGuerraTool';
import UserProfileGuerraTool from './screens/user-profile/GuerraTool/UserProfileGuerraTool';
import ReceiveCrypto from './screens/receive-crypto/ReceiveCrypto';
import CryptoPaymentPage from './screens/crypto-payment-page/CryptoPaymentPage';
import ReportsDashboard from './screens/reports-dashboard/ReportsDashboard';

//import { User } from './components/user-table/UserTable';
//import User from './components/user-table/UserTable';
//import { useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MgmtReportsGuerraTool from './screens/management-reports/guerra-tool/MgmtReportsGuerraTool';
import BlockedUsers from './screens/blocked-users/BlockedUsers';
import TaskLogsGT from './screens/task-logs-gt/TaskLogsGT';
import TaskLogsTMT from './screens/task-logs-tmt/TaskLogsTMT';
import GuerraToolBlockedUsers from './screens/blocked-users/guerra-tool/GuerratoolBlockedUsers';
import CreditLogsTMT from './screens/credit-logs-tmt/CreditLogsTMT';
import MotorolaServerScreen from './screens/MotorolaServerScreen/MotorolaServerScreen';
import CreditLogsGT from './screens/credit-logs-gt/CreditLogsGT';
import { Analytics } from './screens/analytics/Analytics';
import FingerPHStoriesTMT from './screens/fingerprints-histories-tmt/FingerPHistoriesTMT';
import FingerPHStoriesGT from './screens/fingerprints-histories-gt/FingerPHistoriesGT';
import LockingCentral from './screens/locking-central/TheLockingCentral';
import LogsScreen from './screens/logs-screen/LogsScreen';
import PresentationScreen from './screens/presentation-screen/PresentationScreen';

//import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastProvider } from './context/toast/ToastProvider';
import ReportView from './screens/report-page/ReportPage';
import AddSupplier from './screens/AddSupplier/AddSupplier';
import UserPrintsPageGT from './screens/user-prints-page/user-prints-page-guerratool/UserPrintsPageGT';
import AddClientManually from './screens/add-client-manually/AddClientManually';
import NewDashboard from './screens/all-new-dashboard/AllNewDashboard';
import GeracaoDeCliente from './screens/all-payments-screen/new-payment-screens/gerar-cliente';
import CobrarPagamento from './screens/all-payments-screen/new-payment-screens/cobrar-pagamento';
import FastPaymentReports from './screens/all-payments-screen/new-payment-screens/validação-e-relatórios';
import NewPaymentScreen from './screens/new-payment-screen/NewPaymentScreen';
import GuerraToolNewPrintStrategy from './screens/new-peints-strategy/guerratool';
import TheMagictoolPrintsStrategy from './screens/new-peints-strategy/themagictool';
// import noIDPrintsStrategy from './screens/new-peints-strategy/prints-with-no-id';

import GuerraToolNewPrintStrategyButJustTheCancelled from './screens/new-peints-strategy/guerratool/cancelled-prints';
import TheMagictoolPrintsStrategyButJustTheCancelled from './screens/new-peints-strategy/themagictool/cancelled-prints';
import GTPRINTS from './screens/second-screenshots/guerratool';
import NoIDPrintsStrategy from './screens/new-peints-strategy/prints-with-no-id';
import UserPrintsPageNOID from './screens/user-prints-page/no-id/UserPrintsNoID';
import TheMagicToolPrintsListFormat from './screens/new-peints-strategy/list-format/the-magic-tool';
// import { ChakraProvider } from '@chakra-ui/react';


export const mercadoPagoApi = axios.create({
  baseURL: 'https://api.mercadopago.com/v1'
});



// const container = document.getElementById('root');
// const root = createRoot(container!);
// root.render(<App />);


function App() {

 // let navigate = useNavigate();
  
  return (
    <>
  

      <AuthProvider>
      {/* <ChakraProvider>         */}
        <HelmetProvider>
        {/* <GlobalStyle /> */}

        <ToastProvider>
        
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<LoginForm />} />


        <Route path="/payments-central/generating-client" element={<GeracaoDeCliente/>}/>
        <Route path="/payments-central/charging-payments" element={<CobrarPagamento/>}/>
        <Route path="/payments-central/fast-payment-reports" element={<FastPaymentReports/>}/>

        <Route path="/payments-central/start-here" element={<PrivateRoute><NewPaymentScreen/></PrivateRoute>}/>


        {/* <Route path="/payments-central/all-registered-data" element={<FastPaymentReports/>}/> */}

          <Route path="/familiaguerra/all-new-dashboard" element={<PrivateRoute><NewDashboard /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/add-supplier" element={<PrivateRoute><AddSupplier/></PrivateRoute>} />
          <Route path="/logs-screen" element={<PrivateRoute><LogsScreen /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile nomeInicial={'Demetrius'} funcaoInicial={'Admin'}/></PrivateRoute>} />
          <Route path="/activity" element={<PrivateRoute><Activity /></PrivateRoute>} />
          <Route path="/scheduling" element={<PrivateRoute><Scheduling /></PrivateRoute>} />
          <Route path="/configure" element={<PrivateRoute><Configure /></PrivateRoute>} />
          <Route path="/blocked-users/guerratool" element={<PrivateRoute><GuerraToolBlockedUsers /></PrivateRoute>} />
          <Route path="/blocked-users" element={<PrivateRoute><BlockedUsers /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
          <Route path="/guerratool-users" element={<PrivateRoute><GuerraToolUsers /></PrivateRoute>} />
          <Route path="/search-results" element={<PrivateRoute><SearchResults /></PrivateRoute>} />
          <Route path="/search-results-guerratool" element={<PrivateRoute><SearchResultsGuerraTool /></PrivateRoute>} />
          <Route path="/search-prints-results" element={<PrivateRoute><SearchPrintsResults /></PrivateRoute>} />
          <Route path="/user-profile/:userId" element={ /* <PrivateRoute> */ <UserProfile /> /* </PrivateRoute > */} />
          <Route path="/presentation-screen" element={ /* <PrivateRoute> */ <PresentationScreen /> /* </PrivateRoute > */} />
          <Route path="/user-profile-guerratool/:userId" element={ /*<PrivateRoute>*/ <UserProfileGuerraTool /> /*</PrivateRoute> */}/>
          <Route path="/payment-screen/execute-action" element={<PrivateRoute><PaymentScreen /></PrivateRoute>} />

          
          <Route path="/guerratool/new-screen/get-all-prints" element={<PrivateRoute><GuerraToolNewPrintStrategy /></PrivateRoute>} />
          <Route path="/themagictool/new-screen/get-all-prints" element={<PrivateRoute><TheMagictoolPrintsStrategy /></PrivateRoute>} />
          <Route path="/themagictool/new-screen/get-all-prints/users-without-ids" element={<PrivateRoute><NoIDPrintsStrategy/></PrivateRoute>} />

          <Route path="/guerratool/new-screen/get-prints/cancelled" element={<PrivateRoute><GuerraToolNewPrintStrategyButJustTheCancelled /></PrivateRoute>} />
          <Route path="/themagictool/new-screen/get-prints/cancelled" element={<PrivateRoute><TheMagictoolPrintsStrategyButJustTheCancelled /></PrivateRoute>} />


          <Route path="/guerratool/get-all-prints" element={<PrivateRoute><PrintsGuerraTool /></PrivateRoute>} />
          <Route path="/themagictool/get-all-prints" element={<PrivateRoute><PrintsTheMagicTool /></PrivateRoute>} />

          
          <Route path="/target" element={<PrivateRoute><MiniTargetTable /></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute><PaymentMenu /></PrivateRoute>} />

          
          <Route path="/user-prints-page/:userId" element={<PrivateRoute><UserPrintsPage /></PrivateRoute>} />
          <Route path="/guerratool/user-prints-page/:userId" element={<PrivateRoute><UserPrintsPageGT /></PrivateRoute>} />

          <Route path="/withoutid/user-prints-page" element={<PrivateRoute><UserPrintsPageNOID/></PrivateRoute>} />

          {/* PRINTS EM FORMA DE LISTA COM MÚLTIPLA SELEÇÃO E EXCLUSÃO */}

          <Route path="/user-prints-page/list/:userId" element={<PrivateRoute><TheMagicToolPrintsListFormat /></PrivateRoute>} />
          {/* <Route path="/guerratool/user-prints-page/list/:userId" element={<PrivateRoute>< /></PrivateRoute>} /> */}

          <Route path="/withoutid/user-prints-page/list" element={<PrivateRoute><UserPrintsPageNOID/></PrivateRoute>} />

          {/* PRINTS EM FORMA DE LISTA COM MÚLTIPLA SELEÇÃO E EXCLUSÃO */}

          {/* NOVA USER PRINTS PAGE  */}

          <Route path="/guerratool/get-all-prints/:userId" element={<PrivateRoute><GTPRINTS/></PrivateRoute>} />





          {/* NOVA USER PRINTS PAGE  */}


          <Route path="/mgmt-reports" element={<PrivateRoute><ManagementReports /></PrivateRoute>} />
          <Route path="/mgmt-reports-guerratool" element={<PrivateRoute><MgmtReportsGuerraTool /></PrivateRoute>} />
          <Route path="/receive-crypto" element={<PrivateRoute><ReceiveCrypto /></PrivateRoute>} />
          <Route path="/reports-dashboard" element={<PrivateRoute><ReportsDashboard /></PrivateRoute>} />
          <Route path="/reports-data" element={<PrivateRoute><ReportDetailsPage /></PrivateRoute>} />
          <Route path="/reports-dashboard/:reportType" element={<PrivateRoute><ReportView /></PrivateRoute>} />
          <Route path="/tmt-task-logs" element={<PrivateRoute><TaskLogsTMT /></PrivateRoute>} />
          <Route path="/gt-task-logs" element={<PrivateRoute><TaskLogsGT /></PrivateRoute>} />
          <Route path="/clients/add-manually" element={<PrivateRoute><AddClientManually /></PrivateRoute>} />
          
          <Route path="/tmt-credit-logs" element={<PrivateRoute><CreditLogsTMT /></PrivateRoute>} />
          <Route path="/gt-credit-logs" element={<PrivateRoute><CreditLogsGT /></PrivateRoute>} />

          <Route path="/themagictool/fingerprints-history" element={<PrivateRoute><FingerPHStoriesTMT /></PrivateRoute>} />
          <Route path="/guerratool/fingerprints-history" element={<PrivateRoute><FingerPHStoriesGT /></PrivateRoute>} />

          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />

          <Route path="/analytics" element={<PrivateRoute><LockingCentral /></PrivateRoute>} />

          <Route path="/servers-screen" element={<PrivateRoute><MotorolaServerScreen /></PrivateRoute>} />

          <Route path="/crypto-payments/:paymentId" element={<CryptoPaymentPage />} />
        
          </Routes>
          {/* <div className="floating-buttons">
              <button onClick={() => navigate('/rota1')} className="floating-btn">Botão 1</button>
              <button onClick={() => navigate('/rota2')} className="floating-btn">Botão 2</button>
          </div> */}
          {/* <ToastContainer position="bottom-left" /> */}
        </BrowserRouter>

        </ToastProvider>
        </HelmetProvider>
        {/* </ChakraProvider> */}

      </AuthProvider>

    </>
  );
}

export default App;
