<?php
if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])) {
    http_response_code(401);
    die();
}

$method = $_SERVER['REQUEST_METHOD'];
$file_name = md5($_SERVER['PHP_AUTH_USER'].':'.$_SERVER['PHP_AUTH_PW']).'.json';
$file = dirname(__FILE__).'/store/'.$file_name;

header('Content-type: application/json');
if ($method == 'GET') {
    if (!file_exists($file)) {
        http_response_code(404);
        echo json_encode(array('error' => 'not found'));
        die();
    }
    readfile($file);
} else if ($method == 'POST') {
    file_put_contents($file, file_get_contents('php://input'));
    echo json_encode(array('status' => 'ok'));
} else {
    http_response_code(405);
    echo json_encode(array('error' => 'method not allowed'));
}
?>
