/* jshint -W030 */
import $ from 'jquery';
import {Promise} from 'rsvp';
import config from 'sharedrop/config/environment';
import {initializeApp} from 'firebase/app';
import {getAuth, signInWithCustomToken} from 'firebase/auth';
import {getDatabase} from 'firebase/database';

import FileSystem from '../services/file';
import Analytics from '../services/analytics';

const firebaseConfig = {
  apiKey: config.FIREBASE_API_KEY,
  authDomain: config.FIREBASE_AUTH_DOMAIN,
  databaseURL: config.FIREBASE_DATABASE_URL,
  projectId: config.FIREBASE_PROJECT_ID,
  storageBucket: config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
  appId: config.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export function initialize(application) {
  function checkWebRTCSupport() {
    return new Promise((resolve, reject) => {
      // window.util is a part of PeerJS library
      if (window.util.supports.sctp) {
        console.log('WebRTC supported')
        resolve();
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('browser-unsupported');
      }
    });
  }

  function clearFileSystem() {
    return new Promise((resolve, reject) => {
      // TODO: change File into a service and require it here
      FileSystem.removeAll()
        .then(() => {
          resolve();
        })
        .catch(() => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('filesystem-unavailable');
        });
    });
  }

  function authenticateToFirebase() {
    return new Promise((resolve, reject) => {
      $.getJSON('/auth')
        .then((data) => {
          if (!data || !data.token) {
            reject(new Error('Invalid data from /auth'));
            return;
          }

          signInWithCustomToken(auth, data.token)
            .then((userCredential) => {
              const user = userCredential.user;
              application.db = db;
              application.userId = data.id;
              application.publicIp = data.public_ip;

              resolve();
            })
            .catch((error) => {
              console.error('Firebase auth error:', error);
              reject(error);
            });
        })
        .catch((xhrError) => {
          console.error('Error fetching /auth:', xhrError);
          reject(xhrError);
        });
    });
  }

  // TODO: move it to a separate initializer
  function trackSizeOfReceivedFiles() {
    $.subscribe('file_received.p2p', (event, data) => {
      Analytics.trackEvent('received', {
        event_category: 'file',
        event_label: 'size',
        value: Math.round(data.info.size / 1000),
      });
    });
  }

  application.deferReadiness();

  checkWebRTCSupport()
    .then(clearFileSystem)
    .catch((error) => {
      // eslint-disable-next-line no-param-reassign
      application.error = error;
    })
    .then(authenticateToFirebase)
    .then(trackSizeOfReceivedFiles)
    .then(() => {
      application.advanceReadiness();
    });
}

export default {
  name: 'prerequisites',
  initialize,
};
