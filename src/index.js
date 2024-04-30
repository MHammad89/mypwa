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
    canvasFingerprint: result.components.canvas?.value ?? 'N/A',
    webglFingerprint: result.components.webgl?.value ?? 'N/A',
    visitorId: result.visitorId ?? 'N/A'
  };

  console.log('Selected fingerprint data:', fingerprintData);
  
  displayFingerprintData(fingerprintData);
  return fingerprintData;
}

function displayFingerprintData(data) {
  const dataContainer = document.getElementById('fingerprintData');
  dataContainer.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

document.addEventListener('DOMContentLoaded', function() {
  collectFingerprintData();
});