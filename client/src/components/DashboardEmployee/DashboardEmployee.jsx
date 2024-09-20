import React from 'react'
import './DashboardEmployee.css'
import Image from "../../images/yo.jpg"

function DashboardEmployee() {
  return (
    <div className='dashboard-employee flexColStart paddings'>
        <div className='paddings'>
            <h1>Employee Dashboard</h1>
        </div>
        <div className='flexCenter'>

          <div className='paddings image-container' style = {{marginLeft: "4rem"}}>
            <img src={Image} alt="employee_img" />
          </div>
          
          <div style = {{marginLeft: "4rem"}}>
            <div className='flexCenter'>
            <div className='flexColCenter paddings'>
                <h2>Accumulated days</h2>
                <h3>45</h3>
            </div>
            <div className='flexColCenter paddings'>
                <h2>Used days</h2>
                <h3>20</h3>
            </div>
            <div className='flexColCenter paddings'>
                <h2>Remaining days</h2>
                <h3>25</h3>
            </div>
            </div>
            <div className='flexCenter' style={{fontSizeAdjust: "0.45"}}>
                <div className='flexColCenter paddings'>
                    <h2>Days in the company</h2>
                    <h3>376</h3>
                </div>
                <div className='flexColCenter paddings'>
                    <h2>Days compensated</h2>
                    <h3>5</h3>
                </div>
            </div>
          </div>
          
        </div>
        
        
        

    </div>
  )
}

export default DashboardEmployee