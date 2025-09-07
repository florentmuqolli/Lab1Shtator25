import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../services/axiosInstance';
import '../../../styles/EnrollmentFormModal.css';

const EnrollmentFormModal = ({ visible, onClose, enrollment, refreshEnrollments }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    class_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      student_id: '',
      class_id: ''
    });
    setErrors({});
  }, [enrollment, visible]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/enrollment', formData);
      toast.success("Enrollment Created");
      refreshEnrollments();
      onClose();
    } catch (error) {
      console.error('Error saving enrollment:', error);
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
    <div className="enrollment-form-modal-overlay" onClick={onClose}>
      <div className="enrollment-form-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="enrollment-form-modal-title">
          {'Add New Enrollment'}
        </div>

        {errors.api && (
          <div className="enrollment-form-error-text">{errors.api}</div>
        )}

        <div className="enrollment-form-input-group">
          <div className="enrollment-form-label">Student ID*</div>
          <input
            className={`enrollment-form-input ${errors.student_id ? 'enrollment-form-input-error' : ''}`}
            placeholder="eg. 13"
            type="number"
            value={formData.student_id}
            onChange={(e) => setFormData({...formData, student_id: e.target.value})}
          />
          {errors.student_id && <div className="enrollment-form-error-text">{errors.student_id}</div>}
        </div>

        <div className="enrollment-form-input-group">
          <div className="enrollment-form-label">Course ID*</div>
          <input
            className={`enrollment-form-input ${errors.class_id ? 'enrollment-form-input-error' : ''}`}
            placeholder="eg. 12"
            type="number"
            value={formData.class_id}
            onChange={(e) => setFormData({...formData, class_id: e.target.value})}
          />
          {errors.class_id && <div className="enrollment-form-error-text">{errors.class_id}</div>}
        </div>

        <div className="enrollment-form-button-container">
          <button
            className="enrollment-form-cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            <span className="enrollment-form-cancel-button-text">Cancel</span>
          </button>
          <button
            className="enrollment-form-submit-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className="enrollment-form-activity-indicator" />
            ) : (
              <span className="enrollment-form-submit-button-text">
                {'Create'}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentFormModal;