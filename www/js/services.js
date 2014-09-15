angular.module('services', ['restangular'])

.service('NewsflashService', ['Restangular', '$q', function(Restangular, $q) {
	return {
		getNews : function() {
			console.log("Retrieving news from server...");
			var deferred = $q.defer();
			Restangular.all('rest/news/all/active').getList().then(
				function(result) {
					deferred.resolve(result);
				}, function(err) {
					deferred.reject(err);
				});

			return deferred.promise;
		}
	}
}])

.service('NewsflashStorage', function() {
	this.news = null;

	this.getNews = function() {
		return this.news;
	};

	this.setNews = function(news) {
		this.news = news;
	};
})

.factory('PushProcessingService', function(Restangular) {
  function onDeviceReady() {
    console.info('NOTIFY  Device is ready.  Registering with GCM server');
            //register with google GCM server
            var pushNotification = window.plugins.pushNotification;
            pushNotification.register(gcmSuccessHandler, gcmErrorHandler, {
              "senderID":"526558819211",
              "ecb":"onNotificationGCM"
            });
          }
          function gcmSuccessHandler(result) {
            console.info('NOTIFY  pushNotification.register succeeded.  Result = '+result)
          }
          function gcmErrorHandler(error) {
            console.error('NOTIFY  '+error);
          }
          return {
            initialize : function () {
              console.info('NOTIFY  initializing');
              document.addEventListener('deviceready', onDeviceReady, false);
            },
            registerID : function (id) {
                //Insert code here to store the user's ID on your notification server.
                //You'll probably have a web service (wrapped in an Angular service of course) set up for this.
                //For example:
                Restangular.all("rest/android/user").post({"regId":id}).then(function(response) {
                  console.log(response);
                });
              },
            //unregister can be called from a settings area.
            unregister : function () {
              console.info('unregister')
              var push = window.plugins.pushNotification;
              if (push) {
                push.unregister(function () {
                  console.info('unregister success')
                });
              }
            }
          }
        });

// ALL GCM notifications come through here.
function onNotificationGCM(e) {
  console.log('EVENT -&gt; RECEIVED:' + e.event + '');
  switch( e.event )
  {
    case 'registered':
    if ( e.regid.length > 0 ) {
      console.log('REGISTERED with GCM Server REGID:' + e.regid);

                //call back to web service in Angular.
                //This works for me because in my code I have a factory called
                //      PushProcessingService with method registerID
                var elem = angular.element(document.querySelector('[ng-app]'));
                var injector = elem.injector();
                var myService = injector.get('PushProcessingService');
                myService.registerID(e.regid);
              }
              break;

              case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground)
            {
                //we're using the app when a message is received.
                console.log('--INLINE NOTIFICATION--' + '');

                // if the notification contains a soundname, play it.
                //var my_media = new Media(&quot;/android_asset/www/&quot;+e.soundname);
                //my_media.play();
                alert(e.payload.message);
              }
              else
              {
                // otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart)
                  console.log('--COLDSTART NOTIFICATION--' + '');
                else
                  console.log('--BACKGROUND NOTIFICATION--' + '');

                // direct user here:
                window.location = "#/tab/featured";
              }

              console.log('MESSAGE -&gt; MSG: ' + e.payload.message + '');
              console.log('MESSAGE: '+ JSON.stringify(e.payload));
              break;

              case 'error':
              console.log('ERROR -&gt; MSG:' + e.msg + '');
              break;

              default:
              console.log('EVENT -&gt; Unknown, an event was received and we do not know what it is');
              break;
            }
          }
