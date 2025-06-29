// common.js

/**
 * データをlocalStorageに追記保存する
 * @param {string} dataToSave - 保存するデータ
 */
function saveData(dataToSave) {
    // 既存のデータをlocalStorageから読み込む
    const existingData = localStorage.getItem('savedData');
    let dataList = [];
    if (existingData) {
        dataList = JSON.parse(existingData);
    }

    // 新しいエントリーを作成
    const newEntry = {
        scannedAt: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
        data: dataToSave,
    };

    // リストに追加
    dataList.push(newEntry);

    // 更新されたリストをJSON文字列に変換してlocalStorageに保存
    localStorage.setItem('savedData', JSON.stringify(dataList, null, 2));
}

/**
 * 保存されている全データをJSONファイルとしてダウンロードする
 */
function downloadData() {
    const data = localStorage.getItem('savedData');
    if (!data || data === '[]') {
        alert('保存されているデータがありません。');
        return;
    }

    // Blobを作成してダウンロードリンクを生成
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saved_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
