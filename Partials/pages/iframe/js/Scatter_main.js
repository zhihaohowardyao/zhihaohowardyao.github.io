var margin = {top: 20, right: 20, bottom: 20, left: 60}, // margins around the graph
    width = 880 - margin.left - margin.right, // width of the graph
    height = 590 - margin.top - margin.bottom; // height of the graph


var x,y;
    x = d3.scale.ordinal().rangeBands([margin.left, width-margin.right]), // x range function
    y = d3.scale.linear().range([height - margin.top, margin.bottom]); // y range function

//var color = d3.scale.category10();
var color = d3.scale.ordinal()
  .domain(["Medium", "High", "Critical"])
  .range(["#4DAF7C", "#EAC85D" , "#E25331"]);

var  currentDataset,// name of the current data set. Used to track when the dataset changes
  data;

var vis = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    ;
  
var  xAxis = d3.svg.axis().scale(x).tickSize(16).tickSubdivide(true).orient("bottom"), // x axis function
    yAxis = d3.svg.axis().scale(y).tickSize(10).tickSubdivide(true).orient("left"); // y axis function

function render(source,c,v,r) {    
  vis = d3.select("#visualisation");
    vis.attr("reansform", "translate(100,0)");
     vis.selectAll("g").remove();
    
	vis.append("g") // container element
		.attr("class", "x axis") // so we can style it with CSS
		.attr("transform", "translate(0," + (height+50) + ")") // move into position
		.call(xAxis); // add to the visualisation
 
	// add in the y axis
	vis.append("g") // container element
		.attr("class", "y axis") // so we can style it with CSS
		.attr("transform", "translate(" + margin.left + ", 50)")
    .call(yAxis); // add to the visualisation
 
    var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

    d3.csv(source,function(data){
        var tip;
    
    if([c] == 'severity'){
         tip = d3.tip().attr('class','d3-tip').html(function(d) {     
        return 'Severity: ' + d.severity + '<br/>' + 'Base Score: '  + d.baseScore + '<br/>' + 'Total Count: '  + d.count_by_sev;
        });
    }else {
         tip = d3.tip().attr('class','d3-tip').html(function(d) {  
        return 'Severity: ' + d.severity + '<br/>' + 'Base Score: '  + d.baseScore + '<br/>' + d[c] + ': '  + d[r];
        });
    }

	// add new points if they're needed
        x.domain(data.map(function(d) { return d[c]; }));
	y.domain([
		d3.min(data, function (d) { return +d[v]; }),
		d3.max(data, function (d) { return +d[v]; })
	]);
        
    var plot = vis.selectAll ("circle").data(data);     
	plot.enter()
		.insert("circle")
			.attr("cx", function (d) { return x(d[c])+x.rangeBand()/2; })
			.attr("cy", function (d) { return y(d[v]); })
//			.attr("r", 0)
            .attr("r", function(d){ if(d[r] >3000){return Math.log(d[r])*5;}else if(d[r]>1000){return Math.log(d[r])*4;}else if(d[r]>500){return Math.log(d[r])*3;}else{return Math.log(d[r])*2;}})
            .style("opacity", 0.8)
            .style("fill", "white" )
            .attr("transform", "translate(" + 0 + ", 50)")
            ; 
 
           
    var t = vis.transition().duration(1500).ease("exp-in-out");
    if([c] == 'vendor'){
        t.select(".x.axis").call(xAxis)
                            .selectAll("text")
                            .attr("y", 0)
                            .attr("x", -18)
                            .attr("dy", ".35em")
                            .attr("transform", "rotate(-90)")
                            .style("text-anchor", "end")
        ;
    }else{
       t.select(".x.axis").call(xAxis); 
    }
    t.select(".y.axis").call(yAxis);

	// transition the points
	plot.transition().duration(1500).ease("exp-in-out")
		.attr("cx", function (d) { return x(d[c])+x.rangeBand()/2; })
		.attr("cy", function (d) { return y(d[v]); })
//    .attr("r", function (d) { return d[r]/40; })
    .attr("r", function(d){ if(d[r] >3000){return Math.log(d[r])*5;}else if(d[r]>1000){return Math.log(d[r])*4;}else if(d[r]>500){return Math.log(d[r])*3;}else{return Math.log(d[r])*2;}})
    .style("opacity", 0.8)
  	.style("fill", function (d) { return color(d.severity); })
    //.style("stroke", "grey")
    .attr("transform", "translate(" + 0 + ", 50)")
    ; 
    vis.call(tip);    
    plot.on('mouseover', tip.show)
         .on('mouseout', tip.hide);
 
	// remove points if we don't need them anymore
	plot.exit()
		.transition().duration(0).ease("exp-in-out")
		.attr("cx", function (d) { return x(d[c])+x.rangeBand()/2; })
		.attr("cy", function (d) { return y(d[v]); })
		.style("opacity", 0)
		.attr("r", 0)
        .style("fill","white")
				.remove();
   
 });       
}


$( document ).ready(function() {
   $('.btn').on('click',function(){
            var input = $(this).attr("value").split(',');
//            console.log(input);
            render(input[0],input[1],input[2],input[3]);
            $('.btn').removeClass('btn-warning').addClass('btn-info');
            $(this).addClass('btn-warning');
        });
});
