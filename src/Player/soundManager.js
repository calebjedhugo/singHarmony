import piano from './piano'
import base64Binary from './base64Binary'

const sounds = {piano: piano}

class SampledInstrument{
  constructor(type, soundscape){
    this.soundscape = soundscape
    this.type = type
    this.sounds = {}

    for(let sound in sounds[type]){
      this.sounds[sound] = base64Binary.decodeArrayBuffer(sounds[type][sound])
      this.primeSound(sound, this.sounds[sound])
    }
    window.play = this.play
  }

  dynamics = {"fff": 1, "ff": .875, "f": .75, "mf": .625, "mp": .5, "p": .375, "pp": .25, "ppp": .125, "n": .01}

  stoppingNodes = {}
  gainNodes = {}
  sourceNodes = {}

  primeSound = (note, fileData) => {
    if(this.sourceNodes[note])
      this.sourceNodes[note].ready = false;
    this.gainNodes[note] = this.soundscape.createGain();
    this.gainNodes[note].connect(this.soundscape.destination);
    this.gainNodes[note].gain.value = this.dynamics["mf"];
    this.soundscape.decodeAudioData(fileData, decodedData => {
      this.sourceNodes[note] = this.soundscape.createBufferSource();
      this.sourceNodes[note].buffer = decodedData;
      this.sourceNodes[note].connect(this.gainNodes[note])
      this.sourceNodes[note].ready = true;
    }, (err) => {console.error(err.message, fileData)});
  }

  //For resolving a promise at the right time, but without playing a sound.
  timelyPromise = (length) => {
    return new Promise(resolve => {
      //We still want to resolve at the right time.
      setTimeout(resolve, (length * 1000));
    })
  }

  play = (note, dynamic = 'mf', length = 1, tied) => {
    note = this.noteConvert(note);
    if((this.sourceNodes[note] && !(this.sourceNodes[note].ready))) {
      console.log(`The ${note} on the ${this.type} is priming.`)
      return this.timelyPromise(length)
    }


    if(this.sourceNodes[note] === undefined){
      console.log(
        `The ${note} on the ${this.type} out of the instrument's range or has failed to be included.`,
        this.sourceNodes[note]
      )
      return this.timelyPromise(length)
    }

    let sourceNode = this.sourceNodes[note]
    let gainNode = this.gainNodes[note]

    //Set gain.
    if(this.dynamics[dynamic] === undefined){
      console.warn(`${dynamic} is not a valid dynamic.`, Object.keys(this.dynamics))
    }
    gainNode.gain.value = this.dynamics[dynamic] || .625;

    if(this.sounds[note]){
      sourceNode.start(0);
      if(this.sounds[note].byteLength == 0){ //firefox is a little fussy sometimes.
        this.sounds[note] = base64Binary.decodeArrayBuffer(sounds[this.type][note])
      }
      this.primeSound(note, this.sounds[note])
    }
    else
      console.log(note + " is not available for the " + this.type);

    return new Promise(resolve => {
      setTimeout(() => {
        let stop = () => {this.smoothStop(sourceNode, gainNode)}
        if(!tied){
          resolve() //resolve with precision.
          setTimeout(stop, 20) //Allow sound to overlap a bit.
        } else { //the note is tied, so whatever called this needs to know how to stop it.
          resolve(stop) //Note we are returning HOW to stop it. We are not stopping it yet.
        }
      }, (length * 1000))
    })
  }

  noteConvert = note => {
    try{
      let f = note.split("");
      let noteInitial = f[0].toUpperCase();
      var octave = Number(f.pop());
      var idx = 1;
      var sharpsVsFlats = 0;
      while(/#|b/.test(f[idx])){
        if(f[idx] == "#"){
          f[0] = Object.keys(this.notesMeta)[(this.notesMeta[f[0]][1] + 1) % 12];
          sharpsVsFlats += 1;
        }
        if(f[idx] == "b"){
          f[0] = Object.keys(this.notesMeta)[(this.notesMeta[f[0]][1] + 143) % 12];
          sharpsVsFlats -= 1;
        }
        idx += 1;
      }
      if(this.notesMeta[noteInitial][1] + sharpsVsFlats < 0) octave -= 1;
      if(this.notesMeta[noteInitial][1] + sharpsVsFlats > 11) octave += 1;
      return `${f[0]}/${octave}`
    } catch(e){
      console.error(`${note} could not be converted.`)
      throw new Error(e.message)
    }
  }

  notesMeta = {"C": [261.626, 0], "C#": [277.18, 1], "D": [293.66, 2],
                "Eb": [311.13, 3], "E": [329.63, 4], "F": [349.23, 5],
                "F#": [369.99, 6], "G": [392.00, 7], "Ab": [415.30, 8],
                "A": [440, 9], "Bb": [466.16, 10], "B": [493.88, 11]}

  smoothStop = (sourceNode, gainNode) => {
    let interval = setInterval(() => {
      gainNode.gain.value = Math.max(gainNode.gain.value - .05, .01);
      if(gainNode.gain.value <= .01){
        sourceNode.stop(0)
        clearInterval(interval)
      }
    }, 1);
  }
}

export default class SoundManager {
  constructor(){
    const sampleRate = 44100
    var AudioCtor = window.AudioContext || window.webkitAudioContext
    var context = new AudioCtor()

    // Check if hack is necessary. Only occurs in iOS6+ devices
    // and only when you first boot the iPhone, or play a audio/video
    // with a different sample rate
    var buffer = context.createBuffer(1, 1, sampleRate)
    var dummy = context.createBufferSource()
    dummy.buffer = buffer
    dummy.connect(context.destination)
    dummy.start(0)
    dummy.disconnect()

    context.close() // dispose old context
    context = new AudioCtor()

    this.soundscape = context
  }

  verifySoundUnlocked = () => {
    if (this.soundUnlocked || !this.soundscape) {
      return;
    }

    var buffer = this.soundscape.createBuffer(1, 1, 22050);
    var source = this.soundscape.createBufferSource();
    source.buffer = buffer;
    source.connect(this.soundscape.destination);
    source.start(0);

    // by checking the play state after some time, we know if we're really unlocked
    setTimeout(function() {
      if((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
        this.soundUnlocked = true;
      }
    }, 0);
  }

  soundUnlocked = false

  sampledInstrument = type => {
    return new SampledInstrument(type, this.soundscape)
  }
}
