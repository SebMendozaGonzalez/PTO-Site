import React, { useState } from 'react';
import { Dialog, DialogContent, Box, Avatar, TextField, Typography, Button, Divider, Snackbar, Alert } from '@mui/material';
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
    const [success, setSuccess] = useState(false); // State for success notification

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const renderLabel = (label, mandatory) => (
        <Typography component="span">
            {label}
            {mandatory && <Typography component="span" sx={{ color: 'red' }}>*</Typography>}
        </Typography>
    );

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
                setSuccess(true); // Show success notification
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

    return (
        <>
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
                            <TextField label={renderLabel('Full Name', false)} name="full_name" value={formData.full_name} onChange={handleChange} fullWidth />
                            <TextField
                                label={renderLabel('Date of Birth', false)}
                                name="date_of_birth"
                                type="date"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField label={renderLabel('Position', false)} name="position" value={formData.position} onChange={handleChange} fullWidth />

                            <TextField
                                label={renderLabel('Leader Email', true)}
                                name="leader_email"
                                value={formData.leader_email}
                                onChange={handleChange}
                                fullWidth
                                error={error && !formData.leader_email}
                            />
                            <TextField label={renderLabel('Company', false)} name="company" value={formData.company} onChange={handleChange} fullWidth />
                            <TextField label={renderLabel('Department', false)} name="department" value={formData.department} onChange={handleChange} fullWidth />
                            <TextField
                                label={renderLabel('Start Date', true)}
                                name="start_date"
                                type="date"
                                value={formData.start_date}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={error && !formData.start_date}
                            />
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
                            <TextField label={renderLabel('Email Quantum', false)} name="email_quantum" value={formData.email_quantum} onChange={handleChange} fullWidth />
                            <TextField
                                label={renderLabel('Phone Number', false)}
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField label={renderLabel('Home Address', false)} name="home_address" value={formData.home_address} onChange={handleChange} fullWidth />
                            <TextField
                                label={renderLabel('Emergency Contact', false)}
                                name="emergency_contact"
                                value={formData.emergency_contact}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label={renderLabel('Emergency Name', false)}
                                name="emergency_name"
                                value={formData.emergency_name}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label={renderLabel('Emergency Phone', false)}
                                name="emergency_phone"
                                value={formData.emergency_phone}
                                onChange={handleChange}
                                fullWidth
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
            <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
                <Alert severity="success" onClose={() => setSuccess(false)}>
                    Employee added successfully!
                </Alert>
            </Snackbar>
        </>
    );
}

export default EmployeeAddCard;
