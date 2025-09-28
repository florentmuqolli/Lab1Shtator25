import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../../styles/StudentAssignments.css";

const Assignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("");

  useEffect(() => {
      fetchAssignments();
    }, []);

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
      const response = await axiosInstance.get("/assignments");
      setAssignments(response.data);
      setFilteredAssignments(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to load assignments.");
      console.error(err);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAssignments();
    setTimeout(() => setRefreshing(false), 1000);
  };

  useEffect(() => {
    let filtered = [...assignments];
    
    if (filter !== "all") {
      filtered = filtered.filter(assignment => assignment.status === filter);
    }
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.due_date) - new Date(b.due_date);
        case "priority":
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case "course":
          return (a.class_id || '').localeCompare(b.class_id || '');
        default:
          return 0;
      }
    });
    
    setFilteredAssignments(filtered);
  }, [assignments, filter, sortBy]);

  const openAssignmentDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailModal(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#00B894';
      default: return '#95a5a6';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return '#00B894';
      case 'in progress': return '#3498db';
      case 'pending': return '#f39c12';
      case 'overdue': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return '✅';
      case 'in progress': return '🔄';
      case 'pending': return '⏳';
      case 'overdue': return '⚠️';
      default: return '📝';
    }
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return 'No due date';
    
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    
    return date.toLocaleDateString();
  };

  const getCourseIcon = (courseName) => {
  const subject = String(courseName || '').toLowerCase();
    if (subject.includes('math')) return '∫';
    if (subject.includes('science') || subject.includes('physics')) return '⚛';
    if (subject.includes('english') || subject.includes('literature')) return '📖';
    if (subject.includes('history')) return '📜';
    if (subject.includes('art')) return '🎨';
    if (subject.includes('computer')) return '💻';
    return '📚';
  };

  if (loading && assignments.length === 0) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-loading-spinner"></div>
        <p className="dashboard-loading-text">Loading your assignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-loading-container">
        <div className="empty-icon" style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
        <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Failed to Load Assignments</h3>
        <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>There was an error loading your assignments.</p>
        <button className="dashboard-refresh-btn" onClick={fetchAssignments}>
          Try Again
        </button>
      </div>
    );
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
              <h1 className="dashboard-title">My Assignments</h1>
              <p className="dashboard-subtitle">Manage your tasks and track your academic progress</p>
            </div>
          </div>
          <div className="dashboard-header-right">
            <button
              className="dashboard-refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <span className={`dashboard-refresh-icon ${refreshing ? 'loading' : ''}`}>
                ↻
              </span>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome-card">
          <div className="welcome-card-content">
            <div className="welcome-text">
              <h2>Assignment Overview 📋</h2>
              <p>Stay organized and on top of your academic tasks and deadlines</p>
              {elapsedTime && (
                <div className="last-updated">
                  <span className="update-indicator"></span>
                  Last updated {elapsedTime}
                </div>
              )}
            </div>
            <div className="welcome-graphic">
              <div className="graphic-icon">📚</div>
            </div>
          </div>
        </div>
        
        <div className="content-card filters-card">
          <div className="card-header">
            <h3>Sort Assignments</h3>
            <div className="results-count">
              {filteredAssignments.length} of {assignments.length} shown
            </div>
          </div>

          <div className="filters-container">
            <div className="filter-group">
              <label className="filter-label">Sort by</label>
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${sortBy === 'dueDate' ? 'active' : ''}`}
                  onClick={() => setSortBy('dueDate')}
                >
                  Due Date
                </button>
                <button 
                  className={`filter-btn ${sortBy === 'priority' ? 'active' : ''}`}
                  onClick={() => setSortBy('priority')}
                >
                  Priority
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="content-card assignments-grid-card">
          <div className="card-header">
            <h3>
              {filter === 'all' ? 'All Assignments' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Assignments`}
            </h3>
            <span className="results-count">
              {filteredAssignments.length} {filteredAssignments.length === 1 ? 'assignment' : 'assignments'}
            </span>
          </div>

          {filteredAssignments.length > 0 ? (
            <div className="assignments-grid">
              {filteredAssignments.map((assignment) => (
                <div 
                  key={assignment.id} 
                  className="assignment-card"
                  onClick={() => openAssignmentDetails(assignment)}
                >
                  <div className="assignment-header">
                    <div className="course-badge">
                      <span className="course-icon">
                        {getCourseIcon(assignment.class_id)}
                      </span>
                      <span className="course-name">{assignment.class_id || 'Unknown Course'}</span>
                    </div>
                    <div 
                      className="priority-badge"
                      style={{ background: getPriorityColor(assignment.priority) }}
                    >
                      {assignment.priority || 'Standard'}
                    </div>
                  </div>
                  
                  <div className="assignment-body">
                    <h4 className="assignment-title">{assignment.title || 'Untitled Assignment'}</h4>
                    
                    <div className="assignment-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span className="meta-text">{formatDueDate(assignment.due_date)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">{getStatusIcon(assignment.status)}</span>
                        <span 
                          className="status-text"
                          style={{ color: getStatusColor(assignment.status) }}
                        >
                          {assignment.status || 'Unknown Status'}
                        </span>
                      </div>
                    </div>

                    <p className="assignment-description">
                      {assignment.description || 'No description provided'}
                    </p>

                    <div className="assignment-footer">
                      <button className="view-details-btn">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h4>No Assignments Found</h4>
              <p>
                {filter === 'all' 
                  ? "You don't have any assignments yet." 
                  : `No assignments match the "${filter}" filter.`}
              </p>
              {filter !== 'all' && (
                <button 
                  className="action-btn primary"
                  onClick={() => setFilter('all')}
                >
                  Show All Assignments
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      {showDetailModal && selectedAssignment && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-gradient">
              <div className="modal-header-content">
                <div className="modal-title-section">
                  <div className="modal-icon">
                    {getCourseIcon(selectedAssignment.class_id)}
                  </div>
                  <div>
                    <h3>{selectedAssignment.title}</h3>
                    <p>Assignment details and information</p>
                  </div>
                </div>
                <button 
                  className="modal-close-btn"
                  onClick={() => setShowDetailModal(false)}
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="modal-body-custom">
              <div className="modal-badges">
                <span 
                  className="status-badge large"
                  style={{ 
                    background: getStatusColor(selectedAssignment.status),
                    color: 'white'
                  }}
                >
                  {getStatusIcon(selectedAssignment.status)} {selectedAssignment.status}
                </span>
                <span 
                  className="priority-badge large"
                  style={{ 
                    background: getPriorityColor(selectedAssignment.priority),
                    color: 'white'
                  }}
                >
                  {selectedAssignment.priority} Priority
                </span>
              </div>

              <div className="modal-details-grid">
                <div className="detail-card">
                  <div className="detail-icon">📚</div>
                  <div className="detail-content">
                    <span className="detail-label">Course</span>
                    <span className="detail-value">{selectedAssignment.class_id || 'Unknown'}</span>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-icon">📅</div>
                  <div className="detail-content">
                    <span className="detail-label">Due Date</span>
                    <span className="detail-value">{formatDueDate(selectedAssignment.due_date)}</span>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-icon">🕐</div>
                  <div className="detail-content">
                    <span className="detail-label">Assigned</span>
                    <span className="detail-value">
                      {selectedAssignment.created_at ? new Date(selectedAssignment.created_at).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-icon">⭐</div>
                  <div className="detail-content">
                    <span className="detail-label">Points</span>
                    <span className="detail-value points">{selectedAssignment.points || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h4 className="section-title">Assignment Description</h4>
                <p className="description-text">
                  {selectedAssignment.description || 'No description provided.'}
                </p>
              </div>

              <div className="modal-actions">
                <button className="modal-btn secondary">
                  <span className="btn-icon">✏️</span>
                  Edit Assignment
                </button>
                <button 
                  className="modal-btn primary"
                >
                  <span className="btn-icon">📥</span>
                  Download Materials
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;