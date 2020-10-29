'use strict';

(function (angular,buildfire) {
  angular
    .module('googleAppsPresentationWidget')
    .controller('WidgetHomeCtrl', ['$scope', 'Buildfire', 'DataStore', 'TAG_NAMES', '$rootScope', 'STATUS_CODE',
      function ($scope, Buildfire, DataStore, TAG_NAMES, $rootScope, STATUS_CODE) {
        var WidgetHome = this;
        var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        var aspect = window.screen.width / window.screen.height
        var iPhoneXandIphone11 = isIOS && aspect.toFixed(3) === "0.462";
        var oneTime=false;
        //var homeBar=Number(getComputedStyle(document.documentElement).getPropertyValue("--sab").split('px')[0]);
        //var isAndroid = /(android)/i.test(navigator.userAgent);
        //var frame,fullScreen,listeners=false,isInFullScreen=false;;
        //var innitOffsetTop=0,innitOffsetLeft=0,innitialLoad=false,isItFailed=false;
        /*
         * Fetch user's data from datastore
         */
        

        WidgetHome.init = function () {
          WidgetHome.success = function (result) {
            if(result.data && result.id) {
              WidgetHome.data = result.data;
              if (!WidgetHome.data.content)
                WidgetHome.data.content = {};
              if (WidgetHome.data.content.mode && WidgetHome.data.content.url && WidgetHome.data.content.mode == 'preview'){
                WidgetHome.data.content.url = WidgetHome.data.content.url.replace('/edit', '/preview');
              }
              else if ((WidgetHome.data.content.mode && WidgetHome.data.content.url && WidgetHome.data.content.mode == 'editable')){
                WidgetHome.data.content.url = WidgetHome.data.content.url.replace('/preview', '/edit');
              }
              console.log(">>>>>", WidgetHome.data);
              WidgetHome.initRotate();
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
            WidgetHome.initRotate();
          };
          WidgetHome.initRotate();
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

        window.rotateFromIndex = function () {
          WidgetHome.initRotate();
        }
        WidgetHome.initRotate = function () {
          if(!oneTime)buildfire.appearance.titlebar.hide();
          var iFrame = document.getElementById("slideFrame");
          if(iFrame && !oneTime)
          {
          oneTime=true;
          setTimeout(function(){
            iFrame.style.webkitTransform = 'rotate(90deg)'; 
            iFrame.style.mozTransform = 'rotate(90deg)'; 
            iFrame.style.msTransform = 'rotate(90deg)'; 
            iFrame.style.oTransform = 'rotate(90deg)'; 
            iFrame.style.transform = "rotate(90deg)";

            WidgetHome.setRotateSize();
            
            if(buildfire.isWeb())
              window.addEventListener("resize",function(){
                WidgetHome.setRotateSize();
              });
          }, 500); 
        }
        }

        WidgetHome.setRotateSize = function () {
          var iFrame = document.getElementById("slideFrame");
          var rotatedWidth = window.innerHeight-((iPhoneXandIphone11)?44:0),
          rotatedHeight = window.innerWidth;
          iFrame.style.width = (rotatedWidth+5)+"px";
          iFrame.style.maxWidth = (rotatedWidth+5)+"px";
          iFrame.style.height = rotatedHeight+"px";
          iFrame.style.position = "absolute";
          iFrame.style.left = (((rotatedHeight/2)-rotatedWidth/2)-2)+"px";
          iFrame.style.top = ((rotatedHeight/2)-rotatedWidth/2)*(-1)+((iPhoneXandIphone11)?44:0)+"px";
        };

      //  window.oniFrameLoad = function(){
         /* var previousOrientation=2;//2 portrait, 1 landscape
          window.addEventListener("deviceorientation", function(event){
            var xAxis = event.alpha;
            var yAxis = event.beta;
            var oTime;
            console.log(xAxis,yAxis);
            if(xAxis!=null&&yAxis!=null&&!disableAutoRotate)
            if (((yAxis <= 25) && (yAxis >= -25) && (xAxis >= -160)) || (yAxis < -25) && (xAxis >= -20)) {
        
                if (previousOrientation != 1){
                    previousOrientation = 1;
                    clearTimeout(oTime);
                    if(!isInFullScreen)
                      oTime = setTimeout(function(){ WidgetHome.rotate(); }, 200);
                }
        
            } else if ((yAxis > 25) && (xAxis >= -20)){
        
                if (previousOrientation != 2){
                    previousOrientation = 2;
                    clearTimeout(oTime);
                    if(isInFullScreen)
                      oTime = setTimeout(function(){WidgetHome.rotate();}, 200);
                }
            }
          }, true);*/
          /*

            frame= document.getElementById("slideFrame");
            frame.style.width =  window.innerWidth+"px";
            frame.style.maxWidth =  window.innerWidth+"px";
            frame.style.maxHeight =  window.innerHeight-((isIOS)?homeBar:0)+1+"px";
            frame.style.height =  window.innerHeight-((isIOS)?homeBar:0)+1+"px";
            innitOffsetTop=frame.offsetTop;
            innitOffsetLeft=frame.offsetLeft;
            fullScreen = document.getElementById("containerFS");
            fullScreen.style.paddingTop=((isIOS)?"1px":"");
            fullScreen.style.left = innitOffsetLeft+((isIOS)?305:270)+((isAndroid)?5:0)+"px";
            fullScreen.style.top = window.innerHeight-((isIOS)?homeBar+1:0)-27+"px";
            innitialLoad=true;
            if(!isItFailed)
              fullScreen.style.visibility="visible";
            var time;

            if(!listeners)
            window.addEventListener("resize",function(){
              if(buildfire.isWeb()){
                document.body.style.setProperty("background-color", "323232", "important");
                if(isInFullScreen){
                  fullScreen.style.visibility="hidden";
                  let rotatedWidth,rotatedHeight;
                  rotatedWidth = window.innerHeight;
                  rotatedHeight = window.innerWidth;
                  frame.style.width = (rotatedWidth+5)+"px";
                  frame.style.maxWidth = (rotatedWidth+5)+"px";
                  frame.style.height = rotatedHeight+"px";
                  
                  frame.style.left = (((rotatedHeight/2)-rotatedWidth/2)-2)+"px";
                  frame.style.top = ((rotatedHeight/2)-rotatedWidth/2)*(-1)+"px";

                  fullScreen.style.left = innitOffsetLeft-((isAndroid)?0:1)+((isIOS)?1:0)+"px";
                  fullScreen.style.top = innitOffsetTop+((isIOS)?305:268)+((isAndroid)?5:0)+"px";
                  clearTimeout(time);
                  time = setTimeout(function(){ fullScreen.style.visibility="visible"; }, 300);
                  
                }else{
                  fullScreen.style.visibility="hidden";
                  frame.style.width =  window.innerWidth+"px";
                  frame.style.maxWidth =  window.innerWidth+"px";
                  frame.style.maxHeight =  window.innerHeight-((isIOS)?homeBar:0)+1+"px";
                  frame.style.height =  window.innerHeight-((isIOS)?homeBar:0)+1+"px";
                  fullScreen.style.left = innitOffsetLeft+((isIOS)?305:270)+((isAndroid)?5:0)+"px";
                  fullScreen.style.top = window.innerHeight-((isIOS)?homeBar+1:0)-27+"px";  
                  clearTimeout(time);
                  time = setTimeout(function(){ fullScreen.style.visibility="visible"; }, 300);
                }
            }
            },true);

            if(!listeners)
            fullScreen.addEventListener('click', function(){
              WidgetHome.rotate();
            });
            listeners=true;
        }*/


       /* WidgetHome.hideShowRotation = function()
        {
          var xmlHttp = new XMLHttpRequest();
          var time;
          xmlHttp.onreadystatechange = function() { 
            if(xmlHttp.status==200&&WidgetHome.data.content.url.includes('/preview')){
              time = setTimeout(function(){ if(innitialLoad)document.getElementById("containerFS").style.visibility="visible"; }, 600);
              
            }else if(xmlHttp.status>=400||WidgetHome.data.content.url.includes('edit')){
              if(isInFullScreen){WidgetHome.rotate();isInFullScreen=false;}
              isItFailed=true;
              time = setTimeout(function(){ document.getElementById("containerFS").style.visibility="hidden"; }, 600);
            }
          }
          try{
            xmlHttp.open("GET", WidgetHome.data.content.url, true); // true for asynchronous 
            xmlHttp.send(null);
          }catch(err){
            if(isInFullScreen){WidgetHome.rotate();isInFullScreen=false;}
            isItFailed=true;
            document.getElementById("containerFS").style.visibility="hidden";
          }
        }*/

       /*var goBack = buildfire.navigation.onBackButtonClick ;
        buildfire.navigation.onBackButtonClick = function(){
          if(isInFullScreen)WidgetHome.rotate()
          else goBack();
        }*/
       /* WidgetHome.rotate = function(){
          var rotatedWidth;
          var rotatedHeight;
          fullScreen.style.visibility="hidden";
          document.body.style.setProperty("background-color", "black", "important");
            if(!isInFullScreen){
              buildfire.appearance.titlebar.hide();
              setTimeout(function(){
                fullScreen.style.paddingLeft="3px";
                fullScreen.style.paddingTop="";
                document.getElementById("fullScreen").classList.remove("fullScreen");
                document.getElementById("fullScreen").classList.add("exitFullScreen");
                rotatedWidth = window.innerHeight;
                rotatedHeight = window.innerWidth;
                frame.style.webkitTransform = 'rotate(90deg)'; 
                frame.style.mozTransform = 'rotate(90deg)'; 
                frame.style.msTransform = 'rotate(90deg)'; 
                frame.style.oTransform = 'rotate(90deg)'; 
                frame.style.transform = "rotate(90deg)";
                //fullScreen.style.visibility="hidden";
        
                frame.style.width = (rotatedWidth+5)+"px";
                frame.style.maxWidth = (rotatedWidth+5)+"px";
                frame.style.height = rotatedHeight+"px";
                frame.style.position = "absolute";
                frame.style.left = (((rotatedHeight/2)-rotatedWidth/2)-2)+"px";
                frame.style.top = ((rotatedHeight/2)-rotatedWidth/2)*(-1)+"px";
                
                fullScreen.style.left = innitOffsetLeft-((isAndroid)?0:1)+((isIOS)?1:0)+"px";
                fullScreen.style.top = innitOffsetTop+((isIOS)?305:268)+((isAndroid)?5:0)+"px";
                fullScreen.style.bottom = "";
                fullScreen.style.right = "";
                setTimeout(function(){fullScreen.style.visibility="visible"; }, 500);   
                isInFullScreen=true;
              }, 100);
            }else{
              buildfire.appearance.titlebar.show();
              setTimeout(function(){
                fullScreen.style.paddingLeft="";
                fullScreen.style.paddingTop=((isIOS)?"1px":"");
                document.getElementById("fullScreen").classList.remove("exitFullScreen");
                document.getElementById("fullScreen").classList.add("fullScreen");
                frame.style.webkitTransform = 'rotate(0deg)'; 
                frame.style.mozTransform = 'rotate(0deg)'; 
                frame.style.msTransform = 'rotate(0deg)'; 
                frame.style.oTransform = 'rotate(0deg)'; 
                frame.style.transform = "rotate(0deg)";
                fullScreen.style.visibility="hidden";
                fullScreen.style.left = innitOffsetLeft+((isIOS)?310:270)+((isAndroid)?5:0)+"px";
                fullScreen.style.top = window.innerHeight-((isIOS)?homeBar+1:0)-27+"px";
                fullScreen.style.bottom = "";
                fullScreen.style.right = "";
                frame.style.width =  window.innerWidth+"px";
                frame.style.maxWidth =  window.innerWidth+"px";
                frame.style.maxHeight =  window.innerHeight-((isIOS)?homeBar:0)+1+"px";
                frame.style.height =  window.innerHeight-((isIOS)?homeBar:0)+1+"px";
                frame.style.position = "relative";
                frame.style.left = "";
                frame.style.top = "";
                
                setTimeout(function(){fullScreen.style.visibility="visible"; }, 500);   
                isInFullScreen=false;
              }, 100);
            }
        }*/

        WidgetHome.onUpdateCallback = function (event) {
          if (event && event.tag === TAG_NAMES.GOOGLE_APPS_PRESENTATION_INFO) {
            WidgetHome.data = event.data;
            if (WidgetHome.data && !WidgetHome.data.content)
              WidgetHome.data.content = {};
            if (WidgetHome.data.content.mode && WidgetHome.data.content.url && WidgetHome.data.content.mode == 'preview')
              {
                WidgetHome.data.content.url = WidgetHome.data.content.url.replace('/edit', '/preview');
              }
            else if ((WidgetHome.data.content.mode && WidgetHome.data.content.url && WidgetHome.data.content.mode == 'editable')){
              WidgetHome.data.content.url = WidgetHome.data.content.url.replace('/preview', '/edit');
            }
           // WidgetHome.hideShowRotation();
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
