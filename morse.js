//
// morse.js
//
// Send morse code to Luxafor light
//
// Usage:
// node morse.js 'sos or other text'
//


const Luxafor = require('luxafor-api');


// Color of light
const LIGHT_COLOR = '#FFF';


// Connect to Luxafor light 
const device = new Luxafor();


// Set the text to send
const args = process.argv.slice(2);
let text = 'demo';

if (args[0] && args[0].length) {
  text = args[0];
}


// Speed
const baseTime = 100;


const morse = {
  ' ': ' ',
  'a': '*-',
  'b': '-***',
  'c': '-*-*',
  'd': '-**',
  'e': '*',
  'f': '**-*',
  'g': '--*',
  'h': '****',
  'i': '**',
  'j': '*---',
  'k': '-*-',
  'l': '*-**',
  'm': '--',
  'n': '-*',
  'o': '---',
  'p': '*--*',
  'q': '--*-',
  'r': '*-*',
  's': '***',
  't': '-',
  'u': '**-',
  'v': '***-',
  'w': '*--',
  'x': '-**-',
  'y': '-*--',
  'z': '--**',
  '1': '*----',
  '2': '**---',
  '3': '***--',
  '4': '****-',
  '5': '*****',
  '6': '-****',
  '7': '--***',
  '8': '---**',
  '9': '----*',
  '0': '-----',
  '/': '-**-*',
  '+': '*-*-*',
  '=': '-***-',
  '.': '*-*-*-',
  ',': '--**--',
  '?': '**--**',
  '(': '-*--*',
  ')': '-*--*-',
  '-': '-****-',
  '"': '*-**-*',
  '_': '**--*-',
  '\'': '*----*',
  ':': '---***',
  ';': '-*-*-*',
  '$': '***-**-'
}




// Convert text to morse
const textToCharacters = (text) => {
  return text.toLowerCase().split('');
};

const encodeCharacter = (character) => {
  if (character in morse) {
    return morse[character];
  }
  return ' ';
};

const encodeText = (text) => {
  return textToCharacters(text).map(encodeCharacter);
};

const encodedText = encodeText(text);



// Create a queue of light on/off + duration
const lightQueue = [];

encodedText.forEach((item) => {
  const a = item.split('');
  a.forEach((b, d) => {
    if (b === ' ') lightQueue.push({ off: 7 }); // Between words: 7 units duration
    if (b === '*') lightQueue.push({ on: 1 });
    if (b === '-') lightQueue.push({ on: 3 });
    if (d < a.length) lightQueue.push({ off: 1 }); // Between letters: 1 unit duration
  });
  lightQueue.push({ off: 3 });
});


// Loop over light queue untill all on/off signals are done
const loop = () => {
  const what = lightQueue.shift();

  // Check if we are done
  if (!what) {
    return device.off();
  }

  if (what.on) {
    device.setColor(LIGHT_COLOR, 0xFF);
  }
  else {
    device.off();
  }

  setTimeout(loop, (what.on || what.off) * baseTime);
};

loop();
