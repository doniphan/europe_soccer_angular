angular.module ("controllers", [])

//Dashboard controller
.controller('leaguesDashboardCtrl', function(Dashboard, $scope){
	var vm = this;
	vm.processing = true;

	// Gets all leagues from the API
		Dashboard.leagues()
		.then(function (data) {
			vm.leagues = data
		
		}).finally(function () {
			 vm.processing = false;
		});

	// Clears search box
		$scope.clear_search = function () {
			 $scope.search = "" 
		}
}) 

//League table controller
.controller('leagueCtrl', function(LeagueDetail, $routeParams, Checks, $scope, ngDialog, $log, $controller, $q){
	var vm = this;
	vm.processing = true;
	var id = $routeParams.id;

	// Clears search box
	$scope.clear_search = function () {
		 $scope.search = "" 
	}

	//Gets league detail from the API
	LeagueDetail.league_detail(id)
	.then(function (data) {
		vm.league_detail = data;


	//There's a league that has groups, so this detect if a league has groups or don't.
		if (vm.league_detail.standings) {
			//Put groups into scope.
			vm.groups = vm.league_detail.standings;
			vm.league_detail.league_id = "424"
		} else
		if (vm.league_detail.standing) {
			vm.teams = vm.league_detail.standing;
			
			//Assigns an id in the scope to every league 
				var league_link = vm.league_detail._links.competition.href;
				vm.league_detail.league_id = league_link.substr(league_link.lastIndexOf('/') + 1);
					

		//Assigns a team ID inside the scope. 	
			for (var i = 0; i < vm.teams.length; i++) {
				var team_link = vm.teams[i]._links.team.href;
				vm.teams[i].teamId = team_link.substr(team_link.lastIndexOf('/') + 1);						
			};

			

	//Favorites utils
		//Puts the team into localStorage as favorite
		$scope.fav = function (team_fav) {
			var ls_name = team_fav.teamId;
			team_fav.league_id = vm.league_detail.league_id;
		    window.localStorage.setItem(ls_name, JSON.stringify(team_fav));
		    
		    $scope.check_fav();
		   

		}; 
		//Removes the team from the localStorage as favorite		
		$scope.unfav = function (team_unfav) {
			var ls_name = team_unfav.teamId;
			window.localStorage.removeItem(ls_name);
			$scope.check_fav();
		};

		//Checks if team is already in the localStorage as favorite	
			$scope.check_fav = function () {
				for (var i = 0; i < vm.teams.length; i++) {
					vm.teams[i].favorited = false;
				}
				var keys = Object.keys(localStorage);
				for (var y = 0; y < keys.length; y++) {
				 for (var i = 0; i < vm.teams.length; i++) {
						
						if (vm.teams[i].teamId ===	 keys[y]) {										
							vm.teams[i].favorited = true;											
						} 
					};
				};
			};

		// first check of favs
		$scope.check_fav();
		};


//Opens team modal and put data into a controller
		vm.open = function (team, league_id) {

	        ngDialog.open({ 
	        	template: 'views/teamModal.html', 
	        	className: 'ngdialog-theme-default',
	        	closeByEscape: true,
	        	closeByNavigation: true,
	        	width: '80%',
	        	controller: ['$scope', 'Checks', function($scope, Checks) {
			       //Shows proccessing animation
				       $scope.processing = true

				       $scope.team = team;
				       $scope.team.league_id = league_id;

			       //Gets the link of the team depending of wich object has it
				       if (team._links){
				       	var team_link = team._links.team.href;
				       }else{
				       	var team_link = "http://api.football-data.org/v1/teams/" + team.teamId;
				       };

			       //Makes the players request to the API
				       LeagueDetail.team_players(team_link)
				       .then(function (response) {

		       		//Checks if there are list of players or is not empty before put it into $scope.
				       	if(response.players === null || response.players === undefined  || response.players.length == 0){
				       		console.log('There are no players in the API associated to this team');
				       		$scope.processing = false;
				       	} else{
				       		$scope.players = response.players
				       					       	 
			       	 //Calculate player age:
				       	 for (var i = 0; i < $scope.players.length; i++) {
				       	 	var player_birthday = $scope.players[i].dateOfBirth;
				       	 	var birthYear = Number(player_birthday.substr(0,4));
				       	 	var calculateAge = function(birthYear) { // birthday is a date
				       	 		var currentYear = new Date().getFullYear();
				       	 		return currentYear - birthYear;							    
							};
				       	 	$scope.players[i].player_age = calculateAge(birthYear);
				       	 };
			       	 //End Calculate player age

				       	 };
			       	 //Ends else.

				       	 // Sorts players table
						    $scope.sortType = 'name'; // set the default sort type
						    $scope.sortReverse = false; // set the default sort order

					//Hides proccessing animation   
						 $scope.processing = false   
				       });

			       //Closes the modal
				       $scope.close = function () {
	   						ngDialog.close()
						};

					//Puts the team into localStorage as favorite
						$scope.fav = function (team_fav) {
							var ls_name = team_fav.teamId;
							team_fav.league_id = league_id;
						    window.localStorage.setItem(ls_name, JSON.stringify(team_fav));
						    console.log(team);
						    $scope.favorited = check_fav();
						    console.log(league_id)

						}; 
					//Removes the team from the localStorage as favorite		
						$scope.unfav = function (team_unfav) {							
							var ls_name = team_unfav.teamId;							
							window.localStorage.removeItem(ls_name);
							$scope.favorited = check_fav();
						};

					//Checks if team is already in the localStorage as favorite	
						var check_fav = function () {							
							var keys = Object.keys(localStorage);		         					
								for (var i = 0; i < keys.length; i++) {
									if ($scope.team.teamId == keys[i]) {										
										return true										
									}; 
								};							
						};

						$scope.favorited = check_fav();			

						// Clears search box
							$scope.clear_search = function () {
								 $scope.search = "" 
							}
				    }]	    
	        });
	    };
		// End open team modal		    
		 
		}).finally(function () {
				vm.processing = false;
			});
		//// End Gets league detail from the API

	 // Sorts league table
	    $scope.sortType = 'position'; // set the default sort type
	    $scope.sortReverse = false; // set the default sort order 

}) 


