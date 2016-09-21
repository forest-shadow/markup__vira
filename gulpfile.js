//'use strict';


/*******************************
 * Modules & Plugins
 *******************************/
var gulp            = require( 'gulp' ),
    uglify          = require( 'gulp-uglify' ),
    concat          = require( 'gulp-concat' ),
    jshint          = require( 'gulp-jshint' ),
    sass            = require( 'gulp-sass' ),
    autoprefixer    = require( 'gulp-autoprefixer' ),
    imagemin        = require( 'gulp-imagemin' ),
    browsersync     = require( 'browser-sync' ),
    reload          = browsersync.reload,
    browserify      = require( 'browserify' ),
    source          = require( 'vinyl-source-stream' ),
    plumber         = require('gulp-plumber'),
    beeper          = require('beeper'),
    del             = require('del'),
    //config = require('./config.json'),
    sourcemaps      = require('gulp-sourcemaps'),
    rename          = require('gulp-rename'),
    jade            = require('gulp-jade'),
    fs              = require('fs'),
    streamqueue     = require('streamqueue'),
    spritesmith     = require('gulp.spritesmith'),
    buffer          = require('vinyl-buffer');


/*******************************
 * Create dist dir if not exist
 *******************************/
if ( !fs.existsSync( './dist/' ) ) {
    fs.mkdirSync( './dist/' );
}


/*******************************
 * Error Helper
 *******************************/
function onError( err ) {
    beeper( 3 );
    console.log( err );
}


/*******************************
 * Get dictionary.json with pages description
 *******************************/
var getDesc = function( txt ) {
    var dict, key, value;
    dict = fs.readFileSync( './dictionary.json', 'utf-8' );
    dict = JSON.parse( dict );
    for ( key in dict ) {
        value = dict[key];
        if ( key === txt ) {
            return value;
        }
    }
    return txt;
};


/*******************************
 * Jade Task
 *******************************/
gulp.task( 'jade', function() {
    dirs = fs.readdirSync( './dist/' );
    files = [];
    for ( var i = 0, len = dirs.length; i < len; i++ ) {
        var file = dirs[i];
        if ( file.indexOf( '.html' ) + 1 && !( file.indexOf( 'index' ) + 1) ) {
            files.push({
                file: file.replace( '.html', '' ),
                name: getDesc( file )
            });
        }
    }

    gulp.src( './dev/jade/*.jade' )
        .pipe( plumber({
            errorHandler: onError
        }) )
        .pipe( jade({
            pretty: true,
            locals: {'pages': files}
        }) )
        .pipe( gulp.dest( './dist' ) );
});


/*******************************
 * Fonts Task
 *******************************/
gulp.task( 'fonts', function() {
	return gulp.src( './dev/fonts/**/*' )
		.pipe( gulp.dest( './dist/fonts' ) );
});


/*******************************
 * Sass Task
 *******************************/
gulp.task( 'sass', function() {
   return gulp.src('./dev/scss/bootstrap.scss')
       .pipe(sourcemaps.init())
       .pipe( sass().on( 'error', sass.logError ) )
       //.pipe(plumber({
       //    errorHandler: onError
       //}))

       .pipe(autoprefixer({ browsers: ['android 4', 'Safari < 9', '> 1%', 'IE 6-8', 'Firefox < 20', 'last 2 versions']}))
       .pipe(sourcemaps.write( ))
       .pipe(rename( 'all.css' ))
       .pipe(gulp.dest('./dist/'));
});


/*******************************
 * Scripts Task
 *******************************/
