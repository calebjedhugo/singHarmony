import React, {Component} from 'react'
import VoiceController from '../VoiceController'
import Measure from '../notation/Measure'
import Meta from '../notation/Meta'

export default class Practice extends Component {

  get measures(){
    const {voices, songData} = this.props
    return songData.map((data) => {
      return <div><Measure data={data} voices={voices} grand={true} /></div>
    })
  }

  render(){
    const {voices, toggleVoice} = this.props
    return (
      <>
        <VoiceController voices={voices} toggleVoice={toggleVoice} />
        <div className={'notation-container'}>
          <div className={'notation'} >
            <Meta grand={true} key={'Ab'}/>
            {this.measures}
          </div>
        </div>
      </>
    )
  }
}
