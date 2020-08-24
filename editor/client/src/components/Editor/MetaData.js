import React, {Component} from 'react'
import Form from 'react-bootstrap/Form'

export default class MetaData extends Component {
  state = {
    ...this.props.metaData
  }

  handleChange = (e, prop) => {
    let {metaData, patch} = this.props
    metaData[prop] = e.target.value
    patch(metaData)
    this.setState({[prop]: e.target.value})
  }

  render(){
    const {prettyTitle, keySignature} = this.state

    return (
      <Form>
        <Form.Control
          value={prettyTitle}
          placeholder={'i.e. Amazing Grace'}
          onChange={e => {this.handleChange(e, 'prettyTitle')}}
        />
        <Form.Control
          value={keySignature}
          placeholder={'i.e. C'}
          onChange={e => {this.handleChange(e, 'keySignature')}}
        />
      </Form>
    )
  }
}
