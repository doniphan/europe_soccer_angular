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
                    

                    console.error(response);
                    
                    alert(' Error al hacer la consulta.');

                    return $q.reject(response.data);
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

 	dashboardFactory.league_detail = function (id) {
 		return Authorization.consult('GET', 'http://api.football-data.org/v1/competitions/' + id + '/leagueTable', '' )

 		// return $http.get('http://api.football-data.org/v1/competitions/398/leagueTable');
 	}; 	

 	dashboardFactory.team_players = function (team_link) {
 		return Authorization.consult('GET', team_link +'/players', '' )
 		
 	}

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

        calculateAge: function(birthday) { // birthday is a date
		    var ageDifMs = Date.now() - birthday.getTime();
		    var ageDate = new Date(ageDifMs); // miliseconds from epoch
		    return Math.abs(ageDate.getUTCFullYear() - 1970);
		}
    };
});