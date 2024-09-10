import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import InterestedClientsOpportunities from './Component/InterestedClientsOpportunits';
import OpportunityDetails from './Component/OpportunityDetails';
import TalkWithAssistant from './Component/TalkWithAssistent';
import CheckAppoinment from './Component/CheckAppoinment';
import LoginPage from './Component/Login/LoginPage';
import Signup from './Component/Signup/Signup';
import Dashboard from './Component/Dashboard';
import './App.css';
import ResetPassword from './Component/Login/ResetPassword';
import Clients from './Component/Clients';
import VisitedClientsData from './Component/VisitedCLientsData';
import Setting from './Component/Setting';
import ClientsSendData from './Component/ClientsSendData';
import TranscribeAi from './Component/TranscirbeAi';
import SavedTranscribeText from './Component/SavedTranscribeText';
import GenerateImage from './Component/GenerateImage';
import Home from './Component/Home';
import OTPVerification from './Component/Login/OTPVerification';
import CreateNewPassword from './Component/Login/CreateNewPassword ';
import PasswordChanged from './Component/Login/PasswordChanged';
import UsersList from './Component/UsersList';
import Pipline from './Component/Pipline';
import ProfileUpdate from './Component/settingUpdate/profileupdate';
import UpdatePassword from './Component/settingUpdate/UpdatePassword';
import UpdatePromptKeys from './Component/settingUpdate/UpdatePromptKeys';


const App = () => {

  return (
    <BrowserRouter>
     <CheckAppoinment />
      <ClientsSendData />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path="/opportunity/:id" element={<OpportunityDetails />} />
        <Route path="/item/:id" element={<VisitedClientsData />} />
        <Route path='/dashboard/transcribe_audio' element={<InterestedClientsOpportunities />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/Artificial_intelligence' element={<TalkWithAssistant />} />
        <Route path='/reset_password' element={<ResetPassword />} />
        <Route path='/visited_clients' element={<Clients />} />
        <Route path='/setting' element={<Setting />} />  
        <Route path='/transcribe_ai' element={<TranscribeAi />} />
        <Route path='/saved_file' element={<SavedTranscribeText />} />
        <Route path='generate_image' element={<GenerateImage />} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/verify-otp' element={<OTPVerification/>} />
        <Route path="/create-new-password" element={<CreateNewPassword />} /> 
        <Route path='/password-changed-successfully' element={<PasswordChanged/>} />
        <Route path='/user-list' element={<UsersList/>} />
        <Route path='/update-pipline' element={<Pipline/>} />
        <Route path='/setting/profile' element={<ProfileUpdate/>} />
        <Route path='/setting/update-password' element={<UpdatePassword/>} />
        <Route path='/setting/update-keys-prompt' element={<UpdatePromptKeys />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
