const path = require('path')

module.exports.dataPath = path.join(path.dirname(require.main.filename), `../src/staticData/songData/`)
module.exports.lyricsPath = path.join(path.dirname(require.main.filename), `data/lyrics`)

module.exports.dataTemplate = () => {
  return {
    "metaData": {
      "tempo": 100,
      "keySignature": "C"
    },
    "notes": []
  }
}
