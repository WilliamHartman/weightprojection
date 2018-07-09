import React, { Component } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import router from './router';

class App extends Component {
  handleClick() {
    console.log('clicked')
    axios.get('/auth/me')
      .then( (res) => console.log(res))
  }
  render() {
    return (
      <div className="App">
        <Navbar />
          <div className="router-container">
            {router}
          </div>
      </div>
    );
  }
}

export default App;