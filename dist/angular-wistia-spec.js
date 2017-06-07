'use strict';

describe('Component: angularwistia', function () {
  beforeEach(module('AngularWistia'));
 
  var element;
  var scope;
  var controller; 
  var fileuploadSpy = jasmine.createSpy('fileupload');
  var AW_MOCK_PASSWORD = "SuperSecretWistiaPasswordYouWillNeverGetIt";

  // Set up before each unit test
  beforeEach(inject(function($rootScope, $compile){
    scope = $rootScope.$new();
    
    spyOn(window, '$').and.returnValue({
      fileupload: fileuploadSpy
    });
    element = angular.element('<angularwistia awpassword="awPassword"></angularwistia>');
    element = $compile(element)(scope);
    controller = element.controller('angularwistia');
    scope.awPassword = AW_MOCK_PASSWORD;
    scope.$apply();
  }));
  
  it('should render the html', function() {
    expect(element.html()).toContain('<form class="ng-pristine ng-valid"><span class="fileUpload btn btn-default"><span class="glyphicon glyphicon-upload"></span> Upload video<input id="aw-fileupload" type="file" data-url="https://upload.wistia.com/" name="files[]" multiple=""></span></form><p id="aw-fileUploadError" class="text-danger hide"></p><br><div id="aw-progress" class="list-group-item hide"><div class="progress progress-striped active"><div class="bar progress-bar-info" style="width: 0%;"></div></div></div><br><div id="aw-wistia-embedded-video"></div>');
  });

  it('should expose awpassword bound on my binding', function() {
    expect(controller.awpassword).toBeDefined();
    expect(controller.awpassword).toBe(AW_MOCK_PASSWORD);
  });
  
  it('should of called fileupload during initialization', function() {
    expect(fileuploadSpy).toHaveBeenCalled();
  });

});

