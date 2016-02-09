'use strict';

(function (angular, window) {
  angular
    .module('googleAppsPresentationPluginContent')
    .controller('ContentHomeCtrl', ['TAG_NAMES', 'DataStore','$timeout','Utils',
        function (TAG_NAMES, DataStore,$timeout,Utils) {

            var ContentHome = this;
            ContentHome.data = {
                content: {
                    url: null
                }
            };
            ContentHome.isUrlValidated = null;
            ContentHome.pptUrl = null;
            /*Init method call, it will bring all the pre saved data*/
            ContentHome.init = function () {
                ContentHome.success = function (result) {
                    console.info('init success result:', result);
                    if (result) {
                        ContentHome.data = result.data;
                        if (!ContentHome.data.content)
                            ContentHome.data.content = {};
                        ContentHome.pptUrl = ContentHome.data.content.url;
                    }
                };
                ContentHome.error = function (err) {
                        console.error('Error while getting data', err);

                };
                DataStore.get(TAG_NAMES.GOOGLE_APPS_PRESENTATION_INFO).then(ContentHome.success, ContentHome.error);
            };
            ContentHome.init();


            ContentHome.validateUrl = function () {
                //  var result =
                if(Utils.validateUrl(ContentHome.pptUrl)){
                            ContentHome.isUrlValidated = true;
                            ContentHome.data.content.url = ContentHome.pptUrl;
                            ContentHome.saveData(JSON.parse(angular.toJson(ContentHome.data)), TAG_NAMES.GOOGLE_APPS_PRESENTATION_INFO);
                }else{
                    ContentHome.isUrlValidated = false;
                }

                $timeout(function () {
                    ContentHome.isUrlValidated = null;
                }, 3000);

            };

            ContentHome.saveData = function (newObj, tag) {
                if (typeof newObj === 'undefined') {
                    return;
                }
                ContentHome.success = function (result) {
                    console.info('Saved data result: ', result);
                    // updateMasterItem(newObj);
                };
                ContentHome.error = function (err) {
                    console.error('Error while saving data : ', err);
                };
                DataStore.save(newObj, tag).then(ContentHome.success, ContentHome.error);
            };

            /*
             * Method to clear JotForm feed url
             * */
            ContentHome.clearData = function () {
                if (!ContentHome.pptUrl) {
                    ContentHome.data.content.url = null;
                    ContentHome.saveData(ContentHome.data.content, TAG_NAMES.GOOGLE_APPS_PRESENTATION_INFO)
                }
            };


        }]);
})(window.angular, window);