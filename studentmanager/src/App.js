import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.css';


import Header from './components/Header';
import Footer from './components/Footer';

import StartPage from './views/StartPage';

import Login from './views/authentication/LoginPage';
import Register from './views/authentication/RegisterPage';
import ForgotPassword from './hooks/ForgotPassword';
import ComingSoonScreen from './views/ComingSoonPage';


import AdminDashboard from './views/admin/AdminDashboard';
import StudentManagement from './views/admin/StudentManagement';
import CourseManagement from './views/admin/CourseManagement';
import TeacherManagement from './views/admin/TeacherManagement';
import EnrollmentManagement from './views/admin/EnrollmentManagement';
import EnrollmentFormModal from './views/admin/utils/EnrollmentFormModal';
import CourseFormModal from './views/admin/utils/CourseFormModal';
import TeacherFormModal from './views/admin/utils/TeacherFormModal';
import PendingRequests from './views/admin/utils/PendingRequests';
import TeamManagement from './views/admin/TeamManagement';
import PlayerManagement from './views/admin/PlayerManagement';


import StudentDashboard from './views/student/StudentHome';
import StudentClasses from './views/student/Classes';
import StudentGrades from './views/student/Grades';
import StudentCalendar from './views/student/Calendar';
import StudentAssignments from './views/student/Assignments';
import StudentProfile from "./views/student/StudentProfile"


import TeacherDashboard from './views/teacher/TeacherDashboard';
import TeacherClasses from './views/teacher/MyClasses';
import AssignmentsTeacher from './views/teacher/AssignmentsTeacher';
import GradesTeacher from './views/teacher/GradesTeacher';
import AssignmentForm from './views/teacher/utils/AssignmentForm';
import AssignmentStats from './views/teacher/utils/AssignmentStats';


function Layout() {
  const location = useLocation();

  const hideHeaderRoutes = [
    "/admin-dashboard",
    "/studentmanagement",
    "/course-management",
    "/teachermanagement",
    "/enrollment-management",
    "/team-management",
    "/enrollmentformmodal",
    "/courseformmodal", 
    "/teacherformmodal",
    "/pending-requests",
    "/student-profile",
    "/student-dashboard",
    "/student-classes",
    "/student-grades",
    "/student-calendar",
    "/student-assignments",
    "/teacher-dashboard",
    "/teacher-classes",
    "/teacher-assignments",
    "/teacher-grades",
    "/teacher-assignmentform",
    "/teacher-assignmentstats",
    "/login",
    "/register"
  ];
  const hideFooterRoutes = [
    "/admin-dashboard",
    "/studentmanagement",
    "/course-management",
    "/teachermanagement",
    "/enrollment-management",
    "/team-management",
    "/enrollmentformmodal",
    "/courseformmodal", 
    "/teacherformmodal",
    "/pending-requests",
    "/student-profile",
    "/student-dashboard",
    "/student-classes",
    "/student-grades",
    "/student-calendar",
    "/student-assignments",
    "/teacher-dashboard",
    "/teacher-classes",
    "/teacher-assignments",
    "/teacher-grades",
    "/teacher-assignmentform",
    "/teacher-assignmentstats",
    "/login",
    "/register"
  ];

  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/studentmanagement" element={<StudentManagement />} />
        <Route path="/course-management" element={<CourseManagement />} />
        <Route path="/teachermanagement" element={<TeacherManagement />} />
        <Route path="/enrollment-management" element={<EnrollmentManagement />} />
        <Route path="/enrollmentformmodal" element={<EnrollmentFormModal />} />
        <Route path="/courseformmodal" element={<CourseFormModal />} />
        <Route path="/teacherformmodal" element={<TeacherFormModal />} />
        <Route path="/pending-requests" element={<PendingRequests />} />
        <Route path="/team-management" element={<TeamManagement />} />
        <Route path="/player-management" element={<PlayerManagement />} />


        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-classes" element={<StudentClasses />} />
        <Route path="/student-grades" element={<StudentGrades />} />
        <Route path="/student-calendar" element={<StudentCalendar />} />
        <Route path="/student-assignments" element={<StudentAssignments />} />


        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher-classes" element={<TeacherClasses />} />
        <Route path="/teacher-assignments" element={<AssignmentsTeacher />} />
        <Route path="/teacher-grades" element={<GradesTeacher />} />
        <Route path="/teacher-assignmentform" element={<AssignmentForm />} />
        <Route path="/teacher-assignmentstats" element={<AssignmentStats />} />


        <Route path="/coming-soon" element={<ComingSoonScreen />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      {!shouldHideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
      <ToastContainer position="top-right" autoClose={5000} />
    </BrowserRouter>
  );
}

export default App;
