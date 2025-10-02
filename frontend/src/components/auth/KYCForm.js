import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './KYCForm.css';

const KYCForm = () => {
  const [formData, setFormData] = useState({
    panNumber: ''
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if KYC already completed
  React.useEffect(() => {
    if (user && user.isKYCCompleted) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      // Validate file size (5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate PAN format
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.panNumber)) {
      setError('Please enter a valid PAN number (e.g., ABCDE1234F)');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('panNumber', formData.panNumber);
      if (file) {
        formDataToSend.append('idDocument', file);
      }

      const response = await api.post('/auth/kyc', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      updateUser(response.data.user);
      setSuccess('KYC completed successfully!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'KYC submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Complete Your KYC</h2>
        <p className="kyc-info">
          Please provide the following information to complete your account setup
        </p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="panNumber">PAN Number *</label>
            <input
              type="text"
              id="panNumber"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              required
              placeholder="ABCDE1234F"
              maxLength="10"
              style={{ textTransform: 'uppercase' }}
            />
            <small>Enter your 10-digit PAN number</small>
          </div>

          <div className="form-group">
            <label htmlFor="idDocument">Upload ID Document</label>
            <input
              type="file"
              id="idDocument"
              name="idDocument"
              onChange={handleFileChange}
              accept="image/*"
            />
            <small>Upload a clear image of your ID document (max 5MB)</small>
          </div>

          {file && (
            <div className="file-preview">
              <p>Selected file: {file.name}</p>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting KYC...' : 'Complete KYC'}
          </button>
        </form>

        <div className="kyc-note">
          <p><strong>Note:</strong> All information will be verified within 24-48 hours.</p>
        </div>
      </div>
    </div>
  );
};

export default KYCForm;