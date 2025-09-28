import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Badge, Modal, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssignmentFormModal from './utils/AssignmentForm';
import AssignmentStatsModal from './utils/AssignmentStats';
import '../../styles/TeacherAssignments.css';

const TeacherAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    if (!lastUpdated) return;
    const interval = setInterval(() => {
      const secondsAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      setElapsedTime(secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.floor(secondsAgo / 60)}m ago`);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/assignments');
      setAssignments(res.data);
      setFilteredAssignments(res.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const viewStats = async (assignment) => {
    setStatsLoading(true);
    setSelectedAssignment(assignment);
    setShowStatsModal(true);
    
    try {
      const res = await axiosInstance.get(`/assignments/${assignment.id}/activity`);
      setSelectedAssignment(prev => ({ ...prev, submissions: res.data }));
    } catch (err) {
      console.error('Failed to load submissions:', err);
      toast.error('Failed to load statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  const toggleVisibility = async (assignment) => {
    try {
      await axiosInstance.put(`/assignments/${assignment.id}`, {
        ...assignment,
        visible: !assignment.visible
      });
      fetchAssignments();
      toast.success(`Assignment ${!assignment.visible ? 'published' : 'hidden'} successfully`);
    } catch (error) {
      console.error('Failed to update assignment:', error);
      toast.error('Failed to update assignment');
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    const filtered = assignments.filter(assignment =>
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAssignments(filtered);
  }, [searchQuery, assignments]);

  const getStatusVariant = (visible) => {
    return visible ? 'success' : 'secondary';
  };

  const getStatusText = (visible) => {
    return visible ? 'Published' : 'Draft';
  };

  const renderLoader = () => (
    <div className="dashboard-loading-container">
      <div className="dashboard-loading-spinner"></div>
      <p className="dashboard-loading-text">Loading your assignments...</p>
    </div>
  );

  if (loading && assignments.length === 0) {
    return renderLoader();
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-left">
            <div className="header-navigation">
              <button
                className="back-button"
                onClick={() => navigate(-1)}
                title="Go back"
              >
                <span className="back-icon">←</span>
                Back
              </button>
            </div>
            <div className="header-titles">
              <h1 className="dashboard-title">Assignment Management</h1>
              <p className="dashboard-subtitle">Overview of all assigned tasks and their status</p>
            </div>
          </div>
          <div className="dashboard-header-right">
            <button
              className="dashboard-refresh-btn"
              onClick={fetchAssignments}
              disabled={loading}
            >
              <span className={`dashboard-refresh-icon ${loading ? 'loading' : ''}`}>
                ↻
              </span>
              {loading ? 'Updating...' : 'Refresh'}
            </button>
            <button
              className="dashboard-create-btn"
              onClick={() => {
                setSelectedAssignment(null);
                setShowCreateModal(true);
              }}
            >
              <span className="create-icon">+</span>
              Create New
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome-card">
          <div className="welcome-card-content">
            <div className="welcome-text">
              <h2>Assignment Overview 📝</h2>
              <p>Manage and track all your assignments in one place. Create new assignments, view statistics, and monitor student progress.</p>
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
        <div className="dashboard-content-grid">
          <div className="content-card search-card">
            <div className="search-container">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search assignments by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          <div className="content-card stats-card">
            <div className="stat-content">
              <div className="stat-icon assignments">📚</div>
              <div>
                <h3>{assignments.length}</h3>
                <p>Total Assignments</p>
              </div>
            </div>
          </div>
        </div>
        <div className="content-card assignments-grid-card">
          <div className="card-header">
            <h3>
              {searchQuery ? `Search Results (${filteredAssignments.length})` : 'All Assignments'}
            </h3>
            <span className="results-count">
              Showing {filteredAssignments.length} of {assignments.length} assignments
            </span>
          </div>

          <div className="assignments-grid">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => (
                <div key={assignment.id} className="assignment-card">
                  <div className={`assignment-header ${assignment.visible ? 'published' : 'draft'}`}>
                    <div className="assignment-title">
                      <h4>{assignment.title}</h4>
                      <span className={`status-badge ${assignment.visible ? 'published' : 'draft'}`}>
                        {getStatusText(assignment.visible)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="assignment-body">
                    <p className="assignment-description">
                      {assignment.description || 'No description provided.'}
                    </p>

                    <div className="assignment-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span className="meta-text">
                          Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">⭐</span>
                        <span className="meta-text">
                          Points: {assignment.points || '0'}
                        </span>
                      </div>
                    </div>

                    <div className="assignment-actions">
                      <button
                        className="action-btn primary"
                        onClick={() => viewStats(assignment)}
                      >
                        <span className="action-icon">📊</span>
                        View Stats
                      </button>
                    </div>
                  </div>

                  <div className="assignment-footer">
                    <button
                      className="footer-btn secondary"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowCreateModal(true);
                      }}
                    >
                      <span className="btn-icon">✏️</span>
                      Edit
                    </button>
                    <button
                      className={`footer-btn ${assignment.visible ? 'warning' : 'success'}`}
                      onClick={() => toggleVisibility(assignment)}
                    >
                      <span className="btn-icon">
                        {assignment.visible ? '👁️' : '🌐'}
                      </span>
                      {assignment.visible ? 'Hide' : 'Publish'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <h4>
                  {searchQuery ? 'No matching assignments found' : 'No Assignments Created Yet'}
                </h4>
                <p>
                  {searchQuery
                    ? 'Try clearing your search or adjusting your terms.'
                    : 'Get started by creating your first assignment to engage your students.'}
                </p>
                {searchQuery ? (
                  <button 
                    className="action-btn primary"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </button>
                ) : (
                  <button 
                    className="action-btn primary"
                    onClick={() => {
                      setSelectedAssignment(null);
                      setShowCreateModal(true);
                    }}
                  >
                    Create First Assignment
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <AssignmentFormModal
        visible={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedAssignment(null);
        }}
        assignment={selectedAssignment}
        refreshAssignments={fetchAssignments}
      />

      <AssignmentStatsModal
        visible={showStatsModal}
        onClose={() => {
          setShowStatsModal(false);
          setSelectedAssignment(null);
        }}
        assignment={selectedAssignment}
        loading={statsLoading}
      />
    </div>
  );
};

export default TeacherAssignments;