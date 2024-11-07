import React, { useState } from 'react';
import { Dialog, DialogContent, Box, Avatar, TextField, Typography, Button } from '@mui/material';
import { Divider } from '@mui/material';
import './EmployeeEditCard.css';

function EmployeeEditCard({ employee, onClose }) {
    
  const [formData, setFormData] = useState({
    employee_id: employee.employee_id || '', 
    email_surgical: employee.email_surgical || '',
    phone_number: employee.phone_number || '',
    home_address: employee.home_address || '',
    company: employee.company || '',
    department: employee.department || '',
    leader: employee.leader || '',
    emergency_contact: employee.emergency_contact || '',
    emergency_name: employee.emergency_name || '',
    emergency_phone: employee.emergency_phone || '',
  });

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission to update the employee's info
  const handleSubmit = async () => {
    try {
      const response = await fetch('/update-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // employee_id is included here
      });

      if (response.ok) {
        // Close the dialog after a successful update
        onClose();
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, marginBottom: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--secondary)' }}>
                Contact Info
              </Typography>
              <TextField
                label="Email"
                name="email_surgical"
                value={formData.email_surgical}
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
                label="Address"
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
                label="Leader"
                name="leader"
                value={formData.leader}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </Box>

          <Divider />

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
