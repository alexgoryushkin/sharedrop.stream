import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'sharedrop/config/environment';
import * as Sentry from '@sentry/browser';
import {Ember as EmberIntegration} from '@sentry/integrations';

if (config.SENTRY_ERROR_TRACKER_URL) {
  Sentry.init({
    dsn: config.SENTRY_ERROR_TRACKER_URL,
    integrations: [new EmberIntegration()],
  });
}


export default class App extends Application {
  modulePrefix = config.modulePrefix;

  podModulePrefix = config.podModulePrefix;

  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
