import React, {Component} from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios'

export default class TimeSignatureChange extends Component {
  state = {
    show: false,
    num: '',
    denom: '',
    error: ''
  }

  componentDidMount(){
    this.mounted = true
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
    const {text, num, denom} = this.state
    axios.patch(`timeSignature/${title}`, {timeSignature: [num, denom]}).then(res => {
      this.handleClose()
      setData(res.data)
    }).catch(e => {
      this.setState({error: e.response ? e.response.data : e.message})
    })
  }

  handleChange = (e, prop) => {
    let {value} = e.target
    this.setState({
      [prop]: value
    })
  }

  render(){
    const {handleShow, handleClose, handleSave} = this
    const {show, error, num, denom} = this.state
    const {title} = this.props
    return (
      <>
        <Button variant="primary" onClick={handleShow} className={'menuButtons'}>
          Time Signatures
        </Button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Overwrite Time Signatures</Modal.Title>
          </Modal.Header>
          <Modal.Body>Enter the new Time Signature</Modal.Body>
          <Form>
            <div className={'timeSignatureEntry'}>
              <Form.Control
                value={num}
                onChange={(e) => {this.handleChange(e, 'num')}}
              />
            </div>
            {'/'}
            <div className={'timeSignatureEntry'}>
              <Form.Control
                value={denom}
                onChange={(e)=> {this.handleChange(e, 'denom')}}
              />
            </div>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="danger" type='submit' onClick={handleSave}>
                {`Overwrite existing time signatures`}
              </Button>
            </Modal.Footer>
          </Form>
          {error ? <div className={'error'}>{error}</div> : null}
        </Modal>
      </>
    )
  }
}
