import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Header from './components/Header';
import StartPage from './views/StartPage';
import Login from './views/authentication/LoginPage';
import Register from './views/authentication/RegisterPage';
import StudentDashboard from './views/student/StudentHome';
import ProfilePage from './views/student/StudentProfile';
import ComingSoonScreen from './views/ComingSoonPage';
import ForgotPassword from './hooks/ForgotPassword';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/studentdashboard" element={<StudentDashboard />} />
          <Route path="/studentprofile" element={<ProfilePage />} />
          <Route path="/coming-soon" element={<ComingSoonScreen />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
        <Footer />
    </BrowserRouter>
  );
}

export default App;
