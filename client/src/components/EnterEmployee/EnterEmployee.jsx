import React from 'react';
import './EnterEmployee.css'
import { Link } from 'react-router-dom';

const EnterEmployee = () =>{
  return (
    <div className="flexEnd innerWidth paddings" style={{background: "Var(--light-gradient)"}}>

        <div className='paddings botón'>
            <Link to="/employee-portal" className="nav-link">
                <button className='button' style={{width: "11rem"}}>
                    Enter as an Employee
                </button>
            </Link>
        </div>

        <div className='flexColEnd'>
            <h1 className="fonts-secondary" style={{ fontSize: '38px' }}>
                Enter the Employees Portal
            </h1>

            <span style={{ width: "40rem"}} className="fonts-regular paddings">
                If you want to enter as an employee and make new vacation requests, review the ones you already have, or see how many vacation days you have accumulated so far, this is your place.
            </span>
        </div>

        
    </div>
    
  );
}

export default EnterEmployee;
