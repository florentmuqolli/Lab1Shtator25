import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/MyClasses.css';

const MyClasses = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
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

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/class/specific-class');
      const coursesWithCounts = await Promise.all(
        res.data.map(async (course) => {
          try {
            const countRes = await axiosInstance.get(`/enrollment/total`);
            return {
              ...course,
              totalStudents: countRes.data.totalStudents || 0,
            };
          } catch (err) {
            console.error(`Error fetching student count for class ${course.id}:`, err);
            return { ...course, totalStudents: 0 };
          }
        })
      );
      setCourses(coursesWithCounts);
      setFilteredCourses(coursesWithCounts);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching courses:', err);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.room.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

  const openCourseDetails = (course) => {
    setSelectedCourse(course);
    setShowDetailModal(true);
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'pending': return 'warning';
      case 'completed': return 'primary';
      default: return 'secondary';
    }
  };

  const getDayColor = (day) => {
    const colors = {
      monday: 'primary',
      tuesday: 'info',
      wednesday: 'warning',
      thursday: 'success',
      friday: 'danger',
      saturday: 'secondary',
      sunday: 'dark'
    };
    return colors[day?.toLowerCase()] || 'secondary';
  };

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-loading-spinner"></div>
        <p className="dashboard-loading-text">Loading your courses...</p>
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
              <h1 className="dashboard-title">My Courses</h1>
              <p className="dashboard-subtitle">Manage and monitor all your teaching assignments</p>
            </div>
          </div>
          <div className="dashboard-header-right">
            <button
              className="dashboard-refresh-btn"
              onClick={fetchCourses}
              disabled={loading}
            >
              <span className={`dashboard-refresh-icon ${loading ? 'loading' : ''}`}>
                ↻
              </span>
              {loading ? 'Updating...' : 'Refresh'}
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome-card">
          <div className="welcome-card-content">
            <div className="welcome-text">
              <h2>Course Management 📚</h2>
              <p>Overview of all your teaching assignments. Track schedules, student enrollment, and course details in one place.</p>
              {elapsedTime && (
                <div className="last-updated">
                  <span className="update-indicator"></span>
                  Last updated {elapsedTime}
                </div>
              )}
            </div>
            <div className="welcome-graphic">
              <div className="graphic-icon">🏫</div>
            </div>
          </div>
        </div>

        <div className="dashboard-content-grid">
          <div className="content-card search-card">
            <div className="search-container">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search courses by title, description, or room..."
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
                <div className="stat-icon courses">📚</div>
                <div className="stat-content">
                  <h3>{courses.length}</h3>
                  <p>Total Courses</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon students">👥</div>
                <div className="stat-content">
                  <h3>{courses.reduce((total, course) => total + (course.totalStudents || 0), 0)}</h3>
                  <p>Total Students</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-card courses-grid-card">
          <div className="card-header">
            <h3>
              {searchQuery ? `Search Results (${filteredCourses.length})` : 'All Courses'}
            </h3>
            <span className="results-count">
              Showing {filteredCourses.length} of {courses.length} courses
            </span>
          </div>

          <div className="courses-grid">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="course-card"
                  onClick={() => openCourseDetails(course)}
                >
                  <div className="course-header">
                    <div className="course-badges">
                      <span className="course-id">ID: {course.id}</span>
                      <span className={`status-badge ${getStatusVariant(course.status)}`}>
                        {course.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="course-body">
                    <h4 className="course-title">{course.title || 'Untitled Course'}</h4>
                    
                    <div className="course-description">
                      {course.description || 'No description provided'}
                    </div>

                    <div className="course-meta">
                      <div className="meta-item">
                        <span className="meta-icon">⏰</span>
                        <span className="meta-text">{course.schedule || 'Schedule TBA'}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span className={`day-badge ${getDayColor(course.day)}`}>
                          {course.day || 'Days TBA'}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">📍</span>
                        <span className="meta-text">{course.room || 'Room TBA'}</span>
                      </div>
                    </div>

                    <div className="course-footer">
                      <div className="enrollment-info">
                        <span className="enrollment-label">Students Enrolled</span>
                        <span className="enrollment-count">{course.totalStudents || 0}</span>
                      </div>
                      <button className="view-details-btn">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h4>
                  {searchQuery ? 'No matching courses found' : 'No courses available'}
                </h4>
                <p>
                  {searchQuery 
                    ? 'Try adjusting your search terms' 
                    : 'You haven\'t been assigned to any courses yet'}
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
        </div>
      </main>

      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered className="wide-modal">
        <div className="modal-header-gradient">
          <div className="modal-header-content">
            <div className="modal-title-section">
              <div className="modal-icon">
                📚
              </div>
              <div>
                <h3>{selectedCourse?.title}</h3>
                <p>Course details and information</p>
              </div>
            </div>
            <button className="modal-close-btn" onClick={() => setShowDetailModal(false)}>×</button>
          </div>
        </div>
        
        <div className="modal-body-custom">
          {selectedCourse && (
            <div className="course-detail-content">
              <div className="course-badges-header">
                <span className={`status-badge large ${getStatusVariant(selectedCourse.status)}`}>
                  {selectedCourse.status}
                </span>
                <span className="course-id-badge">
                  ID: {selectedCourse.id}
                </span>
              </div>

              <div className="detail-grid">
                <div className="detail-card">
                  <div className="detail-icon">⏰</div>
                  <div className="detail-content">
                    <span className="detail-label">Schedule</span>
                    <span className="detail-value">{selectedCourse.schedule || 'TBA'}</span>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-icon">📅</div>
                  <div className="detail-content">
                    <span className="detail-label">Day</span>
                    <span className={`day-badge large ${getDayColor(selectedCourse.day)}`}>
                      {selectedCourse.day || 'TBA'}
                    </span>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-icon">📍</div>
                  <div className="detail-content">
                    <span className="detail-label">Room</span>
                    <span className="detail-value">{selectedCourse.room || 'TBA'}</span>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-icon">👥</div>
                  <div className="detail-content">
                    <span className="detail-label">Students Enrolled</span>
                    <span className="detail-value enrollment">{selectedCourse.totalStudents || 0}</span>
                  </div>
                </div>
              </div>

              <div className="description-section">
                <h4 className="section-title">Course Description</h4>
                <p className="description-text">
                  {selectedCourse.description || 'No description provided.'}
                </p>
              </div>

              <div className="action-buttons">
                <button className="action-btn primary large">
                  <span className="btn-icon">👥</span>
                  View Students
                </button>
                <button className="action-btn secondary large">
                  <span className="btn-icon">✏️</span>
                  Edit Course
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MyClasses;