/**
 @preserve CLEditor Image Upload Plugin v1.0.0
 http://premiumsoftware.net/cleditor
 requires CLEditor v1.3.0 or later
 
 Copyright 2011, Dmitry Dedukhin
 Plugin let you either to upload image or to specify image url.
*/

(function($) {
	var hidden_frame_name = '__upload_iframe';
	
	var popupHTML = 
			'<iframe style="width:0;height:0;border:0;" name="' + hidden_frame_name + '" />' +
			'<table cellpadding="0" cellspacing="0">' +
			'<tr><td>Choose a File:</td></tr>' +
			'<tr><td> ' +
			'<form method="post" enctype="multipart/form-data" action="" target="' + hidden_frame_name + '">' +
			'<input id="imageName" name="imageName" type="file"></form> </td></tr>' +
			'<tr><td>Or enter URL:</td></tr>' +
			'<tr><td><input type="text" size="40" value=""></td></tr>' +
			'<tr><td><input type="button" value="Submit"></td></tr>' +
			'</table>' +
			'<div id="ajaxImageContainer"></div>';
	
	// Define the image button by replacing the standard one
	$.cleditor.buttons.image = {
		name: 'image',
		title: 'Insert/Upload Image',
		command: 'insertimage',
		popupName: 'image',
		popupClass: 'cleditorPrompt',
		stripIndex: $.cleditor.buttons.image.stripIndex,
		popupContent: popupHTML,
		buttonClick: imageButtonClick,
		uploadUrl: '/cleditor_image.php' // default url
	};

	function closePopup(editor) {
		editor.hidePopups();
		editor.focus();
	}

	function imageButtonClick(e, data) {
		var editor = data.editor,
			$text = $(data.popup).find(':text'),
			url = $.trim($text.val()),
			$iframe = $(data.popup).find('iframe'),
			$file = $(data.popup).find(':file'),
			$ajaxFiles = $(data.popup).find('#ajaxImageContainer');

		// clear previously selected file and url
		$file.val('');
		$text.val('').focus();

		$(data.popup)
			.find(":button")
			.unbind("click")
			.bind("click", function(e) {
				if($file.val()) { // proceed if any file was selected
					$iframe.bind('load', function() {
						var file_url, error_message;
						
						// check for error message
						try {
							error_message = $iframe.get(0).contentWindow.document.getElementById('error').innerHTML;
						} catch(e) {};
						if(error_message) {
							alert(error_message);
						}
						
						// check for image URL
						try {
							file_url = $iframe.get(0).contentWindow.document.getElementById('image').innerHTML;
						} catch(e) {};
						if(file_url) {
							editor.execCommand(data.command, file_url, null, data.button);
						} else {
							// show default error if no error message was provided
							if (!error_message) alert('An error occured during upload!');
						}
						
						$iframe.unbind('load');
						closePopup(editor);
					});
					$(data.popup).find('form').attr('action', $.cleditor.buttons.image.uploadUrl).submit();
				} else if (url != '') {
					editor.execCommand(data.command, url, null, data.button);
					closePopup(editor);
				}
			});
	}
})(jQuery);
