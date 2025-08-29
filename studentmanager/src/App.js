import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Header from './components/Header';
import StartPage from './views/StartPage';
import Login from './views/authentication/LoginPage';
import Register from './views/authentication/RegisterPage';
import StudentDashboard from './views/student/StudentHome';
import Classes from './views/student/Classes';
import Grades from './views/student/Grades';
import Calendar from './views/student/Calendar';
import ProfilePage from './views/student/StudentProfile';
import ComingSoonScreen from './views/ComingSoonPage';
import ForgotPassword from './hooks/ForgotPassword';
import Footer from './components/Footer';
import Classes from './views/student/Classes';

function App() {
  return (
    <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/studentdashboard" element={<StudentDashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/studentprofile" element={<ProfilePage />} />
          <Route path="/coming-soon" element={<ComingSoonScreen />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
        <Footer />
    </BrowserRouter>
  );
}

export default App;
