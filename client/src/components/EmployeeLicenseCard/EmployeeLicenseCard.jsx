import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, Box, TextField, Typography, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Divider } from '@mui/material';

function EmployeeLicenseCard({ employeeId, onClose }) {
    // Initialize state
    const [formData, setFormData] = useState({
        employee_id: employeeId || '', // Set the initial value directly
        start_date: '',
        end_date: '',
        explanation: '',
        documentation: '',
        type: '',
    });

    // Ensure the employee_id updates correctly if the prop changes
    useEffect(() => {
        if (employeeId && employeeId !== formData.employee_id) {
            setFormData((prev) => ({
                ...prev,
                employee_id: employeeId,
            }));
        }
    }, [employeeId, formData.employee_id]); // Dependency includes both employeeId and formData.employee_id

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.start_date || !formData.end_date || !formData.type) {
            alert('Please fill in all mandatory fields.');
            return;
        }

        try {
            // Step 1: Submit license request
            const requestResponse = await fetch('/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    is_exception: false,
                }),
            });

            if (!requestResponse.ok) throw new Error('Failed to submit license request');
            const newRequest = await requestResponse.json();

            // Step 2: Automatically accept the license
            const decideResponse = await fetch('/decide-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    request_id: newRequest.request_id,
                    accepted: 'true',
                }),
            });

            if (!decideResponse.ok) throw new Error('Failed to accept the license');

            alert('License successfully created and accepted!');
            onClose();
        } catch (error) {
            console.error('Error submitting license:', error);
            alert('An error occurred while processing the license request.');
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
                    <Typography variant="h5" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--primary)' }}>
                        Document Employee License
                    </Typography>

                    <Divider />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Employee ID"
                            name="employee_id"
                            value={formData.employee_id}
                            fullWidth
                            disabled // Greyed out to prevent editing
                        />
                        <TextField
                            label="Start Date"
                            name="start_date"
                            type="date"
                            value={formData.start_date}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <TextField
                            label="End Date"
                            name="end_date"
                            type="date"
                            value={formData.end_date}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <TextField
                            label="Explanation"
                            name="explanation"
                            value={formData.explanation}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                        />
                        <TextField
                            label="Documentation"
                            name="documentation"
                            value={formData.documentation}
                            fullWidth
                            disabled
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Type</InputLabel>
                            <Select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <MenuItem value="Maternity License">Maternity License</MenuItem>
                                <MenuItem value="Paternity License">Paternity License</MenuItem>
                                <MenuItem value="Domestic Calamity License">Domestic Calamity License</MenuItem>
                                <MenuItem value="Bereavement License">Bereavement License</MenuItem>
                                <MenuItem value="Inability">Inability</MenuItem>
                            </Select>
                        </FormControl>
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

export default EmployeeLicenseCard;
