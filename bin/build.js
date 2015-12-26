var prettyBytes = require('pretty-bytes')
var prettyMs = require('pretty-ms')
var isAbsolute = require('path-is-absolute')
var browserify = require('browserify')
var UglifyJS = require('uglify-js')
var CleanCSS = require('clean-css')
var path = require('path')
var fs = require('fs')
var color = require('term-color')
var simpleHtml = require('simple-html-index')
var hyperstream = require('hyperstream')
var envify = require('loose-envify')
var uglifyify = require('uglifyify')
var collapser = require('bundle-collapser/plugin')

var now

module.exports = build
function build (argv, babelify) {
  // set for React et al that use envify
  process.env.NODE_ENV = 'production'

  now = Date.now()
  console.error('‣', color.magenta('build'), color.bold(argv._[1]))
  var bundler = browserify({
    transform: babelify
  })

  argv._.forEach(function (file) {
    bundler.add(path.resolve(file))
  })

  bundler.transform(envify)
  bundler.transform(uglifyify)
  bundler.plugin(collapser)

  bundler.bundle(function (err, src) {
    if (err) throw err
    prep(argv, src)
  })
}

function prep (argv, src) {
  log(src.length)
  console.error('‣', color.magenta('uglify'), color.bold(argv._[1]))

  var result = UglifyJS.minify(src.toString(), { fromString: true }).code
  log(result.length)

  if (argv.css) {
    console.error('‣', color.magenta('css-compress'), color.bold(argv._[1]))
    var cssFile = argv.css
    cssFile = isAbsolute(cssFile) ? cssFile : path.resolve(process.cwd(), cssFile)
    fs.readFile(cssFile, 'utf8', function (err, cssSrc) {
      if (err) throw err
      var cssCompressed = new CleanCSS().minify(cssSrc).styles
      log(cssCompressed.length)
      emit(result, cssCompressed)
    })
  } else {
    emit(result)
  }

  function emit (compressedJS, compressedCSS) {
    var buildFile = argv.build || argv.b
    var cssAppend
    if (compressedCSS) {
      cssAppend = {
        _appendHtml: '<style type="text/css">' +
          compressedCSS + '</style>'
      }
    }

    var outStream = process.stdout
    if (typeof buildFile === 'string') {
      buildFile = isAbsolute(buildFile) ? buildFile : path.resolve(process.cwd(), buildFile)
      outStream = fs.createWriteStream(buildFile)
    }

    simpleHtml({ title: argv.title })
      .pipe(hyperstream({
        head: cssAppend,
        body: {
          _appendHtml: '<script type="text/javascript">' +
            compressedJS + '</script>'
        }
      }))
      .pipe(outStream)
  }
}

function log (length) {
  var bytes = prettyBytes(length)
  var ms = prettyMs(Date.now() - now)
  console.error('└─', color.dim(bytes), 'in', color.dim(ms))
  now = Date.now()
}
