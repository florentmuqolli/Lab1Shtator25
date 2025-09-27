import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/StudentHome.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('');
  const [stats, setStats] = useState({
    upcomingClasses: 0,
    pendingAssignments: 0,
    averageGrade: 0,
    completedCourses: 0,
    attendanceRate: 0,
  });
  const [todaysClasses, setTodaysClasses] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);

  useEffect(() => {
    if (!lastUpdated) return;
    const interval = setInterval(() => {
      const secondsAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      setElapsedTime(secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.floor(secondsAgo / 60)}m ago`);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userRes = await axiosInstance.get('/auth/me');
      setName(userRes.data.name);
      const classesRes = await axiosInstance.get('/class/by-student', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const classes = classesRes.data;
      const today = new Date().toLocaleString('en-US', { weekday: 'long' });
      const todayClasses = classes.filter(c => c.day === today);
      setTodaysClasses(todayClasses);
      const assignmentsRes = await axiosInstance.get('/assignments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const assignments = assignmentsRes.data;
      const assignmentsWithProgress = await Promise.all(assignments.map(async (a) => {
        try {
          const subRes = await axiosInstance.get(`/assignments/${a.id}/activity`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const total = subRes.data.total_submissions || 0;
          const completed = subRes.data.submissions.filter(s => s.student_name === name).length;
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
          return { ...a, progress };
        } catch (err) {
          console.error('Error fetching assignment progress:', err);
          return { ...a, progress: 0 };
        }
      }));

      const pendingAssignments = assignmentsWithProgress.filter(a => new Date(a.due_date) >= new Date());
      setUpcomingAssignments(pendingAssignments);

      setStats({
        upcomingClasses: todayClasses.length,
        pendingAssignments: pendingAssignments.length,
        averageGrade: 0, 
        completedCourses: 0,
        attendanceRate: 0,
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load student dashboard:', error);
      toast.error('Failed to update dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate('/student-profile');
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !name) {
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
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Welcome to your learning portal</p>
          </div>
          <div className="dashboard-header-right">
            <button
              className="dashboard-refresh-btn"
              onClick={fetchData}
              disabled={loading}
            >
              <span className={`dashboard-refresh-icon ${loading ? 'loading' : ''}`}>
                ↻
              </span>
              {loading ? 'Updating...' : 'Refresh'}
            </button>
            <div 
              className="dashboard-profile-avatar"
              onClick={handleNavigate}
              title="View Profile"
            >
              <span className="dashboard-avatar-text">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-welcome-card">
          <div className="welcome-card-content">
            <div className="welcome-text">
              <h2>Welcome back, {name}! 👋</h2>
              <p>Here's your academic overview for today. Stay on track with your learning journey.</p>
              {elapsedTime && (
                <div className="last-updated">
                  <span className="update-indicator"></span>
                  Last updated {elapsedTime}
                </div>
              )}
            </div>
            <div className="welcome-graphic">
              <div className="graphic-icon">🎓</div>
            </div>
          </div>
        </div>
        <div className="dashboard-content-grid">
          <div className="content-card classes-card">
            <div className="card-header">
              <h3>Today's Classes</h3>
              <button className="view-all-btn">View All →</button>
            </div>
            <div className="classes-list">
              {todaysClasses.length === 0 && <p>No classes today.</p>}
              {todaysClasses.map((c) => (
                <div key={c.id} className="class-item">
                  <div className="class-time">{c.schedule}</div>
                  <div className="class-details">
                    <h4>{c.title}</h4>
                    <p>{c.room} • {c.teacher_name}</p>
                  </div>
                  <div className="class-subject">{c.title.charAt(0)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="content-card assignments-card">
            <div className="card-header">
              <h3>My Assignments</h3>
              <button className="view-all-btn">View All →</button>
            </div>
            <div className="assignments-list">
              {upcomingAssignments.length === 0 && <p>No upcoming assignments.</p>}
              {upcomingAssignments.map((a) => (
                <div key={a.id} className="assignment-item">
                  <div className="assignment-icon">{a.title.charAt(0)}</div>
                  <div className="assignment-details">
                    <h4>{a.title}</h4>
                    <p>Due {new Date(a.due_date).toLocaleDateString()} • {a.points || 0} pts</p>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${a.progress}%` }}></div>
                      </div>
                      <span>{a.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="content-card quick-actions-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => navigate('/coming-soon')}>
              <div className="action-icon">📅</div>
              <span>Schedule</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/student-assignments')}>
              <div className="action-icon">📝</div>
              <span>Assignments</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/student-grades')}>
              <div className="action-icon">📊</div>
              <span>Grades</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/coming-soon')}>
              <div className="action-icon">📚</div>
              <span>Resources</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/student-classes')}>
              <div className="action-icon">👥</div>
              <span>Classes</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/student-profile')}>
              <div className="action-icon">⚙️</div>
              <span>Settings</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;