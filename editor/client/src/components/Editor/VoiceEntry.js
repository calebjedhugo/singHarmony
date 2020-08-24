import React, {Component} from 'react'
import Form from 'react-bootstrap/Form'

export default class VoiceEntry extends Component {

  patch = (newData, idx) => {
    const {patch} = this.props
    let data = JSON.parse(JSON.stringify(this.props.data))
    data[idx] = newData
    patch(data)
  }

  get entries(){
    const {data} = this.props
    return data.map((entry, idx) => {
      return <NoteEntry key={idx} noteData={entry} patch={newData => {this.patch(newData, idx)}}/>
    })
  }

  render(){
    const {label} = this.props
    return (
      <div className={'voiceEntry'}>
        <div className='voiceLable'>{label}</div>
        {this.entries}
      </div>
    )
  }
}

class NoteEntry extends Component {
  state = {
    ...this.props.noteData
  }

  handleChange = (e, prop) => {
    let {noteData, patch} = this.props
    let {value} = e.target

    this.setState({[prop]: value})
    noteData[prop] = value
    patch(noteData)
  }

  render(){
    const {value, duration} = this.state

    return (
      <div className={'noteEntry'}>
        <Form>
          <Form.Control
            value={value}
            placeholder={'la/n'}
            onChange={e => {this.handleChange(e, 'value')}}
            maxLength={5}
          />
          <Form.Control
            value={duration}
            placeholder={'ndr'}
            onChange={e => {this.handleChange(e, 'duration')}}
            maxLength={5}
          />
        </Form>
      </div>
    )
  }
}
