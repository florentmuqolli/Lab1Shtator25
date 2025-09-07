import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance'; 
import ScreenWrapper from '../../hooks/ScreenWrapper';
import { SearchIcon, EditIcon, DeleteIcon, BackArrowIcon, AddIcon } from '../../assets/Icons';
import { toast } from 'react-toastify';
import CourseFormModal from './utils/CourseFormModal';
import '../../styles/CourseManagement.css';

const CourseManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/class'); 
      setLoading(false);
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteCourse = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/class/${id}`);
      toast.success("Course Deleted");
      setTimeout(() => {
        setLoading(false);
        setCourses(courses.filter(course => course.id !== id));
      }, 1000);
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  if (loading) {
    return (
      <div className="course-loadingContainer">
        <div className="course-activityIndicator" />
      </div>
    );
  }

  return (
    <ScreenWrapper>
      <div className="course-container">
        <div className="course-header">
          <button onClick={() => navigate(-1)} className="course-backButton">
            <BackArrowIcon/>
          </button>
          <div className="course-title">Course Management</div>
          <div style={{ width: '24px' }} />
        </div>
        <div className="course-actionBar">
          <div className="course-searchContainer">
            <SearchIcon/>
            <input
              className="course-searchInput"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholderTextColor="#999"
            />
          </div>
          <button 
            className="course-addButton"
            onClick={() => {
              setSelectedCourse(null);
              setModalVisible(true);
            }}
          >
            <AddIcon/>
            <span className="course-addButtonText">Add</span>
          </button>
        </div>
        <div className="course-cardContainer">
          {loading ? (
            <div className="course-activityIndicator" style={{ marginTop: '40px' }} />
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-cardHeader">
                  <div className="course-cardName">Title: {course.title}</div>
                  <div className="course-cardName">ID: {course.id}</div>
                  <div className={[
                    'course-statusBadge',
                    course.status === 'Active' ? 'course-activeBadge' : 'course-inactiveBadge'
                  ].join(' ')}>
                    <div className="course-statusText">{course.status}</div>
                  </div>
                </div>
                <div className="course-cardEmail">Description: {course.description}</div>
                <div className="course-cardEmail">Teacher ID: {course.teacher_id}</div>
                <div className="course-cardEmail">Schedule: {course.schedule}</div>
                <div className="course-cardEmail">Day: {course.day}</div>
                <div className="course-cardEmail">Room: {course.room}</div>
                <div className="course-cardActions">
                  <button
                    className="course-cardButton"
                    onClick={() => {
                      setSelectedCourse(course);
                      setModalVisible(true);
                    }}
                  >
                    <EditIcon size={16} />
                    <span className="course-cardButtonText">Edit</span>
                  </button>
                  <button
                    className="course-cardButton course-deleteButton"
                    onClick={() => deleteCourse(course.id)}
                  >
                    <DeleteIcon size={16} color="#FF5252" />
                    <span className="course-cardButtonText course-deleteButtonText">Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="course-empty-state">
              <div className="course-empty-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#bdc3c7"/>
                </svg>
              </div>
              <h3 className="course-empty-title">No Courses Found</h3>
              <p className="course-empty-description">
                {searchQuery ? 
                  `No courses match your search for "${searchQuery}"` : 
                  'Get started by adding your first course to the system'
                }
              </p>
              {!searchQuery && (
                <button 
                  className="course-empty-action-button"
                  onClick={() => setModalVisible(true)}
                >
                  <AddIcon/>
                  <span>Add First Course</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <CourseFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        course={selectedCourse}
        refreshCourses={fetchCourses}
      />
    </ScreenWrapper>
  );
};


export default CourseManagement;