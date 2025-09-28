import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../services/axiosInstance';
import '../../../styles/CourseFormModal.css';

const TeamFormModal = ({ visible, onClose, team, refreshTeams }) => {
  const [formData, setFormData] = useState({
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || ''
      });
    } else {
      setFormData({
        name: ''
      });
    }
    setErrors({});
  }, [team, visible]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (team) {
        await axiosInstance.put(`/team/${team.TeamId}`, formData);
        toast.success("Team Updated");
      } else {
        await axiosInstance.post('/team', formData);
        toast.success("Team Created");
      }
      refreshTeams();
      onClose();
    } catch (error) {
      console.error('Error saving team:', error);
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
          {team ? 'Edit Team' : 'Add New Team'}
        </div>

        {errors.api && (
          <div className="course-form-error-text">{errors.api}</div>
        )}

        <div className="course-form-input-group">
          <div className="course-form-label">Name*</div>
          <input
            className={`course-form-input ${errors.name ? 'course-form-input-error' : ''}`}
            placeholder="Title Example"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          {errors.name && <div className="course-form-error-text">{errors.name}</div>}
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
                {team ? 'Update' : 'Create'}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamFormModal;