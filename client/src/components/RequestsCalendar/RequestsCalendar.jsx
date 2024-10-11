import React from 'react'
import './RequestsCalendar.css'

function RequestsCalendar({employee_id}) {
  return (
    <div className='paddings flexColCenter request-calendar'>
      this is the employee_id: {employee_id}
    </div>
  )
}

export default RequestsCalendar