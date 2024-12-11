import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { Avatar, Typography } from '@mui/material';
import './EmployeeProfile.css';

function EmployeeProfile({ selectedEmployee }) {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { timeZone: 'UTC' });
    };
    return (
        <div>
            <Box
                sx={{
                    width: '100%',
                    bgcolor: '#f8f9fe',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
                className="paddings"
            >
                {/* Header Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                    <Avatar
                        alt={selectedEmployee.name}
                        src={`/employee-photos/${selectedEmployee.employee_id}.jpeg`}
                        sx={{ width: 100, height: 100 }}
                    />
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: 'Poppins',
                                fontWeight: 700,
                                color: 'var(--primary)',
                            }}
                        >
                            {selectedEmployee.name}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            sx={{
                                fontFamily: 'Poppins',
                                fontWeight: 400,
                            }}
                        >
                            {selectedEmployee.employee_id}
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                {/* Basic Information */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, marginBottom: 2 }}>
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'Poppins',
                                fontWeight: 700,
                                color: 'var(--secondary)',
                            }}
                        >
                            Basic Info
                        </Typography>
                        <Typography>
                            <strong className="fonts-primary">Date of Birth:</strong>{' '}
                            {formatDate(selectedEmployee.date_of_birth)}
                        </Typography>
                        <Typography>
                            <strong className="fonts-primary">Start Date:</strong>{' '}
                            {formatDate(selectedEmployee.start_date)}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'Poppins',
                                fontWeight: 700,
                                color: 'var(--secondary)',
                            }}
                        >
                            Leader Info
                        </Typography>
                        <Typography>
                            <strong className="fonts-primary">Leader:</strong> {selectedEmployee.leader}
                        </Typography>
                        <Typography>
                            <strong className="fonts-primary">Leader Email:</strong>{' '}
                            {selectedEmployee.leader_email}
                        </Typography>
                        <Typography>
                            <strong className="fonts-primary">Leader ID:</strong> {selectedEmployee.leader_id}
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                {/* Contact Information */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, marginBottom: 2 }}>
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'Poppins',
                                fontWeight: 700,
                                color: 'var(--secondary)',
                            }}
                        >
                            Contact Info
                        </Typography>
                        <Typography>
                            <strong className="fonts-primary">Email Surgical:</strong>{' '}
                            {selectedEmployee.email_surgical}
                        </Typography>
                        <Typography>
                            <strong className="fonts-primary">Email Quantum:</strong>{' '}
                            {selectedEmployee.email_quantum}
                        </Typography>
                        <Typography>
                            <strong className="fonts-primary">Phone:</strong> {selectedEmployee.phone_number}
                        </Typography>
                        <Typography>
                            <strong className="fonts-primary">Home Address:</strong>{' '}
                            {selectedEmployee.home_address}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'Poppins',
                                fontWeight: 700,
                                color: 'var(--secondary)',
                            }}
                        >
                            Company Info
                        </Typography>
                        <Typography>
                            <strong className="fonts-primary">Company:</strong> {selectedEmployee.company}
                        </Typography>
                        <Typography>
                            <strong className="fonts-primary">Department:</strong> {selectedEmployee.department}
                        </Typography>
                        <Typography>
                            <strong className="fonts-primary">Position:</strong> {selectedEmployee.position}
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                {/* Emergency Contact */}
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 700,
                            color: 'var(--secondary)',
                        }}
                    >
                        Emergency Info
                    </Typography>
                    <Typography>
                        <strong className="fonts-primary">Contact:</strong> {selectedEmployee.emergency_contact}
                    </Typography>
                    <Typography>
                        <strong className="fonts-primary">Name:</strong> {selectedEmployee.emergency_name}
                    </Typography>
                    <Typography>
                        <strong className="fonts-primary">Phone:</strong> {selectedEmployee.emergency_phone}
                    </Typography>
                </Box>
            </Box>
        </div>
    );
}

export default EmployeeProfile;
