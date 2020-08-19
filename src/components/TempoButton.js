import React, {Component} from 'react'
import {maxTempo} from '../config'

export default class TempoButton extends Component {
  constructor(props){
    super(props)
    this.state = {
      touchStartVector: [0, 0],
      startingTempo: this.props.tempo,
      active: false
    }
    this.tempoButtonDom = React.createRef()
  }

  componentDidMount(){
    this.tempoButtonDom.current.addEventListener('touchstart', this.openTempoSlider, {passive: false})
  }

  componentWillUnmount(){
    this.tempoButtonDom.current.removeEventListener('touchstart', this.openTempoSlider)
  }

  openTempoSlider = (e) => {
    e.preventDefault()
    const {tempo, playing, togglePlay} = this.props
    let {clientX, clientY} = e.touches[0]
    clientX = Math.round(clientX)
    clientY = Math.round(clientY)
    this.setState({
      touchStartVector: [clientX, clientY],
      startingTempo: tempo,
      active: true,
      restartPlayback: playing
    })
    if(playing) togglePlay()
  }

  calculatChange(newVector){
    const {touchStartVector} = this.state
    let changeFromX = ((touchStartVector[0] - newVector[0]) / window.innerWidth) * maxTempo
    let changeFromY = ((touchStartVector[1] - newVector[1]) / window.innerHeight) * maxTempo
    return Math.round((changeFromX + changeFromY) / 3)
  }

  setTempo = (e) => {
    let {clientX, clientY} = e.touches[0]
    clientX = Math.round(clientX)
    clientY = Math.round(clientY)

    const {startingTempo} = this.state
    const {tempo} = this.props
    let newTempo = Math.round(this.calculatChange([clientX, clientY]) + startingTempo)
    if(newTempo !== tempo){
      this.props.setTempo(newTempo)
    }
  }

  closeTempoSlider = () => {
    const {togglePlay, playing} = this.props
    const {restartPlayback} = this.state
    if(restartPlayback) togglePlay()
    this.setState({
      active: false,
      restartPlayback: false
    })
  }

  get style(){
    const {tempo} = this.props
    const {active} = this.state

    if(!active) return null

    let width = (tempo / maxTempo) * window.innerWidth

    //If it IS active:
    return {
      width: `${width}px`
    }
  }

  get className() {
    const {active} = this.state
    return active ? 'practiceTempoDiv-active' : 'practiceTempoDiv'
  }

  get textContent(){
    const {tempo} = this.props
    const {active} = this.state
    return active ? tempo : 'Tempo'
  }

  render(){
    return (
      <div
        ref={this.tempoButtonDom}
        className={this.className}
        style={this.style}
        onTouchMove={this.setTempo}
        onTouchEnd={this.closeTempoSlider}
      >{this.textContent}</div>
    )
  }
}
