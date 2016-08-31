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
	.when("/characters", {
		templateUrl: 'views/characters.html',	
		controller: 'sectionCtrl',
		controllerAs: 'section'
	})
	.when("/character/:id", {
		templateUrl: 'views/character_one.html',
		controller: 'characterCtrl',
		controllerAs: 'characterOne'
	})
	// .when("/dashboard", {
	// 	templateUrl: 'views/dashboard.html',
	// 	controller: 'leaguesDashboardCtrl',
	// 	controllerAs: 'dashboard'
	// })
	.otherwise({
        redirectTo: '/'
    });

    // get rid of the hash in the URL
	// $locationProvider.html5Mode(true);

})
