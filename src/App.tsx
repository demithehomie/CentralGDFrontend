import './App.css';
import axios from 'axios';
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
//import ReportsDashboard from './screens/reports-dashboard/ReportsDashboard';

//import { User } from './components/user-table/UserTable';
//import User from './components/user-table/UserTable';
//import { useParams } from 'react-router-dom';



export const mercadoPagoApi = axios.create({
  baseURL: 'https://api.mercadopago.com/v1'
});


function App() {

  
  
  return (
    <>
      <AuthProvider>
        <GlobalStyle />

        <BrowserRouter>
          <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile nomeInicial={'Demetrius'} funcaoInicial={'Admin'}/></PrivateRoute>} />
          <Route path="/activity" element={<PrivateRoute><Activity /></PrivateRoute>} />
          <Route path="/scheduling" element={<PrivateRoute><Scheduling /></PrivateRoute>} />
          <Route path="/configure" element={<PrivateRoute><Configure /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
          <Route path="/search-results" element={<PrivateRoute><SearchResults /></PrivateRoute>} />
          <Route path="/search-prints-results" element={<PrivateRoute><SearchPrintsResults /></PrivateRoute>} />
          <Route path="/user-profile/:userId" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/payment-screen/:userId" element={<PrivateRoute><PaymentScreen /></PrivateRoute>} />
          <Route path="/get-prints-guerra-tool" element={<PrivateRoute><PrintsGuerraTool /></PrivateRoute>} />
          <Route path="/get-prints-themagictool" element={<PrivateRoute><PrintsTheMagicTool /></PrivateRoute>} />
          <Route path="/target" element={<PrivateRoute><MiniTargetTable /></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute><PaymentMenu /></PrivateRoute>} />
          <Route path="/user-prints-page/:userId" element={<PrivateRoute><UserPrintsPage /></PrivateRoute>} />
          <Route path="/mgmt-reports" element={<PrivateRoute><ManagementReports /></PrivateRoute>} />
          {/* <Route path="/reports-dashboard/:typeOfReport" element={<PrivateRoute><ReportsDashboard /></PrivateRoute>} /> */}
          <Route path="/reports-data" element={<PrivateRoute><ReportDetailsPage /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
