import './App.css';
import axios from 'axios';
import * as Sentry from "@sentry/react";
import { createRoot } from 'react-dom/client';
//import  { useEffect, useState } from 'react';
import { GlobalStyle } from './components/global-style/GlobalStyle';
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
//import ReportsDashboard from './screens/reports-dashboard/ReportsDashboard';

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



export const mercadoPagoApi = axios.create({
  baseURL: 'https://api.mercadopago.com/v1'
});

Sentry.init({
  dsn: "https://3f6d4a098a0bdf0d992be607a65e51e8@o4506707658539008.ingest.sentry.io/4506707659915264",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});



const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);


function App() {

  
  
  return (
    <>
  

      <AuthProvider>
        <HelmetProvider>
        <GlobalStyle />

        <BrowserRouter>
          <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
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
          <Route path="/user-profile-guerratool/:userId" element={ /*<PrivateRoute>*/ <UserProfileGuerraTool /> /*</PrivateRoute> */}/>
          <Route path="/payment-screen/:userId" element={<PrivateRoute><PaymentScreen /></PrivateRoute>} />
          <Route path="/get-prints-guerra-tool" element={<PrivateRoute><PrintsGuerraTool /></PrivateRoute>} />
          <Route path="/get-prints-themagictool" element={<PrivateRoute><PrintsTheMagicTool /></PrivateRoute>} />
          <Route path="/target" element={<PrivateRoute><MiniTargetTable /></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute><PaymentMenu /></PrivateRoute>} />
          <Route path="/user-prints-page/:userId" element={<PrivateRoute><UserPrintsPage /></PrivateRoute>} />
          <Route path="/mgmt-reports" element={<PrivateRoute><ManagementReports /></PrivateRoute>} />
          <Route path="/mgmt-reports-guerratool" element={<PrivateRoute><MgmtReportsGuerraTool /></PrivateRoute>} />
          <Route path="/receive-crypto" element={<PrivateRoute><ReceiveCrypto /></PrivateRoute>} />
          {/* <Route path="/reports-dashboard/:typeOfReport" element={<PrivateRoute><ReportsDashboard /></PrivateRoute>} /> */}
          <Route path="/reports-data" element={<PrivateRoute><ReportDetailsPage /></PrivateRoute>} />
          <Route path="/tmt-task-logs" element={<PrivateRoute><TaskLogsTMT /></PrivateRoute>} />
          <Route path="/gt-task-logs" element={<PrivateRoute><TaskLogsGT /></PrivateRoute>} />
          <Route path="/tmt-credit-logs" element={<PrivateRoute><CreditLogsTMT /></PrivateRoute>} />
          <Route path="/gt-credit-logs" element={<PrivateRoute><TaskLogsGT /></PrivateRoute>} />
          <Route path="/crypto-payments/:paymentId" element={<CryptoPaymentPage />} />
          </Routes>
        </BrowserRouter>
        </HelmetProvider>
      </AuthProvider>
    </>
  );
}

export default App;
