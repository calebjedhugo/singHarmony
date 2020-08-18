export default class KeySignatures {
  alteredNotes = (key) => {
    let f = []
    switch(key){
      case 'F#': f.push('E#')
      case 'B': f.push('A#')
      case 'E': f.push('D#')
      case 'A': f.push('G#')
      case 'D': f.push('C#')
      case 'G': f.push('F#'); break;
      case 'Gb': f.push('Cb')
      case 'Db': f.push('Gb')
      case 'Ab': f.push('Db')
      case 'Eb': f.push('Ab')
      case 'Bb': f.push('Eb')
      case 'F': f.push('Bb'); break;
    }
    return f
  }
}
