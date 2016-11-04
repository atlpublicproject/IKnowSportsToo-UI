({
  baseUrl: 'node_modules/materialize-css/js',
  name: '../../../materialize-css',
  out: 'node_modules/materialize-css/dist/js/materialize.amd.js',
  paths: {
    'jquery': '../../jquery/dist/jquery',
    'initial': 'initial',
    'global': 'global',
    'animation': 'animation',
    'buttons': 'buttons',
    'cards': 'cards',
    'carousel': 'carousel',
    'character_counter': 'character_counter',
    'chips': 'chips',
    'collapsible': 'collapsible',
    'dropdown': 'dropdown',
    'forms': 'forms',
    'hammerjs': 'hammer.min',
    'jquery.easing': 'jquery.easing.1.3',
    'jquery.hammer': 'jquery.hammer',
    'jquery.timeago': 'jquery.timeago.min',
    'leanModal': 'leanModal',
    'materialbox': 'materialbox',
    'parallax': 'parallax',
    'picker': 'date_picker/picker',
    'picker.date': 'date_picker/picker.date',
    'prism': 'prism',
    'pushpin': 'pushpin',
    'scrollFire': 'scrollFire',
    'scrollspy': 'scrollspy',
    'sideNav': 'sideNav',
    'slider': 'slider',
    'tabs': 'tabs',
    'toasts': 'toasts',
    'tooltip': 'tooltip',
    'transitions': 'transitions',
    'velocity': 'velocity.min',
    'waves': 'waves'
  },
  shim: {
    'jquery': { exports: '$' },
    'animation': ['jquery'],
    'buttons': ['jquery'],
    'cards': ['jquery'],
    'carousel': ['jquery'],
    'character_counter': ['jquery'],
    'chips': ['jquery'],
    'collapsible': ['jquery'],
    'dropdown': ['jquery'],
    'forms': ['jquery', 'global'],
    'global': { deps: ['jquery'], exports: 'Materialize' },
    'hammerjs': {},
    'jquery.easing': ['jquery'],
    'jquery.hammer': { deps: ['jquery', 'hammerjs', 'waves'] },
    'jquery.timeago': ['jquery'],
    'leanModal': ['jquery'],
    'materialbox': ['jquery'],
    'parallax': ['jquery'],
    'prism': ['jquery'],
    'pushpin': ['jquery'],
    'scrollFire': ['jquery', 'global'],
    'scrollspy': ['jquery'],
    'sideNav': ['jquery'],
    'slider': ['jquery'],
    'tabs': ['jquery'],
    'toasts': {
      deps: ['global', 'hammerjs', 'velocity'], init: function(Materialize, Hammer, Vel) {
        window.Hammer = Hammer;
        window.Vel = Vel;
      }
    },
    'tooltip': ['jquery'],
    'transitions': ['jquery', 'scrollFire'],
    'waves': { exports: 'Waves' }
  },
  optimize: 'none',
  exclude: ['jquery'],
  include: [
    'initial',
    'global',
    'animation',
    'buttons',
    'cards',
    'carousel',
    'character_counter',
    'chips',
    'collapsible',
    'dropdown',
    'forms',
    'hammerjs',
    'jquery.easing',
    'jquery.hammer',
    'jquery.timeago',
    'leanModal',
    'materialbox',
    'parallax',
    'picker',
    'picker.date',
    'prism',
    'pushpin',
    'scrollFire',
    'scrollspy',
    'sideNav',
    'slider',
    'tabs',
    'toasts',
    'tooltip',
    'transitions',
    'velocity',
    'waves'
  ]
});