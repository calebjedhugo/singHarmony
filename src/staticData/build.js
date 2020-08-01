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
  'A Mighty Fortress is Our God',
  'All Glory, Laud and Honor',
  'All Hail the Power of Jesus’ Name',
  'America the Beautiful',
  'Amazing Grace',
  'And Can It Be',
  'Angels We Have Heard on High',
  'Angels, from the Realms of Glory',
  'As with Gladness Men of Old',
  'At Calvary',
  'At the Cross',
  'Away in a Manger',
  'Battle Hymn of the Republic',
  'Blest Be the Tie That Binds',
  'Brethren, We Have Met to Worship',
  'Children of the Heavenly Father',
  'Christ Arose!',
  'Christ the Lord Is Risen Today',
  'Come, Thou Fount of Every Blessing',
  'Crown Him with Many Crowns',
  'Face to Face',
  'Fairest Lord Jesus',
  'For the Beauty of the Earth',
  'Go to Dark Gethsemane',
  'God of Our Fathers',
  'God Rest Ye Merry, Gentlemen',
  'Good Christian Men, Rejoice',
  'Grace Greater than Our Sin',
  'Hallelujah, What a Savior!',
  'Hark! the Herald Angels Sing',
  'Have Thine Own Way, Lord!',
  'Higher Ground',
  'Holy Holy Holy',
  'How Firm A Foundation',
  'How Great Our Joy',
  'I Heard the Bells on Christmas Day',
  'I Sing the Mighty Power of God',
  'I Surrender All',
  'In the Garden',
  'It Came upon the Midnight Clear',
  'It Is Well with My Soul',
  'Jesus Paid it All',
  'Joy to the World!',
  'Joyful, Joyful, We Adore Thee',
  'Just As I Am',
  'Leaning on the Everlasting Arms',
  'My Country, ‘Tis of Thee',
  'Nothing But the Blood',
  'O Come, All Ye Faithful',
  'O Come, O Come, Emmanuel',
  'O for a Thousand Tongues to Sing',
  'O Holy Night',
  'O Little Town of Bethlehem',
  'O Sacred Head, Now Wounded',
  'Praise Him! Praise Him!',
  'Praise to the Lord, the Almighty',
  'Rock of Ages',
  'Shall We Gather at the River?',
  'Silent Night! Holy Night!',
  'Standing on the Promises',
  'Take My Life and Let It Be',
  'The First Noel',
  'The Lord Bless You and Keep You',
  'The Old Rugged Cross',
  'The Solid Rock',
  'There Is a Fountain',
  'This Is my Father’s World',
  'To God Be the Glory',
  'We Three Kings',
  'Were You There?',
  'What Child Is This?',
  'When I Survey the Wondrous Cross',
  'While Shepherds Watched Their Flocks',
  'Wonderful Grace of Jesus'
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

let importCode = ['', 'export default {\n']
for(let i = 0; i < songTitles.length; i++){
  let fileName = songTitles[i].toLowerCase().replace(/\s/g, '_').replace(/\W/g, '') + '.json'
  importCode[0] += `import ${fileName.replace('.json', '')} from './${fileName}'\n`
  importCode[1] += `'${songTitles[i]}': ${fileName.replace('.json', '')},\n`
  let notes = [], measure = {s: [], a: [], t: [], b: [], ts: []}
  let measureLength = {s: 0, a: 0, t: 0, b: 0}
  let noteEnd = {s: 0, a: 0, t: 0, b: 0}
  let noteStart = {s: 0, a: 0, t: 0, b: 0}
  let flag= false
  for(let i2 = 0; i2 < oldNotes.s.length; i2++){
    for(let voice in oldNotes){
      if(oldNotes[voice][i2] && oldNotes[voice][i2][i]){
        let rest = restCheck(i2, noteEnd[voice], songData.subsPerBeat[i])
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
          duration: durationConvert(rhythm[voice][i2][i], songData.subsPerBeat[i])
        })
        noteStart[voice] = i2
        measureLength[voice] += rhythm[voice][i2][i]
        noteEnd[voice] += rhythm[voice][i2][i]
      }
    }
    if((i2 - songData.pickups[i]) % songData.subsPerMeasure[i] === 1 && i2 !== 1){
      if(!measure.s.length && !measure.a.length && !measure.t.length && !measure.b.length && i2 !== 0){
        break;
      }
      for(let voice in noteEnd){
        if(noteEnd[voice] <= i2){
          noteEnd[voice] = i2
        } else {
          if(measure[voice][measure[voice].length - 1]){
            measure[voice][measure[voice].length - 1].duration = durationConvert(i2 - noteStart[voice] + 1, songData.subsPerBeat[i])
          } else {
            // measure[voice].push()
          }
          measureLength[voice] -= (noteEnd[voice] - i2)
          if(oldNotes[voice][i2 + 1]){
            oldNotes[voice][i2 + 1][i] = oldNotes[voice][noteStart[voice]][i]
            if(rhythm[voice][i2 + 1]){
              rhythm[voice][i2 + 1][i] = noteEnd[voice] - i2
            } else console.log(rhythm[voice][i2 + 1], fileName, i2)
          } else console.log(oldNotes[voice][i2 + 1], fileName, i2)
        }
      }
      measure.ts = [Number(((measureLength.s || measureLength.a || measureLength.t || measureLength.b) * songData.resolution[i]).toFixed(0)), /(5|2)/.test(songData.resolution[i].toString()[2]) ? 4 : 8]
      notes.push(measure)
      measure = {s: [], a: [], t: [], b: [], ts: []}
      measureLength = {s: 0, a: 0, t: 0, b: 0}
    }
  }
  let data = {
    metaData: {
      resolution: songData.resolution[i],
      tempo: songData.tempo[i],
      pickups: songData.pickups[i],
      subsPerMeasure: songData.subsPerMeasure[i],
    },
    notes: notes
  }
  fs.writeFile(`songData/${fileName}`, JSON.stringify(data), e => {
    if(e) throw e
    console.log(`${fileName} has been created.`)
  })
}

fs.writeFile(`songData/index.js`, `${importCode[0]}\n\n${importCode[1]}}`, e => {
  if(e) throw e
  console.log(`songData/index.js has been created.`)
})
