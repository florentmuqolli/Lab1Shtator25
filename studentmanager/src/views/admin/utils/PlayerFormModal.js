import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../services/axiosInstance';
import '../../../styles/CourseFormModal.css';

const PlayerFormModal = ({ visible, onClose, player, refreshPlayers }) => {
  const [formData, setFormData] = useState({
    TeamId: '',
    name: '',
    number: '',
    birthyear: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axiosInstance.get('/team'); 
        setTeams(res.data);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
        toast.error("Unable to load teams");
      }
    };

    if (visible) {
      fetchTeams();
    }

    if (player) {
      setFormData({
        TeamId: player.TeamId || '',
        name: player.name || '',
        number: player.number || '',
        birthyear: player.birthyear || ''
      });
    } else {
      setFormData({
        TeamId: '',
        name: '',
        number: '',
        birthyear: ''
      });
    }
    setErrors({});
  }, [player, visible]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (player) {
        console.log(formData);
        await axiosInstance.put(`/player/${player.PlayerId}`, formData);
        toast.success("Player Updated");
      } else {
        console.log(formData);
        await axiosInstance.post('/player', formData);
        toast.success("Player Created");
      }
      refreshPlayers();
      onClose();
    } catch (error) {
      console.error('Error saving player:', error);
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
          {player ? 'Edit Player' : 'Add New Player'}
        </div>

        {errors.api && (
          <div className="course-form-error-text">{errors.api}</div>
        )}

        <div className="course-form-input-group">
          <div className="course-form-label">Team*</div>
          <select
            className={`course-form-select ${errors.TeamId ? 'course-form-input-error' : ''}`}
            value={formData.TeamId}
            onChange={(e) => setFormData({...formData, TeamId: e.target.value})}
          >
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team.TeamId} value={team.TeamId}>
                {team.name}
              </option>
            ))}
          </select>
          {errors.TeamId && <div className="course-form-error-text">{errors.TeamId}</div>}
        </div>

        <div className="course-form-input-group">
          <div className="course-form-label">Name*</div>
          <input
            className={`course-form-input ${errors.name ? 'course-form-input-error' : ''}`}
            placeholder="Name Example"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          {errors.name && <div className="course-form-error-text">{errors.name}</div>}
        </div>

        <div className="course-form-input-group">
          <div className="course-form-label">Number*</div>
          <input
            className={`course-form-input ${errors.number ? 'course-form-input-error' : ''}`}
            placeholder="10"
            value={formData.number}
            onChange={(e) => setFormData({...formData, number: e.target.value})}
          />
          {errors.number && <div className="course-form-error-text">{errors.number}</div>}
        </div>

        <div className="course-form-input-group">
          <div className="course-form-label">Birthyear*</div>
          <input
            className={`course-form-input ${errors.birthyear ? 'course-form-input-error' : ''}`}
            placeholder="2000"
            value={formData.birthyear}
            onChange={(e) => setFormData({...formData, birthyear: e.target.value})}
          />
          {errors.birthyear && <div className="course-form-error-text">{errors.birthyear}</div>}
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
                {player ? 'Update' : 'Create'}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerFormModal;