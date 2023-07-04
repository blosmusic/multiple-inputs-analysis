const select = document.getElementById("audio-devices-input");

// Create an AudioContext
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
audioContext.suspend();
Tone.context.lookAhead = 0;
Tone.context.updateInterval = 0.01;
Tone.context.bufferSize = 128;

// Audio Parameters
const audioSource = new Tone.UserMedia();
const destination = Tone.Destination;

let mediaStream;
let sourceNode;

// Handle device selection change
select.addEventListener("change", async () => {
  const selectedDeviceId = select.value;
  const selectedChannels = [1, 2]; // Modify this array to include the desired channel indices (starting from 1)

  // Stop the previous audio
  stopAudio();

  try {
    // Create a MediaStream using the selected audio device and channels
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: selectedDeviceId,
        channelCount: selectedChannels.length,
        channelSelection: selectedChannels,
      },
    });

    // Create a MediaStreamAudioSourceNode
    sourceNode = audioContext.createMediaStreamSource(mediaStream);

    // Connect the source node to the audio context destination
    sourceNode.connect(audioContext.destination);
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
          (device) =>
            device.kind === "audioinput" &&
            device.label.includes("Scarlett 18i20")
        );

        // Populate the select element with audio input devices
        audioInputDevices.forEach((device) => {
          const option = document.createElement("option");
          option.value = device.deviceId;
          option.text = device.label;
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
}

main();

function stopAudio() {
  // Disconnect the source node and stop the media stream
  if (sourceNode) {
    sourceNode.disconnect();
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null; // Reset the media stream variable
  }
}
