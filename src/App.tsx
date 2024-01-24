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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile nomeInicial={'Demetrius'} funcaoInicial={'Admin'}/>} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/scheduling" element={<Scheduling />} />
            <Route path="/configure" element={<Configure />} />
            <Route path="/users" element={<Users/>}/>
            <Route path="/search-results" element={<SearchResults/>}/>
            <Route path="/user-profile/:userId" element={<UserProfile />} />
            <Route path="/payment-screen/:userId" element={<PaymentScreen />} />
            <Route path="/get-prints-guerra-tool" element={<PrintsGuerraTool />} />
            <Route path="/get-prints-themagictool" element={<PrintsTheMagicTool />} />
            <Route path="/target" element={<MiniTargetTable />} />
            {/* get-all-prints */}

            {/* <Route path="/user-profile" element={
      userData ? <UserProfile user={userData} onSendCredits={() => {}} onSendMoney={() => {}} /> : <div>Loading...</div>
    }/> */}

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
