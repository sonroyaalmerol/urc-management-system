import http from 'http';
import crypto from 'crypto';
import { exec } from 'child_process';

const SECRET = 'aYwBpLv3BaEhAVoHrlQLN2mhA6oSB4nK';

http
  .createServer((req, res) => {
    req.on('data', chunk => {
      const signature = `sha1=${crypto
        .createHmac('sha1', SECRET)
        .update(chunk)
        .digest('hex')}`;

      const isAllowed = req.headers['x-hub-signature'] === signature;

      const body = JSON.parse(chunk);

      const isMaster = body?.ref === 'refs/heads/master';

      if (isAllowed && isMaster) {
        // do something
        try {
          exec(`cd /var/www/urc-management-system && git pull && npx prisma migrate deploy && yarn build && pm2 reload urc_ms`);
        } catch (error) {
          console.log(error);
        }
      }
    });

    res.end();
  })
  .listen(3031);