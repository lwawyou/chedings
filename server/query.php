<?php
    include "connect.php";
    $sql = $_POST["data"];
    $query = mysqli_query($conn, $sql);
    if(!$query){
        $sql.= PHP_EOL.'=============================================================================================='.PHP_EOL
        .'Message: '. mysqli_error($conn);;
    }else{
        $row = mysqli_fetch_all($query,MYSQLI_ASSOC);
        echo json_encode($row);
        
        mysqli_close($conn);
    }

    $token = 'ddded6ed-6f7b-11e7-bfd0-a088697bc432';
    date_default_timezone_set("Asia/Manila");
    $file = fopen("logs-".$token."/log-".date("Y-m-d").".txt","a+");
    fwrite($file,date("H:i:s").": ".$sql." ".PHP_EOL." ".PHP_EOL);
    fclose($file);
?>