![ShareDrop](public/assets/images/sharedrop.svg)

ShareDrop is a web application inspired by Apple [AirDrop](http://support.apple.com/kb/ht4783) service. It allows you to
transfer files directly between devices, without having to upload them to any server first. It
uses [WebRTC](http://www.webrtc.org) for secure peer-to-peer file transfer and [Firebase](https://www.firebase.com) for
presence management and WebRTC signaling.

ShareDrop allows you to send files to other devices in the same local network (i.e. devices with the same public IP
address) without any configuration - simply open <https://sharedrop.stream> on all devices and they will see each other.
It also allows you to send files between networks - just click the `+` button in the top right corner of the page to
create a room with a unique URL and share this URL with other people you want to send a file to. Once they open this
page in a browser on their devices, you'll see each other's avatars.

The main difference between ShareDrop and AirDrop is that ShareDrop requires Internet connection to discover other
devices, while AirDrop doesn't need one, as it creates ad-hoc wireless network between them. On the other hand,
ShareDrop allows you to share files between mobile (Android and iOS) and desktop devices and even between networks.

## What happened to sharedrop.io

The original [ShareDrop.io](https://www.sharedrop.io) project has been acquired by [LimeWire](https://limewire.com) and
is now operating under their branding.

However, ShareDrop was originally built as a **peer-to-peer file sharing tool using WebRTC**, designed to allow secure
file transfers directly between devices — **not through centralized servers of an external company**.

This fork aims to preserve that original vision. The codebase has been slightly modernized to update outdated
dependencies and is now relaunched at [sharedrop.stream](https://sharedrop.stream).

You can continue to use this version to run ShareDrop as it was originally intended: lightweight, secure, anonymous, and
truly peer-to-peer.

The source code remains available, and you can host this version as well.

## Supported browsers

- Chrome
- Edge (Chromium based)
- Firefox
- Opera
- Safari 13+

## Local development

1. Setup Firebase:
   1. [Sign up](https://www.firebase.com) for a Firebase account and create `Realtime Database`.
   2. Go to "Rules" tab, replace existing content by content from `firebase_rules.json` file.
   3. Create .env file by sample. Need to get all environment variables for firebase in one place. Click the gear icon
      next to "Project Overview" in the top-left corner, then select "Project settings". Scroll down to the "Your apps"
      section. Select your web app (if you've already created one). If not, create a new web app by clicking the "</>"
      icon. In the "Firebase SDK snippet" section, select "Config". You will see the firebaseConfig object with the
      values populated. Copy this object and paste these values into your environment variables.
   4. For server-side authorization, you need the firebase_admin.json file. To get it, download the file
      serviceAccountKey.json from Firebase Console (Project settings -> Service accounts -> Generate new private key)
   5. Enable anonymous authorization (Project Overview -> Authentication -> Sign-in method -> Add new provider ->
      Anonymous)
2. If you want to get errors from the site, you can connect the sentry service, but it is paid (there are 14 days free).
   If not just leave SENTRY_ERROR_TRACKER_URL empty.
3. You can use docker compose to start the service, or you can start the service natively  
   Docker compose: `docker-compose build; docker-compose up -d --force-recreate; docker-compose logs -f`  
   Native startup - the following items
4. Run `npm install -g ember-cli` to install Ember CLI.
5. Run `yarn` to install app dependencies.
6. Run `cp .env{.sample,}` to create `.env` file. This file will be used by Foreman to set environment variables when
   running the app locally.
   - `SECRET` key is used to encrypt cookies and generate room name based on public IP address for `/` route. It can be
     any random string - you can generate one using e.g. `openssl rand -hex 32`
   - `NEW_RELIC_*` keys are only necessary in production
7. Run `yarn develop` to start the app.

## Deployment

### Heroku

Create a new Heroku app:

```
heroku create <app-name>
```

and push the app to Heroku repo:

```
git push heroku master
```
