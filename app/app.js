import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'sharedrop/config/environment';
import * as Sentry from '@sentry/browser';
import {Ember as EmberIntegration} from '@sentry/integrations';

Sentry.init({
  dsn: "https://0e3e53aff3f6bab711aa6fd280267704@o4509149437231104.ingest.de.sentry.io/4509149439852624",
  integrations: [new EmberIntegration()],
});

export default class App extends Application {
  modulePrefix = config.modulePrefix;

  podModulePrefix = config.podModulePrefix;

  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
