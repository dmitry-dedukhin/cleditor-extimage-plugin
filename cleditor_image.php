<?php

include 'config.php';

$allowedExts = array("gif", "jpeg", "jpg", "png");
$temp = explode(".", $_FILES["imageName"]["name"]);
$extension = end($temp);
if ((($_FILES["imageName"]["type"] == "image/gif")
	|| ($_FILES["imageName"]["type"] == "image/jpeg")
	|| ($_FILES["imageName"]["type"] == "image/jpg")
	|| ($_FILES["imageName"]["type"] == "image/pjpeg")
	|| ($_FILES["imageName"]["type"] == "image/x-png")
	|| ($_FILES["imageName"]["type"] == "image/png"))
	&& ($_FILES["imageName"]["size"] < 600000)
	&& in_array($extension, $allowedExts)) {
	if ($_FILES["imageName"]["error"] > 0) {
	    echo "Return Code: " . $_FILES["imageName"]["error"];
	}
	else {
		if (FALSE === move_uploaded_file($_FILES['imageName']['tmp_name'], 'uploads/' . $_FILES['imageName']['name'])) {
			echo "Failed to move temporary file!";
		}
		else {
			echo '<div id="image">//' . SITE_URL . '/uploads/' . $_FILES['imageName']['name'] . '</div>';
		}
	}
}
else {
	echo "Invalid file";
}


//<div id="image">/path/to/uploaded/file</div>