//Team fixtures page controller
.controller('fixturesCtrl', function(LeagueDetail, $routeParams, Checks, $scope, ngDialog, $log, $controller){
	var vm = this;
	vm.processing = true;
	var id = $routeParams.id;

	// Sorts league table
    $scope.sortType = 'position'; // set the default sort type
    $scope.sortReverse = false; // set the default sort order
 	
 		//Makes the fixtures request to the API
	       LeagueDetail.team_fixtures(id)
	       .then(function (response) {
	       	 vm.fixtures = response.fixtures;
	       	 console.log(response)

	       }).finally(function () {
	       	 vm.processing = false;
	       });

       //The fixtures object has no Team Name. So this gets the Team Name
       		LeagueDetail.team(id)
       		.then(function (response) {
       			 vm.team_name = response.name;       			 
       		});

   		// Clears search box
   			$scope.clear_search = function () {
   				 $scope.search = "" 
   			};	
})


//Favorites page controller
.controller('favoritesCtrl', function(LeagueDetail, Dashboard, $routeParams, Checks, $scope, ngDialog, $log, $controller){
	var vm = this;
	vm.processing = true;

	//Gets the fav teams from the local storage
	vm.fav_teams = Checks.getFavs();	
	vm.processing = false;

	// Clears search box
	$scope.clear_search = function () {
		 $scope.search = "" 
	};

	//Removes the team from the localStorage as favorite		
		$scope.unfav = function (team_unfav) {
			var ls_name = team_unfav.teamId;
			window.localStorage.removeItem(ls_name);
			vm.fav_teams = Checks.getFavs();
		};

	// Gets all leagues from the API
		Dashboard.leagues()
		.then(function (data) {
			vm.leagues = data;			

		}).finally(function () {
			 vm.processing = false;
		});

	//Opens team modal and put data into a controller
		vm.open = function (team, league_id) {

		        ngDialog.open({ 
		        	template: 'views/teamModal.html', 
		        	className: 'ngdialog-theme-default',
		        	closeByEscape: true,
		        	closeByNavigation: true,
		        	width: '80%',
		        	controller: ['$scope', 'Checks','$rootScope', function($scope, Checks, $rootScope) {
					       //Shows proccessing animation
					       $scope.processing = true

					       $scope.team = team;
					       $scope.team.league_id = league_id;

					    //Gets the link of the team depending of wich object has it
					       if (team._links){
					       	var team_link = team._links.team.href;
					       }else{
					       	var team_link = "http://api.football-data.org/v1/teams/" + team.teamId;
					       };

				       //Makes the players request to the API
					       LeagueDetail.team_players(team_link)
					       .then(function (response) {

			       		//Checks if there are list of players or is not empty before put it into $scope.
					       	if(response.players === null || response.players === undefined  || response.players.length == 0){
					       		console.log('There are no players in the API associated to this team');
					       		$scope.processing = false;
					       	} else{
					       		$scope.players = response.players
					       					       	 
				       	 //Calculate player age:
					       	 for (var i = 0; i < $scope.players.length; i++) {
					       	 	var player_birthday = $scope.players[i].dateOfBirth;
					       	 	var birthYear = Number(player_birthday.substr(0,4));
					       	 	var calculateAge = function(birthYear) { // birthday is a date
					       	 		var currentYear = new Date().getFullYear();
					       	 		return currentYear - birthYear;							    
								};
					       	 	$scope.players[i].player_age = calculateAge(birthYear);
					       	 };
				       	 //End Calculate player age

					       	 };
				       	 //Ends else.

					       	 // Sorts players table
							    $scope.sortType = 'name'; // set the default sort type
							    $scope.sortReverse = false; // set the default sort order

						//Hides proccessing animation   
							 $scope.processing = false   
					       });

				       //Closes the modal
					       $scope.close = function () {
		   						ngDialog.close()
		   						vm.fav_teams = Checks.getFavs()
							};

						//Puts the team into localStorage as favorite
							$scope.fav = function (team_fav) {
								var ls_name = team_fav.teamId;
								team_fav.league_id = league_id;
							    window.localStorage.setItem(ls_name, JSON.stringify(team_fav));
							    console.log(team);
							    $scope.favorited = check_fav();
							    console.log(league_id)
								vm.fav_teams = Checks.getFavs()	
							}; 
						//Removes the team from the localStorage as favorite		
							$scope.unfav = function (team_unfav) {
								var ls_name = team_unfav.teamId;
								window.localStorage.removeItem(ls_name);
								$scope.favorited = check_fav();
								vm.fav_teams = Checks.getFavs()
							};

						//Checks if team is already in the localStorage as favorite	
							var check_fav = function () {								
								var keys = Object.keys(localStorage);		         					
									for (var i = 0; i < keys.length; i++) {
										if ($scope.team.teamId == keys[i]) {										
											return true										
										}; 
									};								
							};
							$scope.favorited = check_fav();	
					    }]	    
		        });
		    };
	// End open team modal		
})



