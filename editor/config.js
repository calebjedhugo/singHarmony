const path = require('path')

module.exports.dataPath = path.join(path.dirname(require.main.filename), `../src/staticData/songData/`)

module.exports.dataTemplate = () => {
  return {
    "metaData": {
      "resolution": 0.5,
      "tempo": 100,
      "keySignature": "C"
    },
    "notes": []
  }
}
