'use strict';

(function (angular,buildfire) {
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
            if(result.data && result.id) {
              WidgetHome.data = result.data;
              if (!WidgetHome.data.content)
                WidgetHome.data.content = {};
              if (WidgetHome.data.content.mode && WidgetHome.data.content.url && WidgetHome.data.content.mode == 'preview')
                WidgetHome.data.content.url = WidgetHome.data.content.url.replace('/edit', '/preview');
              else if ((WidgetHome.data.content.mode && WidgetHome.data.content.url && WidgetHome.data.content.mode == 'editable'))
                WidgetHome.data.content.url = WidgetHome.data.content.url.replace('/preview', '/edit');
              console.log(">>>>>", WidgetHome.data);
            }
            else
            {
              WidgetHome.data = {
                content: {}
              };
              var dummyData = {url: "https://docs.google.com/presentation/d/1GajPA3eOHYT39vkDj_NX8v0FjiumnBgGtOyIHROyhd8/preview#slide=id.gc6fa3c898_0_0"};
              WidgetHome.data.content.url = dummyData.url;
            }
          };
          WidgetHome.error = function (err) {
            if (err && err.code !== STATUS_CODE.NOT_FOUND) {
              console.error('Error while getting data', err);
            }
          };
          DataStore.get(TAG_NAMES.GOOGLE_APPS_PRESENTATION_INFO).then(WidgetHome.success, WidgetHome.error);
        };



        //Refresh web page on pulling the tile bar

        buildfire.datastore.onRefresh(function () {
          var iFrame = document.getElementById("slideFrame"),
            url = iFrame.src,
            hashIndex = url.indexOf("#");

          if(hashIndex !== -1) {
            url = url.substr(0, hashIndex) + "?v=test" + url.substr(hashIndex);
          }
          iFrame.src = url + "";
        });

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

})(window.angular, window.buildfire);
