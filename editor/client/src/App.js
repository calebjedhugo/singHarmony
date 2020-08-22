import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

//Set up api calls to the back end.
import axios from 'axios'
axios.defaults.baseURL = function(){
  if(process.env.NODE_ENV === 'development'){
    return 'http://localhost:3001/api/v1/'
  } else {
    return '/api/v1/'
  }
}()

function App() {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{'Welcome to Sing Harmony Data Editor'}</Card.Title>
        <Card.Text>{'Select a song to edit, or create a new one.'}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default App;
