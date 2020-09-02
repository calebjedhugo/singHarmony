const fs = require('fs')

const tempoChanges = require('./oldData/tempoChanges.js')
const songData = require('./oldData/songData.js')

const oldNotes = {
  s: require('./oldData/sopranoNotes.js'),
  a: require('./oldData/altoNotes.js'),
  t: require('./oldData/tenorNotes.js'),
  b: require('./oldData/bassNotes.js')
}

const rhythm = {
  a: require('./oldData/altoRhythm.js'),
  b: require('./oldData/bassRhythm.js'),
  s: require('./oldData/sopranoRhythm.js'),
  t: require('./oldData/tenorRhythm.js')
}

let songTitles = [
  // ['A Mighty Fortress is Our God', 'C'],
  // ['All Glory, Laud and Honor', 'Bb'],
  // ['All Hail the Power of Jesus’ Name', 'G'],
  // ['America the Beautiful', 'Bb'],
  // ['Amazing Grace', 'G'],
  // ['And Can It Be', 'G'],
  // ['Angels We Have Heard on High', 'F'],
  // ['Angels, from the Realms of Glory', 'Bb'],
  // ['As with Gladness Men of Old', 'G'],
  // ['At Calvary', 'C'],
  // ['At the Cross', 'Eb'],
  // ['Away in a Manger', 'F'],
  // ['Battle Hymn of the Republic', 'Bb'],
  // ['Blest Be the Tie That Binds', 'F'],
  // ['Brethren, We Have Met to Worship', 'G'],
  // ['Children of the Heavenly Father', 'D'],
  // ['Christ Arose!', 'Bb'],
  // ['Christ the Lord Is Risen Today', 'C'],
  // ['Come, Thou Fount of Every Blessing', 'D'],
  // ['Crown Him with Many Crowns', 'Eb'],
  // ['Face to Face', 'Ab'],
  // ['Fairest Lord Jesus', 'Eb'],
  // ['For the Beauty of the Earth', 'Ab'],
  // ['Go to Dark Gethsemane', 'D'],
  // ['God of Our Fathers', 'Eb'],
  // ['God Rest Ye Merry, Gentlemen', 'G'],
  // ['Good Christian Men, Rejoice', 'F'],
  // ['Grace Greater than Our Sin', 'G'],
  // ['Hallelujah, What a Savior!', 'Bb'],
  // ['Hark! the Herald Angels Sing', 'F'],
  // ['Have Thine Own Way, Lord!', 'Eb'],
  // ['Higher Ground', 'G'],
  // ['Holy Holy Holy', 'D'],
  // ['How Firm A Foundation', 'Ab'],
  // ['How Great Our Joy', 'Bb'],
  // ['I Heard the Bells on Christmas Day', 'Eb'],
  // ['I Sing the Mighty Power of God', 'Bb'],
  // ['I Surrender All', 'Db'],
  ['In the Garden', 'Ab'],
  // ['It Came upon the Midnight Clear', 'Bb'],
  // ['It Is Well with My Soul', 'C'],
  // ['Jesus Paid it All', 'Db'],
  // ['Joy to the World!', 'D'],
  // ['Joyful, Joyful, We Adore Thee', 'G'],
  // ['Just As I Am', 'Db'],
  // ['Leaning on the Everlasting Arms', 'Ab'],
  // ['My Country, ‘Tis of Thee', 'F'],
  // ['Nothing But the Blood', 'F'],
  // ['O Come, All Ye Faithful', 'Ab'],
  // ['O Come, O Come, Emmanuel', 'G'],
  // ['O for a Thousand Tongues to Sing', 'Ab'],
  // ['O Holy Night', 'Eb'],
  // ['O Little Town of Bethlehem', 'F'],
  // ['O Sacred Head, Now Wounded', 'C'],
  // ['Praise Him! Praise Him!', 'G'],
  // ['Praise to the Lord, the Almighty', 'G'],
  // ['Rock of Ages', 'Bb'],
  // ['Shall We Gather at the River?', 'D'],
  // ['Silent Night! Holy Night!', 'Bb'],
  // ['Standing on the Promises', 'Bb'],
  // ['Take My Life and Let It Be', 'F'],
  // ['The First Noel', 'D'],
  // ['The Lord Bless You and Keep You', 'C'],
  // ['The Old Rugged Cross', 'Bb'],
  // ['The Solid Rock', 'F'],
  // ['There Is a Fountain', 'Bb'],
  // ['This Is my Father’s World', 'Eb'],
  // ['To God Be the Glory', 'Ab'],
  // ['We Three Kings', 'G'],
  // ['Were You There?', 'Eb'],
  // ['What Child Is This?', 'G'],
  // ['When I Survey the Wondrous Cross', 'F'],
  // ['While Shepherds Watched Their Flocks', 'C'],
  // ['Wonderful Grace of Jesus', 'C']
]

