'use strict';

(function (angular) {
  angular
    .module('googleAppsPresentationWidget')
    .controller('WidgetHomeCtrl', ['$scope', 'Buildfire', 'DataStore', 'TAG_NAMES', '$rootScope', 'STATUS_CODE',
      function ($scope, Buildfire, DataStore, TAG_NAMES, $rootScope, STATUS_CODE) {
        var WidgetHome = this;

        /*
         * Fetch user's data from datastore
         */
        WidgetHome.init = function () {
          WidgetHome.success = function (result) {
            WidgetHome.data = result.data;
            if (!WidgetHome.data.content)
              WidgetHome.data.content = {};
            if (WidgetHome.data.content.mode && WidgetHome.data.content.url && WidgetHome.data.content.mode == 'preview')
              WidgetHome.data.content.url = WidgetHome.data.content.url.replace('/edit', '/preview');
            else if ((WidgetHome.data.content.mode && WidgetHome.data.content.url && WidgetHome.data.content.mode == 'editable'))
              WidgetHome.data.content.url = WidgetHome.data.content.url.replace('/preview', '/edit');
            console.log(">>>>>", WidgetHome.data);
          };
          WidgetHome.error = function (err) {
            if (err && err.code !== STATUS_CODE.NOT_FOUND) {
              console.error('Error while getting data', err);
            }
          };
          DataStore.get(TAG_NAMES.GOOGLE_APPS_PRESENTATION_INFO).then(WidgetHome.success, WidgetHome.error);
        };

        WidgetHome.onUpdateCallback = function (event) {
          if (event && event.tag === TAG_NAMES.GOOGLE_APPS_PRESENTATION_INFO) {
            WidgetHome.data = event.data;
            if (WidgetHome.data && !WidgetHome.data.content)
              WidgetHome.data.content = {};
            if (WidgetHome.data.content.mode && WidgetHome.data.content.url && WidgetHome.data.content.mode == 'preview')
              WidgetHome.data.content.url = WidgetHome.data.content.url.replace('/edit', '/preview');
            else if ((WidgetHome.data.content.mode && WidgetHome.data.content.url && WidgetHome.data.content.mode == 'editable'))
              WidgetHome.data.content.url = WidgetHome.data.content.url.replace('/preview', '/edit');
          }
        };

        DataStore.onUpdate().then(null, null, WidgetHome.onUpdateCallback);

        WidgetHome.init();

      }])
    .filter('returnUrl', ['$sce', function ($sce) {
      return function (url) {
        return $sce.trustAsResourceUrl(url);
      }
    }]);

})(window.angular);
