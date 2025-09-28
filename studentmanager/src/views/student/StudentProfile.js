import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../../styles/StudentProfile.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        const userData = response.data;
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data: ', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-loading-spinner"></div>
        <p className="dashboard-loading-text">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-profile-avatar" style={{ marginBottom: '20px', width: '80px', height: '80px' }}>
          <span className="dashboard-avatar-text">!</span>
        </div>
        <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>User Not Found</h3>
        <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>We couldn't retrieve your profile information.</p>
        <button 
          className="dashboard-refresh-btn" 
          onClick={() => navigate('/student-dashboard')}
          style={{ background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)' }}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-left">
            <h1 className="dashboard-title">Student Profile</h1>
            <p className="dashboard-subtitle">Manage your account and academic information</p>
          </div>
          <div className="dashboard-header-right">
            <button
              className="dashboard-refresh-btn"
              onClick={() => window.location.reload()}
            >
              <span className="dashboard-refresh-icon">↻</span>
              Refresh
            </button>
            <button 
              className="dashboard-refresh-btn"
              onClick={() => navigate(-1)}
              style={{ background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)' }}
            >
              <span>←</span>
              Back
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome-card">
          <div className="welcome-card-content">
            <div className="welcome-text">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <div className="dashboard-profile-avatar" style={{ width: '80px', height: '80px' }}>
                  <span className="dashboard-avatar-text">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div>
                  <h2>{user.name}</h2>
                  <p>{user.email}</p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ 
                      background: 'rgba(255, 255, 255, 0.2)', 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student'}
                    </span>
                    <span style={{ 
                      background: 'rgba(255, 255, 255, 0.2)', 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      ID: {user.studentId || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="welcome-graphic">
              <div className="graphic-icon">👤</div>
            </div>
          </div>
        </div>
        <div className="content-card">
          <div className="card-header">
            <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid #f8f9fa', width: '100%' }}>
              <button
                className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <span>📊</span>
                Overview
              </button>
              <button
                className={`tab-button ${activeTab === "academic" ? "active" : ""}`}
                onClick={() => setActiveTab("academic")}
              >
                <span>🎓</span>
                Academic
              </button>
              <button
                className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <span>⚙️</span>
                Settings
              </button>
            </div>
          </div>
          <div style={{ padding: '20px 0' }}>
            {activeTab === "overview" && (
              <div className="stats-grid" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <div className="stat-card" style={{ flex: '1 1 100%', textAlign: 'center' }}>
                  <div className="stat-content">
                    <h3 style={{ color: '#888' }}>🚀 Tools Coming Soon!</h3>
                    <p style={{ color: '#aaa' }}>Stay tuned for new features</p>
                  </div>
                  <div className="stat-trend positive" style={{ visibility: 'hidden' }}></div>
                </div>
              </div>
            )}

            {activeTab === "academic" && (
              <div className="content-card" style={{ textAlign: 'center', minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h3 style={{ color: '#888' }}>🚀 Tools Coming Soon!</h3>
              </div>
            )}
            {activeTab === "settings" && (
              <div className="actions-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <button className="action-btn" onClick={() => navigate('/profile/edit')}>
                  <div className="action-icon">✏️</div>
                  <span>Edit Profile</span>
                  <small>Update personal information</small>
                </button>

                <button className="action-btn" onClick={() => navigate('/coming-soon')}>
                  <div className="action-icon">🔒</div>
                  <span>Security Settings</span>
                  <small>Change password & security</small>
                </button>

                <button className="action-btn" onClick={() => navigate('/coming-soon')}>
                  <div className="action-icon">⭐</div>
                  <span>Preferences</span>
                  <small>Customize your experience</small>
                </button>

                <button className="action-btn" onClick={() => navigate('/coming-soon')}>
                  <div className="action-icon">❓</div>
                  <span>Help & Support</span>
                  <small>Get assistance</small>
                </button>

                <button className="action-btn" onClick={() => navigate('/coming-soon')}>
                  <div className="action-icon">ℹ️</div>
                  <span>About</span>
                  <small>System information</small>
                </button>

                <button 
                  className="action-btn" 
                  onClick={() => setShowLogoutModal(true)}
                  style={{ background: '#fff5f5', borderColor: '#fed7d7' }}
                >
                  <div className="action-icon">🚪</div>
                  <span style={{ color: '#e53e3e' }}>Logout</span>
                  <small style={{ color: '#e53e3e' }}>Sign out of account</small>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      {showLogoutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <div style={{
              background: '#fed7d7',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '32px'
            }}>
              🚪
            </div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Confirm Logout</h3>
            <p style={{ color: '#7f8c8d', marginBottom: '25px' }}>
              Are you sure you want to logout from your account?
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                className="dashboard-refresh-btn"
                onClick={() => setShowLogoutModal(false)}
                style={{ 
                  background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
                  flex: 1
                }}
              >
                Cancel
              </button>
              <button
                className="dashboard-refresh-btn"
                onClick={handleLogout}
                style={{ 
                  background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
                  flex: 1
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;