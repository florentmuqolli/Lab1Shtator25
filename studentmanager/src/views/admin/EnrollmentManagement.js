import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance'; 
import ScreenWrapper from '../../hooks/ScreenWrapper';
import { SearchIcon, EditIcon, DeleteIcon, BackArrowIcon, AddIcon } from '../../assets/Icons';
import { toast } from 'react-toastify';
import EnrollmentFormModal from './utils/EnrollmentFormModal';
import '../../styles/EnrollmentManagement.css';

const EnrollmentManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/enrollment'); 
      setLoading(false);
      console.log('enrollments: ', res.data);
      setEnrollments(res.data);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.student_id.toString().includes(searchQuery.toLowerCase()) ||
    enrollment.class_id.toString().includes(searchQuery.toLowerCase()) ||
    enrollment.enrolled_at.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteEnrollment = async (id) => {
    try {
      await axiosInstance.delete(`/enrollment/${id}`);
      toast.success("Enrollment Deleted");
      setEnrollments(enrollments.filter(enrollment => enrollment.id !== id));
    } catch (err) {
      console.error('Error deleting enrollment:', err);
    }
  };

  if (loading) {
    return (
      <div className="enrollment-loadingContainer">
        <div className="enrollment-activityIndicator" />
      </div>
    );
  }

  return (
    <ScreenWrapper>
      <div className="enrollment-container">
        <div className="enrollment-header">
          <button onClick={() => navigate(-1)} className="enrollment-backButton">
            <BackArrowIcon/>
          </button>
          <div className="enrollment-title">Enrollments Management</div>
          <div style={{ width: '24px' }} />
        </div>
        <div className="enrollment-actionBar">
          <div className="enrollment-searchContainer">
            <SearchIcon/>
            <input
              className="enrollment-searchInput"
              placeholder="Search enrollments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholderTextColor="#999"
            />
          </div>
          <button 
            className="enrollment-addButton"
            onClick={() => {
              setSelectedEnrollment(null);
              setModalVisible(true);
            }}
          >
            <AddIcon/>
            <span className="enrollment-addButtonText">Add</span>
          </button>
        </div>
        <div className="enrollment-cardContainer">
          {loading ? (
            <div className="enrollment-activityIndicator" style={{ marginTop: '40px' }} />
          ) : filteredEnrollments.length > 0 ? (
            filteredEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="enrollment-card">
                <div className="enrollment-cardHeader">
                  <div className="enrollment-cardName">Student: {enrollment.student_id}</div>
                  <div className="enrollment-cardName">Class: {enrollment.class_id}</div>
                  <div className="enrollment-cardName">Enrolled at: {enrollment.enrolled_at}</div>
                </div>
                <div className="enrollment-cardActions">
                  <button
                    className="enrollment-cardButton enrollment-deleteButton"
                    onClick={() => deleteEnrollment(enrollment.id)}
                  >
                    <DeleteIcon size={16} color="#FF5252" />
                    <span className="enrollment-cardButtonText enrollment-deleteButtonText">Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="enrollment-empty-state">
              <div className="enrollment-empty-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#bdc3c7"/>
                </svg>
              </div>
              <h3 className="enrollment-empty-title">No Enrollments Found</h3>
              <p className="enrollment-empty-description">
                {searchQuery ? 
                  `No enrollments match your search for "${searchQuery}"` : 
                  'Get started by adding your first enrollment to the system'
                }
              </p>
              {!searchQuery && (
                <button 
                  className="enrollment-empty-action-button"
                  onClick={() => setModalVisible(true)}
                >
                  <AddIcon/>
                  <span>Add First Enrollment</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <EnrollmentFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        enrollment={selectedEnrollment}
        refreshEnrollments={fetchEnrollments}
      />
    </ScreenWrapper>
  );
};

export default EnrollmentManagement;