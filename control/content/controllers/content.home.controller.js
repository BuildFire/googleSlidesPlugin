'use strict';

(function (angular, window) {
  angular
    .module('googleAppsPresentationPluginContent')
    .controller('ContentHomeCtrl', ['TAG_NAMES', 'DataStore', '$timeout', 'Utils',
      function (TAG_NAMES, DataStore, $timeout, Utils) {

        var ContentHome = this;
        ContentHome.MODE_TYPE = {
          PREVIEW: 'preview',
          EDITABLE: 'editable'
        };
        ContentHome.mode = ContentHome.MODE_TYPE.PREVIEW;
        ContentHome.data = {
          content: {
            url: null,
            mode: ""
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
              if (ContentHome.data.content.mode)
                ContentHome.mode = ContentHome.data.content.mode;
            }
          };
          ContentHome.error = function (err) {
            console.error('Error while getting data', err);

          };
          DataStore.get(TAG_NAMES.GOOGLE_APPS_PRESENTATION_INFO).then(ContentHome.success, ContentHome.error);
        };
        ContentHome.init();
        ContentHome.validateUrl = function () {
          if (Utils.validateUrl(ContentHome.pptUrl)) {
            ContentHome.data.content.url = ContentHome.pptUrl;
            ContentHome.data.content.mode = ContentHome.mode;
            ContentHome.isUrlValidated = true;
            ContentHome.saveData(JSON.parse(angular.toJson(ContentHome.data)), TAG_NAMES.GOOGLE_APPS_PRESENTATION_INFO);
          } else {
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
        ContentHome.gotToSite = function () {
          window.open('https://accounts.google.com', '_blank');
        };
        ContentHome.changeMode = function (mode) {
          ContentHome.data.content.mode = mode;
          ContentHome.saveData(ContentHome.data, TAG_NAMES.GOOGLE_APPS_PRESENTATION_INFO);
        };
      }]);
})(window.angular, window);