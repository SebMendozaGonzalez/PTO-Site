import React from 'react'
import './WelcomeEmployees.css'

function WelcomeEmployees() {
  return (
    <div className='flexColStart paddings innerWidth welcomeEmployees'>

        <h1 className='fonts-secondary' style={{fontWeight: "700"}}>Welcome, Sebastián!</h1>
        
        <div className = "flexStart paragraph">
            <p className="fonts-regular" style={{fontSize: "1.4rem"}}>
                Here, you will be able to manage your vacation requests and view your remaining vacation days.
            </p>
        </div>
        

    </div>
    
  )
}

export default WelcomeEmployees