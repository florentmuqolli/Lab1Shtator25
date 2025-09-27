import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../services/axiosInstance';
import '../../../styles/CourseFormModal.css';

const CourseFormModal = ({ visible, onClose, course, refreshCourses }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teacher_id: '',
    schedule: '',
    day: '',
    room: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [teachers, setTeachers] = useState([]);


  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axiosInstance.get('/teacher'); 
        setTeachers(res.data);
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
        toast.error("Unable to load teachers");
      }
    };

    if (visible) {
      fetchTeachers();
    }

    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        teacher_id: course.teacher_id || '',
        schedule: course.schedule || '',
        day: course.day || '',
        room: course.room || '',
        status: course.status || 'Active'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        teacher_id: '',
        schedule: '',
        day: '',
        room: '',
        status: 'Active'
      });
    }
    setErrors({});
  }, [course, visible]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (course) {
        await axiosInstance.put(`/class/${course.id}`, formData);
        toast.success("Course Updated");
      } else {
        await axiosInstance.post('/class', formData);
        toast.success("Course Created");
      }
      refreshCourses();
      onClose();
    } catch (error) {
      console.error('Error saving course:', error);
      if (error.response?.data?.message) {
        setErrors({ api: error.response.data.message });
      }
      const message =
        error.response?.data?.message || 
        error.message || "Something went wrong";
        
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="course-form-modal-overlay" onClick={onClose}>
      <div className="course-form-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="course-form-modal-title">
          {course ? 'Edit Course' : 'Add New Course'}
        </div>

        {errors.api && (
          <div className="course-form-error-text">{errors.api}</div>
        )}

        <div className="course-form-input-group">
          <div className="course-form-label">Title*</div>
          <input
            className={`course-form-input ${errors.title ? 'course-form-input-error' : ''}`}
            placeholder="Title Example"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          {errors.title && <div className="course-form-error-text">{errors.title}</div>}
        </div>

        <div className="course-form-input-group">
          <div className="course-form-label">Description*</div>
          <textarea
            className={`course-form-textarea ${errors.description ? 'course-form-input-error' : ''}`}
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="3"
          />
          {errors.description && <div className="course-form-error-text">{errors.description}</div>}
        </div>

        <div className="course-form-input-group">
          <div className="course-form-label">Professor*</div>
          <select
            className={`course-form-select ${errors.teacher_id ? 'course-form-input-error' : ''}`}
            value={formData.teacher_id}
            onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
          >
            <option value="">Select Professor</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
          {errors.teacher_id && <div className="course-form-error-text">{errors.teacher_id}</div>}
        </div>

        <div className="course-form-input-group">
          <div className="course-form-label">Schedule*</div>
          <input
            className={`course-form-input ${errors.schedule ? 'course-form-input-error' : ''}`}
            placeholder="15:00 - 16:30"
            value={formData.schedule}
            onChange={(e) => setFormData({...formData, schedule: e.target.value})}
          />
          {errors.schedule && <div className="course-form-error-text">{errors.schedule}</div>}
        </div>

        <div className="course-form-input-group">
          <div className="course-form-label">Day*</div>
          <select
            className={`course-form-select ${errors.day ? 'course-form-input-error' : ''}`}
            value={formData.day}
            onChange={(e) => setFormData({...formData, day: e.target.value})}
          >
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
          {errors.day && <div className="course-form-error-text">{errors.day}</div>}
        </div>

        <div className="course-form-input-group">
          <div className="course-form-label">Room*</div>
          <input
            className={`course-form-input ${errors.room ? 'course-form-input-error' : ''}`}
            placeholder="Room Number (12)"
            value={formData.room}
            onChange={(e) => setFormData({...formData, room: e.target.value})}
          />
          {errors.room && <div className="course-form-error-text">{errors.room}</div>}
        </div>

        <div className="course-form-input-group">
          <div className="course-form-label">Status</div>
          <div className="course-form-status-container">
            <button
              className={`course-form-status-button ${
                formData.status === 'Active' ? 'course-form-active-status-button' : ''
              }`}
              onClick={() => setFormData({...formData, status: 'Active'})}
            >
              <span className={`course-form-status-button-text ${
                formData.status === 'Active' ? 'course-form-active-status-button-text' : ''
              }`}>
                Active
              </span>
            </button>
            <button
              className={`course-form-status-button ${
                formData.status === 'Inactive' ? 'course-form-inactive-status-button' : ''
              }`}
              onClick={() => setFormData({...formData, status: 'Inactive'})}
            >
              <span className={`course-form-status-button-text ${
                formData.status === 'Inactive' ? 'course-form-inactive-status-button-text' : ''
              }`}>
                Inactive
              </span>
            </button>
          </div>
        </div>

        <div className="course-form-button-container">
          <button
            className="course-form-cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            <span className="course-form-cancel-button-text">Cancel</span>
          </button>
          <button
            className="course-form-submit-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className="course-form-activity-indicator" />
            ) : (
              <span className="course-form-submit-button-text">
                {course ? 'Update' : 'Create'}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseFormModal;