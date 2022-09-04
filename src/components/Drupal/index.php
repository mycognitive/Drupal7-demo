<?php

// Error handling.
error_reporting(E_ALL);
ini_set('display_startup_errors', 1);
ini_set('session.save_path', '/home/web_user');

$errors = [];
$stderr = fopen('php://stderr', 'w');
register_shutdown_function(function() use($stderr, &$errors) {
  fwrite($stderr, json_encode(['session_id' => session_id()]) . "\n");
  fwrite($stderr, json_encode(['headers' => headers_list()]) . "\n");
  fwrite($stderr, json_encode(['errors' => error_get_last()]) . "\n");
});
set_error_handler(function(...$args) use($stderr, &$errors) {
  @fwrite($stderr, print_r($args, 1));
});

//$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator("."));
//foreach ($it as $name => $entry) { echo $name . "<br/>"; }

//syslog(LOG_ERR, "Foo");
//phpinfo();

$path    = '/';
$script  = 'index.php';

$docroot = '/home/web_user';
//$docroot = 'drupal-7.91';
$_SERVER['REQUEST_URI']     = $docroot . $path;
$_SERVER['REMOTE_ADDR']     = '0.0.0.0';
$_SERVER['SERVER_NAME']     = 'localhost';
$_SERVER['SERVER_PORT']     = 3000;
$_SERVER['REQUEST_METHOD']  = 'GET';
$_SERVER['SCRIPT_FILENAME'] = $docroot . '/' . $script;
$_SERVER['SCRIPT_NAME']     = $docroot . '/' . $script;
$_SERVER['PHP_SELF']        = $docroot . '/' . $script;

chdir($docroot);
define('DRUPAL_ROOT', getcwd());
//ob_start();

//drupal_load('module', 'system');
require_once DRUPAL_ROOT . '/install.php';
//require_once DRUPAL_ROOT . '/cron.php';
//require_once DRUPAL_ROOT . '/xmlrpc.php';
//require_once DRUPAL_ROOT . '/update.php';
//require_once DRUPAL_ROOT . '/includes/bootstrap.inc';

//echo "Hello, world!";
//drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);
//echo "Hello, world!";
