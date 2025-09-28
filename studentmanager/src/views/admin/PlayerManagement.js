import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance'; 
import ScreenWrapper from '../../hooks/ScreenWrapper';
import { SearchIcon, EditIcon, DeleteIcon, BackArrowIcon, AddIcon } from '../../assets/Icons';
import { toast } from 'react-toastify';
import PlayerFormModal from './utils/PlayerFormModal';
import '../../styles/CourseManagement.css';

const PlayerManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/player'); 
      setLoading(false);
      setPlayers(res.data);
    } catch (err) {
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.number.includes(searchQuery)
  );

  const deletePLayer = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/player/${id}`);
      toast.success("PLayer Deleted");
      setTimeout(() => {
        setLoading(false);
        setPlayers(players.filter(player => player.PlayerId !== id));
      }, 1000);
    } catch (err) {
      console.error('Error deleting player:', err);
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
          <div className="course-title">Player Management</div>
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
              setSelectedPlayer(null);
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
          ) : filteredPlayers.length > 0 ? (
            filteredPlayers.map((player) => (
              <div key={player.PlayerId} className="course-card">
                <div className="course-cardHeader">
                  <div className="course-cardName">Player: {player.PlayerId}</div>
                  <div className="course-cardName">Team: {player.TeamId}</div>
                  <div className="course-cardName">Name: {player.name}</div>
                  <div className="course-cardName">Number: {player.number}</div>
                  <div className="course-cardName">Birthyear: {player.birthyear}</div>
                </div>
                <div className="course-cardActions">
                  <button
                    className="course-cardButton"
                    onClick={() => {
                      setSelectedPlayer(player);
                      setModalVisible(true);
                    }}
                  >
                    <EditIcon size={16} />
                    <span className="course-cardButtonText">Edit</span>
                  </button>
                  <button
                    className="course-cardButton course-deleteButton"
                    onClick={() => deletePLayer(player.PlayerId)}
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
              <h3 className="course-empty-title">No Players Found</h3>
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
                  <span>Add First Player</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <PlayerFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        player={selectedPlayer}
        refreshPlayers={fetchPlayers}
      />
    </ScreenWrapper>
  );
};


export default PlayerManagement;