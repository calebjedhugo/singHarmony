module.exports = (newLyrics, songData) => {
  //make array of verses: `[v1, v2]`
  let lyrics = newLyrics.split('\n\n')

  //make arrays of words: `[[w1, w2], [w1, w2]]`
  lyrics = lyrics.map(verse => {
    let f = verse.replace(/\n/g, ' ')
    f = f.split(' ')
    while(f[f.length - 1].trim() === '') {
      //Remove what used to be a newline char at the end.
      f.pop()
    }
    return f
  })

  let measures = songData.notes

  for(let mi = 0; mi < measures.length; mi++) {
    //Add the Lyrics
    let skipLength = []
    let measure = measures[mi]
    measure.lyrics = []

    measure.s.forEach(sNote => {
      let noteDuration = sNote.duration

      //remove leading instructions for notation.
      while(/^(t|b|f|o)$/.test(noteDuration.slice(noteDuration.length - 1))) {
        noteDuration = noteDuration.slice(0, noteDuration.length - 1)
      }

      for(let verseIdx = 0; verseIdx < lyrics.length; verseIdx++){
        if(!measure.lyrics[verseIdx]) measure.lyrics[verseIdx] = []
        if(noteDuration[noteDuration.length - 1] === 'r') {
          measure.lyrics[verseIdx].push(
            {
              value: '', //No words with a rest.
              duration: noteDuration
            }
          )
          continue
        }
        if(skipLength[verseIdx] !== 0 && skipLength[verseIdx] !== undefined){
          skipLength[verseIdx] -= ((1 / noteDuration) * 1000)
          continue
        }
        word = lyrics[verseIdx].shift()
        if(!word){
          measure.lyrics[verseIdx].push(
            {
              value: '', //No words with a rest.
              duration: noteDuration
            }
          )
          continue
        }
        let lastLetter = word[word.length - 1]
        let lyricDuration = noteDuration

        if(!isNaN(lastLetter)){
          skipLength[verseIdx] = ((1 / Number(lastLetter)) - (1 / noteDuration)).toFixed(3) * 1000
          lyricDuration = Number(lastLetter)
          word = word.slice(0, word.length - 1)
        }

        measure.lyrics[verseIdx].push(
          {
            value: word,
            duration: lyricDuration.toString()
          }
        )
      }
    })
  }

  return songData
}
