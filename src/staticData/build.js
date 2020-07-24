const fs = require('fs')

const altoNotes = require('./oldData/altoNotes.js')
const altoRhythm = require('./oldData/altoRhythm.js')
const bassNotes = require('./oldData/bassNotes.js')
const bassRhythm = require('./oldData/bassRhythm.js')
const sopranoNotes = require('./oldData/sopranoNotes.js')
const sopranoRhythm = require('./oldData/sopranoRhythm.js')
const tenorNotes = require('./oldData/tenorNotes.js')
const tenorRhythm = require('./oldData/tenorRhythm.js')
const tempoChanges = require('./oldData/tempoChanges.js')
const songData = require('./oldData/songData.js')

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

/*[{
  s: [
    {value: 'c/5', duration: 'w'}
  ],
  a: [
    {value: 'g#/4', duration: '4'},
    {value: 'g/4', duration: '4'},
    {value: 'f/4', duration: '4'},
    {value: 'b/4', duration: '4'}
  ],
  t: [
    {value: 'c/4', duration: '1'}
  ],
  b: [
    {value: 'ab/3', duration: '1'}
  ]
},{
  s: [
    {value: 'g#/4', duration: '4'},
    {value: 'g/4', duration: '4'},
    {value: 'f/4', duration: '4'},
    {value: 'b/4', duration: '4'}
  ],
  a: [
    {value: 'c/5', duration: '1'}
  ],
  t: [
    {value: 'c/4', duration: '1'}
  ],
  b: [
    {value: 'ab/3', duration: '1'}
  ]
}]*/

for(let i = 0; i < 1/*songTitles.length*/; i++){
  let fileName = songTitles[i].toLowerCase().replace(/\s/g, '_').replace(/\W/g, '')
  let notes = [], measure = {s: [], a: [], t: [], b: []}
  for(let i2 = 0; i2 < sopranoNotes.length; i2++){
    if(sopranoNotes[i2][i]){
      measure.s.push({value: sopranoNotes[i2][i], duration: sopranoRhythm[i2][i]})
    }
    if(i2 % songData.subsPerMeasure[i] === 0 && i2 !== 0){
      if(!measure.s.length && !measure.a.length && !measure.t.length && !measure.b.length){
        break;
      }
      notes.push(measure)
      measure = {s: [], a: [], t: [], b: []}
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
  console.log(data.notes)
}
