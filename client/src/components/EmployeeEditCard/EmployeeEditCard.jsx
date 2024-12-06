import React, { useState } from 'react';
import { Dialog, DialogContent, Box, Avatar, TextField, Typography, Button, Divider, Alert } from '@mui/material';
import './EmployeeEditCard.css';

function EmployeeEditCard({ employee, onClose }) {
  const [formData, setFormData] = useState({
    employee_id: employee.employee_id ?? '',
    name: employee.name ?? '',
    full_name: employee.full_name ?? '',
    date_of_birth: employee.date_of_birth ?? '',
    position: employee.position ?? '',
    email_surgical: employee.email_surgical ?? '',
    email_quantum: employee.email_quantum ?? '',
    phone_number: employee.phone_number ?? '',
    home_address: employee.home_address ?? '',
    company: employee.company ?? '',
    department: employee.department ?? '',
    start_date: employee.start_date ?? '',
    leader: employee.leader ?? '',
    leader_email: employee.leader_email ?? '',
    leader_id: employee.leader_id ?? '',
    emergency_contact: employee.emergency_contact ?? '',
    emergency_name: employee.emergency_name ?? '',
    emergency_phone: employee.emergency_phone ?? '',
  });
  const [showSuccess, setShowSuccess] = useState(false); // State for success notification

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name && value !== undefined) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  // Handle form submission to update the employee's info
  const handleSubmit = async () => {
    const payload = Object.keys(formData).reduce((acc, key) => {
      acc[key] = formData[key] || employee[key];
      return acc;
    }, {});

    try {
      const response = await fetch('/update-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 3000);
      } else {
        console.error('Failed to update employee data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <Dialog open={true} onClose={onClose} fullWidth>
      <DialogContent>
        <Box
          sx={{
            width: '100%',
            bgcolor: '#f8f9fe',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            padding: 2,
          }}
        >
          {showSuccess && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              Employee data successfully updated!
            </Alert>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
            <Avatar
              alt={formData.name}
              src={`/employee-photos/${formData.employee_id}.jpeg`}
              sx={{ width: 100, height: 100 }}
            />
            <Box>
              <Typography variant="h5" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--primary)' }}>
                {formData.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontFamily: 'Poppins', fontWeight: 400 }}>
                {formData.employee_id}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Basic Info */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--secondary)' }}>
                Basic Info
              </Typography>
              <TextField
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                fullWidth
              />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--secondary)' }}>
                Leader Info
              </Typography>
              <TextField
                label="Leader"
                name="leader"
                value={formData.leader}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Leader Email"
                name="leader_email"
                value={formData.leader_email}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Leader ID"
                name="leader_id"
                value={formData.leader_id}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </Box>

          <Divider />

          {/* Contact Info */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--secondary)' }}>
                Contact Info
              </Typography>
              <TextField
                label="Email Surgical"
                name="email_surgical"
                value={formData.email_surgical}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Email Quantum"
                name="email_quantum"
                value={formData.email_quantum}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Phone"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Home Address"
                name="home_address"
                value={formData.home_address}
                onChange={handleChange}
                fullWidth
              />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--secondary)' }}>
                Company Info
              </Typography>
              <TextField
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Start Date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
          </Box>

          <Divider />

          {/* Emergency Contact */}
          <Box>
            <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--secondary)' }}>
              Emergency Contact
            </Typography>
            <TextField
              label="Contact"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Name"
              name="emergency_name"
              value={formData.emergency_name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Phone"
              name="emergency_phone"
              value={formData.emergency_phone}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default EmployeeEditCard;

