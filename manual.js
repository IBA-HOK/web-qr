// manual.js
const dataTextArea = document.getElementById('manual-data');
const saveBtn = document.getElementById('save-btn');
const downloadBtn = document.getElementById('download-btn');
const statusMessage = document.getElementById('status-message');

saveBtn.addEventListener('click', () => {
    const data = dataTextArea.value.trim();
    if (!data) {
        statusMessage.textContent = '入力が空です。';
        statusMessage.style.color = 'red';
        return;
    }

    // common.jsの関数を呼び出す
    saveData(data);

    statusMessage.textContent = '保存しました！';
    statusMessage.style.color = 'green';
    dataTextArea.value = ''; // 入力欄をクリア
});

downloadBtn.addEventListener('click', () => {
    // common.jsの関数を呼び出す
    downloadData();
});
