import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../services/axiosInstance';
import '../../../styles/TeacherAssignments.css';

const AssignmentFormModal = ({ visible, onClose, assignment, refreshAssignments }) => {
  const [formData, setFormData] = useState({
    class_id: '',
    title: '',
    description: '',
    due_date: '',
    points: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [classes, setClasses] = useState([]);
  const isEditing = !!assignment;

  useEffect(() => {
    if (assignment) {
      const formattedDueDate = assignment.due_date ? new Date(assignment.due_date).toISOString().slice(0, 16) : '';
      
      setFormData({
        class_id: assignment.class_id || '',
        title: assignment.title || '',
        description: assignment.description || '',
        due_date: formattedDueDate,
        points: assignment.points || ''
      });
    } else {
      setFormData({
        class_id: '',
        title: '',
        description: '',
        due_date: '',
        points: ''
      });
    }
    setErrors({});
  }, [assignment, visible]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axiosInstance.get('/class/specific-class');
        
        if (Array.isArray(response.data)) {
          setClasses(response.data);
        } else {
          console.error('API did not return a list of classes as expected:', response.data);
          toast.error('Error: Class list is corrupted or empty.');
        }
      } catch (error) {
        console.error('Error fetching classes:', error.response || error.message);
        toast.error('Failed to load available courses. Check network connection and API endpoint.');
      }
    };

    if (visible) {
      fetchClasses();
    }
  }, [visible]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.class_id) newErrors.class_id = 'Course selection is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.due_date) newErrors.due_date = 'Due date is required';
    if (!formData.points || Number(formData.points) <= 0) newErrors.points = 'Valid points (must be greater than 0) are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isEditing) {
        await axiosInstance.put(`/assignments/${assignment.id}`, formData);
        toast.success('Assignment updated successfully! 🎉');
      } else {
        await axiosInstance.post('/assignments', formData);
        toast.success('Assignment created successfully! 🚀');
      }
      refreshAssignments();
      onClose();
    } catch (error) {
      console.error('Error saving assignment:', error);
      const message = error.response?.data?.message || error.message || "An unexpected error occurred while saving the assignment.";
      
      if (error.response?.data?.errors) {
        setErrors(prev => ({ ...prev, ...error.response.data.errors }));
        toast.error('Please fix the errors in the form.');
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <Modal show={visible} onHide={onClose} centered size="lg" className="modern-modal">
      <div className="modal-header-gradient">
        <div className="modal-header-content">
          <div className="modal-title-section">
            <div className="modal-icon">
              {isEditing ? '✏️' : '➕'}
            </div>
            <div>
              <h3>{isEditing ? 'Edit Assignment' : 'Create New Assignment'}</h3>
              <p>{isEditing ? 'Update assignment details' : 'Set up a new assignment for your students'}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
      </div>
      
      <div className="modal-body-custom">
        {errors.api && (
          <div className="error-alert">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <h4>Submission Error</h4>
              <p>{errors.api}</p>
            </div>
          </div>
        )}

        <div className="form-container">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📚</span>
                Course <span className="required">*</span>
              </label>
              <select
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                disabled={loading}
                className={`form-select ${errors.class_id ? 'error' : ''}`}
              >
                <option value="">Select a course</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.title} (ID: {cls.id})
                  </option>
                ))}
              </select>
              {errors.class_id && <span className="error-message">{errors.class_id}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">⭐</span>
                Max Points <span className="required">*</span>
              </label>
              <input
                type="number"
                name="points"
                placeholder="e.g., 100"
                value={formData.points}
                onChange={handleChange}
                min="1"
                disabled={loading}
                className={`form-input ${errors.points ? 'error' : ''}`}
              />
              {errors.points && <span className="error-message">{errors.points}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📝</span>
              Assignment Title <span className="required">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter a descriptive title (e.g., Chapter 5 Quiz, Final Project Proposal)"
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
              className={`form-input ${errors.title ? 'error' : ''}`}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📄</span>
              Description & Instructions <span className="required">*</span>
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="Provide detailed instructions, rubrics, and expectations for the assignment."
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">⏰</span>
              Due Date and Time <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              disabled={loading}
              className={`form-input ${errors.due_date ? 'error' : ''}`}
            />
            {errors.due_date && <span className="error-message">{errors.due_date}</span>}
          </div>
          
          <div className="form-footer">
            <p className="form-note">
              <span className="note-icon">ℹ️</span>
              Fields marked with <span className="required">*</span> are required
            </p>
          </div>
        </div>
      </div>

      <div className="modal-footer-custom">
        <button 
          className="modal-btn secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          className={`modal-btn primary ${isEditing ? 'warning' : ''}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="loading-spinner-small"></div>
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <span className="btn-icon">
                {isEditing ? '💾' : '🚀'}
              </span>
              {isEditing ? 'Update Assignment' : 'Create Assignment'}
            </>
          )}
        </button>
      </div>
    </Modal>
  );
};

export default AssignmentFormModal;