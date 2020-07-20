import React, {Component} from 'react'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackspace } from '@fortawesome/free-solid-svg-icons'

export default class Home extends Component {
  state = {
    searchText: ''
  }

  get songSelector(){
    const {songTitles, setSong, song} = this.props
    const {searchText} = this.state

    let regExp = new RegExp(searchText, 'i')
    let songInList = false
    let listArray = songTitles.map((title, idx) => {
      if(!regExp.test(title) && searchText){
        return null
      }
      songInList = true
      return <ListGroup.Item key={idx} active={song === title} className={`songSelection`} onClick={() => {
        setSong(title)
      }}>{title}</ListGroup.Item>
    })
    return (
      <div className='songSelector'>
        {songInList ? listArray : <div>{'No songs match your search.'}</div>}
      </div>
    )
  }

  render(){
    const {song} = this.props
    const {searchText} = this.state
    return (
      <>
        <div className={`banner${song ? ' songTitle' : ''}`}>{song ? song : 'How To Sing Harmony'}</div>
        <div className='homeContent'>
          <InputGroup>
          <FormControl id='searchText' value={searchText} onChange={(e) => {
            this.setState({searchText: e.target.value})
          }} type="text" placeholder="search" />
            <InputGroup.Prepend>
              <Button variant="outline-secondary" onClick={() => {
                this.setState({searchText: ''}, document.getElementById('searchText').focus())
              }}><FontAwesomeIcon icon={faBackspace} /></Button>
            </InputGroup.Prepend>
          </InputGroup>
          {this.songSelector}
        </div>
      </>
    )
  }
}
