import React, {Component} from 'react'
import VoiceController from '../VoiceController'
import Measure from '../notation/Measure'
import Meta from '../notation/Meta'
import EndBar from '../notation/EndBar'
import PlayButton from '../playButton'
import TempoButton from '../TempoButton'
import {stafSpace, verseSpace} from '../../config.js'

export default class Practice extends Component {
  constructor(props){
    super(props)
    this.state = {
      activeIdx: 19,
      startedIdx: 0, //Where playback was when the user started touching the screen.
      playing: false,
      touchStart: 0
    }
    this.notation = React.createRef()
  }

  componentDidMount(){
    this.notation.current.addEventListener('touchstart', this.recordTouchStart, {passive: false})
  }

  componentWillUnmount(){
    this.notation.current.removeEventListener('touchstart', this.recordTouchStart)
  }

  restartPlayback = false

  componentDidUpdate(prevProps, prevState){
    //Playback is completely handled by the state of 'playing'.
    const {playing} = this.state
    if(playing !== prevState.playing){
      playing ? this.beginPlayback() : this.endPlayback()
    }
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

  get measures(){
    const {activeIdx} = this.state
    const {voices, songData, keySignature} = this.props

    return songData.map((data, idx) => {
      let maxNotes = Math.max(data.s.length, data.a.length, data.t.length, data.b.length, 1)
      let width = maxNotes * 72
      let active = idx >= activeIdx
      let final = idx === songData.length - 1
      return (
        <div key={idx} style={{width: `${active ? width : 0}px`}} className={`measure${active ? '' : '-inactive'}`}>
          <Measure final={final} idx={idx} data={data} voices={voices} grand={true} width={width} keySignature={keySignature} stafSpace={this.stafSpacePlusVerses}/>
        </div>
      )
    })
  }

  get ts(){
    const {songData} = this.props
    return songData[1].ts
  }

  togglePlay = (value = !this.state.playing, callback = null) => {
    this.setState({playing: value}, callback)
  }

  beginPlayback = async () => {
    let {songData, player} = this.props
    this.playingMeasurePromise = player.play(songData[this.state.activeIdx])

    while(this.state.playing){
      let {activeIdx} = this.state
      //Wait for entire measure to play.
      await this.playingMeasurePromise
      this.timer = new Date().getTime()

      //Play the next meausure?
      if(activeIdx < songData.length - 1){
        //Only advance if not resolved early due to the user hitting pause.
        if(this.state.playing){
          this.playingMeasurePromise = player.play(songData[activeIdx + 1])
          this.setState({activeIdx: activeIdx + 1})
        }
      } else {
        this.endPlayback()
        this.setState({activeIdx: 0})
      }
    }
  }

  endPlayback = () => {
    let {player} = this.props
    player.pause()
    this.setState({playing: false})
  }

  recordTouchStart = (e) => {
    e.preventDefault()
    const {playing, activeIdx} = this.state
    let {clientX} = e.touches[0]
    clientX = Math.round(clientX)
    this.setState({
      touchStart: clientX,
      startedIdx: activeIdx
    })
    this.restartPlayback = playing
    if(playing) this.togglePlay()
  }

  scroll = (e) => {
    let {clientX} = e.touches[0]
    clientX = Math.round(clientX)
    const {touchStart, startedIdx} = this.state
    let newIdx = Number(((touchStart - clientX) / 75).toFixed(0)) + startedIdx

    newIdx = Math.min(this.numberOfMeasures - 1, newIdx)
    newIdx = Math.max(0, newIdx)
    if(newIdx === this.state.activeIdx) return //no update needed

    this.setState({
      activeIdx: newIdx
    })
  }

  doneScrolling = () => {
    if(this.restartPlayback){
      this.togglePlay()
    }
  }

  get numberOfMeasures(){
    const {songData} = this.props
    return songData.length
  }

  goHome = () => {
    const {goHome} = this.props
    const {playing} = this.state

    this.togglePlay(false, goHome)
  }

  get homeButton() {
    return <div className={'practiceHomeDiv'} onTouchStart={this.goHome}>{'Home'}</div>
  }

  render(){
    const {voices, toggleVoice, keySignature, setTempo, tempo} = this.props
    const {playing} = this.state
    const {togglePlay, endPlayback} = this

    return (
      <>
        <VoiceController voices={voices} toggleVoice={toggleVoice} />
        <PlayButton togglePlay={togglePlay} playing={playing}/>
        <div className={'notation-container'}>
          <div ref={this.notation} className={'notation'}
            onTouchMove={this.scroll}
            onTouchEnd={this.doneScrolling}
          >
            <Meta grand={true} keySignature={keySignature} ts={this.ts} stafSpace={this.stafSpacePlusVerses}/>
            {this.measures}
            <EndBar grand={true} stafSpace={this.stafSpacePlusVerses}/>
          </div>
        </div>
        <TempoButton setTempo={setTempo} togglePlay={togglePlay} tempo={tempo} playing={playing}/>
        {this.homeButton}
      </>
    )
  }
}
