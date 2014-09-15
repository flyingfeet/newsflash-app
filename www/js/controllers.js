angular.module('controllers', [])

.controller('AppCtrl', function($scope) {
})

.controller('NewsflashCtrl', ['$scope', 'NewsflashService', 'NewsflashStorage',
	function($scope, NewsflashService, NewsflashStorage) {
   $scope.activeNews = NewsflashStorage.getNews();

   if($scope.activeNews == null) {
    getNewsFromServer();
  }

  $scope.refresh = function() {
    getNewsFromServer();
  };

  function getNewsFromServer() {
    var promise = NewsflashService.getNews();
    promise.then(function(news) {
     NewsflashStorage.setNews(news);
     $scope.activeNews = news;
   });
  };
}])

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
