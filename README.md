# cleditor-extimage

This CLEditor plugin will replace the standard image button popup with a new popup that
includes additional features for image file upload and image selection from the uploads 
directory.

The plugin includes a PHP script to process the image upload and selection features.

---------------------------------

# Requirements

The plugin requires the [CLEditor WYSIWYG HTML editor](http://premiumsoftware.net/CLEditor).

The server must be running PHP version 5.3+

**WARNING:** The cleditor_image.php script does not include any inherent administrator
authorization code. When implementing this plugin you should locate the script in a secured
directory or add some custom code to the PHP script to restrict access to authorized users.

---------------------------------


# Installation

Upload the contents of the cleditor-extimage-plugin project directory to your web server.

Make sure the uploads directory is writable.

---------------------------------


# Usage

Include the cleditor-extimage plugin after the cleditor package in your HTML, I.E.

```
<script src="/js/jquery.cleditor.min.js" type="text/javascript"></script>
<script src="/js/jquery.cleditor.extimage.js" type="text/javascript"></script>
```

The default uploadUrl setting assumes the cleditor_image.php processing script will
run from the root path of your web site. If your processing script is located in
a subdirectory then you may need to use a custom setting, I.E.

```
<script type="text/javascript">
$.cleditor.buttons.image.uploadUrl = 'http://mydomain.com/myblog/cleditor_image.php';
</script>
```
