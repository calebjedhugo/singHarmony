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
  }

  dynamics = {"fff": 1, "ff": .875,"f": .75,"mf": .625,"mp": .5,"p": .375,"pp": .25,"ppp": .125, "n": 0}

  soundingSourceNodes = []
  soundingGainNodes = []
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

  play = (note, dynamic, length) => {
    note = this.noteConvert(note);
    if((this.sourceNodes[note])){
      if(!(this.sourceNodes[note].ready)){
        console.log("The " + note + " on the " + this.type + " is priming.")
        return
      }
    }
    else{
      console.log("The " + note + " on the " + this.type + " does not exist.")
      return
    }
    var self = this;
    if(this.soundingSourceNodes[note]){
      clearTimeout(this["stopCall" + note])
      this.smoothStop(this.soundingSourceNodes[note], this.soundingGainNodes[note]);
    }
    //make an error handler so that we know that a note doesn't exist
    if(dynamic){
      this.gainNodes[note].gain.value = this.dynamics[dynamic];
    }

    if(this.sounds[note]){
      this.sourceNodes[note].start();
      this.soundingSourceNodes[note] = this.sourceNodes[note]
      this.soundingGainNodes[note] = this.gainNodes[note]
      if(this.sounds[note].byteLength == 0) //firefox is a little fussy sometimes.
        this.sounds[note] = base64Binary.decodeArrayBuffer(sounds[this.type][note])
      this.sourceNodes[note] = null;
      this.primeSound(note, this.sounds[note])
    }
    else
      console.log(note + " is not available for the " + this.type);
    //make an error handler so that we know when a dynamic is incorrect.
    if(length){
      return new Promise(resolve => {
        this["stopCall" + note] = setTimeout(() => {
          resolve() //resolve with precision.
          setTimeout(() => { //Allow sound to overlap a bit.
            this.smoothStop(self.soundingSourceNodes[note], self.soundingGainNodes[note])
          }, 20)
        }, (length * 1000));
      })
    }
  }

  noteConvert = note => {
    if(typeof note != "string" || note.length < 2){
      console.log(note + " could not be handled by Player.");
      return;
    }
    var originialNote = note.split("");
    note = note.split("");
    var octave = Number(note.pop());
    var idx = 1;
    var sharpsVsFlats = 0;
    while(/#|b/.test(note[idx])){
      if(note[idx] == "#"){
        note[0] = Object.keys(this.notesMeta)[(this.notesMeta[note[0]][1] + 1) % 12];
        sharpsVsFlats += 1;
      }
      if(note[idx] == "b"){
        note[0] = Object.keys(this.notesMeta)[(this.notesMeta[note[0]][1] + 143) % 12];
        sharpsVsFlats -= 1;
      }
      idx += 1;
    }
    if(this.notesMeta[originialNote[0]][1] + sharpsVsFlats < 0) octave -= 1;
    if(this.notesMeta[originialNote[0]][1] + sharpsVsFlats > 11) octave += 1;
    return `${note[0]}/${octave}`
  }

  notesMeta = {"C": [261.626, 0], "C#": [277.18, 1], "D": [293.66, 2],
                "Eb": [311.13, 3], "E": [329.63, 4], "F": [349.23, 5],
                "F#": [369.99, 6], "G": [392.00, 7], "Ab": [415.30, 8],
                "A": [440, 9], "Bb": [466.16, 10], "B": [493.88, 11]}

  smoothStop = (sourceNode, gainNode) => {
    let stopping = setInterval(function(){
      gainNode.gain.value -= .05;
      if(gainNode.gain.value <= 0){
        gainNode.gain.value = 0;
        clearInterval(stopping)
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
