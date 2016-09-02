angular.module ("factories", [])


.factory('Authorization', ['$rootScope', '$http', '$interval', '$location', '$q', '$timeout', function($rootScope, $http, $interval, $location, $q, $timeout) {
        return {
            consult: function(method, api_url, datos) {
                var token = "d9b2c29baac94818a4908116a55d6f08";
                
                var req = {
                    method: method,
                    url: api_url,
                    headers: { 'X-Auth-Token': token },
                    dataType: 'json',
                    data: datos
                };
                //console.log(req);
                return $http(req).then(function(response) {
                    if (typeof response.data === 'object') {
                        
                        return response.data;

                    }
                    else {
                        // respuesta invalida
                        
                        return $q.reject(response.data);
                    }

                }, function(response) {
                    // algo salio mal
                    

                    console.error(' Error al hacer la consulta: ', response);

                    return $q.reject(response);
                });

            },
           
            
            otra_funcion: function() {} //aca puedo agragar mas funciones a la factoria
        };

    }

])



.factory ('Dashboard', function ($http, Authorization) {
 	var dashboardFactory = {};

 	dashboardFactory.leagues = function () {
 		return Authorization.consult('GET', 'http://api.football-data.org/v1/competitions/', '' )

 		// return $http.get('http://api.football-data.org/v1/competitions/398/leagueTable');
 	}; 	

 	return dashboardFactory;
 })

.factory ('LeagueDetail', function ($http, Authorization) {
 	var dashboardFactory = {};

//Gets list of leagues
 	dashboardFactory.leagues = function (id) {
 		return Authorization.consult('GET', 'http://api.football-data.org/v1/competitions/' + id, '' )
 	}; 

//Gets detail of the league
 	dashboardFactory.league_detail = function (id) {
 		return Authorization.consult('GET', 'http://api.football-data.org/v1/competitions/' + id + '/leagueTable', '' )
 	}; 	 		

// Gets players for a certain team
 	dashboardFactory.team_players = function (team_link) {
 		return Authorization.consult('GET', team_link +'/players', '' ) 		
 	};

// Gets fixtures for a certain team
 	dashboardFactory.team_fixtures = function (team_id) {
 		return Authorization.consult('GET', 'http://api.football-data.org/v1/teams/' + team_id +'/fixtures', '' )

 	}

//Gets team details
 	dashboardFactory.team = function (team_id) {
 		return Authorization.consult('GET', 'http://api.football-data.org/v1/teams/' + team_id , '' )

 	}

 	dashboardFactory.league_teams = function (league_teams_link) {
 		return Authorization.consult('GET', league_teams_link , '' )
 	}; 	

 	return dashboardFactory;
 })

.factory('Checks', function($q) {
    return {
        isImage: function(src) {
            var deferred = $q.defer();

		    var image = new Image();
		    image.onerror = function() {
		        deferred.resolve(false);
		    };
		    image.onload = function() {
		        deferred.resolve(true);
		    };
		    image.src = src;

		    return deferred.promise;
        },
		getFavs: function () {
			var values = [],
		         keys = Object.keys(localStorage),
		         i = keys.length;

		    while ( i-- ) {
		    	var team_object = angular.fromJson(localStorage.getItem(keys[i]))

		        values.push(team_object);
		    }
		    return values;
		}
    };
})

.directive('checkImage', function($http) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            attrs.$observe('ngSrc', function(ngSrc) {
                $http.get(ngSrc).success(function(){
                    console.log('image exist');
                }).error(function(){
                    console.log('image not exist');
                    element.attr('src', 'img/genericBadge.png'); // set default image
                });
            });
        }
    };
});
