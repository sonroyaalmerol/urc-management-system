
const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');

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
          exec(`cd /var/www/urc-management-system && git pull && npx prisma migrate deploy && npx prisma generate && yarn build && pm2 reload urc_ms && pm2 reload urc_webhook && npx prisma db seed`);
        } catch (error) {
          console.log(error);
        }
      }
    });

    res.end();
  })
  .listen(3031);