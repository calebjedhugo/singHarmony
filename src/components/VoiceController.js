import React, {Component} from 'react'

export default class VoiceController extends Component {
  render(){
    return (
      <div className='voice-controller'>
        <VoiceToggle voice='s'/>
        <VoiceToggle voice='a'/>
        <VoiceToggle voice='t'/>
        <VoiceToggle voice='b'/>
      </div>
      )
  }
}

class VoiceToggle extends Component {
  state = {
    active: true
  }
  render(){
    const {voice} = this.props
    const {active} = this.state
    return <div
      onTouchStart={
        () => this.setState({active: !active})
      }
      className={`voiceButton${active ? ' voiceButton-active' : ''}`}
      id={`${voice}-button`}>
    </div>
  }
}
