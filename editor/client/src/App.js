import React, {Component} from 'react';
import Home from './components/Home/index.js'
import Editor from './components/Editor/index.js'

import './App.css';
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

class App extends Component {

  state = {
    selectedSong: '',
    data: {},
    screen: 'home',
    error: ''
  }

  setSong = song => {
    axios.get(`songData/${song}`).then(res => {
      this.setState({data: res.data, selectedSong: song, error: ''})
    }).catch(e => {
      this.setState({error: e.response ? e.response.data : e.message})
    })
  }

  setData = newData => {
    this.setState({data: newData})
  }

  newSong = songTitle => {
    return new Promise((resolve, reject) => {
      axios.post(`songData/${songTitle}`).then(res => {
        this.setState({data: res.data, selectedSong: songTitle, error: '', screen: 'editor'})
        resolve()
      }).catch(e => {
        reject(e.response ? e.response.data : e.message)
      })
    })
  }

  setScreen = screen => {
    this.setState({screen: screen})
  }

  get currentScreen(){
    const {screen, selectedSong, data} = this.state
    switch(screen){
      case 'home':
        return (
          <Home setScreen={this.setScreen} newSong={this.newSong} setSong={this.setSong} selectedSong={selectedSong}/>
        )
      case 'editor':
        return (
          <Editor setScreen={this.setScreen} data={data} setData={this.setData} selectedSong={selectedSong}/>
        )
      default: throw new Error(`There is no screen called '${screen}'`)
    }
  }

  render(){
    const {selectedSong, error} = this.state

    return (
      <>
        {this.currentScreen}
        {error ? <div className='error'>{error}</div> : null}
      </>
    )
  }
}

export default App;
