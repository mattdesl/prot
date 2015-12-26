var budo = require('budo')
var assign = require('object-assign')
var installify = require('installify')

module.exports = dev
function dev (args, argv, babelify) {
  var transforms = [
    babelify
  ]

  if (argv.install || argv.i) {
    transforms.push([ installify, { save: true } ])
  }

  var opts = assign({}, argv, {
    live: true,
    forceDefaultIndex: true,
    browserify: {
      transform: transforms
    },
    serve: 'bundle.js'
  })
  budo.cli(args, opts)
}
