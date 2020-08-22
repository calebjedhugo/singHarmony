const noteRegExp = /^[A-G]([b|#]+)?\/\d$/i

export function noteValidation(){
  var e = []
  for(let i = 0; i < arguments.length; i++){
    if(typeof arguments[i] !== 'string' || !noteRegExp.test(arguments[i])){
      e.push(`Required format is 'C/4'. Input was '${arguments[i]}'`)
    }
  }
  if(e.length) throw new Error(e.join('\n'))
  else return Array.from(arguments)
}
