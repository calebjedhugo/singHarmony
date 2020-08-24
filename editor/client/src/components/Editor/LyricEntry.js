import React, {Component} from 'react'
import Form from 'react-bootstrap/Form'

export default class LyricEntry extends Component {

  patch = (newData, verseNumber) => {
    const {patch} = this.props
    let data = JSON.parse(JSON.stringify(this.props.data))
    data[verseNumber] = newData
    patch(data)
  }

  get verses(){
    const {data} = this.props
    return data.map((verse, idx) => {
      return <VerseEntry label={idx + 1} key={idx} verse={verse} patch={newData => {this.patch(newData, idx)}}/>
    })
  }

  render(){
    return (
      this.verses
    )
  }
}

class VerseEntry extends Component{
  patch = (newData, wordNumber) => {
    const {patch} = this.props
    let data = JSON.parse(JSON.stringify(this.props.verse))
    data[wordNumber] = newData
    patch(data)
  }

  get words(){
    const {verse} = this.props
    return verse.map((word, idx) => {
      return <WordEntry key={idx} word={word} patch={newData => {this.patch(newData, idx)}}/>
    })
  }

  render(){
    const {label} = this.props
    return (
      <div className={'verseEntry'}>
        <div className={'verseLabel'}>{label}</div>
        {this.words}
      </div>
    )
  }
}

class WordEntry extends Component{
  state = {
    ...this.props.word
  }

  handleChange = (e, prop) => {
    let {word, patch} = this.props
    let {value} = e.target

    this.setState({[prop]: value})
    word[prop] = value
    patch(word)
  }

  render(){
    const {value, duration} = this.state

    return (
      <div className={'wordEntry'}>
        <Form>
          <Form.Control
            value={value}
            placeholder={'word'}
            onChange={e => {this.handleChange(e, 'value')}}
          />
          <Form.Control
            value={duration}
            placeholder={'ndr'}
            onChange={e => {this.handleChange(e, 'duration')}}
          />
        </Form>
      </div>
    )
  }
}
