import React, {Component} from 'react'
import VoiceController from '../VoiceController'
import Measure from '../notation/Measure'
import Meta from '../notation/Meta'

export default class Practice extends Component {
  render(){
    const {voices, toggleVoice} = this.props
    return (
      <>
        <VoiceController voices={voices} toggleVoice={toggleVoice} />
        <div className={'notation-container'}>
          <div className={'notation'} >
            <Meta grand={true} key={'Ab'}/>
            <div><Measure {...this.props} grand={true}/></div>
          </div>
        </div>
      </>
    )
  }
}
