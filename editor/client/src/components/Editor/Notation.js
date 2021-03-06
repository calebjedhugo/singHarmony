import React, {Component} from 'react'
import Form from 'react-bootstrap/Form'
import Measure from '../notation/Measure'
import Meta from '../notation/Meta'
import EntryGroup from './EntryGroup'

const stafSpace = 150
const verseSpace = 18

export default class Notation extends Component {

  patch = (newData, idx, hardSetDataBool) => {
    let {patch} = this.props
    let songData = JSON.parse(JSON.stringify(this.props.songData))
    songData[idx] = newData
    patch(songData, hardSetDataBool)
  }

  get measures(){
    const {songData, keySignature} = this.props
    return songData.map((data, idx) => {
      let maxNotes = Math.max(data.s.length, data.a.length, data.t.length, data.b.length, 1)
      let width = Math.max(maxNotes * 80, 100)

      return <div key={idx} style={{display: 'inline-block', verticalAlign: 'top'}} className={`measure`}>
        {idx}
        <div style={{display: 'block'}}>
          <Measure voices={{s: true, a: true, t: true, b: true}} idx={idx} data={data} grand={true} width={width} keySignature={keySignature} stafSpace={this.stafSpacePlusVerses}/>
        </div>
        <div style={{display: 'block'}}>
          <EntryGroup key={idx} patch={(newData, hardSetDataBool) => {this.patch(newData, idx, hardSetDataBool)}} data={data}/>
        </div>
      </div>
    })
  }

  get stafSpacePlusVerses(){
    const {songData} = this.props
    let numberOfVerses = 0
    for(let i = 0; i < songData.length; i++){
      numberOfVerses = Math.max(numberOfVerses, songData[i].lyrics ? songData[i].lyrics.length : 0)
    }

    let f = stafSpace + (numberOfVerses * verseSpace)
    return f
  }

  render(){
    const {keySignature} = this.props
    return <div style={{
      display: 'inline-block',
      padding: '10px',
      overflowX: 'scroll',
      whiteSpace: 'nowrap',
      maxWidth: '100vw'
    }}>
      <div style={{display: 'inline-block', verticalAlign: 'top'}} className={`measure`}>
        {'-'}
        <div style={{display: 'block'}}>
          <Meta grand={true} keySignature={keySignature} stafSpace={this.stafSpacePlusVerses}/>
        </div>
      </div>
      {this.measures}
    </div>
  }
}
