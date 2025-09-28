import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/StudentGrades.css';

const Grades = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("");

  useEffect(() => {
    if (!lastUpdated) return;
    const interval = setInterval(() => {
      const secondsAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      setElapsedTime(secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.floor(secondsAgo / 60)}m ago`);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/grades/my'); 
      setGrades(res.data);
      setLastUpdated(new Date());
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

  const getGradeVariant = (grade) => {
    if (!grade) return 'secondary';
    const numericGrade = parseFloat(grade);
    if (numericGrade >= 90) return 'success';
    if (numericGrade >= 80) return 'primary';
    if (numericGrade >= 70) return 'warning';
    return 'danger';
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
              <h1 className="dashboard-title">My Grades</h1>
              <p className="dashboard-subtitle">Track your academic performance and progress</p>
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
              <h2>Academic Performance 📊</h2>
              <p>Monitor your grades and track your progress across all courses</p>
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
          <div className="content-card search-card">
            <div className="search-container">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search grades by class name..."
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
            <div className="stats-grid-mini">
              <div className="stat-item">
                <div className="stat-icon total">📋</div>
                <div className="stat-content">
                  <h3>{grades.length}</h3>
                  <p>Total Grades</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon average">📈</div>
                <div className="stat-content">
                  <h3>{averageGrade}</h3>
                  <p>Average Grade</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-card stats-overview-card">
          <div className="card-header">
            <h3>Performance Overview</h3>
            <div className="results-count">
              {filteredGrades.length} of {grades.length} shown
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
        <div className="content-card grades-grid-card">
          <div className="card-header">
            <h3>
              {searchQuery ? `Search Results (${filteredGrades.length})` : 'All Grades'}
            </h3>
            <span className="results-count">
              {filteredGrades.length} {filteredGrades.length === 1 ? 'grade' : 'grades'}
            </span>
          </div>

          {filteredGrades.length > 0 ? (
            <div className="grades-grid">
              {filteredGrades.map((grade) => (
                <div 
                  key={grade.id} 
                  className="grade-card"
                >
                  <div className="grade-header">
                    <div className="course-info">
                      <div className="course-icon">📚</div>
                      <div className="course-details">
                        <h4 className="course-title">{grade.class_title || 'No Class Title'}</h4>
                        <span className="grade-type">Coursework Assessment</span>
                      </div>
                    </div>
                    <div className="grade-code">{grade.code || `GRD-${grade.id}`}</div>
                  </div>
                  
                  <div className="grade-body">
                    <div className="grade-display">
                      <div 
                        className={`grade-value ${getGradeVariant(grade.grade)}`}
                      >
                        {grade.grade || 'N/A'}
                      </div>
                      <div 
                        className={`grade-status ${getGradeVariant(grade.grade)}`}
                      >
                        {getGradeStatus(grade.grade)}
                      </div>
                      <div className="grade-icon-large">
                        {getGradeIcon(grade.grade)}
                      </div>
                    </div>

                    <div className="grade-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span className="meta-text">
                          {grade.graded_at ? new Date(grade.graded_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">👤</span>
                        <span className="meta-text">Student ID: {grade.student_id || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h4>{searchQuery ? 'No Matching Grades Found' : 'No Grades Available'}</h4>
              <p>
                {searchQuery 
                  ? 'Try adjusting your search terms to find what you\'re looking for.' 
                  : 'Your grades will appear here once they are published by your instructors.'}
              </p>
              {searchQuery && (
                <button 
                  className="action-btn primary"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Grades;