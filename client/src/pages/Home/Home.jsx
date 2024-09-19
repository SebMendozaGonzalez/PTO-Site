import React from 'react';
import './Home.css';
import Welcome from '../../components/Welcome/Welcome';
import EnterEmployee from '../../components/EnterEmployee/EnterEmployee';
import EnterLeader from '../../components/EnterLeader/EnterLeader';


const Home = () => {
  return (
    <div className="home" style={{ flexDirection: 'column' }}>

      <Welcome />
      <EnterEmployee />
      <EnterLeader />
    
    </div>
  );
}

export default Home;
