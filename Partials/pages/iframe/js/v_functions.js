//Use buttons to highlight the path
function highlight(point) {
                  if( d3.select(point).attr("data-clicked") == "1" ){
                      d3.select(point).attr("data-clicked","0");  // set up toggle
                                  svg.selectAll(point+"link")     // Use id to locate path
                                     .style("stroke-width", 3)
                                     .style("stroke-opacity", 0.4)
                                     .style("stroke", function(d){return color(d.color);});

                  }else{
                     d3.select(point).attr("data-clicked","1");  // when the notton is unchecked, change the attr of the path
                                 svg.selectAll(point+"link")     // By using id to locate the object
                                    .style("stroke-opacity", 1)
                                    .style("stroke-width", 5)
                                    .style("stroke","red");
                       }

    }
//End of highlight function

//keep dropdown menu open when we click the names of nodes

function hidesystem(point){
                      if( d3.select(point).attr("data-clicked") == "1" ){
                          d3.select(point).attr("data-clicked","0"); 
                                       svg.selectAll(".node")
                                          //.filter(function(d){return d.to != "server" ;})
                                          .style("opacity",1);
                                       svg.selectAll(".link")
                                          .style("opacity",1);
                      }else{
                     d3.select(point).attr("data-clicked","1");
                                 svg.selectAll(".node")
                                    .filter(function(d){return d.to === "Root-LV2" ;})
                                    .style("opacity", 0);
                                 svg.selectAll(".link")
                                    .filter(function(d){return d.source.to === "Root-LV2"})
                                    .style("opacity",0);
                      }

}

$(document).ready(function(){

//Dropdown menu multiple choice
//Dropdown memu will still show after clicking
//Click the button to hide
$('.dropdown-menu').click(function(e) {
          e.stopPropagation();
});

//Click whitespace to hide tooltip
$('svg').click(function(){
   $('.tooltip').css('opacity',0);
});

//Set info toggle
$(document).ready(function(){
    $("#info").click(function(){
        $("#infopanel").slideToggle("slow");
        $("div.tooltip").toggleClass("down", 1000);
    });
});

});
//end 