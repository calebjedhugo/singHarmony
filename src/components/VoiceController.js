import React, {Component} from 'react'
//Controls the active voices at the app level. Pass in prop, 'voices', to inform component of what is active.
//pass in prop, 'toggleVoice', to active/deactive a voice.

export default class VoiceController extends Component {
  render(){
    const {voices, toggleVoice} = this.props
    return (
      <div className='voice-controller'>
        {['s','a','t','b'].map((voice, idx) => {
          return <VoiceToggle active={voices[voice]} voice={voice} key={idx} toggle={() => {toggleVoice(voice)}}/>
        })}
      </div>
      )
  }
}

class VoiceToggle extends Component {
  state = {
    active: true
  }
  render(){
    const {voice, active, toggle} = this.props
    return <div
      onTouchStart={toggle}
      className={`voiceButton${active ? ' voiceButton-active' : ''}`}
      id={`${voice}-button`}>
    </div>
  }
}
