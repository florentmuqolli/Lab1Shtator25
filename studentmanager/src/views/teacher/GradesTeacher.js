import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner, Badge, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/TeacherGrades.css";

const TeacherGrades = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [gradeValue, setGradeValue] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("");

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    if (!lastUpdated) return;
    const interval = setInterval(() => {
      const secondsAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      setElapsedTime(secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.floor(secondsAgo / 60)}m ago`);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesRes, gradesRes] = await Promise.all([
        axiosInstance.get("/class/specific-class"),
        axiosInstance.get("/grades/my"),
      ]);
      setTimeout(() => {
        setClasses(classesRes.data);
        setGrades(gradesRes.data);
        setFilteredGrades(gradesRes.data);
        setLastUpdated(new Date());
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
      toast.error("Failed to load grades data");
    } 
  };

  const fetchStudentsForClass = async (classId) => {
    try {
      const res = await axiosInstance.get(`/enrollments/${classId}/students`);
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredGrades(grades);
    } else {
      const lowerText = text.toLowerCase();
      const filtered = grades.filter((grade) => {
        return (
          grade.student_id.toString().includes(lowerText) ||
          grade.class_id.toString().includes(lowerText) ||
          grade.grade.toString().includes(lowerText)
        );
      });
      setFilteredGrades(filtered);
    }
  };

  const handleAddGrade = async () => {
    if (!selectedClassId || !selectedStudentId || !gradeValue) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await axiosInstance.post("/grades", {
        class_id: selectedClassId,
        student_id: selectedStudentId,
        grade: parseFloat(gradeValue),
      });

      toast.success("Grade added successfully");
      setShowAddModal(false);
      setSelectedClassId("");
      setSelectedStudentId("");
      setGradeValue("");
      fetchData();
    } catch (error) {
      console.error("Error adding grade:", error);
      toast.error("Failed to add grade");
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'secondary';
    const numericGrade = parseFloat(grade);
    if (numericGrade >= 90) return 'success';
    if (numericGrade >= 80) return 'primary';
    if (numericGrade >= 70) return 'warning';
    return 'danger';
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
        <p className="dashboard-loading-text">Loading grades data...</p>
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
              <h1 className="dashboard-title">Grade Management</h1>
              <p className="dashboard-subtitle">Track and manage student grades across all classes</p>
            </div>
          </div>
          <div className="dashboard-header-right">
            <button
              className="dashboard-refresh-btn"
              onClick={fetchData}
              disabled={loading}
            >
              <span className={`dashboard-refresh-icon ${loading ? 'loading' : ''}`}>
                ↻
              </span>
              {loading ? 'Updating...' : 'Refresh'}
            </button>
            <button
              className="dashboard-create-btn"
              onClick={() => setShowAddModal(true)}
            >
              <span className="create-icon">+</span>
              Add Grade
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Welcome Card */}
        <div className="dashboard-welcome-card">
          <div className="welcome-card-content">
            <div className="welcome-text">
              <h2>Grade Management 📊</h2>
              <p>Monitor student performance, record grades, and track academic progress across all your classes.</p>
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

        {/* Search and Stats Row */}
        <div className="dashboard-content-grid">
          <div className="content-card search-card">
            <div className="search-container">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search by student ID, class ID, or grade..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="search-clear-btn"
                  onClick={() => handleSearch('')}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          <div className="content-card stats-card">
            <div className="stat-content">
              <div className="stat-icon grades">📈</div>
              <div>
                <h3>{grades.length}</h3>
                <p>Total Grades</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="content-card grades-table-card">
          <div className="card-header">
            <h3>
              {searchQuery ? `Search Results (${filteredGrades.length})` : 'All Grade Records'}
            </h3>
            <span className="results-count">
              Showing {filteredGrades.length} of {grades.length} grades
            </span>
          </div>

          {filteredGrades.length > 0 ? (
            <div className="grades-table-container">
              <div className="table-header">
                <div className="table-cell">Student ID</div>
                <div className="table-cell">Class ID</div>
                <div className="table-cell">Grade</div>
                <div className="table-cell">Date Graded</div>
                <div className="table-cell">Status</div>
              </div>
              
              <div className="table-body">
                {filteredGrades.map((grade) => (
                  <div key={grade.id} className="table-row">
                    <div className="table-cell">
                      <div className="student-id">
                        {grade.student_id}
                      </div>
                    </div>
                    <div className="table-cell">
                      <div className="class-id">
                        {grade.class_id}
                      </div>
                    </div>
                    <div className="table-cell">
                      <span className={`grade-badge ${getGradeVariant(grade.grade)}`}>
                        {grade.grade}
                      </span>
                    </div>
                    <div className="table-cell">
                      <div className="date-graded">
                        {grade.graded_at ? new Date(grade.graded_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    <div className="table-cell">
                      <span className="status-badge recorded">
                        Recorded
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h4>
                {searchQuery ? 'No matching grades found' : 'No grades recorded yet'}
              </h4>
              <p>
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Add grades using the button above to get started'}
              </p>
              {searchQuery ? (
                <button 
                  className="action-btn primary"
                  onClick={() => handleSearch('')}
                >
                  Clear Search
                </button>
              ) : (
                <button 
                  className="action-btn primary"
                  onClick={() => setShowAddModal(true)}
                >
                  Add First Grade
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Enhanced Add Grade Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered className="wide-modal">
        <div className="modal-header-gradient">
          <div className="modal-header-content">
            <div className="modal-title-section">
              <div className="modal-icon">
                ➕
              </div>
              <div>
                <h3>Add New Grade</h3>
                <p>Record a new grade for a student</p>
              </div>
            </div>
            <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>×</button>
          </div>
        </div>
        
        <div className="modal-body-custom">
          <div className="form-container">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📚</span>
                Select Class <span className="required">*</span>
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  setSelectedStudentId("");
                  if (e.target.value) {
                    fetchStudentsForClass(e.target.value);
                  }
                }}
                className="form-select"
              >
                <option value="">Choose a class...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.title} (ID: {cls.id})
                  </option>
                ))}
              </select>
            </div>

            {students.length > 0 && (
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">👨‍🎓</span>
                  Select Student <span className="required">*</span>
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="form-select"
                >
                  <option value="">Choose a student...</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      Student ID: {student.id}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">⭐</span>
                Enter Grade <span className="required">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter grade (e.g., 85.50)"
                value={gradeValue}
                onChange={(e) => setGradeValue(e.target.value)}
                min="0"
                max="100"
                step="0.01"
                className="form-input"
              />
              <div className="form-note">
                <span className="note-icon">ℹ️</span>
                Enter a grade between 0 and 100
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer-custom">
          <button 
            className="modal-btn secondary"
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </button>
          <button 
            className="modal-btn primary"
            onClick={handleAddGrade}
          >
            <span className="btn-icon">📝</span>
            Submit Grade
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherGrades;