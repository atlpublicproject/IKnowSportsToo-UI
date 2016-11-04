import * as gulp from 'gulp';
import * as changedInPlace from 'gulp-changed-in-place';
import * as project from '../aurelia.json';
import * as plumber from 'gulp-plumber';
import * as notify from 'gulp-notify';
import * as scss from 'gulp-sass';
import * as sourcemaps from 'gulp-sourcemaps';
import {build} from 'aurelia-cli';


export default function processSCSS() {

  return gulp.src(project.scssProcessor.source)
    //.pipe(changedInPlace({firstPass:true}))
    .pipe(plumber({ errorHandler: notify.onError('SASS Error: <%= error.message %>') }))
    .pipe(sourcemaps.init())
    .pipe(scss())
    .pipe(build.bundle());
};
