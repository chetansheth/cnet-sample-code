<?php
/**
     *@description Settings of Mysql Database connection
     *
     * @param  null
     * @param  null
     * @return database connection object
     * Created By : CNET - CS
     * Created Date : 28-Oct-2021
*/
	$conObj = mysqli_connect("localhost", "root", "", "inhouse_complain_activity");
	
	if(!$conObj){
		die("Error: Failed, Something went wrong !");
	}
?>