import 'bootstrap/dist/css/bootstrap.min.css';
import React, {Component} from 'react'
import Home from './components/screens/Home'
import Sing from './components/screens/Sing'
import Practice from './components/screens/Practice'
import Print from './components/screens/Print'
import NavButton from './components/NavButton'
import Player from './Player'
import songData from './staticData/songData'
import './App.css';

import {Theory} from './Theory'
const theory = new Theory()

class App extends Component {
  constructor(props){
    super(props)
    this.player = new Player()

    this.state = {
      screen: 'practice',
      song: 'And Can It Be',
      tempo: 100,
      keySignature: 'G',
      voices: {
        s: true,
        a: true,
        t: true,
        b: true
      }
    }
  }

  componentDidUpdate(){
    this.player.tempo = this.state.tempo
  }

  toggleVoice = (voice) => {
    let voices = JSON.parse(JSON.stringify(this.state.voices))
    voices[voice] = !voices[voice]

    let numberActive = 0
    for(let voice in voices){
      if(voices[voice]) numberActive++
    }

    if(numberActive){
      this.setState({voices: voices})

      //We also need to tell the player
      this.player.voicesActive[voice] = voices[voice]
    }
  }

  setSong = song => {
    this.setState({
      song: song,
      tempo: songData[song].metaData.tempo,
      keySignature: songData[song].metaData.keySignature //User will be allow to change this someday.
    })
  }

  setTempo = tempo => {
    tempo = Math.max(tempo, 56)
    tempo = Math.min(tempo, 212)
    this.setState({
      tempo: tempo
    })
  }

  songTitles = Object.keys(songData)

  goHome = () => {
    this.setState({screen: 'home'})
  }

  //The user should not be allowed to adjust this, so we'll retrieve it like this.
  get songData(){
    const {song} = this.state
    return songData[song].notes.map(measure => {
      //Check if there are intervals of a second and offset these notes.
      return theory.offsetSeconds(measure)
    })
  }

  get screen(){
    const {screen} = this.state
    switch(screen){
      case 'home':
        return <Home {...this.state} songTitles={this.songTitles} setSong={this.setSong}/>
      case 'practice':
        return (
          <Practice
            {...this.state}
            player={this.player}
            songData={this.songData}
            toggleVoice={this.toggleVoice}
            goHome={this.goHome}
            setTempo={this.setTempo}
          />
        )
      case 'sing':
        return <Sing {...this.state} songData={this.songData} toggleVoice={this.toggleVoice}/>
      case 'print':
        return <Print {...this.state} songData={this.songData} toggleVoice={this.toggleVoice}/>
      default:
        throw new Error(`There is no screen called, "${screen}"`)
    }
  }

  get navButtons(){
    const {screen, song} = this.state
    if(screen === 'practice') return null
    return ['home', 'practice', 'sing', 'print'].map(value => {
      if(value === screen) return null
      return <NavButton key={value} value={value} action={() => {
        if(song){
          this.setState({screen: value})
        }
      }}/>
    })
  }

  render(){
    const {screen, song} = this.state
    return (
      <div className='globalBackground' id={screen === 'songSelect' ? '' : 'paperEdges'}>
        <div className='globalBackground' id='paper'>
          {this.screen}
          <div className={`navButtonContainer${song ? '' : ' navButtonContainerDisabled'}`}>
            {this.navButtons}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
