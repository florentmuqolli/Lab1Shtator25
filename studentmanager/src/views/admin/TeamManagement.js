import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance'; 
import ScreenWrapper from '../../hooks/ScreenWrapper';
import { SearchIcon, EditIcon, DeleteIcon, BackArrowIcon, AddIcon } from '../../assets/Icons';
import { toast } from 'react-toastify';
import TeamFormModal from './utils/TeamFormModal';
import '../../styles/CourseManagement.css';

const TeamManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/team'); 
      setLoading(false);
      setTeams(res.data);
    } catch (err) {
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchTeams();
  }, []);

  const filteredCourses = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteTeam = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/team/${id}`);
      toast.success("Team Deleted");
      setTimeout(() => {
        setLoading(false);
        setTeams(teams.filter(team => team.TeamId !== id));
      }, 1000);
    } catch (err) {
      console.error('Error deleting team:', err);
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
          <div className="course-title">Team Management</div>
          <div style={{ width: '24px' }} />
        </div>
        <div className="course-actionBar">
          <div className="course-searchContainer">
            <SearchIcon/>
            <input
              className="course-searchInput"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholderTextColor="#999"
            />
          </div>
          <button 
            className="course-addButton"
            onClick={() => {
              setSelectedTeam(null);
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
            filteredCourses.map((team) => (
              <div key={team.TeamId} className="course-card">
                <div className="course-cardHeader">
                  <div className="course-cardName">Title: {team.name}</div>
                  <div className="course-cardName">ID: {team.TeamId}</div>
                </div>
                <div className="course-cardActions">
                  <button
                    className="course-cardButton"
                    onClick={() => {
                      setSelectedTeam(team);
                      setModalVisible(true);
                    }}
                  >
                    <EditIcon size={16} />
                    <span className="course-cardButtonText">Edit</span>
                  </button>
                  <button
                    className="course-cardButton course-deleteButton"
                    onClick={() => deleteTeam(team.TeamId)}
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
              <h3 className="course-empty-title">No Teams Found</h3>
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
                  <span>Add First Team</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <TeamFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        team={selectedTeam}
        refreshTeams={fetchTeams}
      />
    </ScreenWrapper>
  );
};


export default TeamManagement;