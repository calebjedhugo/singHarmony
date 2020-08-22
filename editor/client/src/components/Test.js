import React, {Component} from 'react'

export default class Test extends Component{
  constructor(props){
    super(props)
    this.state = {
      prop: 'value'
    }
  }

  get testResult(){
    let f = 'test'

    //Code goes here.

    // console.log(f)
    return f
  }

  render(){
    const {prop} = this.state
    return (
      <>
        <h1>{'Front End Test Area'}</h1>
        <div>{this.testResult}</div>
      </>
    )
  }
}
