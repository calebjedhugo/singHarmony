import React, {Component} from 'react'

export default class PlayButton extends Component {
  render(){
    const {togglePlay, playing} = this.props
    return (
      <div className={`${playing ? 'pause' : 'play'}Button`} onClick={() => togglePlay()}></div>
    )
  }
}
