<?php
/**
     * Sending Headers to Browser to download excel file
     *
     * @param  filename 
     * @param  Company Data object fetching and making tabular format
     * @return/@output  complete HTML Table structure of Company with their ID, Name, First Name, Last Name, Year of Establishment,Type of Company
     * Created By : CNET - CS
     * Created Date : 28-Oct-2021
*/
header("Content-Type: application/xls");
header("Content-Disposition: attachment; filename=".date("y-m-d").".xls");
header("Pragma: no-cache");
header("Expires: 0");

require_once 'dbconfig.php';

$output = "";

$output .= "
		<table border='1'>
			<thead>
			<tr>
			<th>ID</th>
			<th>Company Name</th>
			<th>Firstname</th>
			<th>Lastname</th>
			<th>Year of Establishment</th>
			<th>Type Of Company</th>
		</tr>
			<tbody>
	";
//Fetching Data from demo_company table
$query = $conObj->query("SELECT * FROM `demo_company`") or die("Not executed!");
while ($fetch = $query->fetch_array()) {

	$output .= "
				<tr>
					<td>" . $fetch['comp_id'] . "</td>
					<td>" . $fetch['companyname'] . "</td>
					<td>" . $fetch['firstname'] . "</td>
					<td>" . $fetch['lastname'] . "</td>
					<td>" . $fetch['year'] . "</td>
					<td>" . $fetch['section'] . "</td>
				</tr>
	";
}

$output .= "
			</tbody>
			
		</table>
	";

echo $output;
?>