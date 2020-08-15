//How to Sing Harmony
//Copyright Caleb Hugo 2016
//All rights reserved
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
      this["stopCall" + note] = setTimeout(() => {
        this.smoothStop(self.soundingSourceNodes[note], self.soundingGainNodes[note]);
      }, (length * 1000) + 20);
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

// function NativeInstrument(type){
//     this.type = type;
//     this.sourceNodes = [];
// }
//
// let soundingNodes = {};
//
// NativeInstrument.prototype.play = function(note, dynamic, length, decayRate){
//     if(this.sourceNodes["source" + note]){
//         clearTimeout(this["stopCall" + note]);
//         nativeSmoothStop(this.sourceNodes["source" + note], this.sourceNodes["source" + note].gain);
//     }
//     this.newSource = this.soundscape.createOscillator();
//     this.newSource.type = this.type;
//     this.newSource.gain = this.soundscape.createGain();
//     this.newSource.frequency.value = noteConvert.convert(note, true);
//     this.newSource.gain.value = dynamics[dynamic];
//     this.newSource.connect(this.newSource.gain);
//     this.newSource.gain.connect(this.soundscape.destination)
//     //make an error handler so that we know that a note doesn't exist
//     var self = this;
//     if(dynamic){
//         this.newSource.gain.value = dynamics[dynamic]/10;
//     }
//     else if(this.soundscape[this.type + "gain"].gain.value == 0){
//         this.newSource.gain.value = dynamics["mf"];
//     }
//     //make an error handler so that we know when a dynamic is incorrect.
//     this.sourceNodes["source" + note] = this.newSource;
//     if(typeof length != "object"){
//         this["stopCall" + note] = setTimeout(function(){
//             nativeSmoothStop(self.sourceNodes["source" + note], self.sourceNodes["source" + note].gain);
//         }, (length * 1000) + 10);
//     }
//     else{
//         soundingNodes[length.keyCode] = self.newSource;
//     }
//     this.newSource.start();
//     this.playing = true;
//     if(typeof decayRate == "number")
//         decay(this.newSource, this.newSource.gain, decayRate)
// }
//
// NativeInstrument.prototype.muteAll = function(){
//     for(var idx = 0; idx < this.sourceNodes.length; idx += 1){
//         nativeSmoothStop(this.sourceNodes[idx], this.sourceNodes[idx].gain);
//     }
// }
//
// function nativeSmoothStop(sourceNode, gainNode){
//     var stopping = setInterval(function(){
//         gainNode.gain.value -= .05;
//         if(gainNode.gain.value <= 0){
//             clearInterval(stopping)
//         }
//     }, 1);
// }
//
// function decay(sourceNode, gainNode, rate){
//     var decayStopping = setInterval(function(){
//         gainNode.gain.value -= .05;
//         if(gainNode.gain.value <= 0){
//             clearInterval(decayStopping)
//             sourceNode.stop();
//         }
//     }, rate * 20);
// }
//
// NativeInstrument.prototype.changeDynamic = function(dynamic, length){
//     var difference = dynamics[dynamic] - this.vca.gain.value;
//     var changing = setInterval(() => {
//         this.vca.gain.value += difference/(length*100)
//     }, 10)
//     setTimeout(function(){clearInterval(changing)}, length*1000);
// }
//
// NativeInstrument.prototype.articulate = function(sourceNode, strength){
//     var oldGain = sourceNode.gain.value;
//     sourceNode.gain.value = 0;
//     if(strength){
//         setTimeout(() => {this.vca.gain.value = strength}, 50);
//         setTimeout(() => {this.vca.gain.value = oldGain}, 100)
//     }
//     else
//         setTimeout(() => {this.vca.gain.value = oldGain}, 50);
// }
