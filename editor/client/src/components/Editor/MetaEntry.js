import React, {Component} from 'react'
import Form from 'react-bootstrap/Form'

export default class MetaEntry extends Component {

  get tempoResolution(){
    const {tempoResolution} = this.props.data
  }

  get ts(){
    const {ts} = this.props.data
  }

  render(){
    const {data, patch} = this.props
    return (
      <>
        <div><TS data={data.ts} patch={newData => {patch(newData, 'ts')}} /></div>
        <div><TempoChangeResolution data={data.tempoChangeResolution} patch={newData => {patch(newData, 'tempoResolution')}} /></div>
        <div><TempoChanges data={data.tempoChanges} patch={newData => {patch(newData, 'tempoChanges')}} /></div>
      </>
    )
  }
}

class TempoChangeResolution extends Component {

  state = {
    tempoChangeResolution: this.props.data
  }

  handleChange = (e, idx) => {
    let {resolution, patch} = this.props
    let {value} = e.target

    this.setState({tempoChangeResolution: value})
    patch(value)
  }

  render(){
    return (
      <>
        <div className={'tempoResolutionEntry'}>
          <Form>
            <Form.Control
              value={this.state.tempoChangeResolution}
              placeholder={8}
              onChange={e => {this.handleChange(e)}}
              maxLength={1}
            />
          </Form>
        </div>
      </>
    )
  }
}

class TS extends Component {
  state = {
    ...this.props.data
  }

  handleChange = (e, idx) => {
    let {data, patch} = this.props
    let {value} = e.target

    this.setState({[idx]: value})
    data[idx] = value
    patch(data)
  }

  render(){
    return (
      <>
        <div className={'timeSignatureEntry'}>
          <Form>
            <Form.Control
              value={this.state[0]}
              placeholder={4}
              onChange={e => {this.handleChange(e, 0)}}
              maxLength={1}
            />
          </Form>
        </div>
            {'/'}
        <div className={'timeSignatureEntry'}>
          <Form>
            <Form.Control
              value={this.state[1]}
              placeholder={4}
              onChange={e => {this.handleChange(e, 1)}}
              maxLength={1}
            />
          </Form>
        </div>
      </>
    )
  }
}

class TempoChanges extends Component {
  state = {
    ...this.props.data
  }

  handleChange = (e, idx) => {
    let {data, patch} = this.props
    let {value} = e.target

    this.setState({[idx]: value})
    data[idx] = value
    patch(data)
  }

  get changes(){
    const {data} = this.props
    return data.map((change, idx) => {
      return (
        <div className={'tempoChangeEntry'} key={idx}>
          <Form >
            <Form.Control
              value={this.state[idx]}
              placeholder={1}
              onChange={e => {this.handleChange(e, idx)}}
              maxLength={3}
            />
          </Form>
        </div>
      )
    })
  }

  render(){
    return (
      this.changes
    )
  }
}
