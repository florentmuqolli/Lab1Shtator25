import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../../styles/TeacherDashboard.css";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!lastUpdated) return;

    const interval = setInterval(() => {
      const secondsAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      if (secondsAgo < 60) {
        setElapsedTime(`${secondsAgo}s ago`);
      } else {
        const minutes = Math.floor(secondsAgo / 60);
        setElapsedTime(`${minutes}m ago`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  const fetchStats = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const [teacherRes, attendanceRes, classRes] = await Promise.all([
        axiosInstance.get('/teacher/teacher-stats'),
        axiosInstance.get('/attendance/summary/teacher'),
        axiosInstance.get('/class/specific-class'),
      ]);

      const teacherData = teacherRes.data;
      const attendanceCourses = attendanceRes.data;
      const specificClass = classRes.data;

      const averageAttendance = attendanceCourses.length > 0
        ? Math.round(attendanceCourses.reduce((acc, curr) => acc + curr.average_attendance_rate, 0) / attendanceCourses.length)
        : 0;

      setStats({
        totalStudents: teacherData.students.total,
        newStudents: teacherData.students.new,
        totalCourses: teacherData.courses.total,
        newCourses: teacherData.courses.new,
        averageAttendance
      });
      
      setUpcomingClasses(
        specificClass.map(c => ({
          id: c.id,
          title: c.title,
          description: c.description,
          time: c.schedule,
          day: c.day,
          room: c.room
        }))
      );

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch teacher stats:', err);
      toast.error('Failed to update dashboard');
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  const fetchEnrolledStudents = async () => {
    try {
      const res = await axiosInstance.get("/enrollments/teacher");
      const students = res.data;

      const studentMap = new Map();
      students.forEach((s) => {
        if (!studentMap.has(s.id)) {
          studentMap.set(s.id, {
            id: s.id,
            name: s.name || `Student ${s.id}`,
            course: s.class_title || "Enrolled Course",
            progress: Math.floor(Math.random() * 100) 
          });
        }
      });
      setRecentStudents(Array.from(studentMap.values()));
    } catch (err) {
      console.error("Failed to fetch enrolled students:", err);
      toast.error("Unable to load enrolled students");
    }
  };

  useEffect(() => {
    fetchStats();
    fetchEnrolledStudents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    navigate('/login');
  };

  if (loading && !stats) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-loading-spinner"></div>
        <p className="dashboard-loading-text">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-left">
            <h1 className="dashboard-title">Teacher Dashboard</h1>
            <p className="dashboard-subtitle">Manage your courses and track student progress</p>
          </div>
          <div className="dashboard-header-right">
            <button
              className="dashboard-refresh-btn"
              onClick={fetchStats}
              disabled={refreshing}
            >
              <span className={`dashboard-refresh-icon ${refreshing ? 'loading' : ''}`}>
                ↻
              </span>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <div className="dashboard-profile-avatar" onClick={handleLogout}>
              <span className="dashboard-avatar-text">👨‍🏫</span>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome-card">
          <div className="welcome-card-content">
            <div className="welcome-text">
              <h2>Welcome, Professor! 👨‍🏫</h2>
              <p>
                Here's your teaching overview for {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              {elapsedTime && (
                <div className="last-updated">
                  <span className="update-indicator"></span>
                  Last updated {elapsedTime}
                </div>
              )}
            </div>
            <div className="welcome-graphic">
              <div className="graphic-icon">📊</div>
            </div>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon students">👥</div>
            <div className="stat-content">
              <h3>{stats?.totalStudents || 0}</h3>
              <p>Total Students</p>
            </div>
            <div className="stat-trend positive">+{stats?.newStudents || 0} new</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon courses">📚</div>
            <div className="stat-content">
              <h3>{stats?.totalCourses || 0}</h3>
              <p>Active Courses</p>
            </div>
            <div className="stat-trend positive">+{stats?.newCourses || 0} new</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon attendance">✅</div>
            <div className="stat-content">
              <h3>{stats?.averageAttendance || 0}%</h3>
              <p>Avg Attendance</p>
            </div>
            <div className="stat-trend positive">Overall rate</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon assignments">📝</div>
            <div className="stat-content">
              <h3>{upcomingClasses.length}</h3>
              <p>Upcoming Classes</p>
            </div>
            <div className="stat-trend positive">This week</div>
          </div>
        </div>
        <div className="content-card">
          <div className="card-header">
            <div className="tabs-navigation">
              <button
                className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <span>📊</span>
                Overview
              </button>
              <button
                className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => setActiveTab('students')}
              >
                <span>👥</span>
                Students
              </button>
            </div>
          </div>
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="dashboard-content-grid">
                <div className="content-card classes-card">
                  <div className="card-header">
                    <h3>Upcoming Classes</h3>
                    <button className="view-all-btn" onClick={() => navigate('/teacher-classes')}>
                      View All →
                    </button>
                  </div>
                  <div className="classes-list">
                    {upcomingClasses.slice(0, 3).map((classItem) => (
                      <div key={classItem.id} className="class-item">
                        <div className="class-time">{classItem.time}</div>
                        <div className="class-details">
                          <h4>{classItem.title}</h4>
                          <p>{classItem.room} • {classItem.day}</p>
                        </div>
                        <div className="class-subject">{classItem.description?.charAt(0) || '📖'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="content-card quick-actions-card">
                  <div className="card-header">
                    <h3>Quick Actions</h3>
                  </div>
                  <div className="actions-grid">
                    <button className="action-btn" onClick={() => navigate('/teacher-classes')}>
                      <div className="action-icon">📚</div>
                      <span>My Courses</span>
                    </button>
                    <button className="action-btn" onClick={() => navigate('/teacher-assignments')}>
                      <div className="action-icon">📝</div>
                      <span>Assignments</span>
                    </button>
                    <button className="action-btn" onClick={() => navigate('/teacher-grades')}>
                      <div className="action-icon">📊</div>
                      <span>Grades</span>
                    </button>
                    <button className="action-btn" onClick={() => navigate('/coming-soon')}>
                      <div className="action-icon">✅</div>
                      <span>Attendance</span>
                    </button>
                    <button className="action-btn" onClick={() => navigate('/coming-soon')}>
                      <div className="action-icon">👥</div>
                      <span>Students</span>
                    </button>
                    <button className="action-btn" onClick={() => navigate('/coming-soon')}>
                      <div className="action-icon">📅</div>
                      <span>Schedule</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="content-card">
                <div className="card-header">
                  <h3>Recent Students</h3>
                  <button className="view-all-btn" onClick={() => navigate('/teacher-students')}>
                    View All →
                  </button>
                </div>
                <div className="students-list">
                  {recentStudents.slice(0, 5).map((student) => (
                    <div key={student.id} className="student-item">
                      <div className="student-avatar">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="student-info">
                        <h4>{student.name}</h4>
                        <p>{student.course}</p>
                      </div>
                      <div className="student-progress">
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill in-progress" 
                              style={{width: `${student.progress}%`}}
                            ></div>
                          </div>
                          <span>{student.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;