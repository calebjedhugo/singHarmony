import React, {Component} from 'react'
import VoiceController from '../VoiceController'
import Measure from '../notation/Measure'
import Meta from '../notation/Meta'
import PlayButton from '../playButton'
import Player from '../../Player'

export default class Practice extends Component {
  constructor(props){
    super(props)
    this.state = {
      activeIdx: 0,
      playing: false
    }
    const {songData} = props
    this.player = new Player()
  }

  componentDidUpdate(prevProps, prevState){
    //Playback is completely handled by the state of 'playing'.
    const {playing} = this.state
    if(playing !== prevState.playing){
      playing ? this.beginPlayback() : this.endPlayback()
    }

    //If the song changes, reconstruct the player
    const {song, songData} = this.props
    if(song !== prevProps.song){
      this.player = new Player(songData)
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

  get atEnd(){
    const {activeIdx} = this.state
    const total = this.props.songData.length - 1
    return activeIdx === total
  }

  togglePlay = (value = !this.state.playing) => {
    this.setState({playing: value})
  }

  beginPlayback = async () => {
    const {songData} = this.props

    if(this.atEnd){ //Should start from the begining if at the end.
      return this.setState({activeIdx: 0}, this.beginPlayback)
    }

    while(this.state.playing){
      let {activeIdx} = this.state
      await this.player.play(songData[activeIdx])
      if(activeIdx < songData.length - 1){
        this.setState({activeIdx: activeIdx + 1})
      } else {
        this.endPlayback()
      }
    }
  }

  endPlayback = () => {
    this.player.pause()
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
