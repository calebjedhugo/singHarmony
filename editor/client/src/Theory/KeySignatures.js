export default class KeySignatures {
  alteredNotes = (key) => {
    let f = {C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', A: 'A', B: 'B'}
    switch(key){
      case 'F#': f.E += '#'
      case 'B': f.A += '#'
      case 'E': f.D += '#'
      case 'A': f.G += '#'
      case 'D': f.C += '#'
      case 'G': f.F += '#'; break;
      case 'Gb': f.C += 'b'
      case 'Db': f.G += 'b'
      case 'Ab': f.D += 'b'
      case 'Eb': f.A += 'b'
      case 'Bb': f.E += 'b'
      case 'F': f.B += 'b'; break;
    }
    return f
  }
}
