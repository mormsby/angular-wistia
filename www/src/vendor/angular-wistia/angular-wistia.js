/*
 * Angular Wistia
 * @description     An Angular 1.5 component that wraps the Wistia uploader using the Blueimp File Upload plugin 
 * @author          Matthew Ormsby
 * @params          awpassword - the API password for your Wistia account 
 * @example         <angularwistia awpassword="awPassword"></angularwistia>
 * @dependencies    Blueimp File Upload, Bootstrap - please include these
 *  
 *
 * angular-wisita.css
 *  .fileUpload {
 *       position: relative;
 *       overflow: hidden;
 *   }
 *   .fileUpload input {
 *       position: absolute;
 *       top: 0;
 *       right: 0;
 *       margin: 0;
 *       padding: 0;
 *       cursor: pointer;
 *       opacity: 0;
 *   }
 *   .progress {
 *       margin-bottom: 0;
 *   }
 *   #action-buttons, #file-uploader{
 *       padding-top: 2%;
 *   }
 *   .bar {
 *       height: 30px;
 *   }
 */
angular.module('AngularWistia',[]).component('angularwistia', {
  bindings: {
    awpassword: '=' // the API password for your Wistia account 
  },
  controller: function () {
    var WISTIA_API_PASSWORD = this.awpassword; // set the Wistia API password as a global variable 
    var formData = new FormData(); // initialize a FormData to be used to successfully build our form and send it to Wistia

    // builds the submission request for Wistia
    this.addToRequestSubmission = function(e, data) {
        if (e.isDefaultPrevented()) {
            return false;
        }

        if (data.autoUpload || (data.autoUpload !== false && $(this).fileupload('option', 'autoUpload'))) {
            var file = data.files[0]; // grab the file that has been selected to be uploaded
            formData.append('file', file);
            formData.append('api_password', WISTIA_API_PASSWORD);
            $("#aw-progress").removeClass("hide"); // show the progress bar

            data.process().done(function () {
                data.submit(); // submit the data for processing
            });
        }
    };

    // on successful upload shows an embedded Wistia video player with the video that was just uploaded
    this.uploadSubmissionComplete = function (e, data) {
        $("#aw-fileUploadError").addClass("hide"); // ensure that if an error was thrown before it is removed

        // build the embedded video
        var embedVideo = '<script src="//fast.wistia.com/embed/medias/' + data.result.hashed_id +'.jsonp" async></script>' +
                         '<script src="//fast.wistia.com/assets/external/E-v1.js" async></script>' +
                         '<div class="wistia_embed wistia_async_' + data.result.hashed_id +'" style="height:349px;width:620px">&nbsp;</div>';

        $('#aw-wistia-embedded-video').append(embedVideo); // inject the video into the DOM
    };

    // error handling if the submission failed
    this.failedSubmissionUpload = function() {
        $("#aw-progress").addClass("hide"); // hide the progress bar
        
        // prompt the user with an error
        $("#aw-fileUploadError").removeClass("hide");
        $("#aw-fileUploadError").text("Something went wrong when trying to upload your video.");
    };

    // update the progress bar as it is being uploaded to Wistia
    this.updateProgressBar = function (e, data) {
        var percent = (data.loaded / data.total) * 100;
        $("#aw-progress").find(".bar").width(percent + "%");
    };

    // using Blueimp File Upload plugin, we attach the fileupload listener to our aw-fileupload
    $('#aw-fileupload').fileupload({
        data: formData,
        headers: {
            'Accept': 'application/json',
        },

        add: this.addToRequestSubmission,
        done: this.uploadSubmissionComplete,
        error: this.failedSubmissionUpload,
        progressall: this.updateProgressBar
    });
  },
  template: // HTML to be injected into the DOM 
    '<form>' +
        '<span class="fileUpload btn btn-default">' +
            '<span class="glyphicon glyphicon-upload"></span> Upload video' + 
            '<input id="aw-fileupload" type="file" data-url="https://upload.wistia.com/" name="files[]" multiple>' +
        '</span>' +
    '</form>' +
    '<p id="aw-fileUploadError" class="text-danger hide"></p>' +
    '<br/><div id="aw-progress" class="list-group-item hide">' +
        '<div class="progress progress-striped active">' +
            '<div class="bar progress-bar-info" style="width: 0%;"></div>' +
        '</div>' +
    '</div>' +
    '<br/><div id="aw-wistia-embedded-video"></div>'
});

