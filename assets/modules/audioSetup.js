const audioContext = Tone.context;
audioContext.lookAhead = 0;
audioContext.updateInterval = 0.01;
audioContext.bufferSize = 128;

// Create audio source
const audioSource = new Tone.UserMedia();
const monoSignal = new Tone.Mono();
const monoLeft = new Tone.Mono({ channelCount: 1 });
const monoRight = new Tone.Mono({ channelCount: -1 });

const destination = Tone.Destination;

const inputMeter = new Tone.Meter(0.8);
let inputLevelValueRead = null;

// read input level
function audioInputLevelMeter() {
  inputLevelValueRead = inputMeter.getValue().toFixed(2);
  // print the incoming mic levels in decibels
  console.log("The Decibel level is:", inputLevelValueRead, "dB");
}

const outputMeter = new Tone.Meter(0.8);
let outputLevelValueRead = null;

// read output level
function audioOutputLevelMeter() {
  outputLevelValueRead = outputMeter.getValue().toFixed(2);
  // print the incoming mic levels in decibels
  console.log("The Decibel level is:", outputLevelValueRead, "dB");
}

export {
  audioSource,
  monoSignal,
  monoLeft,
  monoRight,
  destination,
  inputMeter,
  outputMeter,
  audioInputLevelMeter,
  audioOutputLevelMeter,
};
