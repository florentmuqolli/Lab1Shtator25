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

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/assignments");
      setAssignments(response.data);
      setFilteredAssignments(response.data);
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
    const subject = courseName?.toLowerCase() || '';
    if (subject.includes('math')) return '∫';
    if (subject.includes('science') || subject.includes('physics')) return '⚛';
    if (subject.includes('english') || subject.includes('literature')) return '📖';
    if (subject.includes('history')) return '📜';
    if (subject.includes('art')) return '🎨';
    if (subject.includes('computer')) return '💻';
    return '📚';
  };

  const getAssignmentStats = () => {
    const pending = assignments.filter(a => a.status === 'pending').length;
    const inProgress = assignments.filter(a => a.status === 'in progress').length;
    const completed = assignments.filter(a => a.status === 'completed').length;
    const overdue = assignments.filter(a => a.status === 'overdue').length;
    
    return { pending, inProgress, completed, overdue };
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

  const stats = getAssignmentStats();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-left">
            <h1 className="dashboard-title">Assignments</h1>
            <p className="dashboard-subtitle">Manage your tasks and track your progress</p>
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
        {/* Welcome Card */}
        <div className="dashboard-welcome-card">
          <div className="welcome-card-content">
            <div className="welcome-text">
              <h2>Your Assignments Overview 📋</h2>
              <p>Stay organized and on top of your academic tasks and deadlines</p>
              <div className="last-updated">
                <span className="update-indicator"></span>
                {assignments.length} {assignments.length === 1 ? 'assignment' : 'assignments'} total
              </div>
            </div>
            <div className="welcome-graphic">
              <div className="graphic-icon">📚</div>
            </div>
          </div>
        </div>

        {/* Stats and Filters */}
        <div className="content-card">
          <div className="card-header">
            <h3>Assignment Overview</h3>
            <div className="view-all-btn">
              {filteredAssignments.length} of {assignments.length} shown
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon pending">⏳</div>
              <div className="stat-content">
                <h3>{stats.pending}</h3>
                <p>Pending</p>
              </div>
              <div className="stat-trend warning">Awaiting start</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon progress">🔄</div>
              <div className="stat-content">
                <h3>{stats.inProgress}</h3>
                <p>In Progress</p>
              </div>
              <div className="stat-trend positive">Active</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon completed">✅</div>
              <div className="stat-content">
                <h3>{stats.completed}</h3>
                <p>Completed</p>
              </div>
              <div className="stat-trend positive">Done</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon overdue">⚠️</div>
              <div className="stat-content">
                <h3>{stats.overdue}</h3>
                <p>Overdue</p>
              </div>
              <div className="stat-trend warning">Needs attention</div>
            </div>
          </div>

          <div className="filters-container">
            <div className="filter-group">
              <label>Filter by Status</label>
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                  onClick={() => setFilter('pending')}
                >
                  Pending
                </button>
                <button 
                  className={`filter-btn ${filter === 'in progress' ? 'active' : ''}`}
                  onClick={() => setFilter('in progress')}
                >
                  In Progress
                </button>
                <button 
                  className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </button>
                <button 
                  className={`filter-btn ${filter === 'overdue' ? 'active' : ''}`}
                  onClick={() => setFilter('overdue')}
                >
                  Overdue
                </button>
              </div>
            </div>

            <div className="filter-group">
              <label>Sort by</label>
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
                <button 
                  className={`filter-btn ${sortBy === 'course' ? 'active' : ''}`}
                  onClick={() => setSortBy('course')}
                >
                  Course
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments Grid */}
        {filteredAssignments.length > 0 ? (
          <div className="assignments-grid">
            {filteredAssignments.map((assignment) => (
              <div 
                key={assignment.id} 
                className="assignment-card"
                onClick={() => openAssignmentDetails(assignment)}
              >
                <div className="assignment-card-header">
                  <div className="course-icon">
                    {getCourseIcon(assignment.class_id)}
                  </div>
                  <div 
                    className="priority-badge"
                    style={{ background: getPriorityColor(assignment.priority) }}
                  >
                    {assignment.priority || 'Standard'}
                  </div>
                </div>
                
                <div className="assignment-card-content">
                  <h4>{assignment.title || 'Untitled Assignment'}</h4>
                  <p className="course-name">{assignment.class_id || 'Unknown Course'}</p>
                  
                  <div className="assignment-details">
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span>{formatDueDate(assignment.due_date)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">{getStatusIcon(assignment.status)}</span>
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

                  <button className="view-details-btn">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="content-card text-center py-5">
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No Assignments Found</h3>
              <p className="text-muted">
                {filter === 'all' 
                  ? "You don't have any assignments yet." 
                  : `No assignments match the "${filter}" filter.`}
              </p>
              {filter !== 'all' && (
                <button 
                  className="dashboard-refresh-btn"
                  onClick={() => setFilter('all')}
                >
                  Show All Assignments
                </button>
              )}
            </div>
          </div>
        )}
      </main>
      {showDetailModal && selectedAssignment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-icon">{getCourseIcon(selectedAssignment.class_id)}</div>
              <button 
                className="modal-close"
                onClick={() => setShowDetailModal(false)}
              >
                ✕
              </button>
            </div>
            
            <h3>{selectedAssignment.title}</h3>
            
            <div className="modal-badges">
              <span 
                className="status-badge"
                style={{ 
                  background: getStatusColor(selectedAssignment.status),
                  color: 'white'
                }}
              >
                {getStatusIcon(selectedAssignment.status)} {selectedAssignment.status}
              </span>
              <span 
                className="priority-badge"
                style={{ 
                  background: getPriorityColor(selectedAssignment.priority),
                  color: 'white'
                }}
              >
                {selectedAssignment.priority} Priority
              </span>
            </div>

            <div className="modal-details">
              <div className="modal-detail-row">
                <span className="detail-label">Course</span>
                <span className="detail-value">{selectedAssignment.class_id || 'Unknown'}</span>
              </div>
              <div className="modal-detail-row">
                <span className="detail-label">Due Date</span>
                <span className="detail-value">{formatDueDate(selectedAssignment.due_date)}</span>
              </div>
              <div className="modal-detail-row">
                <span className="detail-label">Assigned</span>
                <span className="detail-value">
                  {selectedAssignment.created_at ? new Date(selectedAssignment.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>

            <div className="modal-section">
              <h4>Assignment Details</h4>
              <p>{selectedAssignment.description || 'No description provided.'}</p>
            </div>

            <div className="modal-actions">
              <button className="dashboard-refresh-btn" style={{ flex: 1 }}>
                <span>✏️</span>
                Edit Assignment
              </button>
              <button 
                className="dashboard-refresh-btn"
                style={{ 
                  background: 'linear-gradient(135deg, #00B894 0%, #00806a 100%)',
                  flex: 1
                }}
              >
                <span>📥</span>
                Download Materials
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;