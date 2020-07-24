// props = {
//     type: String, /*treble, base, alto, tenor, or grand*/
//     width: Number /*width of the staff in pixels*/
//     clef: Boolean /*should the clef render*/
//     key: String /*the major version. For signature only.*/
// }

import React, { Component } from 'react';
import Vex from 'vexflow'

export class Staff extends Component {
    constructor(props, staticProps = {}){
        super(props)
        this.setCanvasElement = element => {
          this.canvasElement = element
        }
        this.staticProps = staticProps
        this.VF = Vex.Flow;
        this.canvas = <canvas ref={this.setCanvasElement}></canvas>
    }

    get width(){
      return this.props.width || this.staticProps.width || Math.min(400, window.innerWidth * .75)//default to 400px
    }

    initStaff(){
      let {grand} = this.props //We only want to render the notes
      let {clef, padding} = this.staticProps
      let type = this.props.type || 'treble' //the staff on which to render.

      // Create a canvas renderer
      this.renderer = new this.VF.Renderer(this.canvasElement, this.VF.Renderer.Backends.CANVAS);

      // Size our canvas:
      padding = padding !== undefined || Math.min(50, window.innerWidth * .03)
      this.renderer.resize(this.width + (padding * 2), 200);

      // And get a drawing context:
      this.context = this.renderer.getContext();

      // Create a stave at position 10, 40 of the passed in width on the canvas.
      this.stave = new this.VF.Stave(0, 0, this.width)
      if(grand){
        this.trebleStaff = new this.VF.Stave(0, 0, this.width)
        this.bassStaff = new this.VF.Stave(0, 75, this.width)
      } else {
        this[`${type}Staff`] = new this.VF.Stave(10, 0, this.width)
      }

      if(grand){
        if(clef) this.trebleStaff.addClef('treble');
        this.trebleStaff.setContext(this.context).draw();
        if(clef) this.bassStaff.addClef('bass');
        this.bassStaff.setContext(this.context).draw();
      } else {
        if(clef) this[`${type}Staff`].addClef(type);
        this[`${type}Staff`].setContext(this.context).draw();
      }
    }

    componentDidMount(){
      this.initStaff()
    }

    render(){
      return this.canvas
    }
}
