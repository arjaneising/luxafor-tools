//
// timer.js
//
// Set a timer with a Luxafor light
//
// Usage:
// node timer.js green:5m orange:3m red:1m
//


const Luxafor = require('luxafor-api');


// Available colors
// Add more if you please
const colors = {
  'aqua': '#00FFFF',
  'black': '#000000',
  'blue': '#0000FF',
  'fuchsia': '#FF00FF',
  'gray': '#808080',
  'green': '#008000',
  'lime': '#00FF00',
  'maroon': '#800000',
  'navy': '#000080',
  'olive': '#808000',
  'orange': '#FFA500',
  'purple': '#800080',
  'red': '#FF0000',
  'silver': '#C0C0C0',
  'teal': '#008080',
  'white': '#FFFFFF',
  'yellow': '#FFFF00',
};


// Connect to Luxafor light 
const device = new Luxafor();



device.setColor(colors.red, 0xFF);




// Parse command line arguments
const parseArg = (string) => {
  let [color, duration] = string.split(':');
  color = parseColor(color);
  duration = parseDuration(duration);
  return { color, duration };
}

const parseColor = (colorString) => {
  if (colors[colorString]) {
    return colors[colorString];
  }
    return '#FFF';
}

const parseDuration = (durationString) => {
  const duration = parseInt(durationString, 10) || 0;
  if (durationString.length > 1) {
    const unit = durationString.charAt(durationString.length - 1);
    if (unit === 'h') {
      return duration * 60 * 60;
    }
    if (unit === 'm') {
      return duration * 60;
    }
  }
  return duration;
}


const args = process.argv.slice(2);
const lightQueue = args.map(parseArg);


// Loop over light queue untill all on/off signals are done
const loop = () => {
  const slot = lightQueue.shift();

  // Check if we are done
  if (!slot) {
    return device.off();
  }

  device.setColor(slot.color, 0xFF);

  setTimeout(loop, slot.duration * 1000);
};

loop();