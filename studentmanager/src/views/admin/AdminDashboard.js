import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import ScreenWrapper from '../../hooks/ScreenWrapper';
import UserTypeSelectionModal from './utils/UserTypeSelection';
import useLogout from "../../hooks/Logout";
import { RefreshIcon, LogoutIcon } from '../../assets/Icons';
//import '../../styles/AdminDashboard.css';

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
  const logoutTranslateY = useRef({ value: 0 });

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
      logoutTranslateY.current = { value: 0 };
      setShowLogout(false);
    } else {
      setShowLogout(true);
      logoutTranslateY.current = { value: -60 };
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
      <div className="loadingContainer">
        <div className="activityIndicator" />
      </div>
    );
  }

  return (
    <ScreenWrapper>
      <div className="container">
        <div className="header">
          <div>
            <div className="greeting">Welcome Admin</div>
            <div className="date">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          <div className="headerActions">
            <div
              className="logoutContainer"
              style={{
                transform: `translateY(${logoutTranslateY.current.value}px)`,
                opacity: showLogout ? 1 : 0,
                zIndex: showLogout ? 1 : 0,
                pointerEvents: showLogout ? 'auto' : 'none'
              }}
            >
              <button className="logoutButton" onClick={handleLogout}>
                <LogoutIcon />
              </button>
            </div>
            <button onClick={toggleLogout}>
              <img
                src={require('../../assets/profile_placeholder.png')}
                className="profileImage"
                alt="Profile"
              />
            </button>
          </div>
        </div>
        <div className="statusBar">
          {elapsedTime && (
            <div className="lastUpdated">Last updated {elapsedTime}</div>
          )}
          <button className="refreshButton" onClick={() => {
            fetchStats();
            fetchRecentActivities();
          }}>
            <RefreshIcon />
          </button>
        </div>

        <div className="statsScrollContainer">
          {stats ? stats.map(item => (
            <div key={item.id} className={`statCard ${item.alert ? 'alertCard' : ''}`}>
              <div className="statIconContainer">
                <div className="statIcon">{item.icon}</div>
              </div>
              <div className="statValue">{item.value}</div>
              <div className="statTitle">{item.title}</div>
              {item.change && (
                <div className="changeBadge">
                  <div className="changeText">{item.change}</div>
                </div>
              )}
            </div>
          )) : (
            <div className="activityIndicator" />
          )}
        </div>

        <div className="tabContainer">
          {['overview', 'manage', 'reports'].map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'activeTab' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <div className={`tabText ${activeTab === tab ? 'activeTabText' : ''}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </div>
            </button>
          ))}
        </div>

        <div className="content">
          {activeTab === 'overview' && (
            <>
              <div className="sectionTitle">Recent Activity</div>
              <div className="activityContainer">
                {activities.map(item => (
                  <div key={item.id} className="activityCard">
                    <div className="activityIconContainer">
                      <div className="activityIcon">{item.icon}</div>
                    </div>
                    <div className="activityText">
                      <div className="activityUser">{item.user}</div>
                      <div className="activityAction">{item.action}</div>
                    </div>
                    <div className="activityTime">
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
              <div className="sectionTitle">Quick Actions</div>
              <div className="gridContainer">
                {[
                  { icon: '👥', text: 'Manage Users', color: '#6C5CE7', action: () => setShowUserModal(true) },
                  { icon: '➕', text: 'Add Course', color: '#00B894', action: () => navigate('/course-management') },
                  { icon: '📊', text: 'Requests', color: '#FD79A8', action: () => navigate('/pending-requests') },
                  { icon: '⚙️', text: 'Enrollments', color: '#FDCB6E', action: () => navigate('/enrollment-management') },
                ].map((item, index) => (
                  <button
                    key={index}
                    className="gridCard"
                    onClick={item.action}
                  >
                    <div className="gridIcon" style={{ backgroundColor: item.color }}>
                      <div className="gridIconText">{item.icon}</div>
                    </div>
                    <div className="gridText">{item.text}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {activeTab === 'reports' && (
            <div className="comingSoonContainer">
              <div className="comingSoon">Reporting Tools Coming Soon</div>
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