const valueConvert = value => {
  return value.slice(0, value.length - 1) + '/' + value.slice(value.length - 1)
}

const durationConvert = (value, subsPerBeat) => {
  let converted = Math.abs(Math.ceil(Number(subsPerBeat * 4) / Number(value)))
  if(!/^(1|2|4|8|16)$/.test(converted.toString())){
    if(converted === 3){
      converted = '4d';
    } else if(converted === 6){
      switch(subsPerBeat){
        case 2:
          converted = '2d';
          break;
        case 4:
          converted = '8d';
          break;
      }
    } else {
      console.log(`converted value of '${converted}' is not being handled.`)
    }
  }
  //This logic correctly handle half notes.
  if(((subsPerBeat * 4) % value) === converted && (subsPerBeat * 4) % value !== 0){
    converted += 'd'
  }
  return converted.toString()
}

const restCheck = (pos, noteEnd, subsPerBeat) => {
  if(noteEnd < pos - 1 && pos > 2){
    return {
      value: 'c/4',
      duration: `${durationConvert(pos - noteEnd - 1, subsPerBeat)}r`
    }
  } else{
    return false
  }
}

const getLyrics = (songTitle) => {
  return new Promise(resolve => {
    fs.readFile(`./oldData/lyrics/${songTitle}`, 'utf8', (e, data) => {
      resolve(data)
    })
  })
}

