
const http = require('http');
const crypto = require('crypto');
const { spawn } = require('child_process');

const SECRET = 'aYwBpLv3BaEhAVoHrlQLN2mhA6oSB4nK';

http
  .createServer((req, res) => {
    req.on('data', chunk => {
      console.log('push incoming')
      const signature = `sha1=${crypto
        .createHmac('sha1', SECRET)
        .update(chunk)
        .digest('hex')}`;

      const isAllowed = req.headers['x-hub-signature'] === signature;

      const body = JSON.parse(chunk);

      const isMaster = body?.ref === 'refs/heads/main';
      console.log(`is allowed: ${isAllowed}, is main: ${isMaster}`)
      if (isAllowed && isMaster) {
        // do something
        try {
          const spawnedShell = spawn('/bin/sh');
          // Capture stdout
          spawnedShell.stdout.on('data', d => console.log(d.toString()));

          spawnedShell.stdin.write('cd /var/www/urc-management-system\n');
          spawnedShell.stdin.write('git pull\n');
          spawnedShell.stdin.write('yarn\n');
          spawnedShell.stdin.write('npx prisma migrate deploy\n');
          spawnedShell.stdin.write('npx prisma generate\n');
          spawnedShell.stdin.write('yarn build\n');
          spawnedShell.stdin.write('pm2 reload urc_ms\n');
          spawnedShell.stdin.write('pm2 reload urc_webhook\n');
          // End
          spawnedShell.stdin.end();
        } catch (error) {
          console.log(error);
        }
      }
    });

    res.end();
  })
  .listen(3031);