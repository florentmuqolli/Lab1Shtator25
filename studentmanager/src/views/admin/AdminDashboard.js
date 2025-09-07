import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import ScreenWrapper from '../../hooks/ScreenWrapper';
import UserTypeSelectionModal from './utils/UserTypeSelection';
import useLogout from "../../hooks/Logout";
import { RefreshIcon, LogoutIcon } from '../../assets/Icons';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogout = useLogout(setLoading);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const logoutTranslateX = useRef({ value: 0 });

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

  const toggleLogout = () => {
    if (showLogout) {
      logoutTranslateX.current = { value: 0 };
      setShowLogout(false);
    } else {
      setShowLogout(true);
      logoutTranslateX.current = { value: -70 };
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const res = await axiosInstance.get('/admin/recent-activities');
      setActivities(res.data);
    } catch (error) {
      console.error('Failed to load recent activities:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get('/admin/dashboard-stats');
      const data = res.data;
      setStats([
        {
          id: '1',
          title: 'Total Students',
          value: data.students.total.toString(),
          change: `+${data.students.new}`,
          icon: '👨‍🎓',
        },
        {
          id: '2',
          title: 'Active Courses',
          value: data.courses.total.toString(),
          change: `+${data.courses.new}`,
          icon: '📚',
        },
        {
          id: '3',
          title: 'Total Professors',
          value: data.professors.total.toString(),
          change: `+${data.professors.new}`,
          icon: '👨‍🏫',
          alert: data.professors.new === 0,
        },
      ]);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecentActivities();
  }, []);

  if (loading) {
    return (
      <div className="admin-loadingContainer">
        <div className="admin-activityIndicator" />
      </div>
    );
  }

  return (
    <ScreenWrapper>
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <div className="admin-greeting">Welcome Admin</div>
            <div className="admin-date">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          <div className="admin-headerActions">
            <div
              className="admin-logoutContainer"
              style={{
                transform: `translateX(${logoutTranslateX.current.value}px)`,
                opacity: showLogout ? 1 : 0,
                zIndex: showLogout ? 1 : 0,
                pointerEvents: showLogout ? 'auto' : 'none'
              }}
            >
              <button className="admin-logoutButton" onClick={handleLogout}>
                <LogoutIcon />
              </button>
            </div>
            <button onClick={toggleLogout} className='profile-button'>
              <img
                src={require('../../assets/profile_placeholder.png')}
                className="admin-profileImage"
                alt="Profile"
              />
            </button>
          </div>
        </div>
        <div className="admin-statusBar">
          {elapsedTime && (
            <div className="admin-lastUpdated">Last updated {elapsedTime}</div>
          )}
          <button className="admin-refreshButton" onClick={() => {
            fetchStats();
            fetchRecentActivities();
          }}>
            <RefreshIcon />
          </button>
        </div>

        <div className="admin-statsScrollContainer">
          {stats ? stats.map(item => (
            <div key={item.id} className={`admin-statCard ${item.alert ? 'admin-alertCard' : ''}`}>
              <div className="admin-statIconContainer">
                <div className="admin-statIcon">{item.icon}</div>
              </div>
              <div className="admin-statValue">{item.value}</div>
              <div className="admin-statTitle">{item.title}</div>
              {item.change && (
                <div className="admin-changeBadge">
                  <div className="admin-changeText">{item.change}</div>
                </div>
              )}
            </div>
          )) : (
            <div className="admin-activityIndicator" />
          )}
        </div>

        <div className="admin-tabContainer">
          {['overview', 'manage', 'reports'].map((tab) => (
            <button
              key={tab}
              className={`admin-tab ${activeTab === tab ? 'admin-activeTab' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <div className={`admin-tabText ${activeTab === tab ? 'admin-activeTabText' : ''}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </div>
            </button>
          ))}
        </div>

        <div className="admin-content">
          {activeTab === 'overview' && (
            <>
              <div className="admin-sectionTitle">Recent Activity</div>
              <div className="admin-activityContainer">
                {activities.map(item => (
                  <div key={item.id} className="admin-activityCard">
                    <div className="admin-activityIconContainer">
                      <div className="admin-activityIcon">{item.icon}</div>
                    </div>
                    <div className="admin-activityText">
                      <div className="admin-activityUser">{item.user}</div>
                      <div className="admin-activityAction">{item.action}</div>
                    </div>
                    <div className="admin-activityTime">
                      {new Date(item.created_at).toLocaleTimeString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'manage' && (
            <>
              <div className="admin-sectionTitle">Quick Actions</div>
              <div className="admin-gridContainer">
                {[
                  { icon: '👥', text: 'Manage Users', color: '#6C5CE7', action: () => setShowUserModal(true) },
                  { icon: '➕', text: 'Add Course', color: '#00B894', action: () => navigate('/course-management') },
                  { icon: '📊', text: 'Requests', color: '#FD79A8', action: () => navigate('/pending-requests') },
                  { icon: '⚙️', text: 'Enrollments', color: '#FDCB6E', action: () => navigate('/enrollment-management') },
                ].map((item, index) => (
                  <button
                    key={index}
                    className="admin-gridCard"
                    onClick={item.action}
                  >
                    <div className="admin-gridIcon" style={{ backgroundColor: item.color }}>
                      <div className="admin-gridIconText">{item.icon}</div>
                    </div>
                    <div className="admin-gridText">{item.text}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {activeTab === 'reports' && (
            <div className="admin-comingSoonContainer">
              <div className="admin-comingSoon">Reporting Tools Coming Soon</div>
            </div>
          )}
        </div>

        <UserTypeSelectionModal
          visible={showUserModal}
          onClose={() => setShowUserModal(false)}
          navigation={{ navigate }}
        />
      </div>
    </ScreenWrapper>
  );
};

export default AdminDashboard;