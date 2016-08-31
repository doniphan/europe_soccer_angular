angular.module ('dashboard_module', [])

.controller('leaguesDashboardCtrl', function(Dashboard){
	var vm = this;
	$("#loading").show();

	Dashboard.leagues()
	.then(function (data) {
		 console.log(data)
	})
}) 