/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

const { lstatSync, readdirSync } = require('fs');
const babel = require('gulp-babel');
const Builder = require('systemjs-builder');
const concat = require('gulp-concat');
const cssBase64 = require('gulp-css-base64');
const del = require('del');
const express = require('express');
const gulp = require('gulp');
const gulpWatch = require('gulp-debounced-watch');
const insert = require('gulp-insert');
const path = require('path');
const plumber = require('gulp-plumber');
const replace = require('gulp-replace');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const serveStatic = require('serve-static');
const sourcemaps = require('gulp-sourcemaps');
const tsc = require('gulp-typescript');
const tscConfig = require('./../tsconfig.json');
const tslint = require('gulp-tslint');
const uglify = require('gulp-uglify');
const rollupbabel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const rollup = require('gulp-rollup');
const rollupBuiltins = require('rollup-plugin-node-builtins');
const rollupGlobals = require('rollup-plugin-node-globals');
const rollupSourcemaps = require('rollup-plugin-sourcemaps');
const rename = require('gulp-rename');

// Generate systemjs-based builds
const buildFolder = 'build';
const distFolder = 'runtime/build';

const sourceMaps = false;
const minify = false;

const babelPlugins = [
  'babel-plugin-transform-es2015-template-literals',
  'babel-plugin-transform-es2015-literals',
  'babel-plugin-transform-es2015-function-name',
  'babel-plugin-transform-es2015-arrow-functions',
  'babel-plugin-transform-es2015-block-scoped-functions',
  'babel-plugin-transform-es2015-classes',
  'babel-plugin-transform-es2015-object-super',
  'babel-plugin-transform-es2015-shorthand-properties',
  'babel-plugin-transform-es2015-computed-properties',
  'babel-plugin-transform-es2015-for-of',
  'babel-plugin-transform-es2015-sticky-regex',
  'babel-plugin-transform-es2015-unicode-regex',
  'babel-plugin-check-es2015-constants',
  'babel-plugin-transform-es2015-spread',
  'babel-plugin-transform-es2015-parameters',
  'babel-plugin-transform-es2015-destructuring',
  'babel-plugin-transform-es2015-block-scoping',
  'babel-plugin-transform-es3-property-literals',
  'babel-plugin-remove-comments'
].map(require.resolve);

// Compile TypeScript to JS
gulp.task('compile:ts', function () {
  return gulp
    .src([
      'src/*.ts',
      'src/**/*.ts',
    ])
    .pipe(sourcemaps.init())
    .pipe(tsc(tscConfig.compilerOptions))
    .pipe(gulp.dest(buildFolder));
});

gulp.task('bundle:vendor', function() {
  return gulp.src([
    'src/libs/systemjs/system.js',
    'src/libs/systemjs/extras/amd.js',
    'src/libs/systemjs/extras/global.js',
    'src/libs/systemjs/extras/named-exports.js',
    'src/libs/systemjs/extras/named-register.js',
    'src/libs/systemjs/extras/transform.js',
    'src/libs/browser-ipfs.js',
    'src/libs/core-js.client.shim.min.js',
    'src/libs/navigo.js',
    'src/libs/polyfills.js',
    'src/libs/zone.js',
    // 'systemjs.config.js',
  ])
  .pipe(babel({
    plugins: babelPlugins
  }))
  .pipe(concat('vendor.min.js'))
  .pipe(gulp.dest(distFolder));
})

