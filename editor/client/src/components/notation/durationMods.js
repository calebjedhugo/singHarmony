// pass in a duration string (`ds`) and get an object back.
// example of alterations: '2drfbtos' is a dotted half note rest, with a fermata,
// no beam, tied to the next note, offset, and slurred. Non-vexflow mods are removed, leaving only d and r
export default (ds) => {
  const durationMods = new DurationMods(ds)

  const f = {}

  while(durationMods.unshiftMods()){
    switch(durationMods.output){
      case 'o': f.manuallyOffset = true; break;
      case 'b': f.noBeam = true; break;
      case 'f': f.fermata = true; break;
      case 's': f.slur = true; break;
      case 't': f.tie = true; break;
      case 'r': f.rest = true; break;
      case 'd': f.dotted = true; break;
    }
  }

  //dots and rest need to be put back in for Vewflow.
  f.duration = `${durationMods.ds}${f.dotted ? 'd' : ''}${f.rest ? 'r' : ''}`
  return f
}

class DurationMods {
  constructor(ds){
    this.ds = ds
  }

  modRegexp = /^(f|b|t|o|s|r|d)$/

  output = ''

  unshiftMods = () => {
    const da = this.ds.split('')
    for(let i = 0; i < da.length; i++){
      if(this.modRegexp.test(da[i])){
        this.output = da.splice(i, 1)[0]
        this.ds = da.join('')
        return true
      }
    }
    return false
  }
}
