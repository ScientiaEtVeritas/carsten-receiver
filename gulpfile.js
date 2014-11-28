var gulp              = require('gulp');
var clean             = require('gulp-clean');
var downloadatomshell = require('gulp-download-atom-shell');

gulp.task('downloadatomshell', function(cb){
    downloadatomshell({
      version: '0.19.*',
      outputDir: 'release'
    }, cb);
});

if(process.platform !== 'win32') {
    gulp.task('copyfiles', function(){
        return gulp.src(['app/**.*'])
            .pipe(gulp.dest('release/Atom.app/Contents/Resources/app/'));
    });

    gulp.task('default', ['downloadatomshell','copyfiles']);
} else {
    gulp.task('default', ['downloadatomshell']);
}