<?php
    require_once('../databaseConnection/connectDB.php');

    
    if(isset($_REQUEST["namepolyline"]) && isset($_REQUEST["typepolyline"]) && isset($_REQUEST["coordinates"]) && isset($_FILES["imgpolyline"])){
        $name = $_REQUEST['namepolyline'];
        $type = $_REQUEST['typepolyline'];
        $coords = $_REQUEST['coordinates'];
        $targetDir = "../upload/";
        $filename = $_FILES["imgpolyline"]["name"];
        $targetFilePath = $targetDir.$filename;

        if (move_uploaded_file($_FILES["imgpolyline"]["tmp_name"], $targetFilePath)) {
    try {   

        $PDO->beginTransaction();
        $query = "INSERT INTO public.occurrences_line(name,type,line,image) VALUES (?,?, ST_GeomFromText('LineString($coords)',3763),?)";
        $stmt = $PDO->prepare($query);
        $stmt->execute([ $name, $type, $filename]);

        $PDO->commit();

        echo "<script>console.log('Inserido com sucesso');</script>";
        header("Location: ./../index.html");

    } catch(PDOException $e) {
        echo "Query failed: ".$e->getMessage();
        $PDO->rollBack();
    }

    }
}

?>