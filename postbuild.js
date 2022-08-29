var download = require('download-file')
const url = "https://ftp.drupal.org/files/projects/drupal-7.91.zip";
const options = {directory: "build", filename: "drupal-7.91.zip"};
console.log("Installing " + options.directory + "/" + options.filename);
download(url, options, function(error) {if (error) throw error;});