gulp.task('bundle:js', ['bundle:vendor'], function() {
  return gulp.src(`${ buildFolder }/**/*.js`)
    // transform the files here.
    .pipe(sourcemaps.init())
    .pipe(rollup({
      onwarn: function(warning) { },

      // Bundle's entry point
      // See "input" in https://rollupjs.org/#core-functionality
      input: `${ buildFolder }/main.js`,

      // Allow mixing of hypothetical and actual files. "Actual" files can be files
      // accessed by Rollup or produced by plugins further down the chain.
      // This prevents errors like: 'path/file' does not exist in the hypothetical file system
      // when subdirectories are used in the `src` directory.
      allowRealFiles: true,

      // A list of IDs of modules that should remain external to the bundle
      // See "external" in https://rollupjs.org/#core-functionality
      external: [ ],

      // Format of generated bundle
      // See "format" in https://rollupjs.org/#core-functionality
      format: 'iife',

      treeshake: true,

      // Export mode to use
      // See "exports" in https://rollupjs.org/#danger-zone
      exports: 'named',

      // The name to use for the module for UMD/IIFE bundles
      // (required for bundles with exports)
      // See "name" in https://rollupjs.org/#core-functionality
      name: 'dappbrowser',

      // See "globals" in https://rollupjs.org/#core-functionality
      globals: {
        typescript: 'ts'
      },

      plugins:[
        resolve({
          preferBuiltins: true,
        }),
        commonjs({
          // include: 'node_modules/angular-libs/node_modules/rxjs/**'
        }),
        rollupGlobals(),
        rollupBuiltins(),
        rollupbabel({
          exclude: [/node_modules/]
        })
        // analyze({ limit: 20 }),
        // cleanup()
        // rollupSourcemaps()
      ]
    }))
    .pipe(insert.prepend('let evanGlobals; let process = { env: { } }; '))

    // fix ace is doing weird blob stuff
    // .pipe(replace(/if\ \(e\ instanceof\ window\.DOMException\)\ \{/g, 'if (true) {'))

    // save file
    .pipe(rename(`app.min.js`))
    //´.pipe(sourcemaps.write(`.`,{includeContent: true, sourceRoot: `${dappRelativePath}`}))
    .pipe(gulp.dest(distFolder));
});

gulp.task('copy:build', function () {
  return gulp
    .src([
      `src/*`
    ])
    .pipe(gulp.dest(distFolder));
});

gulp.task('copy:assets', function() {
  return gulp.src(
    [
      'src/*.json',
      'src/*.js',
      'src/*.html',
      'src/*.css',
      'src/*.ico',
      'src/*.png',
      'src/!*.ts',
      'src/!*.scss',
      'src/manifest.json',
      'src/libs/cordova.js',
    ])
    .pipe(gulp.dest('runtime'))
});

// Clean the js distribution directory
gulp.task('clean:dist', function () {
  return del(['runtime/*', 'build', '!runtime/external']);
});

gulp.task('clean', ['clean:dist']);

// Lint Typescript
gulp.task('lint:ts', function() {
  return gulp.src('src/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report({
      formatter: 'verbose',
      emitError: false })
    );
});

gulp.task('ionic-sass', function () {
  let includePaths = [
    '..',
    '../ui-angular-libs',
    '../ui-angular-libs/ionic-angular',
    '../ui-angular-libs/ionic-angular/themes',
    '../ui-angular-libs/ionic-angular/fonts',
    '../ui-angular-libs/ionicons/dist/scss',
  ];

  includePaths = includePaths.concat(includePaths
    .map(includePath => includePath.replace('../ui-angular-libs', '../ui-angular-libs/node_modules'))
  );

  return gulp
    .src(path.resolve(`src/**/*.scss`))
    .pipe(
      sass({
        outputStyle : 'compressed',
        includePaths : includePaths.map(src => path.resolve(src))
      })
      .on('error', sass.logError)
    )
    // remove ttf and woff font files from build
    // file is 1,4mb big => to reduce file size, remove noto sans font files
    .pipe(replace(/(?:,\s?)?url\(\'[^']*\'\) format\(\'(?:truetype|woff2)\'\)(?:,\s?)?/g, ''))
    .pipe(concat(`dapp-root.css`))
    .pipe(cssBase64({ maxWeightResource: 849616, baseDir : 'node_modules/ui-angular-sass' }))
    .pipe(cssBase64({ maxWeightResource: 849616, baseDir : '../../ui-angular-sass' }))
    .pipe(cssBase64({ maxWeightResource: 228000, baseDir : '../../ui--libs/noangularde_modules/ionic-angular/fonts' }))
    .pipe(gulp.dest(buildFolder));
});


gulp.task('scripts', function(callback) {
  runSequence(['lint:ts', 'clean:dist'], 'compile:ts', 'bundle:js', callback);
});

gulp.task('copy', function(callback) {
  runSequence('copy:assets', callback);
});

gulp.task('build', function(callback) {
  runSequence('scripts', 'ionic-sass', 'copy', callback);
});

gulp.task('default', function(callback) {
  runSequence('build', 'serve', callback);
});

