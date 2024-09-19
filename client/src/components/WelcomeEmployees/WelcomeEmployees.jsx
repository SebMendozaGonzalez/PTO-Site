import React from 'react'
import './WelcomeEmployees.css'

function WelcomeEmployees() {
  return (
    <div className='flexColStart paddings innerWidth'>

        <h1 className='fonts-secondary'>Welcome, Employee!</h1>
        
        <div className = "flexStart" style= {{marginRight:"40rem", fontSize: "20px"}}>
            <span className="fonts-regular">
                Here, you will be able to manage your vacation requests and view your remaining vacation days.
            </span>
        </div>
        

    </div>
    
  )
}

export default WelcomeEmployees