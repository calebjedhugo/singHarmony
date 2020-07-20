import React, {Component} from 'react'

export default class NavButton extends Component {
  render(){
    const {value, action} = this.props
    return (
      <div className='navButton' onTouchStart={action}>
        {value}
      </div>
    )
  }
}
