import FingerprintJS from '@fingerprintjs/fingerprintjs';

async function collectFingerprintData() {
  const fp = await FingerprintJS.load();
  const result = await fp.get();

  console.log('Full fingerprint data:', result);

  const fingerprintData = {
    userAgent: result.components.userAgent?.value ?? 'N/A',
    screenResolution: result.components.screenResolution?.value.join('x') ?? 'N/A',
    timezone: result.components.timezone?.value ?? 'N/A',
    fonts: result.components.fonts?.value.join(', ') ?? 'N/A',
    canvasFingerprint: {
      winding: result.components.canvas?.value.winding ?? false,
      geometry: result.components.canvas?.value.geometry ?? 'N/A',
      text: result.components.canvas?.value.text ?? 'N/A'
    },
    webglFingerprint: result.components.webgl?.value ?? 'N/A',
    visitorId: result.visitorId ?? 'N/A'
  };

  console.log('Selected fingerprint data:', fingerprintData);

  // Send the fingerprint data to your server
  sendDataToServer(fingerprintData);

  // Display data on the frontend
  displayFingerprintData(fingerprintData);
}

function sendDataToServer(fingerprintData) {
  fetch('http://localhost:3000/fingerprints', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(fingerprintData)
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch((error) => console.error('Error:', error));
}

function displayFingerprintData(data) {
  const dataContainer = document.getElementById('fingerprintData');
  dataContainer.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

document.addEventListener('DOMContentLoaded', function() {
  collectFingerprintData();
});