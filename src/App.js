import React, {Component} from 'react'
import SongSelect from './components/screens/SongSelect'
import Sing from './components/screens/Sing'
import Practice from './components/screens/Practice'
import './App.css';

class App extends Component {
  state = {
    screen: 'songSelect',
    song: ''
  }

  get screen(){
    const {screen, song} = this.state
    if(!song) return <SongSelect />
    switch(screen){
      case 'songSelect':
        return <SongSelect />
      case 'sing':
        return <Sing />
      case 'practice':
        return <Practice />
    }
  }

  render(){
    const {screen} = this.state
    return (
      <div className='globalBackground' id={screen === 'songSelect' ? '' : 'paperEdges'}>
        <div className='globalBackground' id='paper'>
          {this.screen}
        </div>
      </div>
    )
  }
}

export default App;
