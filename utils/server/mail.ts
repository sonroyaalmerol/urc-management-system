import { google, gmail_v1 } from 'googleapis'
import auth from './google-auth'

const gmail = google.gmail({
  version: 'v1',
  auth
})

const sendMail = async (subject: string, to: string | string[], content: string) : Promise<gmail_v1.Schema$Message | null> => {
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`
  const messageParts = [
    'From: URC Web Systems <urc.web@addu.edu.ph>',
    `To: ${Array.isArray(to) ? to.join(', ') : to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    content
  ]
  const message = messageParts.join('\n')

  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  return (await gmail.users.messages.send({
    userId: 'urc.web@addu.edu.ph',
    requestBody: {
      raw: encodedMessage,
    }
  }))?.data
}

export {
  sendMail
}