const writeFiles = async () => {
  let importCode = ['', 'export default {\n']
  for(let i = 38; i < 26; i++){
    let fileName = songTitles[0][0].toLowerCase().replace(/\s/g, '_').replace(/\W/g, '') + '.json'

    // let lyrics = await getLyrics(fileName.replace('.json', '.txt'))
    // lyrics = lyrics.split('\n\n')
    // lyrics = lyrics.map(verse => {
    //   let f = verse.replace(/\n/g, ' ')
    //   f = f.split(' ')
    //   while(f[f.length - 1].trim() === '') {
    //     f.pop()
    //   }
    //   return f
    // })

    importCode[0] += `import ${fileName.replace('.json', '')} from './${fileName}'\n`
    importCode[1] += `'${songTitles[0][0]}': ${fileName.replace('.json', '')},\n`
    let notes = [], measure = {s: [], a: [], t: [], b: [], ts: [], lyrics: [], tempoChanges: []}
    let measureLength = {s: 0, a: 0, t: 0, b: 0}
    let noteEnd = {s: 0, a: 0, t: 0, b: 0}
    let noteStart = {s: 0, a: 0, t: 0, b: 0}

    const subsPerBeat = 2
    const subsPerMeasure = 8

    for(let i2 = 0; i2 < oldNotes.s.length; i2++){
      measure.tempoChanges.push(tempoChanges[i2] ? tempoChanges[i2][i] : 1)
      for(let voice in oldNotes){
        if(oldNotes[voice][i2] && oldNotes[voice][i2][i]){
          let rest = restCheck(i2, noteEnd[voice], subsPerBeat)
          if(rest && i2 > 2){
            measure[voice].push(rest)
          }
          switch(rhythm[voice][i2][i]){
            case 5:
              rhythm[voice][i2][i] = 6;
              break;
            case 9:
              rhythm[voice][i2][i] = 10;
              break;
          }
          measure[voice].push({
            value: valueConvert(oldNotes[voice][i2][i]),
            duration: durationConvert(rhythm[voice][i2][i], subsPerBeat)
          })
          noteStart[voice] = i2
          measureLength[voice] += rhythm[voice][i2][i]
          noteEnd[voice] += rhythm[voice][i2][i]
        }
      }
      if((i2 - songData.pickups[i]) % subsPerMeasure === 1 && i2 !== 1){
        if(!measure.s.length && !measure.a.length && !measure.t.length && !measure.b.length && i2 !== 0){
          break;
        }

        //Add the Lyrics
        // let skipLength = []
        // measure.s.forEach(sNote => {
        //   let noteDuration = sNote.duration
        //   for(let verseIdx = 0; verseIdx < lyrics.length; verseIdx++){
        //     if(!measure.lyrics[verseIdx]) measure.lyrics[verseIdx] = []
        //     if(noteDuration[noteDuration.length - 1] === 'r') {
        //       measure.lyrics[verseIdx].push(
        //         {
        //           value: '', //No words with a rest.
        //           duration: noteDuration
        //         }
        //       )
        //       continue
        //     }
        //     if(skipLength[verseIdx] !== 0 && skipLength[verseIdx] !== undefined){
        //       skipLength[verseIdx] -= ((1 / noteDuration) * 1000)
        //       continue
        //     }
        //     word = lyrics[verseIdx].shift()
        //     if(!word){
        //       return //console.log(`lyrics are not well formed for ${fileName}`)
        //     }
        //     let lastLetter = word[word.length - 1]
        //     let lyricDuration = noteDuration
        //
        //     if(!isNaN(lastLetter)){
        //       skipLength[verseIdx] = ((1 / Number(lastLetter)) - (1 / noteDuration)).toFixed(3) * 1000
        //       lyricDuration = Number(lastLetter)
        //       word = word.slice(0, word.length - 1)
        //     }
        //
        //     measure.lyrics[verseIdx].push(
        //       {
        //         value: word,
        //         duration: lyricDuration.toString()
        //       }
        //     )
        //   }
        // })

        //If notes go over barlines, just trim them. We'll fix it later.
        for(let voice in noteEnd){
          if(noteEnd[voice] <= i2){
            noteEnd[voice] = i2
          } else {
            if(measure[voice][measure[voice].length - 1]){
              let newDuration = durationConvert(i2 - noteStart[voice] + 1, subsPerBeat)
              measure[voice][measure[voice].length - 1].duration = newDuration
              if(voice === 's') {
                measure.lyrics = measure.lyrics.map(verse => {
                  if(verse[measure[voice].length - 1]){
                    verse[measure[voice].length - 1].duration = newDuration
                  }
                  return verse
                })
              }
            } else {
              // measure[voice].push()
            }
            measureLength[voice] -= (noteEnd[voice] - i2)
            // oldNotes[voice][i2 + 1][i] = oldNotes[voice][noteStart[voice]][i]
            // rhythm[voice][i2 + 1][i] = (noteEnd[voice] - i2)
          }
        }
        measure.ts = [Number(((measureLength.s || measureLength.a || measureLength.t || measureLength.b) * songData.resolution[i]).toFixed(0)), /(5|2)/.test(songData.resolution[i].toString()[2]) ? 4 : 8]
        measure.tempoChangeResolution = measure.ts[1] / songData.resolution[i]
        notes.push(measure)
        measure = {s: [], a: [], t: [], b: [], ts: [], lyrics: [], tempoChanges: []}
        measureLength = {s: 0, a: 0, t: 0, b: 0}
      }
    }
    noteEnd = {s: 0, a: 0, t: 0, b: 0}
    let data = {
      metaData: {
        // resolution: songData.resolution[i],
        tempo: songData.tempo[i],
        // pickups: songData.pickups[i],
        // subsPerMeasure: songData.subsPerMeasure[i],
        keySignature: songTitles[0][1],
        fileName: fileName,
        prettyTitle: songTitles[0][0]
      },
      notes: notes
    }
    fs.writeFile(`songData/${fileName}`, JSON.stringify(data), e => {
      if(e) throw e
      console.log(`${fileName} has been created.`)
    })
  }

  // fs.writeFile(`songData/index.js`, `${importCode[0]}\n\n${importCode[1]}}`, e => {
  //   if(e) throw e
  //   console.log(`songData/index.js has been created.`)
  // })
}

// writeFiles()
