'use strict';

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
 
  it('should render the html', function() {
    expect(element.html()).toContain('<form class="ng-pristine ng-valid"><span class="fileUpload btn btn-default"><span class="glyphicon glyphicon-upload"></span> Upload video<input id="aw-fileupload" type="file" data-url="https://upload.wistia.com/" name="files[]" multiple=""></span></form><p id="aw-fileUploadError" class="text-danger hide"></p><br><div id="aw-progress" class="list-group-item hide"><div class="progress progress-striped active"><div class="bar progress-bar-info" style="width: 0%;"></div></div></div><br><div id="aw-wistia-embedded-video"></div>');
  });

  it('should expose awpassword bound on my binding', function() {
	  
    expect(controller.awpassword).toBeDefined();
  	expect(controller.awpassword).toBe(AW_MOCK_PASSWORD);
  });

  describe('Controller: angularwistia', function () {
	  it('should expose uploadSubmissionComplete to be defined', function() {
  		expect(controller.uploadSubmissionComplete).toBeDefined();
  		expect(typeof controller.uploadSubmissionComplete).toBe('function');
	  });

	  it('should expose failedSubmissionUpload to be defined', function() {
  		expect(controller.failedSubmissionUpload).toBeDefined();
  		expect(typeof controller.failedSubmissionUpload).toBe('function');
	  });

	  it('should expose updateProgressBar to be defined', function() {
  		expect(controller.updateProgressBar).toBeDefined();
  		expect(typeof controller.updateProgressBar).toBe('function');
	  });

    describe('Function: addToRequestSubmission', function () {
      it('should expose addToRequestSubmission to be defined', function() {
        expect(controller.addToRequestSubmission).toBeDefined();
        expect(typeof controller.addToRequestSubmission).toBe('function');
      });

      it('Unsucessful in adding to request due to default being prevented', function(){
        var mockE = {
          isDefaultPrevented : function() {}
        };

        spyOn(mockE, 'isDefaultPrevented').and.returnValue(true);;

        var result = controller.addToRequestSubmission(mockE, {});
        expect(result).toBe(false);
      });

      it('Successful in adding to request', function(){
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
  });



 
});




