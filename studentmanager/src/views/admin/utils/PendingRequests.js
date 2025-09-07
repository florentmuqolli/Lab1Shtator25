import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackArrowIcon } from '../../../assets/Icons';
import axiosInstance from '../../../services/axiosInstance';
import { toast } from 'react-toastify';
import ScreenWrapper from '../../../hooks/ScreenWrapper';
import '../../../styles/AdminPendingRequests.css';

const AdminPendingRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/pending-requests');
      setRequests(res.data);
    } catch {
      toast.error('Error fetching requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axiosInstance.post(`/admin/approve-request/${id}`);
      await fetchRequests();
      toast.success('Request approved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error');
    }
  };

  const handleDeny = async (id) => {
    try {
      await axiosInstance.delete(`/admin/deny-request/${id}`);
      await fetchRequests();
      toast.success('Request denied');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error');
    }
  };

  const confirmAction = (action, id) => {
    if (window.confirm(`Are you sure you want to ${action} this request?`)) {
      action === 'approve' ? handleApprove(id) : handleDeny(id);
    }
  };

  const filtered = filter === 'all'
    ? requests
    : requests.filter(r => r.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return { bg: '#E3F9E5', text: '#00B894', avatarBg: '#00B894' };
      case 'denied': return { bg: '#FFEBEE', text: '#D63031', avatarBg: '#D63031' };
      default: return { bg: '#FFF8E1', text: '#FDCB6E', avatarBg: '#FDCB6E' };
    }
  };

  if (loading) {
    return (
      <div className="admin-requests-loadingContainer">
        <div className="admin-requests-activityIndicator" />
      </div>
    );
  }

  return (
    <ScreenWrapper>
      <div className="admin-requests-container">
        <div className="admin-requests-header">
          <button onClick={() => navigate(-1)} className="admin-requests-backButton">
            <BackArrowIcon/>
          </button>
          <div className="admin-requests-title">Requests Management</div>
          <div style={{ width: '24px' }} />
        </div>
        <div className="admin-requests-filterContainer">
          {['all', 'pending', 'approved', 'denied'].map(f => (
            <button
              key={f}
              className={`admin-requests-filterButton ${filter === f ? 'admin-requests-activeFilter' : ''}`}
              onClick={() => setFilter(f)}
            >
              <span className={`admin-requests-filterText ${filter === f ? 'admin-requests-activeFilterText' : ''}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </span>
            </button>
          ))}
        </div>

        <div className="admin-requests-listContent">
          {filtered.length > 0 ? (
            filtered.map((item, index) => {
              const statusColors = getStatusColor(item.status);
              return (
                <div key={item._id} className="admin-requests-card">
                  <div className="admin-requests-cardHeader">
                    <div className="admin-requests-userInfo">
                      <div 
                        className="admin-requests-avatar" 
                        style={{ backgroundColor: statusColors.avatarBg }}
                      >
                        <span className="admin-requests-avatarIcon">
                          {item.role === 'professor' ? '🏫' : '👤'}
                        </span>
                      </div>
                      <div>
                        <div className="admin-requests-name">{item.name}</div>
                        <div className="admin-requests-role">{item.role}</div>
                      </div>
                    </div>
                    <div 
                      className="admin-requests-statusBadge"
                      style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
                    >
                      {item.status}
                    </div>
                  </div>

                  <div className="admin-requests-cardBody">
                    <div className="admin-requests-infoRow">
                      <span className="admin-requests-icon">📧</span>
                      <span className="admin-requests-email">{item.email}</span>
                    </div>
                    <div className="admin-requests-infoRow">
                      <span className="admin-requests-icon">📅</span>
                      <span className="admin-requests-date">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {item.status === 'pending' && (
                    <div className="admin-requests-actions">
                      <button
                        className="admin-requests-button admin-requests-approveButton"
                        onClick={() => confirmAction('approve', item._id)}
                      >
                        <span className="admin-requests-buttonIcon">✓</span>
                        <span className="admin-requests-buttonText">Approve</span>
                      </button>
                      <button
                        className="admin-requests-button admin-requests-denyButton"
                        onClick={() => confirmAction('deny', item._id)}
                      >
                        <span className="admin-requests-buttonIcon">✗</span>
                        <span className="admin-requests-buttonText">Deny</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="admin-requests-emptyState">
              <div className="admin-requests-emptyIcon">📭</div>
              <div className="admin-requests-emptyText">No requests found</div>
            </div>
          )}
        </div>
      </div>
    </ScreenWrapper>
  );
};

export default AdminPendingRequests;