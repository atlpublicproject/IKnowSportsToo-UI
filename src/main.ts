import {Aurelia} from 'aurelia-framework'
import environment from './environment';
//import $ from 'jquery';


//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
(<any>Promise).config({
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .plugin('aurelia-hammer')
    .plugin('aurelia-validation')
    .plugin('aurelia-materialize-bridge', b => b.useAll());
    
    //.plugin('./resources');
    //.plugin('aurelia-converters');
    //.plugin('aurelia-mobile-plugin');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
