// src/components/Dots/Dots.jsx
import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import './Dots.css'

function Dots({ requestDetails }) {
    // Determine the x part of the tooltip
    let x;
    if (requestDetails.decided) {
        x = requestDetails.accepted ? "This request was accepted" : "This request was rejected";
    } else {
        x = "This request hasn't been decided upon";
    }

    // Determine the y part of the tooltip
    let y = '';
    if (requestDetails.decided && requestDetails.accepted) {
        if (requestDetails.taken) {
            y = " and already taken";
        } else if (requestDetails.cancelled) {
            y = " but cancelled";
        } else {
            y = " but hasn't been taken yet";
        }
    }

    // Combine x and y
    const tooltipText = `${x}${y}`;

    return (
        <Tooltip title={tooltipText} arrow>
            <div className="dots">
                <div className={`dot ${requestDetails.decided ? (requestDetails.accepted ? 'green' : 'red') : 'grey'}`}></div>
                <div className={`dot ${requestDetails.taken ? 'green' : (requestDetails.cancelled ? 'red' : 'grey')}`}></div>
            </div>
        </Tooltip>
    );
}

export default Dots;
