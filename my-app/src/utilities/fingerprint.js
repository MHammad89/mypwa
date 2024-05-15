import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const getFingerprint = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();

    const fingerprintData = {
        visitorId: result.visitorId,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        fonts: result.components.fonts?.value.join(', ')
    };

    return fingerprintData;
};
