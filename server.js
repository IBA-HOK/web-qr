const https = require('https');
const fs = require('fs');
const path = require('path');

// mkcertで生成された証明書と鍵のファイル名を指定
// 実際のファイル名に合わせて修正してください
const keyFilePath = './192.168.1.5+2-key.pem';
const certFilePath = './192.168.1.5+2.pem';

const options = {
    key: fs.readFileSync(keyFilePath),
    cert: fs.readFileSync(certFilePath)
};

const port = 8443; // HTTPSでよく使われるポート (8000などでも可)

// サーバーのロジック
const server = https.createServer(options, (req, res) => {
    // リクエストされたURLのパスを解決
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, '0.0.0.0', () => {
    console.log(`Server running at https://localhost:${port}/`);
    console.log(`LAN内でアクセス: https://<あなたのIPアドレス>:${port}/`);
});