describe('Component: angularwistia', function () {
  beforeEach(module('AngularWistia'));
 
  var element;
  var scope;
  var controller; 
  var AW_MOCK_PASSWORD = "SuperSecretWistiaPasswordYouWillNeverGetIt";

  // Set up before each unit test
  beforeEach(inject(function($rootScope, $compile){
    scope = $rootScope.$new();
    element = angular.element('<angularwistia awpassword="awPassword"></angularwistia>');
    element = $compile(element)(scope);
    controller = element.controller('angularwistia');
    scope.awPassword = AW_MOCK_PASSWORD;
    scope.$apply();
  }));

  describe('Controller: angularwistia', function () {
	  describe('Function: addToRequestSubmission', function () {
      it('should expose addToRequestSubmission to be defined', function() {
        expect(controller.addToRequestSubmission).toBeDefined();
        expect(typeof controller.addToRequestSubmission).toBe('function');
      });

      it('should be unsucessful in adding to request due to default being prevented', function(){
        var mockE = {
          isDefaultPrevented : function() {}
        };

        spyOn(mockE, 'isDefaultPrevented').and.returnValue(true);

        var result = controller.addToRequestSubmission(mockE, {});
        expect(result).toBe(false);
      });

      it('should be successful in adding to request', function(){
        var mockE = {
          isDefaultPrevented : function() {}
        };

        var mockData = {
          autoUpload: true,
          files: [
            {title: "first"}
          ],
          process: function(){
            return {
              done: function(callback){ callback(); }
            }
          },
          submit: function() {}
        };

        spyOn(mockE, 'isDefaultPrevented').and.returnValue(false);
        spyOn(mockData, 'process').and.returnValue({
          done: function(callback){ callback(); }
        });
        spyOn(mockData, 'submit');

        var result = controller.addToRequestSubmission(mockE, mockData);

        expect(result).not.toBe(false);
        expect(mockData.process).toHaveBeenCalled();
        expect(mockData.submit).toHaveBeenCalled();
      });
    });

    describe('Function: uploadSubmissionComplete', function () {
      it('should expose uploadSubmissionComplete to be defined', function() {
        expect(controller.uploadSubmissionComplete).toBeDefined();
        expect(typeof controller.uploadSubmissionComplete).toBe('function');
      });

      it('should be successful to inject the embedded video into the DOM', function(){
        var mockE = {
          isDefaultPrevented : function() {}
        };

        var mockData = {
          result: {
            hashed_id: "THIS IS MY HASHED ID"
          }
        };

        var addClassSpy = jasmine.createSpy('addClass');
        var appendSpy = jasmine.createSpy('append');

        spyOn(window, '$').and.returnValue({
          'addClass': addClassSpy,
          'append': appendSpy
        });

        controller.uploadSubmissionComplete(mockE, mockData);
        
        expect(addClassSpy).toHaveBeenCalled();
        expect(appendSpy).toHaveBeenCalled();
        expect(appendSpy).toHaveBeenCalledWith('<script src="//fast.wistia.com/embed/medias/' + mockData.result.hashed_id + '.jsonp" async></script><script src="//fast.wistia.com/assets/external/E-v1.js" async></script><div class="wistia_embed wistia_async_THIS IS MY HASHED ID" style="height:349px;width:620px">&nbsp;</div>');
      });
    });

    describe('Function: failedSubmissionUpload', function () {
      it('should expose failedSubmissionUpload to be defined', function() {
        expect(controller.failedSubmissionUpload).toBeDefined();
        expect(typeof controller.failedSubmissionUpload).toBe('function');
      });

      it('should be successful in gracefully handling error state to user', function(){
        var addClassSpy = jasmine.createSpy('addClass');
        var removeClassSpy = jasmine.createSpy('removeClass');
        var textSpy = jasmine.createSpy('removeClass');

        spyOn(window, '$').and.returnValue({
          'addClass': addClassSpy,
          'removeClass': removeClassSpy,
          'text': textSpy
        });

        controller.failedSubmissionUpload();
        
        expect(addClassSpy).toHaveBeenCalled();
        expect(removeClassSpy).toHaveBeenCalled();
        expect(textSpy).toHaveBeenCalled();
        expect(addClassSpy).toHaveBeenCalledWith('hide');
        expect(removeClassSpy).toHaveBeenCalledWith('hide');
        expect(textSpy).toHaveBeenCalledWith('Something went wrong when trying to upload your video.');
      });
    });

    describe('Function: updateProgressBar', function () {
      it('should expose updateProgressBar to be defined', function() {
        expect(controller.updateProgressBar).toBeDefined();
        expect(typeof controller.updateProgressBar).toBe('function');
      });

      it('should be successful in setting the percentage on the progress bar to 20%', function(){
        var mockE = {
          isDefaultPrevented : function() {}
        };

        var mockData = {
          loaded: 200,
          total:1000
        };

        mockData.percent = (mockData.loaded / mockData.total) * 100;
        var widthSpy = jasmine.createSpy('width');

        spyOn(window, '$').and.returnValue({
          'find': function(){
            return {
              width: widthSpy
            }
          }
        });

        controller.updateProgressBar(mockE, mockData);
        
        expect(widthSpy).toHaveBeenCalled();
        expect(widthSpy).toHaveBeenCalledWith(mockData.percent + "%");
      });

      it('should be successful in setting the percentage on the progress bar to 50%', function(){
        var mockE = {
          isDefaultPrevented : function() {}
        };

        var mockData = {
          loaded: 500,
          total:1000
        };

        mockData.percent = (mockData.loaded / mockData.total) * 100;
        var widthSpy = jasmine.createSpy('width');

        spyOn(window, '$').and.returnValue({
          'find': function(){
            return {
              width: widthSpy
            }
          }
        });

        controller.updateProgressBar(mockE, mockData);
        
        expect(widthSpy).toHaveBeenCalled();
        expect(widthSpy).toHaveBeenCalledWith(mockData.percent + "%");
      });

      it('should be successful in setting the percentage on the progress bar to 100%', function(){
        var mockE = {
          isDefaultPrevented : function() {}
        };

        var mockData = {
          loaded: 1000,
          total:1000
        };

        mockData.percent = (mockData.loaded / mockData.total) * 100;
        var widthSpy = jasmine.createSpy('width');

        spyOn(window, '$').and.returnValue({
          'find': function(){
            return {
              width: widthSpy
            }
          }
        });

        controller.updateProgressBar(mockE, mockData);
        
        expect(widthSpy).toHaveBeenCalled();
        expect(widthSpy).toHaveBeenCalledWith(mockData.percent + "%");
      });
    });
  });
});







