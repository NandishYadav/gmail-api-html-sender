const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')
async function openUrl (authUrl) {
  const open = (await import('open')).default
  await open(authUrl)
}

const SCOPES = ['https://www.googleapis.com/auth/gmail.send']
const TOKEN_PATH = 'token.json'

// Load credentials and authorize
fs.readFile(
  'file_path_to/credentials.json', // Replace with the actual path to your credentials.json
  (err, content) => {
    if (err) return console.error('Error loading credentials.json', err)
    authorize(JSON.parse(content), sendMail)
  }
)

function authorize (credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  )

  fs.readFile(TOKEN_PATH, async (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback)
    oAuth2Client.setCredentials(JSON.parse(token))
    callback(oAuth2Client)
  })
}
async function getAccessToken (oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  console.log('Authorize this app by visiting this URL:', authUrl)
  await openUrl(authUrl)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question('Enter the code from that page here: ', code => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err)
      oAuth2Client.setCredentials(token)
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token))
      callback(oAuth2Client)
    })
  })
}

async function sendMail (auth) {
  const gmail = google.gmail({ version: 'v1', auth })
    const mailList = ['reciver mail 1', 'reciver mail 2', 'reciver mail 3'] // Replace with actual recipient emails
  for (let i = 0; i < mailList.length; i++) {
    console.log(`Sending email to: ${i}`);
   const rawMessage = createRawEmail({
    from: 'Name to Display as Send[Your org Name] <sender_mail_id>',
    to: mailList[i],
    subject: `BREAKING NEWS`,
    htmlBody:  `
      <h1>Breaking News</h1>
      <p>We are excited to share the latest updates with you!</p>
      <p>Stay tuned for more information.</p>
    `
  })

  gmail.users.messages.send(
    {
      userId: 'me',
      resource: {
        raw: rawMessage
      }
    },
    (err, res) => {
      if (err) return console.error('Error sending email', err)
      console.log('Email sent! Message ID:', res.data.id)
    }
  )
}
}

function createRawEmail({ from, to, subject, htmlBody }) {
  const messageParts = [
    `From: ${from}`,
    `To: ${to}`,
   `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    htmlBody
  ];

  const message = messageParts.join('\n');

  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
