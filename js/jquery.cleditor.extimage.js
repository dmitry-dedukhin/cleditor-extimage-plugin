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
			'<table cellpadding="0" cellspacing="0" id="image_upload_form">' +
			'<tr><td>Choose a File:</td></tr>' +
			'<tr><td> ' +
			'<form method="post" enctype="multipart/form-data" action="" target="' + hidden_frame_name + '">' +
			'<input id="imageName" name="imageName" type="file"></form> </td></tr>' +
			'<tr><td>Or enter URL:</td></tr>' +
			'<tr><td><input type="text" size="40" value=""></td></tr>' +
			'<tr><td><input type="button" value="Submit"></td></tr>' +
			'</table>' +
			'<div id="ajaxImageContainer" style="overflow: auto; border: 1px solid black; background-color: white; margin-top: 10px;"></div>';
	
	var imageHTML =
			'<div class="select_container" style="border: 1px solid black; margin:2px; float: left; text-align: center; position: relative; width: 62px; height: 84px;">' +
			'<div style="float: left; width: 60px; height: 60px;">' +
			'<img src="[url]" class="select_image" style="width: auto; height: auto; max-width: 100%; max-height: 100%;">' +
			'</div>' +
			'<div style="position: absolute; width: 100%; bottom: 2px; font-size: 12px;">' +
			'<span style="background-color: green; padding: 2px; color: white;">' +
			'<a class="new use" style="color: white;">Use</a>' +
			'</span>' +
			' or ' +
			'<span style="background-color: red; padding: 2px; color: white;">X</span>' +
			'</div>' +
			'</div>';
	
	var moreHTML =
			'<br>' +
			'<span class="more_span" style="background-color: blue; padding: 2px; margin: 2px; color: white; float: left; clear: left;">' +
			'<a style="color: white;">MORE</a>' +
			'</span>';
	
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

	function ajaxLoadImages($ajaxContainer, offset) {
		if (typeof(offset) == 'undefined') offset = 0;
		
		// get image list
		$.ajax({
			url: $.cleditor.buttons.image.uploadUrl,
			data: {
				list: 1,
				offset: offset
			},
			dataType: "json",
			success: function (data, status) {
				if (data.list) {
					$ajaxContainer.find('.more_span').remove();
					
					for (var listIndex = 0; listIndex < data.list.length; listIndex++) {
						var newHTML = imageHTML;
						newHTML = newHTML.replace(/\[url\]/, data.list[listIndex].url);
						$ajaxContainer.append(newHTML);
					}
					
					// add click event to new use buttons
					$ajaxContainer.find('a.new.use')
						.removeClass('new')
						.click(function() {
							var imageURL = $(this).parents('.select_container:first').find('.select_image').attr('src');
							$ajaxContainer.parents('.cleditorPopup:first').find(':text').val(imageURL);
						})
							
					if (data.more) {
						$ajaxContainer.append(moreHTML);
						$ajaxContainer.find('.more_span > a').click(function() {
							// get image list
							ajaxLoadImages($ajaxContainer, data.more);
					//		alert($(this).parents('.more_span:first').html())
					//		$(this).parents('.more_span:first').remove();
						});
					}
					//}
				}
			},
			error: function (data, status, e) {

			}
		});
		
	}
	
	function imageButtonClick(e, data) {
		var editor = data.editor,
			$text = $(data.popup).find(':text'),
			$iframe = $(data.popup).find('iframe'),
			$file = $(data.popup).find(':file'),
			$ajaxFiles = $(data.popup).find('#ajaxImageContainer');

		// clear previously selected file and url
		$file.val('');
		$text.val('').focus();
		$ajaxFiles.html('');

		// get image list
		ajaxLoadImages($ajaxFiles, 0);

		$(data.popup)
			.find(":button")
			.unbind("click")
			.bind("click", function(e) {
				url = $.trim($text.val());
		
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
