// camera.js
const video = document.getElementById('video');
const statusMessage = document.getElementById('status-message');
const switchBtn = document.getElementById('switch-camera-btn');

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d', { willReadFrequently: true });

let scanning = true;
let videoDevices = [];
let currentDeviceIndex = 0;
let currentStream = null;

// トップページに戻る前にカメラを停止するイベントリスナー
document.querySelector('a[href="index.html"]').addEventListener('click', (e) => {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
});

switchBtn.addEventListener('click', () => {
    if (videoDevices.length > 1) {
        currentDeviceIndex = (currentDeviceIndex + 1) % videoDevices.length;
        const nextDeviceId = videoDevices[currentDeviceIndex].deviceId;
        startCamera(nextDeviceId);
    }
});

async function startCamera(deviceId) {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    const constraints = {
        video: { deviceId: deviceId ? { exact: deviceId } : undefined }
    };

    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = stream;
        video.srcObject = stream;
        await video.play();

        scanning = true;
        requestAnimationFrame(tick);
        statusMessage.textContent = 'QRコードをスキャンしてください';
    } catch (err) {
        statusMessage.textContent = 'カメラのアクセスに失敗しました。';
        console.error(err);
    }
}

function tick() {
    if (!scanning || video.readyState !== video.HAVE_ENOUGH_DATA) {
        requestAnimationFrame(tick);
        return;
    }

    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
        scanning = false;

        saveData(code.data); // common.jsの関数を呼び出し

        statusMessage.textContent = '保存しました！2秒後にスキャンを再開します。';
        setTimeout(() => {
            statusMessage.textContent = 'QRコードをスキャンしてください';
            scanning = true;
            requestAnimationFrame(tick);
        }, 2000);
    } else {
        requestAnimationFrame(tick);
    }
}

async function init() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        videoDevices = devices.filter(device => device.kind === 'videoinput');

        if (videoDevices.length > 0) {
            if (videoDevices.length > 1) {
                switchBtn.disabled = false;
            }
            startCamera(videoDevices[currentDeviceIndex].deviceId);
        } else {
            statusMessage.textContent = '利用可能なカメラが見つかりませんでした。';
        }
    } catch (err) {
        statusMessage.textContent = 'デバイスの取得に失敗しました。';
        console.error(err);
    }
}

init();
