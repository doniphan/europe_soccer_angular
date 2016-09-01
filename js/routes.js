angular.module ("appRoutes", ['ngRoute'])

.config(function ($routeProvider, $locationProvider) {
	$routeProvider

	.when("/" ,{
		templateUrl: 'views/dashboard.html',
		controller: 'leaguesDashboardCtrl',
		controllerAs: 'dashboard'
	})
	.when("/league/:id", {
		templateUrl: 'views/league.html',	
		controller: 'leagueCtrl',
		controllerAs: 'league'
	})
	.when("/team/fixtures/:id", {
		templateUrl: 'views/fixtures.html',	
		controller: 'fixturesCtrl',
		controllerAs: 'matches'
	})
	.when("/favorites", {
		templateUrl: 'views/favorites.html',	
		controller: 'favoritesCtrl',
		controllerAs: 'favs'
	})
	.otherwise({
        redirectTo: '/'
    });

    // get rid of the hash in the URL
	// $locationProvider.html5Mode(true);

})
