import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import '../../../styles/TeacherAssignments.css';

const AssignmentStatsModal = ({ visible, onClose, assignment, loading }) => {
  const calculateStats = () => {
    if (!assignment?.submissions) return {};
    
    const totalSubmissions = assignment.submissions.length;
    const gradedSubmissions = assignment.submissions.filter(sub => sub.grade !== null).length;
    const gradedSubmissionsList = assignment.submissions.filter(sub => sub.grade !== null);
    const averageGrade = gradedSubmissionsList.length > 0 
      ? (gradedSubmissionsList.reduce((sum, sub) => sum + (parseFloat(sub.grade) || 0), 0) / gradedSubmissionsList.length).toFixed(1)
      : 0;
    
    return { totalSubmissions, gradedSubmissions, averageGrade };
  };

  const stats = calculateStats();

  const getGradeColor = (grade) => {
    if (grade === null || isNaN(parseFloat(grade))) return 'secondary';
    const numericGrade = parseFloat(grade);
    if (numericGrade >= 90) return 'success';
    if (numericGrade >= 80) return 'primary';
    if (numericGrade >= 70) return 'warning';
    return 'danger';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not submitted';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) + ' at ' + date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isLate = (submittedAt, dueDate) => {
    if (!submittedAt || !dueDate) return false;
    return new Date(submittedAt) > new Date(dueDate);
  };

  const getGradeDistribution = () => {
    if (!assignment?.submissions) return [];
    
    const distribution = [
      { label: 'A (90-100)', range: [90, 100], color: 'success', count: 0 },
      { label: 'B (80-89)', range: [80, 89], color: 'primary', count: 0 },
      { label: 'C (70-79)', range: [70, 79], color: 'warning', count: 0 },
      { label: 'Below 70', range: [0, 69], color: 'danger', count: 0 }
    ];

    assignment.submissions.forEach(sub => {
      const grade = parseFloat(sub.grade);
      if (!isNaN(grade)) {
        distribution.forEach(bucket => {
          if (grade >= bucket.range[0] && grade <= bucket.range[1]) {
            bucket.count++;
          }
        });
      }
    });

    return distribution;
  };

  const gradeDistribution = getGradeDistribution();

  return (
    <Modal show={visible} onHide={onClose} centered className="extra-wide-modal">
      <div className="modal-header-gradient stats">
        <div className="modal-header-content">
          <div className="modal-title-section">
            <div className="modal-icon">
              📊
            </div>
            <div>
              <h3>{assignment?.title} - Statistics</h3>
              <p>Detailed analytics and submission overview</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
      </div>
      
      <div className="modal-body-custom stats-wide">
        {/* Stats Cards */}
        <div className="stats-grid-cards-wide">
          <div className="stat-card-wide">
            <div className="stat-icon-wrapper">
              <div className="stat-icon">👥</div>
            </div>
            <div className="stat-content">
              <h2>{stats.totalSubmissions || 0}</h2>
              <p>Total Submissions</p>
            </div>
          </div>
          
          <div className="stat-card-wide">
            <div className="stat-icon-wrapper">
              <div className="stat-icon">✅</div>
            </div>
            <div className="stat-content">
              <h2>{stats.gradedSubmissions || 0}</h2>
              <p>Graded Submissions</p>
            </div>
          </div>
          
          <div className="stat-card-wide">
            <div className="stat-icon-wrapper">
              <div className="stat-icon">📈</div>
            </div>
            <div className="stat-content">
              <h2>{stats.averageGrade}</h2>
              <p>Average Grade</p>
            </div>
          </div>
        </div>

        <div className="stats-content-grid-wide">
          {/* Submissions Table */}
          <div className="stats-main-content-wide">
            <div className="content-section-wide">
              <div className="section-header">
                <h4>📋 Student Submissions</h4>
              </div>
              
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading submissions data...</p>
                </div>
              ) : assignment?.submissions?.length > 0 ? (
                <div className="submissions-table-wide">
                  <div className="table-header-wide">
                    <div className="table-cell">Student</div>
                    <div className="table-cell">Submitted</div>
                    <div className="table-cell">Status</div>
                    <div className="table-cell">Grade</div>
                    <div className="table-cell">Actions</div>
                  </div>
                  
                  <div className="table-body">
                    {assignment.submissions.map((submission, index) => (
                      <div key={index} className="table-row-wide">
                        <div className="table-cell">
                          <div className="student-name">
                            {submission.student_name || 'Unknown Student'}
                          </div>
                        </div>
                        <div className="table-cell">
                          <div className={`submission-date ${isLate(submission.submitted_at, assignment.due_date) ? 'late' : ''}`}>
                            {formatDate(submission.submitted_at)}
                            {isLate(submission.submitted_at, assignment.due_date) && (
                              <span className="late-badge">Late</span>
                            )}
                          </div>
                        </div>
                        <div className="table-cell">
                          <span className={`status-badge ${submission.grade !== null ? 'graded' : 'pending'}`}>
                            {submission.grade !== null ? 'Graded' : 'Pending'}
                          </span>
                        </div>
                        <div className="table-cell">
                          {submission.grade !== null ? (
                            <span className={`grade-badge ${getGradeColor(submission.grade)}`}>
                              {submission.grade}
                            </span>
                          ) : (
                            <span className="grade-na">N/A</span>
                          )}
                        </div>
                        <div className="table-cell">
                          <button className="action-btn small">
                            <span className="btn-icon">✏️</span>
                            Grade
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📁</div>
                  <h4>No Submissions Yet</h4>
                  <p>Students have not turned in any work for this assignment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Analytics Sidebar */}
          <div className="stats-sidebar-wide">
            {assignment?.submissions?.length > 0 && (
              <>
                {/* Grade Distribution */}
                <div className="sidebar-section-wide">
                  <div className="section-header">
                    <h4>📊 Grade Distribution</h4>
                  </div>
                  <div className="distribution-list">
                    {gradeDistribution.map((item, index) => (
                      <div key={index} className="distribution-item">
                        <div className="distribution-header">
                          <span className="distribution-label">{item.label}</span>
                          <span className={`distribution-count ${item.color}`}>
                            {item.count}
                          </span>
                        </div>
                        <div className="distribution-bar">
                          <div 
                            className={`distribution-fill ${item.color}`}
                            style={{ 
                              width: `${(item.count / stats.totalSubmissions) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submission Timeline */}
                <div className="sidebar-section-wide">
                  <div className="section-header">
                    <h4>⏰ Submission Timeline</h4>
                  </div>
                  <div className="timeline-stats">
                    {(() => {
                      const dueDate = new Date(assignment.due_date);
                      const onTimeCount = assignment.submissions.filter(sub => 
                        sub.submitted_at && new Date(sub.submitted_at) <= dueDate
                      ).length;
                      const lateCount = assignment.submissions.filter(sub => 
                        sub.submitted_at && new Date(sub.submitted_at) > dueDate
                      ).length;

                      return (
                        <div className="timeline-list">
                          <div className="timeline-item">
                            <span className="timeline-label">On Time</span>
                            <span className="timeline-count success">{onTimeCount}</span>
                          </div>
                          <div className="timeline-item">
                            <span className="timeline-label">Late</span>
                            <span className="timeline-count danger">{lateCount}</span>
                          </div>
                          <div className="timeline-item">
                            <span className="timeline-label">Not Submitted</span>
                            <span className="timeline-count secondary">
                              {stats.totalSubmissions - (onTimeCount + lateCount)}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="modal-footer-custom-wide">
        <button className="modal-btn secondary" onClick={onClose}>
          Close
        </button>
        <button className="modal-btn primary">
          <span className="btn-icon">📥</span>
          Export Submissions
        </button>
      </div>
    </Modal>
  );
};

export default AssignmentStatsModal;