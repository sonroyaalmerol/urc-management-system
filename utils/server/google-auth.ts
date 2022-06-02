import { google } from 'googleapis'

const auth = new google.auth.OAuth2({
  clientId: process.env.PROXY_CLIENT_ID,
  clientSecret: process.env.PROXY_CLIENT_SECRET,
  redirectUri: "https://developers.google.com/oauthplayground"
})

auth.setCredentials({
  refresh_token: process.env.PROXY_REFRESH_TOKEN
})

google.options({
  // http2: true,
})

export default auth