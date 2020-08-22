import React, {Component} from 'react'
import Form from 'react-bootstrap/Form'
import axios from 'axios'

export default class Editor extends Component {
  state = {
    error: ''
  }

  patch = (newData) => {
    let {selectedSong} = this.props
    axios.patch(`songData/${selectedSong}`, newData).catch(e => {
      this.setState({error: e.response ? e.response.data : e.message})
    })
  }

  render(){
    const {data, error} = this.props
    return (
      <>
        {error ? <div className='error'>{error}</div> : null}
        <MetaDataEdit patch={this.patch} data={data}/>
      </>
    )
  }
}

class MetaDataEdit extends Component {
  state = {
    prettyTitle: this.props.data.metaData.prettyTitle
  }

  handleTitleChange = (e) => {
    let {data, patch} = this.props
    data.metaData.prettyTitle = e.target.value
    patch(data)
    this.setState({prettyTitle: e.target.value})
  }

  render(){
    const {prettyTitle} = this.state

    return (
      <Form>
        <Form.Control
          value={prettyTitle}
          placeholder={'i.e. Amazing Grace'}
          onChange={this.handleTitleChange}
        />
      </Form>
    )
  }
}
