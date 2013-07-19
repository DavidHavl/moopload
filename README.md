moopload
========

Mootools ajax file upload script

Script that enables file uploading via ajax (on modern browsers).
Using Mootools 1.4.*




Browser support: all browsers that support js FormData object.
Most of the browsers nowdays do, except for infamouse IE9 or lower.



This class extends mootools request class, so most of the methods and events such as onRequest(), onComplete, onProgress,... are available.


USAGE:
------



HTML:
-----

    <div>
    
        <a href="javascript:void(0);" id="moopload_open_browse_link" >Upload file</a>
    
        <input type="file" name="moopload_input" id="moopload_input" style="display: none;" />
        
    </div>


The link above can be removed if you want to see/use file input directly


JS:
---

    <script type="text/javascript" src="moopload.js"></script>

    <script type="text/javascript">
        window.addEvent('domready', function() {
            // create mooploader object
            var mooploadHandler = new Moopload({
                url: 'ajax-file-upload.php',
                onRequest: function(){
                    console.log('start');
                },
                onComplete: function(response){
                    console.log(response);
                    console.log('completed');
                },
                onProgress: function(e) {
                    if (e.lengthComputable) {
                         var percentComplete = e.loaded / e.total;
                         console.log('percent completed: ' + percentComplete.toString());
                     } else {
                        // Unable to compute progress information since the total size is unknown
                     }
                }
            });
    
            // set link that will open file browser. (this can be removed if you want to see the file input)
            $('moopload_open_browse_link').addEvent('click', function(e){
                $('moopload_input').click();
            });
    
            // set onchange event to update moopload object and upload the file.
            $('moopload_input').addEvent('change', function(e){
                mooploadHandler.addFile($(e.target).get('id'));
                mooploadHandler.send();
            });
        });
    </script>

