<?php

require_once('../databaseConnection/connectDB.php');
    if(isset($_REQUEST["id"])){
        $id = $_REQUEST['id'];
        echo "<script>console.log('$id');</script>";
    

    try {   

        $PDO->beginTransaction();

        $query = "DELETE from public.occurrences_point where id=?";
        $stmt = $PDO->prepare($query);
        $stmt->execute([$id]);

        $PDO->commit();

        echo "<script>console.log('Removido com sucesso');</script>";
        header("Location: ./../index.html");

    } catch(PDOException $e) {
        echo "Query failed: ".$e->getMessage();
        $PDO->rollBack();
    }

    }

?>