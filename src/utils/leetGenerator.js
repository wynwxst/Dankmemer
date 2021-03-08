// This file is more or less from http://1337.me, with some modifications
// Therefore, this is technically NOT perryware and the bad code can be ignored

let transtype
let textin

const changeWords = () => {
  cchange('pwn', 'own')
  cchange(' ownzor', ' own')
  achange(' is good ', ' owns ')
  achange(' are good ', ' own ')
  achange(' am good ', ' own ')
  cchange('good you', 'better than you')
  cchange('good me', 'better than me')
  cchange('good them', 'better than them')
  cchange('good him', 'better than him')
  cchange('good her', 'better than her')
  cchange('good it', 'better than it')
  cchange('good us', 'better than us')
  cchange('good that', 'better than that')
  cchange('good all', 'better than all')
  achange(' defeated ', ' owned ')
  cchange('my are good', 'my own')
  cchange('your are good', 'your own')
  cchange('their are good', 'their own')
  cchange('our are good', 'our own')
  cchange('her are good', 'her own')
  cchange('his are good', 'his own')
  achange(' are ', ' r ')
  achange(' am ', ' m ')
  achange('unhack', 'uhaxor')
  achange('hacker', 'haxor')
  cchange('hackerer', 'hacker')
  achange('excellent', 'xellent')
  achange(' are you ', ' ru ')
  achange('hack', 'haxor')
  achange('penis', 'penor')
  cchange(' pwn ', ' own ')
  achange(' yay ', ' woot ')
  achange(' you', ' joo')
  cchange(' yor ', ' your ')
  achange('speak', 'speek')
  achange('leet', '1337')
  achange('internet', 'big lan')
  achange(' picture', ' pixor')
  achange('n   [^]   t ', '   [^]   nt ')
  achange(' kill', ' frag')
  achange(' lamer ', ' llama ')
  achange(' newbie ', ' noob ')
  achange(' sex ', ' sexor ')
  achange(' technique ', ' tekniq ')
  achange('quake', 'quaek')
  achange(' rock ', ' roxor ')
  achange(' rocks ', ' roxorez ')
  achange('cool', 'kewl')
  achange(' the ', ' teh ')
  achange('ass', 'azz')
  achange('cum', 'spooge')
  achange('ejaculate', 'spooge')
  achange('fuck', 'fuxor')
  achange('phuck', 'phuxor')
  achange('porn', 'pron')
  achange('dude', 'dood')
  achange(' me ', ' meh ')
  achange(' with ', ' wit ')
  achange(' oh my god ', ' omg ')
  cchange(' omfg ', ' oh my f*cking god ')
  achange(' oh my fucking god ', ' omfg ')
  achange(' oh my phoxoring god ', ' omfg ')
  cchange('wtf', 'what the f*ck')
  achange(' what the fuck ', ' wtf ')
  cchange(' roflmao ', ' rolling on the floor laughing my ass off ')
  cchange(' rofl ', ' rolling on the floor laughing ')
  achange(' laugh my ass off ', ' lmao ')
  achange(' okay ', ' kk ')
  achange(' thanks ', ' thx ')
  achange('rude', 'rood')
  achange('ness ', 'nees ')
  achange('please', 'pleez')
  achange('money', 'lewt')
  cchange('loot', 'money')
  achange('qu', 'kw')
  achange('fear', 'fjeer')
  achange(' because ', ' cuz ')
  achange('more elite', 'eliteer')
  achange(' an a', ' a a')
  achange(' an e', ' a e')
  achange(' an i', ' a i')
  achange(' an o', ' a o')
  achange(' an u', ' a u')
  achange('bitch', 'bizotch')
  achange('suck', 'suxor')
  achange('at ', '@ ')
  achange(' e@ ', ' eat ')
  if (transtype === 1) achange('e@', 'eat')
  achange('elite', 'leet')
  achange(' computers ', ' boxen ')
  achange(' computer ', ' boxor ')
  achange(' you ', ' u ')
  achange(' your', ' ur')
  achange(' loot ', ' lewt ')
  achange(' stuff ', ' lewt ')
  achange(' fool ', ' foo ')
  achange(' yo ', ' jo ')
  achange('ks ', 'x ')
  achange('se ', 'ze ')
  cchange('ah ', 'er ')
  cchange('yeer', 'yeah')
  achange('ing ', 'in   [^]    ')
  achange('very gay', 'gheyzor')
  achange(' f', ' ph')
  achange('ash ', '# ')
  achange(' cu', ' ku')
  achange(' ca', ' ka')
  achange(' cat', ' kat')
  achange(' co', ' ko')
  achange('s ', 'z ')
  achange('sz ', 'ss ')
  cchange(' ph', ' f')
  cchange(' ghey ', ' gay ')
  cchange('badways', 'horribly')
  cchange(' ownzor', ' own')
  cchange('kthxbye', 'okay. thanks. bye.')
  if (transtype === 1) achange('kk thx bye', 'kthxbye')
  cchange(' k ', ' okay ')
  cchange(' thx ', ' thanks ')
  cchange(' i are ', ' i am ')
  cchange(' hacker it ', ' hack it ')
  cchange(' hacker them ', ' hack them ')
  cchange(' hacker her ', ' hack her ')
  cchange(' hacker him ', ' hack him ')
  cchange(' hacker a ', ' hack a ')
  cchange(' hacker his ', ' hack his ')
  cchange(' hacker their ', ' hack their ')
  cchange(' hacker that ', ' hack that ')
  cchange('hackered', 'hacked')
  cchange(' qea ', ' Quake 3 Arena ')
  cchange(' qe ', ' Quake 3 ')
  cchange(' l ', ' 1 ')
  cchange(' z ', ' 2 ')
  cchange(' e ', ' 3 ')
  cchange(' s ', ' 5 ')
  cchange(' g ', ' 6 ')
  cchange(' l ', ' 7 ')
  cchange(' b ', ' 8 ')
  cchange(' y ', ' 9 ')
  cchange(' o ', ' 0 ')
  cchange(' L ', ' 1 ')
  cchange('   [^]   5', '   [^]   s')
  cchange('siow', 'slow')
  cchange('ciear', 'clear')
  cchange('titie', 'title')
  cchange(' da ', ' the ')
  cchange(' dah ', ' the ')
  cchange('aiso', 'also')
  cchange('eii', 'ell')
  cchange('ii', 'll')
  cchange('!i ', '!! ')
  cchange(' ! ', ' i ')
  cchange('eip', 'elp')
  cchange('sz ', 'ss ')
  cchange('uks ', 'ucks ')
  cchange('eer', 'ear')
  cchange('!!s', 'lis')
  cchange('o/o', '')
  cchange('eie', 'ele')
  cchange('zor', 'er')
  cchange('!!ing', 'lling')
  cchange('w!!!', 'will')
  cchange('wh!!e', 'while')
  cchange('piay', 'play')
  cchange('auit', 'ault')
  cchange('ibie', 'ible')
  cchange('tah', 'ter')
  cchange('fah', 'fer')
  cchange('ouid', 'ould')
  cchange('a!!y', 'ally')
  cchange(' cus ', ' cuz ')
  cchange('iot', 'lot')
  cchange('oia', 'ola')
  cchange('zn', 'sn')
  cchange('siat', 'slat')
  cchange(' fone', ' phone')
  cchange(' fase', ' phase')
  cchange(' farmac', ' pharmac')
  cchange(' fenom', ' phenom')
  cchange(' fobia', ' phobia')
  cchange(' foto', ' photo')
  cchange(' fk', ' fuck')
  cchange('elitear', 'more elite')
  cchange('worid', 'world')
  cchange('dewd', 'dude')
  cchange('eleet', 'elite')
  cchange('iam', 'lam')
  cchange('@ ', 'at ')
  cchange('@', 'a')
  cchange('i{', 'k')
  cchange('#', 'h')
  cchange('iis', 'r')
  if (transtype === 2) {
    textin = textin.replace(/(can|should|would|could|have|did) (?:are|is|am) good/g, '$1 defeat')
    textin = textin.replace(/(can|should|would|could|have|did|do|will|shall) (?:are|is|am) (good|better than)/g, '$1 defeat')
    textin = textin.replace(/(?:are|is|am) good (me|you|him|them|y'all|my|your|his|her|their|our)/g, 'defeat $1')
  }
}

function changeletters (advanced) {
  achange('a', '4')
  achange('b', '8')
  achange('e', '3')
  achange('g', '9')
  achange('i', '1')
  achange('o', '0')
  achange('s', '5')
  achange('t', '7')
  achange('z', '2')
  if (transtype === 1 && !advanced) return
  achange('d', '|)')
  achange('f', '|=')
  achange('h', '|-|')
  achange('ll', '|_|_')
  achange('u', '|_|')
  achange('l', '|_')
  achange('j', '_|')
  achange('k', '|<')
  achange('m', '|\\/|')
  achange('n', '|\\|')
  achange('v', '\\/')
  achange('w', '\\|/')
  achange('x', '><')
  achange('y', '`/')
  cchange("'/", 'y')
  cchange('/v\\', 'm')
  achange('p', '|>')
  achange('q', '().')
  achange('r', '.-')
  achange('c', '(')
  cchange('o|o', 'do')
  cchange('|o', 'b')
  cchange('o|', 'd')
  achange('t', '+')
  achange('g', '6')
  achange('w', '\\/\\/')
  achange('w', 'vv')
  achange('k', '/<')
  achange('s', '$')
  if (transtype === 2) achange('i', '!')
  achange('m', '|v|')
  achange('mc', '|vk')
  achange('w', '\\^/')
  achange('c', '<')
  achange('i', '|')
  achange('y', '\\-/')
  achange('h', '}{')
  if (transtype === 1) return
  achange('t', '†')
  achange('u', 'µ')
  achange('c', '©')
  achange('c', '¢')
  achange('b', 'ß')
  achange('r', '®')
  achange('f', 'ƒ')
  achange('x', '><')
  achange('e', '3')
  achange('d', 'Ð')
  achange('d', 'ð')
  achange('v', 'v')
  achange('t', '‡')
  achange('l', '£')
  achange('z', 'ž')
  achange('y', '¥')
  achange('n', 'ñ')
  achange('x', '×')
  achange('?', '¿')
  cchange('¡', 'i')
  if (transtype === 2) {
    textin = textin.replace(/(?!e)@(\B)/g, 'at$1')
    cchange('@', 'a')
    textin = textin.replace(/iz(?!e)(\w)/g, 'r$1')
    textin = textin.replace(/iy/g, 'ly')
    textin = textin.replace(/(\s|.|,|\?|!)uk/g, '$1' + 'lik')
    cchange('i-i', 'h')
    textin = textin.replace(/i([a@])te/g, 'late')
    cchange('eei', 'eel')
    cchange('iee', 'lee')
    cchange('eio', 'elo')
    cchange('wlli', 'will')
    cchange('ioo', 'loo')
    cchange('d\\ll', 'oni')
    cchange('d\\ii', 'oni')
    cchange('i-b', 'ho')
    cchange('lld', 'ild')
    cchange(' unk', ' link')
    cchange('llim', 'lum')
    cchange('/v', 'n')
    cchange('milumeter', 'millimeter')
    cchange('skllis', 'skills')
    cchange('u>', 'lp')
    textin = textin.replace(/dj(\w)/g, 'ou$1')
    textin = textin.replace(/(\w)dj/g, '$1ou')
    textin = textin.replace(/dc(\w)/g, 'ok$1')
    textin = textin.replace(/(\w)dc/g, '$1ok')
    cchange('d_', 'ol')
    cchange('i\\b', 'no')
  }
}

transtype = 1

function randomcase (what) {
  let tr = ''
  for (let i = 0; i < what.length; i++) {
    if (Math.random() > 0.5) tr += what.substr(i, 1).toLowerCase()
    else tr += what.substr(i, 1).toUpperCase()
  }
  return tr
}

function tol33t (input, advanced = false) {
  transtype = 1
  textin = ' ' + input + ' '
  textin = textin.toLowerCase()
  punct()
  changeWords()
  changeletters(advanced)
  unpunct()
  return stripspaces(randomcase(textin))
}

// Un-converts stuff

// function tolame (input, advanced = false) {
//   transtype = 2
//   textin = ' ' + input + ' '
//   textin = textin.toLowerCase()
//   textin = textin.replace(/(\s)!(\s)/g, '$1i$2')
//   const rxp = /!+\W/g
//   textin = textin.replace(rxp, '.')
//   changeletters(advanced)
//   checkadv()
//   punct()
//   changeWords()
//   unpunct()
//   return stripspaces(textin)
// }

function stripspaces (what) {
  what = what.replace(/^ */, '')
  what = what.replace(/ *$/, '')
  return what
}

function punct () {
  change('.', '   [%]   ')
  change(',', '   [@]   ')
  change('?', '   [©]   ')
  change('!', '   [$]   ')
  change('"', '   [&]   ')
  change("'", '   [^]   ')
  change(')', '   [~]   ')
  change('\n', '   [*]   ')
  change('\r', '')
}

function unpunct () {
  change('   [%]   ', '.')
  change('   [@]   ', ',')
  change('   [a]   ', ',')
  change('   [©]   ', '?')
  change('   [$]   ', '!')
  change('   [&]   ', '"')
  change('   [^]   ', "'")
  change('   [~]   ', ')')
  change('   [*]   ', '\n')
}

function change (t1, t2) {
  let tr = textin
  let lp = 0
  while (tr.indexOf(t1) > -1) {
    if (++lp > 200) {
      return tr
    }
    const occ = tr.indexOf(t1)
    tr = tr.substr(0, occ) + t2 + tr.substr(occ + t1.length)
  }
  textin = tr
}

function achange (t1, t2) {
  if (transtype === 1) {
    if (Math.random() <= 0.8) change(t1, t2)
  }
  if (transtype === 2) change(t2, t1)
}

function cchange (t1, t2) {
  if (transtype === 2) change(t1, t2)
}

// let warned = false

// function checkadv () {
//   if (textin.length < 15) return
//   let spccount = 0
//   for (let i = 0; i < textin.length; i++) {
//     if (textin.substr(i, 1) === ' ') spccount++
//   }
//   if (spccount / textin.length >= 0.5) {
//     change('  ', '##')
//     change(' ', '')
//     change('##', ' ')
//     let lgsword = 0
//     let cword = 0
//     for (let i = 0; i < textin.length; i++) {
//       if (textin.substr(i, 1) === ' ') {
//         if (cword > lgsword) lgsword = cword
//         cword = 0
//       } else cword++
//     }
//     if (!warned && lgsword > 10) {
//       // alert("L33t Translator might not be able to do this one. All the words are smushed together. \nDon't forget that nothing beats a human translation!")
//       warned = true
//     }
//   }
// }

module.exports = tol33t
