import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance'; 
import ScreenWrapper from '../../hooks/ScreenWrapper';
import { SearchIcon, EditIcon, DeleteIcon, BackArrowIcon, AddIcon } from '../../assets/Icons';
import { toast } from 'react-toastify';
import TeacherFormModal from './utils/TeacherFormModal';
import '../../styles/TeacherManagement.css';

const TeacherManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/teachers');
      setLoading(false);
      setTeachers(res.data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteTeacher = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/teachers/${id}`);
      toast.success("Teacher Deleted");
      setTimeout(() => {
        setLoading(false);
        setTeachers(teachers.filter(teacher => teacher.id !== id));
      }, 1000);
    } catch (err) {
      console.error('Error deleting teacher:', err);
    }
  };

  if (loading) {
    return (
      <div className="teacher-loadingContainer">
        <div className="teacher-activityIndicator" />
      </div>
    );
  }

  return (
    <ScreenWrapper>
      <div className="teacher-container">
        <div className="teacher-header">
          <button onClick={() => navigate(-1)} className="teacher-backButton">
            <BackArrowIcon/>
          </button>
          <div className="teacher-title">Teacher Management</div>
          <div style={{ width: '24px' }} />
        </div>
        <div className="teacher-actionBar">
          <div className="teacher-searchContainer">
            <SearchIcon/>
            <input
              className="teacher-searchInput"
              placeholder="Search teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholderTextColor="#999"
            />
          </div>
          <button 
            className="teacher-addButton"
            onClick={() => {
              setSelectedTeacher(null);
              setModalVisible(true);
            }}
          >
            <AddIcon/>
            <span className="teacher-addButtonText">Add</span>
          </button>
        </div>
        <div className="teacher-cardContainer">
          {loading ? (
            <div className="teacher-activityIndicator" style={{ marginTop: '40px' }} />
          ) : filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="teacher-card">
                <div className="teacher-cardHeader">
                  <div className="teacher-cardName">{teacher.name}</div>
                  <div className="teacher-cardName">ID: {teacher.id}</div>
                  <div className={[
                    'teacher-statusBadge',
                    teacher.status === 'Active' ? 'teacher-activeBadge' : 'teacher-inactiveBadge'
                  ].join(' ')}>
                    <div className="teacher-statusText">{teacher.status}</div>
                  </div>
                </div>
                <div className="teacher-cardEmail">Email: {teacher.email}</div>
                <div className="teacher-cardEmail">Password: {teacher.password}</div>
                <div className="teacher-cardEmail">Phone: {teacher.phone}</div>
                <div className="teacher-cardActions">
                  <button
                    className="teacher-cardButton"
                    onClick={() => {
                      setSelectedTeacher(teacher);
                      setModalVisible(true);
                    }}
                  >
                    <EditIcon size={16} />
                    <span className="teacher-cardButtonText">Edit</span>
                  </button>
                  <button
                    className="teacher-cardButton teacher-deleteButton"
                    onClick={() => deleteTeacher(teacher.id)}
                  >
                    <DeleteIcon size={16} color="#FF5252" />
                    <span className="teacher-cardButtonText teacher-deleteButtonText">Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="teacher-empty-state">
              <div className="teacher-empty-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#bdc3c7"/>
                </svg>
              </div>
              <h3 className="teacher-empty-title">No Teachers Found</h3>
              <p className="teacher-empty-description">
                {searchQuery ? 
                  `No teachers match your search for "${searchQuery}"` : 
                  'Get started by adding your first teacher to the system'
                }
              </p>
              {!searchQuery && (
                <button 
                  className="teacher-empty-action-button"
                  onClick={() => setModalVisible(true)}
                >
                  <AddIcon/>
                  <span>Add First Teacher</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <TeacherFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        teacher={selectedTeacher}
        refreshTeachers={fetchTeachers}
      />
    </ScreenWrapper>
  );
};

export default TeacherManagement;