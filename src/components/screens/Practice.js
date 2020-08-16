import React, {Component} from 'react'
import VoiceController from '../VoiceController'
import Measure from '../notation/Measure'
import Meta from '../notation/Meta'
import PlayButton from '../playButton'

export default class Practice extends Component {
  constructor(props){
    super(props)
    this.state = {
      activeIdx: 0,
      playing: false
    }
  }

  componentDidUpdate(prevProps, prevState){
    //Playback is completely handled by the state of 'playing'.
    const {playing} = this.state
    if(playing !== prevState.playing){
      playing ? this.beginPlayback() : this.endPlayback()
    }
  }

  get measures(){
    const {activeIdx} = this.state
    const {voices, songData} = this.props
    return songData.map((data, idx) => {
      let maxNotes = Math.max(data.s.length, data.a.length, data.t.length, data.b.length, 1)
      let width = maxNotes * 70
      let active = idx >= activeIdx
      return (
        <div key={idx} style={{width: `${active ? width : 0}px`}} className={`measure${active ? '' : '-inactive'}`}>
          <Measure idx={idx} data={data} voices={voices} grand={true} width={width}/>
        </div>
      )
    })
  }

  // get atEnd(){
  //   const {activeIdx} = this.state
  //   const total = this.props.songData.length - 1
  //   return activeIdx === total
  // }

  togglePlay = (value = !this.state.playing) => {
    this.setState({playing: value})
  }

  beginPlayback = async () => {
    // if(this.atEnd){ //Should start from the begining if at the end.
    //   return this.setState({activeIdx: 0}, this.beginPlayback)
    // }

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

  render(){
    const {voices, toggleVoice} = this.props
    const {playing} = this.state
    const {togglePlay} = this
    return (
      <>
        <VoiceController voices={voices} toggleVoice={toggleVoice} />
        <PlayButton togglePlay={togglePlay} playing={playing}/>
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
