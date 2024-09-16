// src/App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Header from './components/Header/Header';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route exact path="/" component={Home} />
      </Routes>
    </div>
  );
}

export default App;
