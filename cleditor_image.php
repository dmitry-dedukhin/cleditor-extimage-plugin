<?php
// include existing application configuration file
//include 'config.php';


// WARNING: This script is accessible by anyone. Protect the script by placing it
// in a protected directory with limited access or add your own custom administrator 
// authorization code to restrict access to the functions in this script.
 

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



// file upload if imageName file is set
if (isset($_FILES['imageName'])) {
	$allowedTypes = array("image/gif", "image/jpeg", "image/jpg", "image/pjpeg", "image/x-png", "image/png");

	$extension = strtolower(pathinfo($_FILES["imageName"]["name"], PATHINFO_EXTENSION));

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
		$errorMessage = "File already exists in uploads directory! Using the existing file.";
		
		// use existing image file
		$imageURL = makeImageURL($_FILES['imageName']['name']);//SITE_URL . '/uploads/' . $_FILES['imageName']['name'];
	}

	// attempt file move if no errors at this point
	if (empty($errorMessage)) {
		if (FALSE === move_uploaded_file($_FILES['imageName']['tmp_name'], 'uploads/' . $_FILES['imageName']['name'])) {
			$errorMessage = "Failed to move temporary file! Check directory permissions.";
		}
		else {
			$imageURL = makeImageURL($_FILES['imageName']['name']);// SITE_URL . '/uploads/' . $_FILES['imageName']['name'];
		}
	}

	// return image URL if set
	if (!empty($imageURL)) {
		/*
		// make sure image URL has some type of schema
		if (!preg_match('#^http[s]?:|^//#', $imageURL)) {
			// no schema, add default schema
			$imageURL = '//' . $imageURL;
		}
*/
		echo '<div id="image">' . $imageURL . '</div>';
	}

	// return any active error message
	if (!empty($errorMessage)) {
		echo '<div id="error">' . $errorMessage . '</div>';
	}
}


// get image file list if get is set
if (isset($_GET['list'])) {
	$list = array();
	
	// get directory listing of uploads
	$uploadsDir = dir(UPLOADS_PATH);
	
	while ($file = $uploadsDir->read()) {
		if (in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), $allowedExtensions)) {
			$list[] = array('filename' => $file, 'url' => makeImageURL($file));
		}
	}
	
	usort($list, 'compareFilenames');
	
	$json['list'] = $list;
	
	// make sure json is not cached
	header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
	header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
	
	echo json_encode($json);
	exit;
}


function makeImageURL($filename) {
	$imageURL = SITE_URL . '/uploads/' . $filename;
	
	// make sure image URL has some type of schema
	if (!preg_match('#^http[s]?:|^//#', $imageURL)) {
		// no schema, add default schema
		$imageURL = '//' . $imageURL;
	}
	
	return $imageURL;
}


function compareFilenames($a, $b) {
	if ($a['filename'] == $b['filename']) return 0;

	return ($a['filename'] < $b['filename']) ? -1 : 1;
}