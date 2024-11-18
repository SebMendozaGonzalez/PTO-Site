import React, { useState } from 'react';
import { Dialog, DialogContent, Box, Avatar, TextField, Typography, Button, Divider } from '@mui/material';
import './EmployeeAddCard.css';

function EmployeeAddCard({ onClose }) {
    const [formData, setFormData] = useState({
        employee_id: '',
        name: '',
        full_name: '',
        date_of_birth: '',
        position: '', // Optional
        leader_email: '',
        company: '',
        email_surgical: '',
        email_quantum: '',
        home_address: '',
        phone_number: '',
        emergency_contact: '',
        emergency_name: '',
        emergency_phone: '',
        department: '',
        start_date: '',
    });

    const [error, setError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const mandatoryFields = [
            'employee_id',
            'name',
            'leader_email',
            'email_surgical',
            'start_date',
        ];

        // Check for missing mandatory fields
        const missingFields = mandatoryFields.filter((field) => !formData[field]);
        if (missingFields.length > 0) {
            setError(true);
            alert(`Please fill in all mandatory fields: ${missingFields.join(', ')}`);
            return;
        }

        try {
            const response = await fetch('/add-employee', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Employee added successfully.');
                onClose();
            } else {
                const errorMessage = await response.json();
                console.error('Failed to add employee:', errorMessage.message);
                alert(errorMessage.message || 'An error occurred while adding the employee.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred.');
        }
    };

    const renderLabel = (label, mandatory) => (
        <Typography component="span">
            {label}
            {mandatory && <Typography component="span" sx={{ color: 'red' }}>*</Typography>}
        </Typography>
    );

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
                                New Employee
                            </Typography>
                        </Box>
                    </Box>

                    <Divider />

                    {/* Basic Info */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--secondary)' }}>
                            Basic Info
                        </Typography>
                        <TextField
                            label={renderLabel('Employee ID', true)}
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleChange}
                            fullWidth
                            error={error && !formData.employee_id}
                        />
                        <TextField
                            label={renderLabel('Name', true)}
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            error={error && !formData.name}
                        />
                        <TextField label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} fullWidth />
                        <TextField
                            label="Date of Birth"
                            name="date_of_birth"
                            type="date"
                            value={formData.date_of_birth}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField label="Position" name="position" value={formData.position} onChange={handleChange} fullWidth />
                        
                        <TextField
                            label={renderLabel('Leader Email', true)}
                            name="leader_email"
                            value={formData.leader_email}
                            onChange={handleChange}
                            fullWidth
                            error={error && !formData.leader_email}
                        />
                        <TextField label="Company" name="company" value={formData.company} onChange={handleChange} fullWidth />
                    </Box>

                    <Divider />

                    {/* Contact Info */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--secondary)' }}>
                            Contact Info
                        </Typography>
                        <TextField
                            label={renderLabel('Email Surgical', true)}
                            name="email_surgical"
                            value={formData.email_surgical}
                            onChange={handleChange}
                            fullWidth
                            error={error && !formData.email_surgical}
                        />
                        <TextField label="Email Quantum" name="email_quantum" value={formData.email_quantum} onChange={handleChange} fullWidth />
                        <TextField
                            label="Phone Number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            fullWidth
                            error={error && !formData.phone_number}
                        />
                        <TextField label="Home Address" name="home_address" value={formData.home_address} onChange={handleChange} fullWidth />
                        <TextField
                            label="Emergency Contact"
                            name="emergency_contact"
                            value={formData.emergency_contact}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Emergency Name"
                            name="emergency_name"
                            value={formData.emergency_name}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Emergency Phone"
                            name="emergency_phone"
                            value={formData.emergency_phone}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            fullWidth
                            error={error && !formData.department}
                        />
                        <TextField
                            label="Start Date"
                            name="start_date"
                            type="date"
                            value={formData.start_date}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            error={error && !formData.start_date}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Add Employee
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

export default EmployeeAddCard;
