import React, {Component} from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import SongList from './SongList'
import NewSongModal from './NewSongModal'

export default class Home extends Component {

  editer = () => {
    const {setScreen} = this.props
    setScreen('editor')
  }

  get editButtonText(){
    const {selectedSong} = this.props
    if(!!selectedSong){
      return `Edit '${selectedSong}'`
    } else {
      return 'Select a Song'
    }
  }

  render(){
    const {selectedSong, setSong, newSong} = this.props

    return (
      <Card>
        <Card.Body>
          <Card.Title>{'Welcome to Sing Harmony Data Editor'}</Card.Title>
          <Card.Text>{'Select a song to edit, or create a new one.'}</Card.Text>
          <Button onClick={this.editer} className={'menuButtons'} disabled={!selectedSong}>{this.editButtonText}</Button>
          <NewSongModal newSong={newSong} />
          <SongList setSong={setSong} selectedSong={selectedSong}/>
        </Card.Body>
      </Card>
    )
  }
}
