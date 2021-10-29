<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once('dbconfig.php');
if(isset($_GET['name']) && isset($_GET['jsonobject'])){
    $name = $_GET['name'];
    $jsonobject = $_GET['jsonobject'];
   
    //First checked wither object already available or not
    $selectQuery = "select * from dragdrop where vObject ='".$name."'";
    
    $result = mysqli_query($db, $selectQuery);
    if(mysqli_num_rows($result) > 0) {
        
        //If available then just simply update
        echo $updateRecord = "Update dragdrop SET tText ='".addslashes($jsonobject)."' where vObject='".$name."'";
        $upResult = mysqli_query($db,$updateRecord);
    } else {
        // If not available then insert data into table
        $insRecord = "INSERT INTO `dragdrop` (`id`, `vObject`, `tText`) VALUES (NULL, '".$name."', '".addslashes($jsonobject)."');";
        //echo $insRecord;
        $insResult = mysqli_query($db,$insRecord) or die(mysqli_error());
    }
    
 }
 // If called to fetch data from table to display drag & drop by passing getStoreData
if(isset($_GET['getStoreData']) == 1) {
    //Fetch all Records from DB
    $str = "";
    $selectQuery = "Select * from dragdrop order by vObject ASC";
    $resultQuery = mysqli_query($db,$selectQuery) or die(mysqli_error());
    while($row = mysqli_fetch_assoc($resultQuery)){
        $str.=$row['vObject']."=".stripslashes($row['tText']);
    }
    echo $str;
}
?>