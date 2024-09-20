import React from 'react'
import './RequestEmployee.css'

function RequestsEmployee() {
  return (
    <div className='paddings flexColStart innerWidth' style={{marginTop: "2rem"}}>
        <div className='flexColStart paddings'>
            <h1 className='fonts-primary' style={{fontSize: "2.8rem"}}>Do you want to request time off?</h1>
            <h1 className='fonts-secondary' style={{fontSize: "2.2rem"}}>Here's what you need to know</h1>
        </div>
        <div className='flexColStart paddings paragraph'>

            <h2 className='fonts-primary'>Paid Time Off</h2>
            <p>
                Paid time off is the most common type of time off. <br />
                To be able to request it, you have to have passed already your testing period. 
                Additionally, you can request time off as long as the number of days you're requesting
                is not higher than the number of <strong className='fonts-secondary'>Unused days</strong> you have for vacation. <br />
                However, exceptions can be done, depending on your situation. 
                <strong className='fonts-secondary'> Here</strong> you can request exceptional time off.
            </p>
            <div className='btn-container paddings'>
                <button className='button dark-button'>
                    Request PTO
                </button>
            </div>
            
        </div>
        
        <div className='flexColStart paddings paragraph'>
            
            <h2 className='fonts-primary'>Licences</h2>
            <p>
                Licenses are a special type of time off: they are only applicable in specific scenarios and 
                some of them can be notified after happening. <br />
                These are the types of licenses you can take:

            </p>
            
            <h3>Maternity License</h3>
            <p>
                Maternity licenses are given within a span of <strong className="fonts-secondary"> 18 weeks</strong>, 
                which is the same as <strong className="fonts-secondary">126 days</strong>.
                
            </p>
            <div className='btn-container paddings'>
                <button className='button dark-button innerWidth'>
                    Request
                </button>
            </div>

            <h3>Paternity License</h3>
            <p>
                Paternity licenses are given within a span of <strong className="fonts-secondary"> 2 weeks</strong>, 
                which is the same as <strong className="fonts-secondary">14 days</strong>.
                
            </p>
            <div className='btn-container paddings'>
                <button className='button dark-button innerWidth'>
                    Request                   
                </button>
            </div>

            <h3>Domestic Calamity License</h3>
            <p>
                Domestic calamity licenses are unforseen things that happen in your home that prevent
                your presence at the workplace.
            </p>
            <div className='btn-container paddings'>
                <button className='button dark-button innerWidth'>
                    Request                   
                </button>
            </div>

            <h3>Bereavement</h3>
            <p>
                Bereavement is a license granted to you by law that covers leaves caused by the death of a family member. <br />
                When this happens, you get <strong className="fonts-secondary">5 business days</strong> of permit, 
                while getting <strong className="fonts-secondary">30 business days</strong> to send proof.
            </p>
            <div className='btn-container paddings'>
                <button className='button dark-button innerWidth'>
                    Request                   
                </button>
            </div>

        </div>
        <div className='flexColStart paddings paragraph'>

            <h2 className='fonts-primary'>Unpaid Time Off</h2>
            <p>
                Unpaid time off is a type of time off that can be requested at any time and 
                will be granted to you or not according to certain factors, like the disponibility that your leader
                foresees in your team in the period of time for which you are requesting vacations. <br />
                A lot of unpaid days in your request require you to make your request with a minimum of
                one week of anticipation.
            </p>
            <div className='btn-container paddings'>
                <button className='button dark-button'>
                    Request UTO
                </button>
            </div>
            
        </div>
        <div className='flexColStart paddings paragraph'>

            <h2 className='fonts-primary'>Birthday Off</h2>
            <p>
                This is a type of time off that is non-requestable. <br />
                After you pass your testing period, you get your birthday off. You can not postpone this in any way.
            </p>
            
        </div>

    </div>

  )
}

export default RequestsEmployee