app.controller('sqlController',['$scope','$http','$filter','$rootScope',function($scope, $http, $filter, $rootScope){
    $scope.dataLoaded = false;
    
    $http.get("data/sql.json").success(function(response){
    	$scope.reset = function(){
        	$scope.data = response;
        	render();
        };       	
	$scope.reset();
	$scope.filters = {};

        $scope.addFilter = function(x){
                    $scope.data = $scope.data.filter(function(y){
                        return (y.cpe_label == x);
                        }); 
                    render();
        };

        $scope.resetFilter = function(){
            return ($scope.data = response);
        };

        var called = false;
        $scope.toggle = function (taskId) {
          if (called) { called = false; return $scope.reset(); }
          $scope.addFilter(taskId);
          called = true;          
        };
        
        $scope.searchbox = function(x,s,e){
            $scope.reset();
            $scope.data = alasql('select * from ? where (pluginID like ? or ip like ? or CPE_part like ? or CPE_vendor like ? or CPE_product like ? or cpe_label like ? or severity like ?) and (lastSeen_Date >= ? and lastSeen_Date <= ?)',[$scope.data, x,x,x,x,x,x,x,s,e]);
            render();       
            };
            
        //$scope.datatest = alasql('select * from ? where lastSeen_Date >= "2015-09-01"',[$scope.data]);
         $scope.date = [];
        $scope.dateorder = alasql('select lastSeen_Date from ? order by lastSeen_Date desc',[$scope.data]);
        for(var item = 0; item < $scope.dateorder.length; item++){
            $scope.date.push($scope.dateorder[item].lastSeen_Date);
        }
        
        $scope.start = $scope.date[$scope.date.length-1];
        $scope.end = $scope.date[0];
            console.log($scope.end);
            console.log($scope.start);
    });

    var render = function(){
    	
        $scope.vul_total = alasql('select count(pluginID) as vul_total from ?',[$scope.data]);
        $scope.vul_by_month = alasql('select month, month_label, count(pluginID) as vul from ? group by month, month_label order by month',[$scope.data]);
        $scope.dev_total = alasql('select count(distinct(ip)) as dev_total from ?',[$scope.data]);
        $scope.dev_by_month = alasql('select month, month_label, count(distinct(ip)) as devices from ? group by month, month_label order by month',[$scope.data]); 
        $scope.appls = alasql('select cpe_label, count(cpe_label) as cpe_count from ? group by cpe_label order by cpe_label',[$scope.data]);
        $scope.cvss = alasql('select round(sum(cast(baseScore as float)),0) as cvss from ?',[$scope.data]);
        $scope.cvss_by_month = alasql('select month, month_label, round(sum(cast(baseScore as float)),0) as cvss from ? group by month, month_label order by month',[$scope.data]);
        $scope.mtg = alasql('select hasBeenMitigated, count(pluginID) as mtg_count from ? group by hasBeenMitigated',[$scope.data]);
        $scope.month = alasql('select distinct(month) as month from ? order by month',[$scope.data]);

        $rootScope.vendors = alasql('select top 10 CPE_vendor as vendor, count(pluginID) as count_vendor from ? group by CPE_vendor order by count_vendor desc',[$scope.data]);
        $scope.products = alasql('select top 10 CPE_product as product, count(pluginID) as count_product from ? group by CPE_product order by count_product desc',[$scope.data]);

        //console.log($scope.vendors); 
  
        $scope.vul_change = $scope.vul_by_month[$scope.vul_by_month.length-1].vul - $scope.vul_by_month[$scope.vul_by_month.length-2].vul;
        $scope.dev_change = $scope.dev_by_month[$scope.dev_by_month.length-1].devices - $scope.dev_by_month[$scope.dev_by_month.length-2].devices;
        $scope.cvss_change = $scope.cvss_by_month[$scope.cvss_by_month.length-1].cvss - $scope.cvss_by_month[$scope.cvss_by_month.length-2].cvss;
        $scope.pace = Math.round(($scope.mtg[0].mtg_count - $scope.mtg[1].mtg_count)/($scope.mtg[1].mtg_count/($scope.month[$scope.month.length-1].month - $scope.month[0].month + 1)),0);

        //console.log($scope.pace); 

        $scope.vul_labels = [];
        $scope.vul_data=[];
         for(var item = 0; item < $scope.vul_by_month.length; item++){
              $scope.vul_labels.push($scope.vul_by_month[item].month_label);
              $scope.vul_data.push($scope.vul_by_month[item].vul);
          }
          
        //console.log($scope.vul_data);

		var resetCanvas = function(){
		  $('#vulLineChart').remove(); 
		  $('#devLineChart').remove(); 
		  $('#SeverityLineChart').remove(); 
		  $('#vul-container').append('<canvas id="vulLineChart" width="120" height="80" class="pull-right"><canvas>');	 
		  $('#dev-container').append('<canvas id="devLineChart" width="120" height="80" class="pull-right"><canvas>');	 
		  $('#Severity-container').append('<canvas id="SeverityLineChart"><canvas>');	 
		};
		resetCanvas();

        $scope.vul_line_Data = {
        labels : $scope.vul_labels,
        datasets : [{
            fillColor: "rgba(77, 175, 124,1)",
            strokeColor: "rgba(255,255,255,1)",
            pointColor: "rgba(255,255,255,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data : $scope.vul_data
        }]
        };
        
        var temp1 = document.getElementById('vulLineChart').getContext('2d');
        var LineChart = new Chart(temp1).Line($scope.vul_line_Data,{
                            //responsive:true,
                            scaleShowGridLines : false,
                            scaleShowLabels: false,
                            showScale: false,
                            pointDot : true,
                            bezierCurveTension : 0.2,
                            pointDotStrokeWidth : 1,
                            pointHitDetectionRadius : 5,
                            datasetStroke : false
                        });

        $scope.dev_labels = [];
        $scope.dev_data=[];
         for(var item = 0; item < $scope.dev_by_month.length; item++){
              $scope.dev_labels.push($scope.dev_by_month[item].month_label);
              $scope.dev_data.push($scope.dev_by_month[item].devices);
          }
          
        //console.log($scope.dev_data);

        $scope.dev_line_Data = {
        labels : $scope.dev_labels,
        datasets : [{
            fillColor: "rgba(77, 175, 124,1)",
            strokeColor: "rgba(255,255,255,1)",
            pointColor: "rgba(255,255,255,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data : $scope.dev_data
        }]
        };
        
        var temp2 = document.getElementById('devLineChart').getContext('2d');
        var LineChart = new Chart(temp2).Line($scope.dev_line_Data,{
                            //responsive:true,
                            scaleShowGridLines : false,
                            scaleShowLabels: false,
                            showScale: false,
                            pointDot : true,
                            bezierCurveTension : 0.2,
                            pointDotStrokeWidth : 1,
                            pointHitDetectionRadius : 5,
                            datasetStroke : false
                        });

        $scope.s_by_month_h = alasql('select lastSeen_Date, count(pluginID) as count_s from ? where severity = "High" group by lastSeen_Date order by lastSeen_Date',[$scope.data]);
        $scope.s_by_month_c = alasql('select lastSeen_Date, count(pluginID) as count_s from ? where severity = "Critical" group by lastSeen_Date order by lastSeen_Date',[$scope.data]);
        $scope.s_by_month_m = alasql('select lastSeen_Date, count(pluginID) as count_s from ? where severity = "Medium" group by lastSeen_Date order by lastSeen_Date',[$scope.data]);
        $scope.s_by_month = alasql('select distinct(lastSeen_Date) as date from ? where pluginID is not null order by date',[$scope.data]);

         $rootScope.s_total_h = {"total":0};
         for (var i = 0; i < $scope.s_by_month_h.length; i++) {
         	$scope.s_total_h.total += $scope.s_by_month_h[i].count_s
         }
         $rootScope.s_total_m = {"total":0};
         for (var i = 0; i < $scope.s_by_month_m.length; i++) {
         	$scope.s_total_m.total += $scope.s_by_month_m[i].count_s
         }
         $rootScope.s_total_c = {"total":0};
         for (var i = 0; i < $scope.s_by_month_c.length; i++) {
         	$scope.s_total_c.total += $scope.s_by_month_c[i].count_s
         }

        console.log($rootScope.s_total_h.total);

        $scope.s_data_h = [];
        $scope.s_data_c = [];
        $scope.s_data_m = [];
        $scope.s_labels = [];
         for(var item = 0; item < $scope.s_by_month.length; item++){
              $scope.s_labels.push($scope.s_by_month[item].date)
         }
         for(var item = 0; item < $scope.s_by_month_m.length; item++){
              $scope.s_data_m.push($scope.s_by_month_m[item].count_s)
         }
         for(var item = 0; item < $scope.s_by_month_h.length; item++){
              $scope.s_data_h.push($scope.s_by_month_h[item].count_s)
         }
         for(var item = 0; item < $scope.s_by_month_c.length; item++){
              $scope.s_data_c.push($scope.s_by_month_c[item].count_s)
         }  

		$scope.s_line_Data = {
        labels : $scope.s_labels,
        datasets : [
        {
            fillColor: "rgba(77,175,124,0.5)",
            strokeColor: "#4DAF7C",
            pointColor: "#4DAF7C",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "#4DAF7C",
            data : $scope.s_data_m
        },
           {
            fillColor: "rgba(234,200,93,0.5)",
            strokeColor: "#EAC85D",
            pointColor: "#EAC85D",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "#EAC85D",
            data : $scope.s_data_h
        },
           {
            fillColor: "rgba(226,83,49,0.5)",
            strokeColor: "#E25331",
            pointColor: "#E25331",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "#E25331",
            data : $scope.s_data_c
        }
        ]
        };


        var temp3 = document.getElementById('SeverityLineChart').getContext('2d');
        var SLineChart = new Chart(temp3).Line($scope.s_line_Data,{
                            responsive:true,
                            scaleShowGridLines : false,
                            scaleShowLabels: false,
                            showScale: false,
                            // pointDot : true,
                            // bezierCurveTension : 0.2,
                            // pointDotStrokeWidth : 1,
                            // pointHitDetectionRadius : 5,
                            // datasetStroke : false
                            //scaleShowGridLines : true,
						    //scaleGridLineColor : "rgba(0,0,0,.05)",
						    //scaleGridLineWidth : 1,
						    scaleShowHorizontalLines: true,
						    scaleShowVerticalLines: true,
						    bezierCurve : true,
						    bezierCurveTension : 0.4,
						    pointDot : false,
						    pointDotRadius : 4,
						    pointDotStrokeWidth : 2,
						    pointHitDetectionRadius : 20,
						    datasetStroke : false,
						    datasetStrokeWidth : 2,
						    datasetFill : true
                        });
    
		// $scope.hosts = alasql('select Hostgroups, count(Hostgroups) as host_count from ? group by Hostgroups order by host_count desc',[$scope.data]);
		// $scope.dataLoaded = true;
		// console.log($scope.hosts);
        };
        //$scope.render();
       $scope.showSearchbox = function(){                
                    $('#search_box').toggle("slow");               
        };
      $scope.showDatepicker = function(){                
                    $('#datepicker').toggle("slow");               
        };

    $http.get("data/firewall.json").success(function(response){
        $scope.firewall = response;

        $scope.hosts = alasql('select Hostgroups, count(distinct(ip)) as host_count from ? group by Hostgroups order by host_count desc',[$scope.firewall]);
        //console.log($scope.hosts);
        $scope.dataLoaded = true;
    });

}]);