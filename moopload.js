/**
 Author: davidhavl
 name: [Moopload, Request.File]
 description: Ajax file upload with MooTools 1.4.*.
 license: MIT-style license
 requires: [Request]
 provides: [Moopload, Request.File]
 credits: Based off of File.Upload by Matthew Loberg and MooTools-Form-Upload (https://github.com/arian/mootools-form-upload/) by Arian Stolwijk
 */

Moopload = new Class({

    Implements: [Options, Events],
    
    Extends: Request,

    options: {
        emulation: false,
        urlEncoded: false,
        url: '/', // url to send the files and data
        data: null, // data to send together with files (will be appended to url as query)
        files: null// file input field ids to get value from and send
    },


    initialize: function(options){
        var self = this;
        this.xhr = new Browser.Request();
        this.formData = new FormData();
        this.setOptions(options);
        this.headers = this.options.headers;
        if (typeof this.options.url != 'undefined') {
            this.options.originalUrl = this.options.url;
        }
        // check if it has data in options, then add it
        if(this.options.data) {
            this.addData(this.options.data);
        }
        // check if files (input fields) are specified in options, then add it.
        if(this.options.files) {
            this.addMultipleFiles(this.options.files);
        }
    },

    onComplete: function(){
        self.fireEvent('complete', arguments);
        this.reset();
    },

    /**
     * Add key/value pair of textual data to send together with files.
     * @param data array
     */
    addData: function(data){
        var self = this;
        if(this.options.url.indexOf('?') < 0) this.options.url += '?';
        Object.each(data, function(value, key){
            if(self.options.url.charAt(self.options.url.length - 1) != '?') self.options.url += '&';
            self.options.url += encodeURIComponent(key) + '=' + encodeURIComponent(value);
        });
    },
    
    /**
     * Clear extra textual data send as part of the url. Basically resets the url back to the original/initial value
     */
    clearData: function(){
        if(typeof this.options.originalUrl != 'undefined') {
            this.options.url = this.options.originalUrl;
        }
    },
    /**
     * add multiple file input fields
     * Please note, inputs needs to have a values (file selected) before adding via this method
     * @param inputElements array of file input ids
     */
    addMultipleFiles: function(inputElements){
        var self = this;
        inputElements.each(function(el){
            self.addFile(el);
        });
    },

    /**
     * add file input field
     * Please note, input field needs to have a value (file selected) before adding via this method
     * @param inputElement file input field ids
     */
    addFile: function(inputElement){
        var inputElementObject = document.id(inputElement),
            name = inputElementObject.get('name'),
            file = inputElementObject.files[0];
        this.formData.append(name, file);
    },


    /*
     * Reset the file data and make ready for new upload
     */
    reset: function(){
        this.formData = new FormData();
    },


    /**
     * Send file/s (and data).
     */
    send: function(options){
        var url = options.url || this.options.url;

        this.options.isSuccess = this.options.isSuccess || this.isSuccess;
        this.running = true;

        var xhr = this.xhr;
        xhr.open('POST', url, true);
        xhr.onreadystatechange = this.onStateChange.bind(this);

        Object.each(this.headers, function(value, key){
            try{
                xhr.setRequestHeader(key, value);
            }catch(e){
                this.fireEvent('exception', [key, value]);
            }
        }, this);

        this.fireEvent('request');
        xhr.send(this.formData);

        if(!this.options.async) this.onStateChange();
        if(this.options.timeout) this.timer = this.timeout.delay(this.options.timeout, this);
        return this;
    }

});
