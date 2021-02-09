<?php
    $user = 'postgres';
    $pwd = 'qJ5U6ve5Lz9j';
    $host = '127.0.0.1';
    $database = "tp3_is";
    $port = 5432;


    $db = "pgsql:host=$host;port=$port;dbname=$database; user=$user;password=$pwd";
    
    try {

        $PDO = new PDO($db);

        $PDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $PDO->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);


    } catch(PDOException $e) {
        echo "Query failed: ".$e->getMessage();
    }


?>