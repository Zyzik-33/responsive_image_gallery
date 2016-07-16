import gulp         from 'gulp';
import notifier     from 'node-notifier';
import sass         from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import concat       from 'gulp-concat';
import merge        from 'merge-stream';
import minify       from 'gulp-minify-css';
import jade         from 'gulp-jade';
import connect      from 'gulp-connect';
import imagemin     from 'gulp-imagemin';

gulp.task('connect', () => {
  connect.server({
    root: 'dist/',
    livereload: true
  })
});

gulp.task('sass', () => {
  let scssStream = gulp.src(['src/sass/**/*.sass'])
    .pipe(sass())
    .on('error', swallowError)
    .pipe(autoprefixer())
    .pipe(concat('scss-files.scss'));

  let mergedStream = merge(scssStream)
    .pipe(concat('site.css'))
    .pipe(minify())
    .pipe(gulp.dest('./dist/assets/css/'))
    .pipe(connect.reload())

    return mergedStream;
});

gulp.task('jade', () => {
  gulp.src('./src/jade/index.jade')
    .pipe(jade())
    .on('error', swallowError)
    .pipe(gulp.dest('./dist/'))
    .pipe(connect.reload())
});

gulp.task('imgs', () => {
  gulp.src('src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/img'))
    .on('error', swallowError);
});

gulp.task('default', ['connect', 'sass', 'jade', 'imgs'], () => {
  gulp.watch('src/sass/**/*.sass', ['sass']);
  gulp.watch('src/jade/**/*.jade', ['jade']);
  gulp.watch('src/img/*', ['imgs']);
});

function swallowError(err) {
  console.log(err.message);

  this.emit('end');

  gulp.task('default');
}
