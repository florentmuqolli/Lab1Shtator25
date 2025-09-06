import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../services/axiosInstance';
import '../../../styles/StudentFormModal.css';

const StudentFormModal = ({ visible, onClose, student, refreshStudents }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        password: student.password || '',
        phone: student.phone || '',
        address: student.address || '',
        status: student.status || 'Active',
        user_id: student.user_id || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        status: 'Active'
      });
    }
    setErrors({});
  }, [student, visible]);

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
      if (student) {
        await axiosInstance.put(`/students/${student.id}`, formData);
        toast.success("Student Updated");
      } else {
        await axiosInstance.post('/students', formData);
        console.log("formData: ",formData);
        toast.success("Student Created");
      }
      refreshStudents();
      onClose();
    } catch (error) {
      console.error('Error saving student:', error);
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
    <div className="student-form-modal-overlay" onClick={onClose}>
      <div className="student-form-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="student-form-modal-title">
          {student ? 'Edit Student' : 'Add New Student'}
        </div>

        {errors.api && (
          <div className="student-form-error-text">{errors.api}</div>
        )}

        <div className="student-form-input-group">
          <div className="student-form-label">Full Name*</div>
          <input
            className={`student-form-input ${errors.name ? 'student-form-input-error' : ''}`}
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          {errors.name && <div className="student-form-error-text">{errors.name}</div>}
        </div>

        <div className="student-form-input-group">
          <div className="student-form-label">Email*</div>
          <input
            className={`student-form-input ${errors.email ? 'student-form-input-error' : ''}`}
            placeholder="student@university.edu"
            type="email"
            autoCapitalize="none"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          {errors.email && <div className="student-form-error-text">{errors.email}</div>}
        </div>

        <div className="student-form-input-group">
          <div className="student-form-label">Password*</div>
          <input
            className={`student-form-input ${errors.password ? 'student-form-input-error' : ''}`}
            placeholder="strong password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          {errors.password && <div className="student-form-error-text">{errors.password}</div>}
        </div>

        <div className="student-form-input-group">
          <div className="student-form-label">Phone*</div>
          <input
            className={`student-form-input ${errors.phone ? 'student-form-input-error' : ''}`}
            placeholder="+1234567890"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          {errors.phone && <div className="student-form-error-text">{errors.phone}</div>}
        </div>

        <div className="student-form-input-group">
          <div className="student-form-label">Address*</div>
          <input
            className={`student-form-input ${errors.address ? 'student-form-input-error' : ''}`}
            placeholder="12 St. SM,12345"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
          {errors.address && <div className="student-form-error-text">{errors.address}</div>}
        </div>

        <div className="student-form-input-group">
          <div className="student-form-label">Status</div>
          <div className="student-form-status-container">
            <button
              className={`student-form-status-button ${
                formData.status === 'Active' ? 'student-form-active-status-button' : ''
              }`}
              onClick={() => setFormData({...formData, status: 'Active'})}
            >
              <span className={`student-form-status-button-text ${
                formData.status === 'Active' ? 'student-form-active-status-button-text' : ''
              }`}>
                Active
              </span>
            </button>
            <button
              className={`student-form-status-button ${
                formData.status === 'Inactive' ? 'student-form-inactive-status-button' : ''
              }`}
              onClick={() => setFormData({...formData, status: 'Inactive'})}
            >
              <span className={`student-form-status-button-text ${
                formData.status === 'Inactive' ? 'student-form-inactive-status-button-text' : ''
              }`}>
                Inactive
              </span>
            </button>
          </div>
        </div>

        <div className="student-form-button-container">
          <button
            className="student-form-cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            <span className="student-form-cancel-button-text">Cancel</span>
          </button>
          <button
            className="student-form-submit-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className="student-form-activity-indicator" />
            ) : (
              <span className="student-form-submit-button-text">
                {student ? 'Update' : 'Create'}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentFormModal;