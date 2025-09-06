import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance'; 
import ScreenWrapper from '../../hooks/ScreenWrapper';
import { SearchIcon, EditIcon, DeleteIcon, BackArrowIcon, AddIcon } from '../../assets/Icons';
import { toast } from 'react-toastify';
import StudentFormModal from './utils/StudentFormModal';
import '../../styles/StudentManagement.css';

const StudentManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/students'); 
      setLoading(false);
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteStudent = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/students/${id}`);
      toast.success("Student Deleted");
      setTimeout(() => {
        setLoading(false);
        setStudents(students.filter(student => student.id !== id));
      }, 1000);
    } catch (err) {
      console.error('Error deleting student:', err);
    }
  };

  if (loading) {
    return (
      <div className="student-loadingContainer">
        <div className="student-activityIndicator" />
      </div>
    );
  }

  return (
    <ScreenWrapper>
      <div className="student-container">
        <div className="student-header">
          <button onClick={() => navigate(-1)} className="student-backButton">
            <BackArrowIcon/>
          </button>
          <div className="student-title">Student Management</div>
          <div style={{ width: '24px' }} />
        </div>
        <div className="student-actionBar">
          <div className="student-searchContainer">
            <SearchIcon/>
            <input
              className="student-searchInput"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholderTextColor="#999"
            />
          </div>
          <button 
            className="student-addButton"
            onClick={() => {
              setSelectedStudent(null);
              setModalVisible(true);
            }}
          >
            <AddIcon/>
            <span className="student-addButtonText">Add</span>
          </button>
        </div>
        <div className="student-cardContainer">
          {loading ? (
            <div className="student-activityIndicator" style={{ marginTop: '40px' }} />
          ) : filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div key={student.id} className="student-card">
                <div className="student-cardHeader">
                  <div className="student-cardName">{student.name}</div>
                  <div className="student-cardName">ID: {student.id}</div>
                  <div className={[
                    'student-statusBadge',
                    student.status === 'Active' ? 'student-activeBadge' : 'student-inactiveBadge'
                  ].join(' ')}>
                    <div className="student-statusText">{student.status}</div>
                  </div>
                </div>
                <div className="student-cardEmail">Email : {student.email}</div>
                <div className="student-cardEmail">Password: {student.password}</div>
                <div className="student-cardEmail">Phone: {student.phone}</div>
                <div className="student-cardActions">
                  <button
                    className="student-cardButton"
                    onClick={() => {
                      setSelectedStudent(student);
                      setModalVisible(true);
                    }}
                  >
                    <EditIcon size={16} />
                    <span className="student-cardButtonText">Edit</span>
                  </button>
                  <button
                    className="student-cardButton student-deleteButton"
                    onClick={() => deleteStudent(student.id)}
                  >
                    <DeleteIcon size={16} color="#FF5252" />
                    <span className="student-cardButtonText student-deleteButtonText">Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="student-empty-state">
              <div className="student-empty-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5.9C13.16 5.9 14.1 6.84 14.1 8C14.1 9.16 13.16 10.1 12 10.1C10.84 10.1 9.9 9.16 9.9 8C9.9 6.84 10.84 5.9 12 5.9ZM12 14.9C14.97 14.9 18.1 16.36 18.1 17V18.1H5.9V17C5.9 16.36 9.03 14.9 12 14.9ZM12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13Z" fill="#bdc3c7"/>
                </svg>
              </div>
              <h3 className="student-empty-title">No Students Found</h3>
              <p className="student-empty-description">
                {searchQuery ? 
                  `No students match your search for "${searchQuery}"` : 
                  'Get started by adding your first student to the system'
                }
              </p>
              {!searchQuery && (
                <button 
                  className="student-empty-action-button"
                  onClick={() => setModalVisible(true)}
                >
                  <AddIcon/>
                  <span>Add First Student</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <StudentFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        student={selectedStudent}
        refreshStudents={fetchStudents}
      />
    </ScreenWrapper>
  );
};

export default StudentManagement;