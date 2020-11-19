<?php
$threshold = 60 * 60 * 2;
$files = glob(dirname(__FILE__).'/store/*.json');
$now = time();
foreach ($files as $file) {
    if (is_file($file) && $now - filemtime($file) >= $threshold) {
        unlink($file);
    }
}
?>
