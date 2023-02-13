const gulp= require('gulp');
const sass = require('gulp-sass')(require('sass'));
const minify= require('gulp-minify');


gulp.task('css',function(){
    

    return gulp.src('assets/scss/*.scss')
    .pipe(sass({outputStyle:'compressed'}).on('error',sass.logError))
    .pipe(gulp.dest('public/assets/css'))


    
})
gulp.task('watch',()=>{
    return gulp.watch("scss/*.scss",(done)=>{
    gulp.series(['css'])(done)
})

} )
gulp.task('minifyjs',function(){
    

    return gulp.src('assets/js/*.js')
    .pipe(minify())
    .pipe(gulp.dest('public/assets/js'))


    
})
