import React, {Component} from 'react'
import Form from 'react-bootstrap/Form'

export default class MetaEntry extends Component {

  handleChange = (e, prop) => {
    let {noteData, patch} = this.props
    let {value} = e.target

    this.setState({[prop]: value})
    noteData[prop] = value
    patch(noteData)
  }

  get tempoResolution(){
    const {tempoResolution} = this.props.data
  }

  get ts(){
    const {ts} = this.props.data
  }

  get tempochanges(){
    const {tempochanges} = this.props.data
  }

  render(){
    return (
      <>
        {this.tempoResolution}
        {this.ts}
        {this.tempochanges}
      </>
    )
  }
}
