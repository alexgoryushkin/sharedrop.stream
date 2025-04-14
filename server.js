/* eslint-env node */

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  require('newrelic');
}

// Room server
const http = require('http');
const path = require('path');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const compression = require('compression');
const {v4: uuidv4} = require('uuid');
const crypto = require('crypto');
const app = express();
const secret = process.env.SECRET;
const base = ['dist'];
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require(path.resolve(__dirname, 'firebase_admin.json'));
console.log(serviceAccount, process.env.FIREBASE_DATABASE_URL)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

app.enable('trust proxy');

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(
  cookieSession({
    cookie: {
      // secure: true,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
    secret,
    proxy: true,
  }),
);
app.use(compression());

//
// Web server
//
base.forEach((dir) => {
  const subdirs = ['assets', '.well-known'];

  subdirs.forEach((subdir) => {
    app.use(
      `/${subdir}`,
      express.static(`${dir}/${subdir}`, {
        maxAge: 31104000000, // ~1 year
      }),
    );
  });
});

//
// API server
//
app.get('/', (req, res) => {
  const root = path.join(__dirname, base[0]);
  res.sendFile(`${root}/index.html`);
});

app.get('/rooms/:id', (req, res) => {
  const root = path.join(__dirname, base[0]);
  res.sendFile(`${root}/index.html`);
});

app.get('/room', (req, res) => {
  const ip = req.headers['cf-connecting-ip'] || req.ip;
  const name = crypto.createHmac('md5', secret).update(ip).digest('hex');

  res.json({name});
});

app.get('/auth', async (req, res) => {
  const ip = req.headers['cf-connecting-ip'] || req.ip;
  const uid = uuidv4();

  try {
    const customToken = await admin.auth().createCustomToken(uid, {id: uid});
    res.json({id: uid, token: customToken, public_ip: ip});
  } catch (error) {
    console.error('Error creating custom token:', error);
    res.status(500).json({error: 'Failed to create custom token'});
  }
});

http
  .createServer(app)
  .listen(process.env.PORT)
  .on('listening', () => {
    console.log(
      `Started ShareDrop web server at http://localhost:${process.env.PORT}...`,
    );
  });
