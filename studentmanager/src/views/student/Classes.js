import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../../styles/StudentClasses.css";

const Classes = () => {
  const navigate = useNavigate();
  const [myClasses, setMyClasses] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [showAllClasses, setShowAllClasses] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStudentId = async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      setStudentId(res.data.studentId);  
    } catch (err) {
      console.error('Error fetching student info:', err);
      toast.error('Failed to load student information');
    }
  };

  const fetchMyClasses = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/students/specific-class');
      setMyClasses(res.data);
      setEnrolledIds(res.data.map(cls => cls.id));
    } catch (err) {
      console.error('Error fetching my classes:', err);
      toast.error('Failed to load your classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllClasses = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/class');
      setAllClasses(res.data);
    } catch (err) {
      console.error('Error fetching all classes:', err);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (showAllClasses) {
      await fetchAllClasses();
    } else {
      await fetchMyClasses();
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleEnroll = async (classId) => {
    if (!studentId) {
      toast.error('Student ID not loaded yet');
      return;
    }

    try {
      await axiosInstance.post(`/enrollment`, {
        student_id: studentId,
        class_id: classId
      });

      setEnrolledIds([...enrolledIds, classId]);
      const enrolledClass = allClasses.find(cls => cls.id === classId);
      
      if (enrolledClass && !myClasses.some(cls => cls.id === classId)) {
        setMyClasses([...myClasses, enrolledClass]);
      }

      setShowEnrollModal(false);
      toast.success('Successfully enrolled in class!');
    } catch (err) {
      console.error('Error enrolling in class:', err);
      toast.error('Failed to enroll in class');
    }
  };

  const openEnrollModal = (classItem) => {
    setSelectedClass(classItem);
    setShowEnrollModal(true);
  };

  useEffect(() => {
    fetchMyClasses();
    fetchStudentId();
  }, []);

  const currentData = showAllClasses ? allClasses : myClasses;

  const getSubjectIcon = (title) => {
    const subject = title?.toLowerCase() || '';
    if (subject.includes('math') || subject.includes('calculus')) return '∫';
    if (subject.includes('science') || subject.includes('physics') || subject.includes('chemistry')) return '⚛';
    if (subject.includes('english') || subject.includes('literature')) return '📖';
    if (subject.includes('history') || subject.includes('social')) return '📜';
    if (subject.includes('art') || subject.includes('design')) return '🎨';
    if (subject.includes('music')) return '🎵';
    if (subject.includes('computer') || subject.includes('programming')) return '💻';
    return '📚';
  };

  const getSubjectColor = (index) => {
    const colors = [
      'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
      'linear-gradient(135deg, #00B894 0%, #00806a 100%)',
      'linear-gradient(135deg, #FD79A8 0%, #e84393 100%)',
      'linear-gradient(135deg, #FDCB6E 0%, #e17055 100%)',
      'linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)',
      'linear-gradient(135deg, #00CEC9 0%, #0984e3 100%)',
      'linear-gradient(135deg, #D63031 0%, #e17055 100%)',
      'linear-gradient(135deg, #0984e3 0%, #00CEC9 100%)'
    ];
    return colors[index % colors.length];
  };

  if (loading && myClasses.length === 0) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-loading-spinner"></div>
        <p className="dashboard-loading-text">Loading your classes...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-left">
            <h1 className="dashboard-title">Classes</h1>
            <p className="dashboard-subtitle">
              {showAllClasses ? "Browse and enroll in available classes" : "Manage your enrolled classes"}
            </p>
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
              <h2>Your Classes Overview 📚</h2>
              <p>
                {showAllClasses 
                  ? "Browse all available courses and expand your learning journey." 
                  : "Stay organized with your current course schedule and materials."}
              </p>
              <div className="last-updated">
                <span className="update-indicator"></span>
                {currentData.length} {currentData.length === 1 ? 'class' : 'classes'} available
              </div>
            </div>
            <div className="welcome-graphic">
              <div className="graphic-icon">🎓</div>
            </div>
          </div>
        </div>

        {/* Toggle Section */}
        <div className="content-card">
          <div className="card-header">
            <h3>Class Management</h3>
            <div className="view-all-btn" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span className="class-badge">{currentData.length}</span>
              {currentData.length === 1 ? 'Class' : 'Classes'}
            </div>
          </div>
          
          <div className="toggle-buttons">
            <button
              className={`toggle-btn ${!showAllClasses ? 'active' : ''}`}
              onClick={() => setShowAllClasses(false)}
            >
              <span className="toggle-icon">👤</span>
              My Classes
              {!showAllClasses && <div className="toggle-indicator"></div>}
            </button>
            <button
              className={`toggle-btn ${showAllClasses ? 'active' : ''}`}
              onClick={() => {
                setShowAllClasses(true);
                if (allClasses.length === 0) fetchAllClasses();
              }}
            >
              <span className="toggle-icon">📚</span>
              All Classes
              {showAllClasses && <div className="toggle-indicator"></div>}
            </button>
          </div>
        </div>

        {/* Classes Grid */}
        {currentData.length === 0 ? (
          <div className="content-card text-center py-5">
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No Classes Available</h3>
              <p className="text-muted">
                {showAllClasses 
                  ? "There are currently no classes available for enrollment." 
                  : "You haven't enrolled in any classes yet."}
              </p>
              {!showAllClasses && (
                <button 
                  className="dashboard-refresh-btn"
                  onClick={() => setShowAllClasses(true)}
                >
                  Browse Available Classes
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="classes-grid">
            {currentData.map((classItem, index) => (
              <div className="class-card" key={classItem.id}>
                <div 
                  className="class-card-header"
                  style={{ background: getSubjectColor(index) }}
                >
                  <div className="class-subject-icon">
                    {getSubjectIcon(classItem.title)}
                  </div>
                  <div className="class-code">
                    {classItem.code || `CLS-${classItem.id}`}
                  </div>
                </div>
                
                <div className="class-card-content">
                  <h4>{classItem.title}</h4>
                  <p className="class-instructor">by {classItem.teacher_name || 'Professor'}</p>
                  
                  <div className="class-details">
                    <div className="class-detail-item">
                      <span className="detail-icon">⏰</span>
                      <span>{classItem.schedule || 'Schedule TBA'}</span>
                    </div>
                    <div className="class-detail-item">
                      <span className="detail-icon">📅</span>
                      <span>{classItem.day || 'Days TBA'}</span>
                    </div>
                    <div className="class-detail-item">
                      <span className="detail-icon">📍</span>
                      <span>{classItem.room || 'Room TBA'}</span>
                    </div>
                  </div>

                  {showAllClasses && (
                    <button
                      className={`enroll-btn ${enrolledIds.includes(classItem.id) ? 'enrolled' : ''}`}
                      disabled={enrolledIds.includes(classItem.id)}
                      onClick={() => openEnrollModal(classItem)}
                    >
                      {enrolledIds.includes(classItem.id) ? (
                        <>
                          <span className="enroll-icon">✓</span>
                          Enrolled
                        </>
                      ) : (
                        <>
                          <span className="enroll-icon">+</span>
                          Enroll Now
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Enroll Modal */}
      {showEnrollModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">📚</div>
            <h3>Confirm Enrollment</h3>
            <p className="modal-text">
              Are you sure you want to enroll in <strong>{selectedClass?.title}</strong>?
            </p>
            
            {selectedClass && (
              <div className="modal-details">
                <div className="modal-detail-row">
                  <span>Instructor:</span>
                  <strong>{selectedClass.teacher_name}</strong>
                </div>
                <div className="modal-detail-row">
                  <span>Schedule:</span>
                  <strong>{selectedClass.schedule}</strong>
                </div>
                <div className="modal-detail-row">
                  <span>Location:</span>
                  <strong>{selectedClass.room}</strong>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button
                className="dashboard-refresh-btn"
                onClick={() => setShowEnrollModal(false)}
                style={{ 
                  background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
                  flex: 1
                }}
              >
                Cancel
              </button>
              <button
                className="dashboard-refresh-btn"
                onClick={() => handleEnroll(selectedClass?.id)}
                style={{ 
                  background: 'linear-gradient(135deg, #00B894 0%, #00806a 100%)',
                  flex: 1
                }}
              >
                Confirm Enrollment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;