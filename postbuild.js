var download = require('download-file')
const url = "https://ftp.drupal.org/files/projects/drupal-8.9.20.zip";
const options = {directory: "build", filename: "drupal-8.9.20.zip"};
console.log("Installing " + options.directory + "/" + options.filename);
download(url, options, function(error) {if (error) throw error;});
