import React, {Component} from 'react'
import Form from 'react-bootstrap/Form'
import {AddRemove} from './helpers'

export default class VoiceEntry extends Component {

  patch = (newData, idx) => {
    const {patch} = this.props
    let data = JSON.parse(JSON.stringify(this.props.data))
    data[idx] = newData
    patch(data)
  }

  add = (idx) => {
    const {patch} = this.props
    let data = JSON.parse(JSON.stringify(this.props.data))
    data.splice(idx + 1, 0, {
      value: undefined,
      duration: undefined
    })
    patch(data)
  }

  remove = (idx) => {
    const {patch} = this.props
    let data = JSON.parse(JSON.stringify(this.props.data))
    data.splice(idx, 1)
    patch(data, false)
  }


  get entries(){
    const {data} = this.props
    return data.map((entry, idx) => {
      let addRemove = new AddRemove({add: () => this.add(idx), remove: () => this.remove(idx)})
      return <NoteEntry check={addRemove.check} key={idx} noteData={entry} patch={newData => {this.patch(newData, idx)}}/>
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
    const {check} = this.props

    return (
      <div className={'noteEntry'}>
        <Form>
          <Form.Control
            value={value}
            placeholder={'la/n'}
            onChange={e => {this.handleChange(e, 'value')}}
            maxLength={5}
            onKeyDown={check}
          />
          <Form.Control
            value={duration}
            placeholder={'ndr'}
            onChange={e => {this.handleChange(e, 'duration')}}
            maxLength={5}
            onKeyDown={check}
          />
        </Form>
      </div>
    )
  }
}
