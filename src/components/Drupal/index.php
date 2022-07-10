<?php

// Error handling.
error_reporting(E_ALL);
$errors = [];
$stderr = fopen('php://stderr', 'w');
register_shutdown_function(function() use($stderr, &$errors){
  fwrite($stderr, json_encode(['session_id' => session_id()]) . "\n");
  fwrite($stderr, json_encode(['headers' => headers_list()]) . "\n");
  fwrite($stderr, json_encode(['errors' => error_get_last()]) . "\n");
});
set_error_handler(function(...$args) use($stderr, &$errors){
  fwrite($stderr, print_r($args, 1));
});

echo "Hello, world!";
phpinfo();
drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);
