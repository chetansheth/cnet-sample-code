<?php
	require_once 'dbconfig.php';
	/**
     * Storing company data
     *
     * @param  Company Name, First Name , Last Name, Year & Type of Compnay
     * @param  null
     * @return redirect  to index.php file
     * Created By : CNET - CS
     * Created Date : 28-Oct-2021
*/
	if(isset($_POST['Upload'])){
        $companyname = $_POST['companyname'];
		$firstname = $_POST['firstname'];
		$lastname = $_POST['lastname'];
		$year = $_POST['year'];
		$section = $_POST['section'];
		$query =  "INSERT INTO `demo_company`( `companyname`,`firstname`, `lastname`, `year`, `section`) VALUES( '$companyname','$firstname', '$lastname', '$year', '$section')";
		//Executing query through mysqli_query function
		mysqli_query($conObj, $query) or die(mysqli_error());
		
		header("location: index.php");
		exit();
	}
    
?>