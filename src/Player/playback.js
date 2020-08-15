var nativePiano = new NativeInstrument("triangle");
var noteIdxAccess = [sopranoNotes,altoNotes,tenorNotes,bassNotes];
var instrumentArray = ["Piano", "Triangle", "Square", "Sine", "Sawtooth"]
var currentSoundIndex = 1;
var changeInstrumentButton = document.getElementById("changeInstrument");
var rhythmIdxAccess = [sopranoRhythm,altoRhythm,tenorRhythm,bassRhythm];
var currentDynamic
var pianoActive = true;

function changeSound(instrument){ //just pass it with an uppercase.
    currentSoundIndex += 1
    currentSoundIndex = currentSoundIndex % instrumentArray.length;
    if(instrument) currentSoundIndex = instrumentArray.indexOf(instrument);
    if(instrumentArray[currentSoundIndex].toLowerCase() == "piano"){
        if(soundsReady) pianoActive = true;
        else currentSoundIndex += 1;
    }
    else pianoActive = false;
    changeInstrumentButton.textContent = instrumentArray[currentSoundIndex];
    if(!pianoActive)
        nativePiano.type = instrumentArray[currentSoundIndex].toLowerCase();
}

//debugging tool to see the current frame
/*viewFrame = document.createElement("div");
document.body.appendChild(viewFrame);
viewFrame.style.position = "fixed";
viewFrame.textContent = soundFrame;
viewFrame.style.top = "0px";
viewFrame.style.left = "300px";*/
//end debugging tool. Comment when finished.

function getDynamic(){
    if(activeVoices < 2)
        return "f";
    if(activeVoices == 2)
        return "mf";
    if(activeVoices == 3)
        return "mp";
    if(activeVoices == 4)
        return "p";
}

function playActiveVoices(){
    for(var idx = voiceButtons.length - 1; idx >= 0; idx -= 1){
        if(voiceButtons[idx].on){
            var note = noteIdxAccess[idx][soundFrame][selectedSongIndex];
            var length = ((rhythmIdxAccess[idx][soundFrame][selectedSongIndex]/(tempo/60))*resolution/tempoChanges[soundFrame][selectedSongIndex]);
            if(note){
                if(soundsReady && pianoActive)
                    piano.play(note,getDynamic(),length);
                else
                    nativePiano.play(note,getDynamic(),length,4);
            }
        }
    }
}

var playingAlready = false;

playButton.addEventListener("click", function(){
    if(!playingAlready){
        playingAlready = true; //This is to prevent two recursive timeouts.
        setTimeout(function playing(){
            if(playButton.on && soundFrame < stopFrame){
                soundFrame += 1;
                //viewFrame.textContent = soundFrame; //comment when finished
                playActiveVoices();
                setTimeout(playing, 60/tempo*resolution*1000/tempoChanges[soundFrame][selectedSongIndex]);
                if(soundFrame >= imageChanges[pageNumber][selectedSongIndex] - 1 && imageChanges[pageNumber])
                    if(imageChanges[pageNumber][selectedSongIndex] != 0)
                        music.nextPage();
            }
            else{
                clearTimeout(playing);
                playingAlready = false;
            }
            if(soundFrame == stopFrame && playButton.on){
                playButton.click();
            }
        }, 60/tempo*resolution*1000/tempoChanges[soundFrame][selectedSongIndex]);
    }
});
