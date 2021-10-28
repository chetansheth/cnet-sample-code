<?php
/**
     * Render Company data, Add company & Delete Company
     *
     * @param  ajax request of for delete companyId
     * @param  token, company ID
     * @return string message of success print on screen
     * Created By : CNET - CS
     * Created Date : 28-Oct-2021
*/
if(!session_start()) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1"/>
		<link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
	</head>
<body>
	<nav class="navbar navbar-default">
		
	</nav>
	<div class="col-md-3"></div>
	<div class="col-md-6 well">
		<div id="delmessageblock" style="display:none;color:red">
		
		</div>
		<h3 class="text-primary">CNET - PHP SAMPLE EXCEL EXPORT</h3>
		<hr style="border-top:1px dotted #ccc;"/>
		<button type="button" class="btn btn-success" data-toggle="modal" data-target="#form_modal"><span class="glyphicon glyphicon-plus"></span> Add Company</button>
		<br /><br />
		<table class="table table-bordered">
			<thead class="alert-info">
				<tr>
					<th>Company Name</th>
					<th>Firstname</th>
					<th>Lastname</th>
					<th>Year of Establishment</th>
					<th>Type Of Company</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				<?php
					require 'dbconfig.php'; 
					//Fetching data of demo_company
					$query = mysqli_query($conObj, "SELECT * FROM `demo_company`") or die(mysqli_error());
					while($fetch = mysqli_fetch_array($query)){
				?>
				<tr>
					<td><?php echo $fetch['companyname']?></td>
					<td><?php echo $fetch['firstname']?></td>
					<td><?php echo $fetch['lastname']?></td>
					<td><?php echo $fetch['year']?></td>
					<td><?php echo $fetch['section']?></td>
					<td><button type="button" class="btn btn-danger" data-dismiss="modal" onclick="return delCompany(<?php echo $fetch['comp_id']?>);"><span class="glyphicon glyphicon-remove"></span> Delete</button>
				</tr>
				<?php
					}
				?>
			</tbody>
			<tfoot>
				<tr>
					<td><a class="btn btn-info" href="exportcompanyexcel.php">Save as Excel</a></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
			</tfoot>
		</table>
	</div>
<div class="modal fade" id="form_modal" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<form method="POST" action="storecompany_data.php">
				<div class="modal-header">
					<h3 class="modal-title">Add Company</h3>
				</div>
				<div class="modal-body">
					<div class="col-md-2"></div>
					<div class="col-md-8">
						<div class="form-group">
							<label>Company Name</label>
							<input type="text" name="companyname" class="form-control" required="required"/>
						</div>
						<div class="form-group">
							<label>Firstname</label>
							<input type="text" name="firstname" class="form-control" required="required"/>
						</div>
						<div class="form-group">
							<label>Lastname</label>
							<input type="text" name="lastname" class="form-control" required="required"/>
						</div>
						<div class="form-group">
							<label>Year of Establishment</label>
							<select name="year" class="form-control" required="required">
								<option value=""></option>
								<option value="2018">2018</option>
								<option value="2019">2019</option>
								<option value="2020">2020</option>
								<option value="2021">2021</option>
							</select>
						</div>
						<div class="form-group">
							<label>Type Of Company</label>
							<select name="section" class="form-control" required="required">
								<option value=""></option>
								<option value="Agency">Agency</option>
								<option value="B2B">B2B</option>
								<option value="B2C">B2C</option>
								<option value="AI Base">AI Base</option>
							</select>
						</div>
					</div>
				</div>
				<br style="clear:both;"/>
				<div class="modal-footer">
					<button type="button" class="btn btn-danger" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span> Close</button>
					<button class="btn btn-primary" name="Upload"><span class="glyphicon glyphicon-save"></span> Save</button>
				</div>
			</form>
		</div>
	</div>
</div>
<script>
	//Place sample here for Noraml javascript Ajax call 
	/**
     * after successful deletion reload page / window
     *
     * @param  ajax request of for delete companyId
     * @param  token, company ID
     * @return string message of success print on screen
     * Created By : CNET - CS
     * Created Date : 28-Oct-2021
*/
	function delCompany(compID) {
		var flag = confirm("Are you sure want to delete company ?");
		if(flag) {
			var xhttp = new XMLHttpRequest();
  			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					document.getElementById("delmessageblock").innerHTML = this.responseText;
					document.getElementById("delmessageblock").style.display = "block";
					window.location.reload();
				}
  			};
		  	var url = "ajax_delcompany.php?token=cnet&iCompID=" + compID;
			  
  			xhttp.open("POST",url, true);
  			xhttp.send();
		} // confirm agree condition closed here
		
	}
	<?php 
			/**
			 * Checking for session register or not
			 *
			 * @param  Session Variable
			 * @param  null
			 * @return null
			 * Created By : CNET - CS
			 * Created Date : 28-Oct-2021
			*/
			if(isset($_SESSION['delMsg']) && $_SESSION['delMsg'] != "") {
	?>
				var delmessage = "<?php echo $_SESSION['delMsg'];?>";
				document.getElementById("delmessageblock").innerHTML = delmessage;
				document.getElementById("delmessageblock").style.display = "block";
	<?php		
				$_SESSION['delMsg']	= "";
		}
	?>
</script>	
<script src="js/jquery-3.2.1.min.js"></script>	
<script src="js/bootstrap.js"></script>	
</body>	
</html>