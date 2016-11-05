#!/usr/bin/env node
var color = require('term-color')
var fs = require('fs')
var path = require('path')
var isAbsolute = require('path-is-absolute')
var args = process.argv.slice(2)
var argv = require('budo/lib/parse-args')(args)
argv._.unshift(path.resolve(__dirname, 'polyfill.js'))

var maxstache = require('maxstache')
var pkgJson = fs.readFileSync(path.resolve(__dirname, 'default-package.json'), 'utf8')

if (argv._.length === 1) {
  argv._.push('index.js')
}

var presets = [
  require('babel-preset-es2015'),
  require('babel-preset-stage-0')
]

if (argv.r || argv.react) {
  presets.push(require('babel-preset-react'))
}

var babelify = require('babelify').configure({
  presets: presets
})

var firstEntry = argv._[1]
firstEntry = isAbsolute(firstEntry)
  ? firstEntry : path.resolve(process.cwd(), firstEntry)

isFile(firstEntry, function (exists) {
  if (exists) return checkPackage()
  console.error('‣', color.magenta('writing index.js'))
  fs.writeFile(firstEntry, '', function (err) {
    if (err) throw err
    checkPackage()
  })
})

function checkPackage () {
  var pkg = path.resolve(process.cwd(), 'package.json')
  isFile(pkg, function (exists) {
    if (exists) return run()
    console.error('‣', color.magenta('writing package.json'))
    var jsonStr = maxstache(pkgJson, {
      name: path.basename(process.cwd())
    })
    fs.writeFile(pkg, jsonStr, function (err) {
      if (err) throw err
      run()
    })
  })
}

function isFile (file, cb) {
  fs.stat(file, function (err, stat) {
    if (!err) {
      if (!stat.isFile()) throw new Error('not a file: ' + file)
      return cb(true)
    }
    if (err.code === 'ENOENT') {
      cb(false)
    } else {
      throw err
    }
  })
}

function run () {
  if (argv.build || argv.b) {
    require('./build')(argv, babelify)
  } else {
    require('./dev')(args, argv, babelify)
  }
}
