import React, {Component} from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios'

export default class LyricImport extends Component {
  state = {
    show: false,
    text: '',
    error: ''
  }

  componentDidMount(){
    const {title} = this.props
    this.mounted = true
    axios.get(`lyricImport/${title}`).then(res => {
      this.setState({text: res.data})
    }).catch(e => {
      this.setState({error: e.response ? e.response.data : e.message})
    })
  }

  componentWillUnmount(){
    this.mounted = false
  }

  handleShow = () => {
    this.setState({show: true})
  }

  handleClose = (e) => {
    if(this.mounted) this.setState({show: false})
  }

  handleSave = async e => {
    e.preventDefault()
    const {title, setData} = this.props
    const {text} = this.state
    axios.put(`lyricImport/${title}`, {text: text}).then(res => {
      this.handleClose()
      setData(res.data)
    }).catch(e => {
      this.setState({error: e.response ? e.response.data : e.message})
    })
  }

  handleTextChange = e => {
    let newValue = e.target.value
    this.setState({
      text: newValue
    })
  }

  render(){
    const {handleShow, handleClose, handleSave} = this
    const {show, error, text} = this.state
    const {title} = this.props
    return (
      <>
        <Button variant="primary" onClick={handleShow} className={'menuButtons'}>
          Import Lyrics
        </Button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Import Lyrics</Modal.Title>
          </Modal.Header>
          <Modal.Body><a target={'_blank'} href={'https://juiciobrennan.com/hyphenator/'}>Hyphenator</a></Modal.Body>
          <Modal.Body>Enter the text</Modal.Body>
          <Form>
            <Form.Control
              value={text}
              as={'textarea'}
              rows={'20'}
              placeholder={'Enter the text with spaces for each note in the soprano line. use a numeric suffix for custom length.'}
              onChange={this.handleTextChange}
            />
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="danger" type='submit' onClick={handleSave}>
                {`Overwrite existing lyrics`}
              </Button>
            </Modal.Footer>
          </Form>
          {error ? <div className={'error'}>{error}</div> : null}
        </Modal>
      </>
    )
  }
}
