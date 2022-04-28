
const http = require('http');
const crypto = require('crypto');
const { spawn } = require('child_process');
const pm2 = require('pm2');

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
          // End
          spawnedShell.stdin.end();

          spawnedShell.on('exit', () => {
            pm2.connect((err) => {
              if (err) {
                console.error(err)
                process.exit(2)
              }

              pm2.restart('urc_ms', (err) => {
                pm2.disconnect()
                if (err) throw err
              })
            })
          })
        } catch (error) {
          console.log(error);
        }
      }
    });

    res.end();
  })
  .listen(3031);