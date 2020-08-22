import React, {Component} from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export default class NewSongModal extends Component {
  state = {
    show: false,
    title: '',
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
    const {title} = this.state
    e.preventDefault()
    try{
      await this.props.newSong(title)
      this.handleClose()
    } catch(e){
      this.setState({error: e})
    }
  }

  handleTitleChange = e => {
    let newValue = e.target.value

    newValue = newValue
      .toLowerCase()
      .replace(/\s/g, '_')
      .replace(/\d|\W/, '')

    this.setState({
      title: newValue
    })
  }

  render(){
    const {handleShow, handleClose, handleSave} = this
    const {show, title, error} = this.state
    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          New Song
        </Button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Song</Modal.Title>
          </Modal.Header>
          <Modal.Body>Enter the Title</Modal.Body>
          <Form>
            <Form.Control
              value={title}
              placeholder={'i.e. amazing_grace'}
              onChange={this.handleTitleChange}
            />
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type='submit' onClick={handleSave}>
                {`Create ${title}`}
              </Button>
            </Modal.Footer>
          </Form>
          {error ? <div className={'error'}>{error}</div> : null}
        </Modal>
      </>
    )
  }
}
