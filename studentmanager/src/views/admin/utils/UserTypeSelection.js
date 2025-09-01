import React from 'react';
import '../../../styles/UserTypeSelection.css';

const UserTypeSelectionModal = ({ visible, onClose, navigation }) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Manage Users</div>
        <div className="modal-subtitle">Select user type to manage</div>
        
        <button 
          className="option-button"
          onClick={() => {
            onClose();
            navigation.navigate('StudentManagement');
          }}
        >
          Students
        </button>
        
        <button 
          className="option-button"
          onClick={() => {
            onClose();
            navigation.navigate('TeacherManagement');
          }}
        >
          Professors
        </button>
        
        <button 
          className="cancel-button"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UserTypeSelectionModal;
