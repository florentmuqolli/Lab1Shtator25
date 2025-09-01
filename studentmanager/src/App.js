import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Header from './components/Header';
import StartPage from './views/StartPage';
import Login from './views/authentication/LoginPage';
import Register from './views/authentication/RegisterPage';
import StudentDashboard from './views/student/StudentHome';
import TeacherDashboard from './views/teacher/TeacherDashboard';
import AdminDashboard from './views/admin/AdminDashboard';
import Classes from './views/student/Classes';
import Grades from './views/student/Grades';
import Calendar from './views/student/Calendar';
import Assignments from './views/student/Assignments';
import ProfilePage from './views/teacher/TeacherDashboard';
import MyClasses from './views/teacher/MyClasses';
import AssignmentsTeacher from './views/teacher/AssignmentsTeacher';
import GradesTeacher from './views/teacher/GradesTeacher';
import AssignmentForm from './views/teacher/utils/AssignmentForm';
import AssignmentStats from './views/teacher/utils/AssignmentStats';
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
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/myclasses" element={<MyClasses />} />
          <Route path="/assignmentsteacher" element={<AssignmentsTeacher />} />
          <Route path="/gradesteacher" element={<GradesTeacher />} />
          <Route path="/assignmentform" element={<AssignmentForm />} />
          <Route path="/assignmentstats" element={<AssignmentStats />} />
          <Route path="/studentprofile" element={<ProfilePage />} />
          <Route path="/coming-soon" element={<ComingSoonScreen />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
        <Footer />
    </BrowserRouter>
  );
}

export default App;
