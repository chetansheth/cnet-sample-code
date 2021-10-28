<?php
if(!session_start()) {
    session_start();
}
/**
     * Render an exception into an HTTP response.
     *
     * @param  index.php  $request
     * @param  token, company ID
     * @return string message of success print on screen
     * Created By : CNET - CS
     * Created Date : 28-Oct-2021
*/
if (isset($_REQUEST['token']) && $_REQUEST['token'] == "cnet" && isset($_REQUEST['iCompID'])) {
    require_once 'dbconfig.php';
    $message = "";
    $deleteQuery = "delete from demo_company where comp_id = '" . $_REQUEST['iCompID'] . "'";
    mysqli_query($conObj, $deleteQuery) or die(mysqli_error());
    $message = "Company has been deleted successfully!!";
    $_SESSION['delMsg'] = $message;
    echo $message ;
}
?>