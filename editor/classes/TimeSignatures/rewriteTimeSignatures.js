module.exports = (newTimeSignature, songData) => {
  let measures = songData.notes
  measures.forEach(measure => {
    measure.ts = newTimeSignature
  })
  return songData
}
