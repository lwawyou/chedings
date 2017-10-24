<?php
    include "config.php";
    header("Access-Control-Allow-Origin: *");
    $conn = mysqli_connect($host.":".$port,$user,$pass,$dbname) or die("error: Unable to Connect.". mysqli_connect_error());
?>