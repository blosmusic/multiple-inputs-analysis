const select = document.getElementById("audio-devices-input");

// Create an AudioContext
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
Tone.context.lookAhead = 0;
Tone.context.updateInterval = 0.01;
Tone.context.bufferSize = 128;

// Audio Parameters
const audioSource = new Tone.UserMedia();
const monoSignal = new Tone.Mono();
const destination = Tone.Destination;

let mediaStream;
let sourceNode;

// Handle device selection change
select.addEventListener("change", async () => {
  const selectedDeviceId = select.value;

  // Check if there is an active MediaStream and disconnect it
  if (mediaStream && sourceNode) {
    sourceNode.disconnect();
    mediaStream.getTracks().forEach((track) => track.stop());
  }

  try {
    // Create a MediaStream using the selected audio device
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: selectedDeviceId },
    });

    // Create a MediaStreamAudioSourceNode
    sourceNode = audioContext.createMediaStreamSource(mediaStream);

    // Connect the source node to the audio context destination
    sourceNode.connect(audioContext.destination);

    // Disconnect the audio source from the mono signal
    audioSource.disconnect(monoSignal);
    
  } catch (error) {
    console.error("Error accessing audio device:", error);
  }
});

// Enumerate audio devices after user permission is granted
navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(() => {
    // Enumerate audio devices
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        // Filter audio input devices
        const audioInputDevices = devices.filter(
          (device) => device.kind === "audioinput"
        );

        // Populate the select element with audio input devices
        audioInputDevices.forEach((device) => {
          const option = document.createElement("option");
          option.value = device.deviceId;
          option.text = device.label || `Audio Input ${device.deviceId}`;
          select.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Error enumerating audio devices:", error);
      });
  })
  .catch((error) => {
    console.error("Error accessing audio device:", error);
  });

// Wrap the code inside an async function to use await Tone.start()
async function main() {
  // Start the audio context
  await Tone.start();

  audioSource.open().then(() => {
    console.log("Audio source opened");
    audioSource.connect(monoSignal);
    monoSignal.connect(destination);
  });
}

main();
