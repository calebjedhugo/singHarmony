import React, {Component} from 'react'
import Form from 'react-bootstrap/Form'
import VoiceEntry from './VoiceEntry'
import LyricEntry from './LyricEntry'
import MetaEntry from './MetaEntry'

export default class EntryGroup extends Component {

  patch = (newData, prop) => {
    const {patch} = this.props
    let data = JSON.parse(JSON.stringify(this.props.data))
    data[prop] = newData
    patch(data)
  }

  get voices(){
    const {data} = this.props
    let voiceArray = []
    for(let voice in data){
      if(/^(s|a|t|b)$/.test(voice)){
        voiceArray.push(
          <VoiceEntry key={voice} data={data[voice]} patch={newData => {this.patch(newData, voice)}} label={voice}/>
        )
      }
    }
    return voiceArray
  }

  render(){
    const {data} = this.props
    return (
      <>
        {this.voices}
        {this.verses}
        <LyricEntry patch={newData => {this.patch(newData, 'lyrics')}} data={data.lyrics}/>
        <MetaEntry patch={this.patch} data={data} />
      </>
    )
  }
}
