
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
  Chip,
  Grid,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const RescueAdoptions = () => {
  const { auth } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const removeApplication = async (id) => {
    if (!window.confirm('Are you sure you want to remove this adoption request?')) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/rescue/rescue-adoptions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      if (!res.ok) throw new Error('Failed to remove application');
      setApplications(prev => prev.filter(app => app._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      if (!auth.token) return;
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:5000/api/rescue/rescue-adoptions', {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        if (!res.ok) throw new Error('Failed to load applications');
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [auth.token]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
  const res = await fetch(`http://localhost:5000/api/rescue/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updatedApp = await res.json();
      setApplications(prev => prev.map(app => (app._id === id ? updatedApp : app)));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!auth.token || auth.user.role !== 'Rescue') {
    return <div>Access denied. Only rescue centers can view this page.</div>;
  }

  if (loading) return <div>Loading applications...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (applications.length === 0) return <div>No adoption applications yet.</div>;

  return (
    <Box sx={{ maxWidth: 900, margin: '2rem auto', padding: '1rem' }}>
      <Typography variant="h4" gutterBottom>Adoption Applications</Typography>
      {applications.map(app => (
        <Accordion key={app._id} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1"><b>Cat:</b> {app.cat?.name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1"><b>Applicant:</b> {app.fullName || app.user?.name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Chip label={app.status} color={app.status === 'Approved' ? 'success' : app.status === 'Rejected' ? 'error' : 'warning'} />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={e => { e.stopPropagation(); updateStatus(app._id, 'Approved'); }}
                  disabled={updatingId === app._id || app.status === 'Approved'}
                  sx={{ mr: 1 }}
                >Approve</Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={e => { e.stopPropagation(); updateStatus(app._id, 'Rejected'); }}
                  disabled={updatingId === app._id || app.status === 'Rejected'}
                  sx={{ mr: 1 }}
                >Reject</Button>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={e => { e.stopPropagation(); removeApplication(app._id); }}
                  disabled={updatingId === app._id}
                >Remove</Button>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Contact Info</Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography><b>Email:</b> {app.email || app.user?.email || 'N/A'}</Typography>
                <Typography><b>Phone:</b> {app.phone || 'N/A'}</Typography>
                <Typography><b>Address:</b> {app.address || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Home & Family</Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography><b>Home Type:</b> {app.homeType || 'N/A'}</Typography>
                <Typography><b>Rent/Own:</b> {app.rentOwn || 'N/A'}</Typography>
                <Typography><b>Household Members:</b> {app.householdMembers || 'N/A'}</Typography>
                <Typography><b>Existing Pets:</b> {app.existingPets || 'N/A'}</Typography>
                <Typography><b>Smoking Home:</b> {app.smokingHome ? 'Yes' : 'No'}</Typography>
                <Typography><b>Outdoor Space:</b> {app.outdoorSpace ? 'Yes' : 'No'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Pet Experience</Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography><b>Pet Experience:</b> {app.petExperience || 'N/A'}</Typography>
                <Typography><b>Work Schedule:</b> {app.workSchedule || 'N/A'}</Typography>
                <Typography><b>Pet Care Responsible:</b> {app.petCareResponsible || 'N/A'}</Typography>
                <Typography><b>Willing for Vet Care:</b> {app.willingVetCare ? 'Yes' : 'No'}</Typography>
                <Typography><b>Surrendered Pet Before:</b> {app.surrenderedPetBefore || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Other Details</Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography><b>Reason Adopting:</b> {app.reasonAdopting || 'N/A'}</Typography>
                <Typography><b>Allergies:</b> {app.allergies || 'N/A'}</Typography>
                <Typography><b>Home Environment:</b> {app.homeEnvironment || 'N/A'}</Typography>
                <Typography><b>Additional Details:</b> {app.additionalDetails || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default RescueAdoptions;
