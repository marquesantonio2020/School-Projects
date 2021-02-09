<?php
//database connection
require_once('../databaseConnection/connectDB.php'); 

//
if (isset($_REQUEST["namemarker"]) && isset($_REQUEST["typemarker"]) && isset($_REQUEST["lat"]) && isset($_REQUEST["lng"]) && isset($_FILES["imgmarker"])) {
    //input requests
    $name = $_REQUEST['namemarker'];
    $type = $_REQUEST['typemarker'];
    $lat = $_REQUEST['lat'];
    $lng = $_REQUEST['lng'];

    //img target
    $targetDir = "../upload/";
    $filename = $_FILES["imgmarker"]["name"];
    $targetFilePath = $targetDir.$filename;

    //move img to upload folder
    if (move_uploaded_file($_FILES["imgmarker"]["tmp_name"], $targetFilePath)) {
        try {

            $PDO->beginTransaction();

            //insert query 
            $query = "INSERT INTO public.occurrences_point(name,type,point,image) VALUES (?,?, ST_GeomFromText('Point($lng $lat)',3763),?)";
            $stmt = $PDO->prepare($query);
            $stmt->execute([$name, $type, $filename]);

            $PDO->commit();

            echo "<script>console.log('Inserido com sucesso');</script>";
            header("Location: ./../index.html");
        } catch (PDOException $e) {
            echo "Query failed: " . $e->getMessage();
            $PDO->rollBack();
        }
    }
}
