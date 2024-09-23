import React from 'react'
import './EnterLeader.css'
import { Link } from 'react-router-dom';

const EnterLeader = () => {
    return (
        <div className="flexStart innerWidth paddings" style={{background: "Var(--negative-light-gradient)"}}>

            <div className='flexColStart'>
                <h1 className="fonts-secondary" style={{ fontSize: '38px' }}>
                    Enter the Leaders Portal
                </h1>
    
                <span style={{ width: "40rem"}} className="fonts-regular paddings">
                    If you want to enter as a Leader and manage your team's vacation requests, see the pending requests, or if you want to check the calendar for incoming PTOs, this is your place.
                </span>
            </div>

            <div className='paddings botón'>
                <Link to="/leader-portal" className="nav-link">
                    <button className='button' style={{width: "11rem"}}>
                        Enter as an Leader
                    </button>
                </Link>
            </div>
        </div>
        
    );
}

export default EnterLeader