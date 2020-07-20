import 'bootstrap/dist/css/bootstrap.min.css';
import React, {Component} from 'react'
import Home from './components/screens/Home'
import Sing from './components/screens/Sing'
import Practice from './components/screens/Practice'
import Print from './components/screens/Print'
import NavButton from './components/NavButton'
import songData from './staticData/songData'
import './App.css';

class App extends Component {
  state = {
    screen: 'practice',
    song: 'A Mighty Fortress is Our God',
    voices: {
      s: true,
      a: true,
      t: true,
      b: true
    }
  }

  toggleVoice = (voice) => {
    let voices = JSON.parse(JSON.stringify(this.state.voices))
    voices[voice] = !voices[voice]

    let numberActive = 0
    for(let voice in voices){
      if(voices[voice]) numberActive++
    }

    if(numberActive) this.setState({voices: voices})
  }

  songTitles = Object.keys(songData)

  get songData(){
    const {song} = this.state
    return songData[song]
  }

  get screen(){
    const {screen} = this.state
    switch(screen){
      case 'home':
        return <Home {...this.state} songTitles={this.songTitles} setSong={song => {this.setState({song: song})}}/>
      case 'practice':
        return <Practice {...this.state} songData={this.songData} toggleVoice={this.toggleVoice}/>
      case 'sing':
        return <Sing {...this.state} songData={this.songData} toggleVoice={this.toggleVoice}/>
      case 'print':
        return <Print {...this.state} songData={this.songData} toggleVoice={this.toggleVoice}/>
      default:
        throw new Error(`There is no screen called, "${screen}"`)
    }
  }

  render(){
    const {screen, song} = this.state
    return (
      <div className='globalBackground' id={screen === 'songSelect' ? '' : 'paperEdges'}>
        <div className='globalBackground' id='paper'>
          {this.screen}
          <div className={`navButtonContainer${song ? '' : ' navButtonContainerDisabled'}`}>
            {['home', 'practice', 'sing', 'print'].map(value => {
              if(value === screen) return null
              return <NavButton key={value} value={value} action={() => {
                if(song){
                  this.setState({screen: value})
                }
              }}/>
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
