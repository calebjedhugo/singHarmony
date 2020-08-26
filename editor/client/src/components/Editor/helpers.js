export class AddRemove {
  constructor(props){
    if(typeof props.add !== 'function' || typeof props.remove !== 'function'){
      throw new Error(`The class, 'AddRmove', requires both 'props.add' and 'props.remove' functions.`)
    }
    this.add = props.add
    this.remove = props.remove
  }

  adding = false
  removing = false
  timeout = 2000

  check = (e) => {
    if(e.keyCode === 109 || e.keyCode === 189){ // '-' key
      e.preventDefault()
      if(this.removing){
        this.remove()
      } else {
        this.removing = true
        setTimeout(() => {
          this.removing = false
        }, this.timeout)
      }
    } else if(e.keyCode === 107 || e.keyCode === 187){ // '+' key
      e.preventDefault()
      if(this.adding){
        this.add()
      } else {
        this.adding = true
        setTimeout(() => {
          this.adding = false
        }, this.timeout)
      }
    }
  }
}
