import React, {Component} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import MetaData from './MetaData.js'
import Notation from './Notation.js'
import axios from 'axios'

export default class Editor extends Component {
  state = {
    error: ''
  }

  home = () => {
    const {setScreen} = this.props
    setScreen('home')
  }

  patch = (newData, prop) => {
    let {selectedSong} = this.props
    let fData
    if(prop){
      fData = JSON.parse(JSON.stringify(this.props.data))
      fData[prop] = newData
    } else {
      fData = newData
    }
    axios.patch(`songData/${selectedSong}`, fData).then(res => {
      this.props.setData(res.data)
    }).catch(e => {
      this.setState({error: e.response ? e.response.data : e.message})
    })
  }

  render(){
    //todo: lyrics import modal
    const {data, error} = this.props
    return (
      <>
        <Button className={'menuButtons'} onClick={this.home}>{'Home'}</Button>
        {error ? <div className='error'>{error}</div> : null}
        <MetaData patch={newData => {this.patch(newData, 'metaData')}} metaData={data.metaData} />
        <Notation patch={newData => {this.patch(newData, 'notes')}} songData={data.notes} keySignature={data.metaData.keySignature}/>
      </>
    )
  }
}
