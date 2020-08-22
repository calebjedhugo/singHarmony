import React, {Component} from 'react'
import Button from 'react-bootstrap/Button'
import Test from './Test'
import axios from 'axios'

export default class ApiButtons extends Component{
  state = {
    responseDisplay: 'Click a button to change me!'
  }

  get buttonContents(){
    return [
      {
        name: 'Get',
        action: () => {this.callApi('get')}
      },
      {
        name: 'Post',
        action: () => {this.callApi('post')}
      },
      {
        name: 'Patch',
        action: () => {this.callApi('patch')}
      },
      {
        name: 'Delete',
        action: () => {this.callApi('delete')}
      }
    ]
  }

  callApi = (method, data) => {
    return new Promise((resolve, reject) => {
      axios({
        url: 'test',
        data: data,
        method: method.toUpperCase()
      }).then(res => {
        console.log(res.data.message)
        this.setState({responseDisplay: JSON.stringify(res.data.message)})
        resolve()
      }).catch(e => {
        console.error(e)
        reject()
      })
    })
  }

  render(){
    const {responseDisplay} = this.state
    return (
    <div>
      {this.buttonContents.map(elem => {
        return <Button style={{margin: '10px'}} key={elem.name} onClick={elem.action}>{elem.name}</Button>
      })}
      <div>{responseDisplay}</div>
      <Test />
    </div>)
  }
}
