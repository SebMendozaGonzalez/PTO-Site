import React from 'react'
//import homeImage from '../../images/mom-and-son.png'; 
import './Welcome.css'

const Welcome = () => {
  return (
    <section className='c-wrapper'>
        <div className="flexColStart innerWidth paddings c-container">
            <h1 className= "fonts-primary" style={{ fontSize: '55px' }}>Welcome to Quantum Vacations Portal!!</h1>
            <h2 className= "fonts-regular">A centralized solution for managing vacation requests.</h2>
        </div>
    </section>
  );
};

export default Welcome