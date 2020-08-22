import React, {Component} from 'react'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import axios from 'axios'

export default class SongList extends Component{
  state = {
    songList: [],
    error: ''
  }

  componentDidMount(){
    axios.get('songData').then(res => {
      this.setState({songList: res.data})
    }).catch(e => {
      this.setState({error: e.response ? e.response.data : e.message})
    })
  }

  get list(){
    const {songList} = this.state
    const {setSong, selectedSong} = this.props
    return songList.map((title, idx) => {
      return <ListGroup.Item key={idx} active={selectedSong === title} className={`songSelection`} onClick={() => {
        setSong(title)
      }}>{title}</ListGroup.Item>
    })
  }

  render(){
    const {error} = this.state
    return (
      <>
        <div className='songList'>
          {this.list}
        </div>
        {error ? <div className='error'>{error}</div> : null}
      </>
    )
  }
}
