//Set up height weight, margin and color format
var margin = {top: 10, right: 10, bottom: 20, left: 20},
    width = 800 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),
    color = d3.scale.category10(); 
//End of Set up

// Append the svg to the page
var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left*6 + "," + margin.top + ") rotate(0)"); // add in rotate parameter
//End of svg to the page    
    
// Set the Sankey diagram properties
var sankey = d3.sankey()
               .nodeWidth(15)
               .nodePadding(10)
               .size([width, height]);
               
//replace path=sankey.link() with the codes below
//to make sure the endpoints of links can be connected with circles (instead of rectangles of sankey)
var path = d3.svg.diagonal()
                 .source(function(d) {
                            return {"x":d.source.y + d.source.dy / 2,
                                    "y":d.source.x + sankey.nodeWidth()/2};
                                     })            
                 .target(function(d) {
                            return {"x":d.target.y + d.target.dy / 2,
                                    "y":d.target.x + sankey.nodeWidth()/2};
                                     })
                 .projection(function(d) { return [width-d.y+sankey.nodeWidth(), d.x]; });
                 
//End of Sankey properties

//Set tooltip    
var div = d3.select("body")
            .append("div")
            .attr("class", "tooltip");
//End of tooltip
                        
//Function to create plot by using test data
d3.json("data/v_sankey.json", function(data){
//Set up Sankey layout    
window.width = 500;
sankey
    .nodes(data.nodes)
    .links(data.links)
    .layout(32);

//End of sankey layout

//Add in arrows 
svg.append("svg:defs").selectAll("marker") // add arrow as marker
   .data(["end"])
   .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)   //how far the marker from nodes
    .attr("refY", 0)
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("data-orient", "down") 
    .style("stroke", "grey")
    .style("fill", "grey")
    .style("opacity",0.7)
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5"); // draw the small triangles
          
// Add in links
var link = svg.append("g")
              .attr("transform", "translate(" + width + ", " + 0 + ") rotate(90)")// rotate the links 
              .selectAll(".link")
              .data(data.links)
              .enter().append("path")
              .attr("class", "link")
              .attr("id", function(d) {return d.source.name.replace(/\./g, '').replace(/\s+/g,'') + "link" ;}) //create id for button selection
              .attr("d", path) // path is default which has been created in sankey.js
              .style("stroke-width", 3)
              .style("stroke", function(d){return color(d.color);}) // different color with different type: [prime, server, system]
              .attr("marker-start", function(d){                                     // add the markers(small triangles)
                                                if (d.color >1 && d.target.to != "server"){return "url(#end)";} //url(#end) is the syntax to bind to markers
                                               })
              .on("click", function(d) {                                          // highlight function in svg by clicking any path
                  if( d3.select(this).attr("data-clicked") == "1" ){              // create toggle
                      d3.select(this).attr("data-clicked","0")
                                     .style("stroke-width", 3)
                                     .style("stroke-opacity", 0.4)
                                     .style("stroke", function(d){return color(d.color);});
                  }else{
                     d3.select(this).attr("data-clicked","1")
                                    .style("stroke-opacity", 1)
                                    .style("stroke-width", 5)
                                    .style("stroke","red");
                       }
                 })
              .style("stroke-dasharray",function(d){
                if(d.target.name == "Root2-LV1-No1" || d.target.name =="Root2"){
                  return ("5,5");
                }
              });
              
//End of adding arrows    

//Add in the nodes
var node = svg.append("g")
              .attr("transform", "translate(" + width + ", " + 0 + ") rotate(90)")// rotate the nodes
              .selectAll(".node")
              .data(data.nodes)
              .enter().append("g")
              .attr("class", "node")
              .attr("id", function(d) {return d.name.replace(/\./g, '').replace(/\s+/g,'') + "g";}) //create id for button selection
              .attr("transform", function(d) { return "translate(" + (width-d.x) + "," + d.y + ")"; })
              .call(d3.behavior.drag()                                                              // call drag function
              .origin(function(d) { return d; })
              .on("dragstart", function() { this.parentNode.appendChild(this); })
              .on("drag", dragmove))
//              .on("mouseover", fade(0.2))
//              .on("mouseout", fade(1))
              ;
              
//End of Adding in the nodes
 
//Add the circles for the nodes, temporarily keep the codes incase we would like to have nodes instead of icons
//Use icons to present Primes, Servers & Systems
node//.append("circle")                           // replace the default rectangles with circles
    //.attr("cy", function(d) { return d.dy/2; })
    //.attr("cx", sankey.nodeWidth()/2)
    //.attr("r",6)
    .append("image")
    .attr("xlink:href", function(d){
      if(d.type === "Root"){return "https://4ynpia.dm2302.livefilestore.com/y2pp4j9Lj5mcSmhLE5eZRcRbR_Yaq0jiOcA72EwFAuH5kuNdzhrHdtyAvUgREdbzXDzN6-NrWP4Ku9PZ2hol_z_QK9ieYOPQPjZo5-T3HDqMdEPiFpQJ3Hqgq9vwF2bIu8d0O7hMUciHSCaYDLDjU13KvEkpaCP5-8SmsofPgvtV-A/tools.png?psid=1";} 
      else if (d.to === "Root-LV1" ){return "https://4ynpia.dm2302.livefilestore.com/y2pukaJssubyiGNC8i4oDSmJzfw_T6HrYUsEFRp-ZRDPZPvGJ0jY-E_6T0VBSa2v78mYtUiaE1WVLVJVQTVhE4_gP9aFa8CvO522AGLlhAk5_VAOzg8HQCyzo-rSUkDEWBInxCeZKglqXMzjuEtO9pPgj-NNfo3Yh9ylMcXXPcrXJI/document.png?psid=1";}
      else if (d.to === "Root-LV2" ){return "https://4ynpia.dm2302.livefilestore.com/y2pSmahpyihklyx5K8xrgYHnGnsA1nJZqCrYsMLjLgg6nuTsslnWRQUZ7ptT10YJt_xd6ztx0_Pd5trjrEpGJiGrMBU9W6GPm75ih4as5E890BUUqvyM0_WffYbS1LM98LpXFRQ1GV3ZpVVylmcHoP51sr5KHQEdFB5FcZuFyEv8r4/browser.png?psid=1";}
    })
    .attr("x", sankey.nodeWidth()/2 - 8)            //Adjust position of icon
    .attr("y", function(d) { return d.dy/2 - 15; }) //Adjust position of icon
    .attr("width", 30)                              //Size of icon
    .attr("height", 30)                             //Size of icon
    .attr("id", function(d) {return d.name.replace(/\./g, '').replace(/\s+/g,'') + "node";})
    .style("stroke",function(d){return color(d.group);})
    .style("fill",function(d){return color(d.group);})
//add in and edit tooltip
//Since prime has different variables, set variable list for prime
    .on("mouseover", function(d) {                  // use css to create the tooltip message box
        if (d.type === "Root"){                // prime has different variable names with these of server & system
             div.html(                        
                    "</br>" + 
                    "Name: " + d.name + 
                    "</br>" + "</br>" +
                    "Type: " + d.objectType + "</br>" + "</br>" +
                    '<a href= "http://d3js.org" target="_blank">' + '<font color = "white">' + '<u>' + "d3js.org" + '</u>' + "</a>" )
                //.style("left", (d3.event.pageX + 12) + "px") // move with mouse
                .style("left", height/6 + "px")                     // fixed position tooltip
                //.style("top", (d3.event.pageY - 28 + "px");
                //.style("top",  740 + "px")                       //Set top in css to change with/without info text
                .style("background", color(d.group))
                .style("opacity", 0.7);    
                                 }
        else{    
             div.html( 
                    "</br>" +
                    "Name: " + d.name + "</br>" + "</br>" +
                    "Type: " + d.to + "</br>" + "</br>" +
                    '<a href= "http://d3js.org" target="_blank">' + '<font color = "white">' + '<u>' + "d3js.org" + '</u>' + "</a>" )
                      
                //.style("left", (d3.event.pageX + 12) + "px") // move with mouse
                .style("left", height/6 + "px")                     // fixed position tooltip
                //.style("top", (d3.event.pageY - 28 + "px");
                //.style("top",  740 + "px")                        //Set top in css to change with/without info text
                .style("background", color(d.group))
                .style("opacity", 0.7);
            }
      });
      //.on("mouseout", function(d){            //tooltip box will disappear when mouseout
      //  div.html("</br>")                     
      //     .style("background", "white")
      //     .style("opacity",0);
      //});
//End of circle of nodes and tooltip
      
// Add in the titles for the nodes
node.append("text")
    .attr("x", 50)
    .attr("y", function(d) { return d.dy / 2 - 15; })
//    .attr("y", 0)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + -195 + ", " + 130 + ")rotate(300)")
    .text(function(d) { return d.name; })
//45 degree text
    .filter(function(d) { return d.name !== "Root1" })
    .attr("x", -10 )
    .attr("y", 25)
    .attr("text-anchor", "start")
    .attr("transform", "rotate(300)");
//End of nodes titles

//function to move the nodes      
function dragmove(d) {
  if( d3.select("#hideAll").attr("data-clicked") == "1"  ){
    d3.select(this)
      //.filter(function(d){return d.to === "server";})
      .attr("transform", "translate(" 
                         + (width-(d.x = Math.max(0, Math.min(width - d.dx, width-d3.event.x))))
                         + "," 
                         + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
    sankey.relayout();
    link.attr("d", path);
  }else{
     d3.select(this).attr("transform", "translate(" 
                         + (width-d.x )
                         + "," 
                         + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
    sankey.relayout();
    link.attr("d", path);
  }
}
//End of drag function 


/*
//function to highlight the path of related nodes
function fade(opacity) {
    return function(g, i) {
        svg.selectAll(".node")
           .filter(function(d) { return d.name != data.nodes[i].name })
           .transition()
           .style("opacity", 1);

        svg.selectAll(".link")
           .filter(function(d) { return d.source.name != data.nodes[i].name && d.target.name != data.nodes[i].name })
           .transition()
           .style("opacity",opacity);
    };
}
//End of highlight function
*/
});
//End of d3.json data import function