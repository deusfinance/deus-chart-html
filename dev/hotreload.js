const livereload = require('livereload');
const path = require('path');

const liveReloadServer = livereload.createServer({
    port: 35729,
    debug: false,
});

// Listen for errors
liveReloadServer.on('error', (err) => {
    if(err.code == "EADDRINUSE") {
        console.log("The port LiveReload wants to use is used by something else.");
        process.exit(1);
    }
});

liveReloadServer.watch([
    // path.join(__dirname, '../src/public/js'),
    // path.join(__dirname, '../src/views/')
    path.join(__dirname, '../src/')
]);
