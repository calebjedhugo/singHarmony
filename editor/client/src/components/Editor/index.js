import React, {Component} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import MetaData from './MetaData'
import Notation from './Notation'
import LyricImport from './LyricImport'
import TimeSignatureChange from './TimeSignatureChange'
import axios from 'axios'

import {Theory} from '../../Theory'
const theory = new Theory()

export default class Editor extends Component {
  state = {
    error: ''
  }

  home = () => {
    const {setScreen} = this.props
    setScreen('home')
  }

  patch = (newData, prop, hardSetDataBool) => {
    let {selectedSong, setData, hardSetData} = this.props
    let fData
    if(prop){
      fData = JSON.parse(JSON.stringify(this.props.data))
      fData[prop] = newData
    } else {
      fData = newData
    }
    axios.patch(`songData/${selectedSong}`, fData).then(res => {
      if(hardSetDataBool){
        this.props.hardSetData(res.data)
      } else {
        this.props.setData(res.data)
      }
    }).catch(e => {
      this.setState({error: e.response ? e.response.data : e.message})
    })
  }

  get songData(){
    const {data} = this.props
    return data.notes.map(measure => {
      //Check if there are intervals of a second and offset these notes.
      return theory.offsetSeconds(measure)
    })
  }

  render(){
    //todo: lyrics import modal
    const {data, error, selectedSong, setData, hardSetData} = this.props
    if(!data.notes) return null
    return (
      <>
        <Button className={'menuButtons'} onClick={this.home}>{'Home'}</Button>
        <LyricImport setData={hardSetData} title={selectedSong} />
        <TimeSignatureChange setData={hardSetData} title={selectedSong} />
        {error ? <div className='error'>{error}</div> : null}
        <MetaData patch={newData => {this.patch(newData, 'metaData')}} metaData={data.metaData} />
        <Notation patch={(newData, hardSetDataBool) => {this.patch(newData, 'notes', hardSetDataBool)}} songData={this.songData} keySignature={data.metaData.keySignature}/>
      </>
    )
  }
}
