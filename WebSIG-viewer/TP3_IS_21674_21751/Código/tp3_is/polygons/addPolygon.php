<?php
    require_once('../databaseConnection/connectDB.php');

    
    if(isset($_REQUEST["namepolygon"]) && isset($_REQUEST["typepolygon"]) && isset($_REQUEST["coordinatespolygon"]) && isset($_FILES["imgpolygon"])){
        $name = $_REQUEST['namepolygon'];
        $type = $_REQUEST['typepolygon'];
        $coords = $_REQUEST['coordinatespolygon'];
        
        $targetDir = "../upload/";
        $filename = $_FILES["imgpolygon"]["name"];
        $targetFilePath = $targetDir.$filename;

        if (move_uploaded_file($_FILES["imgpolygon"]["tmp_name"], $targetFilePath)) {
    try {   

        $PDO->beginTransaction();
        $query = "INSERT INTO public.occurrences_polygon(name,type,geometry,image) VALUES (?,?, ST_GeomFromText('Polygon(($coords))',3763),?)";
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