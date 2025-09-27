import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../services/axiosInstance';
import '../../../styles/TeacherFormModal.css';

const TeacherFormModal = ({ visible, onClose, teacher, refreshTeachers }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name || '',
        email: teacher.email || '',
        password: teacher.password || '',
        phone: teacher.phone || '',
        department: teacher.department || '',
        status: teacher.status || 'Active',
        user_id: teacher.user_id || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        department: '',
        status: 'Active'
      });
    }
    setErrors({});
  }, [teacher, visible]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (teacher) {
        await axiosInstance.put(`/teacher/${teacher.id}`, formData);
        toast.success("Teacher Updated");
      } else {
        await axiosInstance.post('/teacher', formData);
        toast.success("Teacher Created");
      }
      refreshTeachers();
      onClose();
    } catch (error) {
      console.error('Error saving teacher:', error);
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
    <div className="teacher-form-modal-overlay" onClick={onClose}>
      <div className="teacher-form-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="teacher-form-modal-title">
          {teacher ? 'Edit Teacher' : 'Add New Teacher'}
        </div>

        {errors.api && (
          <div className="teacher-form-error-text">{errors.api}</div>
        )}

        <div className="teacher-form-input-group">
          <div className="teacher-form-label">Full Name*</div>
          <input
            className={`teacher-form-input ${errors.name ? 'teacher-form-input-error' : ''}`}
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          {errors.name && <div className="teacher-form-error-text">{errors.name}</div>}
        </div>

        <div className="teacher-form-input-group">
          <div className="teacher-form-label">Email*</div>
          <input
            className={`teacher-form-input ${errors.email ? 'teacher-form-input-error' : ''}`}
            placeholder="teacher@university.edu"
            type="email"
            autoCapitalize="none"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          {errors.email && <div className="teacher-form-error-text">{errors.email}</div>}
        </div>

        <div className="teacher-form-input-group">
          <div className="teacher-form-label">Password*</div>
          <input
            className={`teacher-form-input ${errors.password ? 'teacher-form-input-error' : ''}`}
            placeholder="strong password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          {errors.password && <div className="teacher-form-error-text">{errors.password}</div>}
        </div>

        <div className="teacher-form-input-group">
          <div className="teacher-form-label">Phone*</div>
          <input
            className={`teacher-form-input ${errors.phone ? 'teacher-form-input-error' : ''}`}
            placeholder="+1234567890"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          {errors.phone && <div className="teacher-form-error-text">{errors.phone}</div>}
        </div>

        <div className="teacher-form-input-group">
          <div className="teacher-form-label">Department*</div>
          <input
            className={`teacher-form-input ${errors.department ? 'teacher-form-input-error' : ''}`}
            placeholder="Biology"
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
          />
          {errors.department && <div className="teacher-form-error-text">{errors.department}</div>}
        </div>

        <div className="teacher-form-input-group">
          <div className="teacher-form-label">Status</div>
          <div className="teacher-form-status-container">
            <button
              className={`teacher-form-status-button ${
                formData.status === 'Active' ? 'teacher-form-active-status-button' : ''
              }`}
              onClick={() => setFormData({...formData, status: 'Active'})}
            >
              <span className={`teacher-form-status-button-text ${
                formData.status === 'Active' ? 'teacher-form-active-status-button-text' : ''
              }`}>
                Active
              </span>
            </button>
            <button
              className={`teacher-form-status-button ${
                formData.status === 'Inactive' ? 'teacher-form-inactive-status-button' : ''
              }`}
              onClick={() => setFormData({...formData, status: 'Inactive'})}
            >
              <span className={`teacher-form-status-button-text ${
                formData.status === 'Inactive' ? 'teacher-form-inactive-status-button-text' : ''
              }`}>
                Inactive
              </span>
            </button>
          </div>
        </div>

        <div className="teacher-form-button-container">
          <button
            className="teacher-form-cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            <span className="teacher-form-cancel-button-text">Cancel</span>
          </button>
          <button
            className="teacher-form-submit-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className="teacher-form-activity-indicator" />
            ) : (
              <span className="teacher-form-submit-button-text">
                {teacher ? 'Update' : 'Create'}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherFormModal;