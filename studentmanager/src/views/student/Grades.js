import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/StudentHome.css';

const Grades = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/grades/my'); 
      setGrades(res.data);
    } catch (err) {
      console.error('Error fetching grades:', err);
      toast.error('Failed to fetch grades');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchGrades();
    setTimeout(() => setRefreshing(false), 1000);
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const filteredGrades = grades.filter(grade =>
    grade.class_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const averageGrade = grades.length > 0 ? 
    (grades.reduce((sum, grade) => sum + parseFloat(grade.grade || 0), 0) / grades.length).toFixed(1) : 0;

  const openGradeDetails = (grade) => {
    setSelectedGrade(grade);
    setShowDetailModal(true);
  };

  const getGradeColor = (grade) => {
    if (!grade) return '#95a5a6';
    const numericGrade = parseFloat(grade);
    if (numericGrade >= 90) return '#00B894';
    if (numericGrade >= 80) return '#3498db';
    if (numericGrade >= 70) return '#FDCB6E';
    return '#e74c3c';
  };

  const getGradeIcon = (grade) => {
    if (!grade) return '❓';
    const numericGrade = parseFloat(grade);
    if (numericGrade >= 90) return '🏆';
    if (numericGrade >= 80) return '⭐';
    if (numericGrade >= 70) return '✅';
    return '⚠️';
  };

  const getGradeStatus = (grade) => {
    if (!grade) return 'Not Graded';
    const numericGrade = parseFloat(grade);
    if (numericGrade >= 90) return 'Excellent';
    if (numericGrade >= 80) return 'Great';
    if (numericGrade >= 70) return 'Good';
    return 'Needs Improvement';
  };

  if (loading && grades.length === 0) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-loading-spinner"></div>
        <p className="dashboard-loading-text">Loading your grades...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-left">
            <h1 className="dashboard-title">Grades</h1>
            <p className="dashboard-subtitle">Track your academic performance and progress</p>
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
        <div className="dashboard-welcome-card">
          <div className="welcome-card-content">
            <div className="welcome-text">
              <h2>Your Academic Performance 📊</h2>
              <p>Monitor your grades and track your progress across all courses</p>
              <div className="last-updated">
                <span className="update-indicator"></span>
                {grades.length} {grades.length === 1 ? 'grade' : 'grades'} recorded
              </div>
            </div>
            <div className="welcome-graphic">
              <div className="graphic-icon">🎓</div>
            </div>
          </div>
        </div>
        <div className="content-card">
          <div className="card-header">
            <h3>Grade Overview</h3>
            <div className="search-container">
              <div className="search-input">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search grades by class name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-field"
                />
                {searchQuery && (
                  <button 
                    className="clear-search"
                    onClick={() => setSearchQuery('')}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">📋</div>
              <div className="stat-content">
                <h3>{grades.length}</h3>
                <p>Total Grades</p>
              </div>
              <div className="stat-trend positive">All courses</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon average">📈</div>
              <div className="stat-content">
                <h3>{averageGrade}</h3>
                <p>Average Grade</p>
              </div>
              <div className="stat-trend positive">Overall</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon high">🏆</div>
              <div className="stat-content">
                <h3>
                  {grades.length > 0 ? Math.max(...grades.map(g => parseFloat(g.grade || 0))) : 0}
                </h3>
                <p>Highest Grade</p>
              </div>
              <div className="stat-trend positive">Excellent</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon progress">🎯</div>
              <div className="stat-content">
                <h3>{grades.filter(g => parseFloat(g.grade || 0) >= 70).length}</h3>
                <p>Passing Grades</p>
              </div>
              <div className="stat-trend positive">Good standing</div>
            </div>
          </div>
        </div>
        {filteredGrades.length > 0 ? (
          <div className="grades-grid">
            {filteredGrades.map((grade) => (
              <div 
                key={grade.id} 
                className="grade-card"
                onClick={() => openGradeDetails(grade)}
              >
                <div className="grade-card-header">
                  <div className="grade-icon" style={{ color: getGradeColor(grade.grade) }}>
                    {getGradeIcon(grade.grade)}
                  </div>
                  <div className="grade-code">{grade.code || `GRD-${grade.id}`}</div>
                </div>
                
                <div className="grade-card-content">
                  <h4>{grade.class_title || 'No Class Title'}</h4>
                  <p className="grade-type">Coursework Assessment</p>
                  
                  <div className="grade-display">
                    <div 
                      className="grade-value"
                      style={{ color: getGradeColor(grade.grade) }}
                    >
                      {grade.grade || 'N/A'}
                    </div>
                    <div 
                      className="grade-status"
                      style={{ color: getGradeColor(grade.grade) }}
                    >
                      {getGradeStatus(grade.grade)}
                    </div>
                  </div>

                  <div className="grade-details">
                    <div className="grade-detail-item">
                      <span className="detail-icon">📅</span>
                      <span>{grade.graded_at ? new Date(grade.graded_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="grade-detail-item">
                      <span className="detail-icon">👤</span>
                      <span>Student ID: {grade.student_id || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="content-card text-center py-5">
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>{searchQuery ? 'No Matching Grades Found' : 'No Grades Available'}</h3>
              <p className="text-muted">
                {searchQuery 
                  ? 'Try adjusting your search terms to find what you\'re looking for.' 
                  : 'Your grades will appear here once they are published by your instructors.'}
              </p>
              {searchQuery && (
                <button 
                  className="dashboard-refresh-btn"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </main>
      {showDetailModal && selectedGrade && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div 
              className="modal-icon"
              style={{ color: getGradeColor(selectedGrade.grade) }}
            >
              {getGradeIcon(selectedGrade.grade)}
            </div>
            <h3>{selectedGrade.class_title}</h3>
            <div 
              className="modal-grade-value"
              style={{ color: getGradeColor(selectedGrade.grade) }}
            >
              {selectedGrade.grade || 'N/A'}
            </div>
            <div 
              className="modal-grade-status"
              style={{ color: getGradeColor(selectedGrade.grade) }}
            >
              {getGradeStatus(selectedGrade.grade)}
            </div>

            <div className="modal-details">
              <div className="modal-detail-row">
                <span className="detail-label">Course Code</span>
                <span className="detail-value">{selectedGrade.code || 'N/A'}</span>
              </div>
              <div className="modal-detail-row">
                <span className="detail-label">Student ID</span>
                <span className="detail-value">{selectedGrade.student_id || 'N/A'}</span>
              </div>
              <div className="modal-detail-row">
                <span className="detail-label">Graded Date</span>
                <span className="detail-value">
                  {selectedGrade.graded_at ? new Date(selectedGrade.graded_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="modal-detail-row">
                <span className="detail-label">Assessment Type</span>
                <span className="detail-value">Coursework</span>
              </div>
              <div className="modal-detail-row">
                <span className="detail-label">Status</span>
                <span className="detail-value published">Published</span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="dashboard-refresh-btn"
                onClick={() => setShowDetailModal(false)}
                style={{ 
                  background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
                  flex: 1
                }}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grades;