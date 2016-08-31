angular.module ("controllers", [])


.controller('leaguesDashboardCtrl', function(Dashboard){
	var vm = this;
	vm.processing = true;

	Dashboard.leagues()
	.then(function (data) {
		vm.leagues = data
		 console.log(data)
	}).finally(function () {
		 vm.processing = false;
	})
}) 

.controller('leagueCtrl', function(LeagueDetail, $routeParams, Checks, $scope, ngDialog, $log, $controller){
	var vm = this;
	vm.processing = true;
	var id = $routeParams.id;

	LeagueDetail.league_detail(id)
	.then(function (data) {
		vm.league_detail = data;

		if (vm.league_detail.standings) {
			vm.groups = vm.league_detail.standings;
		} else
		if (vm.league_detail.standing) {
			vm.teams = vm.league_detail.standing;
			console.log(vm.teams)
			
			// for (var i = 0; i < vm.teams.length; i++) {
				
			// 	var test = function(src) {
			//         Checks.isImage(src)
			// 	        .then(function(result) {
			// 	            if (result === false) {
			// 	            	for (var i = 0; i < vm.teams.length; i++) {
			// 				 	vm.teams[i].crestURI = "img/genericBadge.png"
			// 				 	}
			// 				} 
			// 	        });
			//     };

			//     test(vm.teams[i].crestURI);				
			// }
		};


//Opens team modal and put data into a controller
		vm.open = function (team) {

	        ngDialog.open({ 
	        	template: 'views/teamModal.html', 
	        	className: 'ngdialog-theme-default',
	        	// controller: 'modalCtrl',
	        	width: '80%',
	        	controller: ['$scope', function($scope, Checks) {
				       $scope.team = team;

				       var team_link = team._links.team.href

				       console.log(team_link)

				       $scope.processing = true

				       LeagueDetail.team_players(team_link)
				       .then(function (response) {
				       	 $scope.players = response.players

				       	 //Calculate player age:

				       	 for (var i = 0; i < $scope.players.length; i++) {
				       	 	var player_birthday = $scope.players[i].dateOfBirth;

				       	 	var birthYear = Number(player_birthday.substr(0,4))

				       	 	var calculateAge = function(birthYear) { // birthday is a date
				       	 		var currentYear = new Date().getFullYear();
				       	 		return currentYear - birthYear
							    
							}

				       	 	$scope.players[i].player_age = calculateAge(birthYear);

				       	 };

				       	 console.log($scope.players)

				       	 // Sorts players table
						    $scope.sortType = 'name'; // set the default sort type
						    $scope.sortReverse = false; // set the default sort order

						 $scope.processing = false   
				       })

				       vm.ok = function () {
	   
						};

						vm.fav = function () {
						    
						    // rest of code
						}; 

				    }]	    
	        });
	    };
		 
	}).finally(function () {
			vm.processing = false;
		})

 // Sorts league table
    $scope.sortType = 'position'; // set the default sort type
    $scope.sortReverse = false; // set the default sort order

}) 