gulp.task( 'scripts', function() {
    return streamqueue( { objectMode: true },

    gulp.src( [ 'dev/js/vendor/jquery-3.0.0.min.js', 'dev/js/vendor/jquery-ui.min.js', 'dev/js/vendor/moment-with-locales.js','dev/js/vendor/**/*.js' ] )
         .pipe( sourcemaps.init() )
         .pipe( sourcemaps.write() ),

    gulp.src( ['dev/js/custom/*.js'] )
        .pipe( sourcemaps.init() )
        .pipe( jshint() )
        .pipe( jshint.reporter( 'default' ) )
        .pipe( sourcemaps.write( ) ) )

    .pipe( concat( 'all.js' ) )
        //.pipe(uglify())
    .pipe( gulp.dest( './dist/' ) );
});


/*******************************
 * Images Task
 *******************************/
gulp.task( 'images', function() {
    gulp.src( 'dev/images/*' )
        .pipe( imagemin() )
        .pipe( gulp.dest( 'dist/images' ) );
});

gulp.task( 'images:vendor', function() {
    gulp.src( ['dev/images/vendor/**/*.*'] )
        .pipe( imagemin() )
        .pipe( gulp.dest( 'dist/images/vendor/' ) );
});

gulp.task( 'images:mockups', function() {
    gulp.src( ['dev/images/mockups/**/*.*'] )
        .pipe( imagemin() )
        .pipe( gulp.dest( 'dist/images/mockups/' ) );
});

/*******************************
 * Spritesmith task
 *******************************/
gulp.task('images:spritesmith', function() {
	var spriteData =
		gulp.src( './dev/images/icons/**/*.*' ) // путь, откуда берем картинки для спрайта
			.pipe( spritesmith({
				imgName: 'sprite.png',
				imgPath: 'images/sprite.png',
				cssName: '_sprites.scss',
				cssFormat: 'scss',
				algorithm: 'binary-tree',
				padding: 10,
				cssVarMap: function( sprite ) {
					sprite.name = 's-' + sprite.name
				}
			}) );

	spriteData.img
		.pipe(buffer())
		.pipe( imagemin({ progressive: true }).on('error', function(e){
			console.log(e);
		}) )
		.pipe(gulp.dest( './dist/images' )); // путь, куда сохраняем картинку

	spriteData.css.pipe(gulp.dest( './dev/scss/' )); // путь, куда сохраняем стили

	gulp.src( './dev/images/icons/**/*' )
		.pipe(buffer())
		.pipe(imagemin({ progressive: true }))
		.pipe(gulp.dest( './dist/images/icons' ));
});

/*******************************
 * Watch Task
 *******************************/
gulp.task('watch', function() {
    gulp.watch( 'dist/*.html' ).on( 'change', reload );
    gulp.watch( 'dev/jade/**/*.jade', [ 'jade' ] ).on( 'change', reload );
    gulp.watch( 'dev/fonts/**/*', [ 'fonts' ] );
    gulp.watch( 'dev/scss/**/*.scss', [ 'sass', reload ] );
    gulp.watch( 'dev/js/**/*.js', [ 'scripts', reload ] );
    gulp.watch( 'dev/images/**/*.*', [ 'images', 'images:vendor', 'images:mockups', 'images:spritesmith', reload ] );
});


/*******************************
 * BrowserSync Task
 *******************************/
gulp.task( 'browsersync', function( cb ) {
    return browsersync( {
        server: {
            baseDir: 'dist',
            //index: 'template.html'
        },
        open: "local",
        browser: "chrome"
    }, cb );
});


/*******************************
 * Browserify Task
 *******************************/
gulp.task( 'browserify', function() {
    return browserify( './dev/js/dev.js' )
        .bundle()
        .pipe( source( 'bundle.js' ) )
        .pipe( gulp.dest( './dist' ) );
});


/*******************************
 * Delete 'dist' directory
 *******************************/
gulp.task( 'cleanDistDir', function( cb ) {
    del( ['dist'], cb );
});


/*******************************
 * Default Task
 *******************************/
gulp.task( 'default', [ 'jade', 'fonts', 'sass', 'scripts', 'images', 'images:vendor', 'images:mockups', 'images:spritesmith', 'browsersync', 'watch' ] );
