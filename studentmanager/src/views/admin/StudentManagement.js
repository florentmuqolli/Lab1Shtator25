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
          ) : (
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