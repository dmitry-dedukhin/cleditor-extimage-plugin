<?php
include 'config.php';

// define constants if not yet provided
if (!defined('SITE_URL')) {
	// define SITE_URL based on the URI for the running script
	define('SITE_URL', rtrim(str_replace(basename(__FILE__), '', $_SERVER['SCRIPT_URI']), '/'));
}

if (!defined('UPLOADS_PATH')) {
	// define the UPLOADS_PATH based on the path of the running script
	define('UPLOADS_PATH', dirname(__FILE__) . '/uploads');
}

if (!defined('MAXIMUM_UPLOAD_BYTES')) {
	define('MAXIMUM_UPLOAD_BYTES', 1048576);
}


$allowedExtensions = array("gif", "jpeg", "jpg", "png");
$allowedTypes = array("image/gif", "image/jpeg", "image/jpg", "image/pjpeg", "image/x-png", "image/png");

$extension = pathinfo($_FILES["imageName"]["name"], PATHINFO_EXTENSION);

// validate image file type
if (!in_array($_FILES["imageName"]["type"], $allowedTypes) || !in_array($extension, $allowedExtensions)) {
	$errorMessage = "Invalid file type!";
}

// validate upload size
if (empty($errorMessage) && $_FILES["imageName"]["size"] > MAXIMUM_UPLOAD_BYTES) {
	$errorMessage = "File size exceeds upload maximum of " . MAXIMUM_UPLOAD_BYTES . " bytes!";
}

// validate upload error codes
if (empty($errorMessage) && $_FILES["imageName"]["error"] > 0) {
	$errorMessage = "Upload Error Code: " . $_FILES["imageName"]["error"];
}

// validate file already exists
if (empty($errorMessage) && file_exists(UPLOADS_PATH . '/' . $_FILES['imageName']['name'])) {
	$errorMessage = "File already exists in uploads directory!";
}

// attempt file move if no errors at this point
if (empty($errorMessage)) {
	if (FALSE === move_uploaded_file($_FILES['imageName']['tmp_name'], 'uploads/' . $_FILES['imageName']['name'])) {
		$errorMessage = "Failed to move temporary file! Check directory permissions.";
	}
	else {
		// build image URL and ensure a scheme or // is provided
		$imageURL = SITE_URL . '/uploads/' . $_FILES['imageName']['name'];
		if (!preg_match('#^http[s]?:|^//#', $imageURL)) {
			// no schema, add default schema
			$imageURL = '//' . $imageURL;
		}
		
		// return URL to the uploaded image
		echo '<div id="image">' . $imageURL . '</div>';
	}
}

// return any active error message
if (!empty($errorMessage)) {
	echo '<div id="error">' . $errorMessage . '</div>';
}

