var totalDiv = document.getElementById('totalDiv')
var boxWidth = 40;

// Set some variables
var width = parseInt(d3.select("#master_container").style("width")),
  height = width / 2;

var projection = d3.geo.albers();

var path = d3.geo.path()
	.projection(projection);

var svg = d3.select("#map_container")
  .attr("width", width)
  .attr("height", height);

var radius = d3.scale.sqrt()  
	.domain([0, 24500])
	.range([(5), (width / 15)]); 

//change
var legend = svg.append("g")
  .attr("class", "legend")    
  .selectAll("g")
	.data([2000, 10000, 20000])
	.enter().append("g");

// change
var legend2 = svg.append("g")
	.attr("class", "legend2")
	.selectAll("g")
	.data(["Distributed PV","Utility","CSP"])
	.enter().append("g")

var imgWidth = 50;
var imgHeight = 50;

// change
// Pie chart colors 
var color = d3.scale.ordinal()
    .range(["#FC3903", "#FC7F03","#FFAB03"]);
// Tomato FF6347
// Neon Blue 00eeee
// DOE pink E7227E
// DOE light blue 226 19A9E2
// DOE Green 8BCC00

// Other Pie chart parameters
var arc = d3.svg.arc()
  .outerRadius(function(d){    	
    	var x = Number(d.data.value) + Number(d.data.other)
      return radius(x); 
  })
  .innerRadius(0);

var pie = d3.layout.pie()
  .sort(null)
  .value(function(d){ 
      return Number(d.value);
  });

// add the bar chart parameters
var x = d3.scale.ordinal()
    .rangeRoundBands([0, (width/3)], .1);

var y = d3.scale.linear()
    .rangeRound([(height), (height/2)]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));


(function ($) { 
// load some data
// d3.json("/sites/prod/files/wind_vision_50m_contiguous.json", function(error, us) {

// change
// d3.json("js/wind_vision_50m_contiguous.json", function(error, us) {
d3.json("data/sunshot_vision_1.json", function(error, us) {
	if (error) return console.error(error);
d3.csv("js/totals.csv", function(error, totals) {	
	if (error) return console.error(error);

 color.domain(d3.keys(totals[0]).filter(function(key) { return key !== "Year"; }));

 	// Make the break points for each bar amount
  totals.forEach(function(d) {
    var y0 = 0;
    d.megawatts = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.megawatts[d.megawatts.length - 1].y1;
  });

  x.domain(totals.map(function(d) { return d.Year; }));
  y.domain([0, d3.max(totals, function(d) { return d.total; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("x",(-height/2))
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("megawatts");

// change
	var TheData = topojson.feature(us, us.objects.us_50m_sunshot).features		

		// Do something on the click of selector
		
		$('.year').click(function(e) {
			if (m === 1) {
				$('.rpt2 span img').attr('src', 'img/mediaButtons_play.png');				
				m-=1;
			};
			clearInterval(play);
			var width = parseInt(d3.select("#master_container").style("width"));
			$('.year').removeClass('activea');
			$(this).addClass('activea');
			i =  Number($(this).attr("idnum"));
			BuildBubbles(width);
		});	

		function pause() {

			if (m === 0 && i != num) {				
				$('.rpt2 span img').attr('src', 'img/mediaButtons_pause.png');				
				m+=1;
				play = setInterval(mechanic,1000);	
				// clearInterval(play);		 
			} else if (m === 1 && i != num) {
				$('.rpt2 span img').attr('src', 'img/mediaButtons_play.png');				
				m-=1;
				// play = setInterval(mechanic,1000);
				clearInterval(play);	
			} else {
				$('.rpt2 span img').attr('src', 'img/mediaButtons_pause.png'); //restart at the beginning??
				i = 0;
				play = setInterval(mechanic,1000);	
				// here i want to reset the variables to i=0 m=0
			}		
		}

// change 1
// preload the data and sort it for year 2020
		var data2 = topojson.feature(us, us.objects.us_50m_sunshot).features;

// turn numbers into numbers from strings, remove commas too
		data2.forEach(function(i){
			for (var u in i.properties){				
				if (u != "name") {
					i.properties[u] = parseFloat(i.properties[u].replace(/,/g, ''));
				};				
			}
		});

		data2.sort(function(a, b) { 
			var raw1 = a.properties.distPV2020 + a.properties.utilityPV2020 + a.properties.csp2020;
	  	var raw2 = b.properties.distPV2020 + b.properties.utilityPV2020 + b.properties.csp2020;
			return raw2 - raw1; 
		});

		var totalArray = [0,0,0,0,0,0,0,0,0,0,0,0];
		for (var i = 0; i  < data2.length; i++) { 
			var data3 = data2[i].properties;

			totalArray[0]  = data3.distPV2005 + totalArray[0] ;
			totalArray[1]  = data3.utilityPV2005  + totalArray[1] ;
			totalArray[2]  = data3.csp2005 + totalArray[2] ;

			totalArray[3]  = data3.distPV2010  + totalArray[3] ;
			totalArray[4]  = data3.utilityPV2010 + totalArray[4] ;
			totalArray[5]  = data3.csp2010  + totalArray[5] ;

			totalArray[6]  = data3.distPV2015 + totalArray[6] ;
			totalArray[7]  = data3.utilityPV2015  + totalArray[7] ;
			totalArray[8]  = data3.csp2015 + totalArray[8] ;

			totalArray[9]  = data3.distPV2020  + totalArray[9] ;
			totalArray[10] = data3.utilityPV2020 + totalArray[10];
			totalArray[11] = data3.cspPV2020  + totalArray[11];
		};

		var typeArray = [[],[],[],[]];

// This is where the data names are grouped.
		for (var datapoint in data2[0].properties){
		 	if (datapoint.slice(-2) == "05") {
	 			typeArray[0].push(datapoint)
	 		}
	 		else if (datapoint.slice(-2) == "10") {
	 			typeArray[1].push(datapoint)
	 		}
	 		else if (datapoint.slice(-2) == "15") {
	 			typeArray[2].push(datapoint)
	 		}
	 		else if (datapoint.slice(-2) == "20") {
	 			typeArray[3].push(datapoint)
	 		}
	 	}

		//build a map outside of resize
		svg.selectAll(".state")
	    .data(topojson.feature(us, us.objects.us_50m_sunshot).features)
	    .enter().append("path")
	      .attr("class", function(d) {return "state " + d.id; });

	      //this is building of the USA shape
		svg.append("path")
	    .datum(topojson.mesh(us, us.objects.us_50m_sunshot, function(a,b) {return a !== b;}))
	    .attr("class", "state-boundary");

// build the bubbles/pies outside of the loop so that when you rebuild, 
// you are replacing the existing, not creating all new

		// var bubblediv = svg.append("g")
		// 	.attr("class", "bubbles")

	 //      //build the bubbles for all data
		// bubblediv.selectAll("circle")
		// 	.data(topojson.feature(us, us.objects.us_50m_sunshot).features)
		// 	.enter().append("circle")
		// 	.attr("class", "bubble")   	

		// Resize function
		function resize() {			
			//for first load????
			if (k = "undefined") { k = 0;};

			d3.selectAll(".lg").remove();

			// resize width
			var width = parseInt(d3.select("#master_container").style("width")),
		    height = width / 2;

			// resize projection
		  // Smaller viewport
			if (width <= 800) {
				projection
					.scale(width * 1.05)
					.translate([width / 2, ((height / 2) + 45)])             
			} else if (width <= 900) {
				projection
					.scale(width * 1.2)
					.translate([width / 2, ((height / 2) + 30)])  
			} 

			// full viewport
			else {
				projection
					.scale(width)
					.translate([width / 2, ((height / 2) + 10)])   
			};	    

			var margin	= width / 20;
			var top = 10;
			var left = margin;
			var boxWidth = 40;
			var boxMargin = margin*1.5;
			var boxSegment = 3*boxWidth + (boxMargin);
			var barWidth = width - margin - boxSegment;   

			var radius = d3.scale.linear()  
				.domain([0, 34500])
				.range([(5), (width / 15)]); 

			var arc = d3.svg.arc()
			  .outerRadius(function(d){    	
			    	var x = Number(d.data.value) + Number(d.data.other)
			      return radius(x); 
			  })
			  .innerRadius(0);
	    
	    // resize paths of states
			svg.selectAll('path.state')
	    	.attr("d", path);

	  	svg.selectAll('path.state-boundary')
	  		.attr("d", path);

			// create the legend
			legend.append("circle")

	    legend.append("text")
	      .attr("dy", "1.3em")
	      .text(d3.format(".1s"))
	      // .text(function(d){return d});


	      // hang the legend based on louisiana's location
			var lgspot = [(path.centroid(TheData[8])[0] + (width / 10)),(path.centroid(TheData[8])[1] + (width / 5))] //using louisiana as reference

			legend        
				// .attr("transform", "translate(" + (width - (radius(10000) + 10)) + "," + (height + 30) + ")");
				.attr("transform", function(d) { 
	        return "translate(" + lgspot + ")"; });

	    legend.selectAll("circle")
	    	.attr("class","lg")
	      .attr("cy", function(d) { return -radius(d); })
	      .attr("r", radius);

	    legend.selectAll("text")
	    	.attr("class","lg")
	      .attr("y", function(d) { return -2 * radius(d); }); 

      var legendText = svg.append("g")
			.attr("class", "legendText lg")
			.append("text")
			.attr("dy", "1.3em")		  
		  .attr("text-anchor","middle")
		  .attr("fill","rgb(51,51,51)")
			.attr("transform", function(d) { 
	        return "translate(" + lgspot + ")"; });		  

		  legendText.append("tspan")
		  	.text("Solar Power Capacity")
		  	.attr("x",0)
	      .attr("y",0);

		  legendText.append("tspan")
		  	.text("In Gigawatts (GW)")
		  	.attr("x",0)
	      .attr("y",25);

// hang the legend2 based on upper right
			var lgspot2 = [(radius(20000)+25), 25];
			var lgspot3 = [(radius(20000)+25), (35 + (radius(5000) * 2))];
			var lgspot4 = [(radius(20000)+25), (100 + (radius(5000) * 2))];
			
			var legend2Text = svg.append("g")
				.attr("class", "legend2Text lg")
				.append("text")
				.attr("dy", "1.3em")			  
			  .attr("text-anchor","middle")

			  legend2Text.append("tspan")
			  .text("SOLAR POWER")
			  .attr("x", function(d) { return  (radius(20000)+25) })
			  .attr("y", 0); 

			  legend2Text.append("tspan")
			  .text("TYPE")
			  .attr("x", function(d) { return  (radius(20000)+25) })
			  .attr("y", 30); 

			// add a second legend for the colors
			legend2.append("circle")

	    legend2.append("text")
	      .attr("dy", "1.3em")
	      .text(function(d){
	      	return d;
	      })
	      .attr("text-anchor","middle")
	      .attr("y", function(d) { return  radius(10000)/2 })
	      .attr("x", "0"); 
	      
			legend2        
				.attr("transform", function(d) { 
					if (d === "Distributed PV") {
						return "translate(" + lgspot2 + ")"; 
					} else if (d === "CSP"){
						return "translate(" + lgspot3 + ")"; 
					} else {
						return "translate(" + lgspot4 + ")"; 
					}
				});	        

	    legend2.selectAll("circle")
	    	.attr("class","lg")
	    	.attr("cy","40")
	      .attr("r", function(d) { return radius(10000); })
	      .attr("stroke", "#fff")
	      .attr("fill", function(d) {
	      	if (d === "Distributed PV") {
		    		return "#FC3903"
		    	} else if (d === "CSP"){
		    		return "#FC7F03"
		    	} else {
		    		return "#FFAB03"
		    	};	      	
	      });

	    legend2.selectAll("text")
	    	.attr("class","lg")
	      .attr("fill","rgb(51,51,51)"); 
			
			//define here instead of there because if global resets it to 0 automatically which is NOT good :)
			var type = typeArray[k] // where to start
			BuildBubbles(width, type);
		}		

		function BuildBubbles(w, type) {		

			// remove the pies and tools for next build
			d3.selectAll(".arc").remove();
			d3.selectAll(".tool").remove();
			d3.select("#piebox").remove();
			
			//Set the new activea category before the build, then you just rebuild the new one
			var gotype = $('.activea').attr('datayear');

		     if (gotype == "05") { var k = 0; var gotypename = "2005"; var statesnum = "21" ; var increase = 0; var prev_year = "2000"} 
		else if (gotype == "10") { var k = 1; var gotypename = "2010"; var statesnum = "39"; var increase = 37.73; var prev_year = "2005"} 
		else if (gotype == "15") { var k = 2; var gotypename = "2015"; var statesnum = "46"; var increase = 20.84; var prev_year = "2010"} 
		else if (gotype == "20") { var k = 3; var gotypename = "2020"; var statesnum = "46"; var increase = 52.31; var prev_year = "2015"} 		

			var type = typeArray[k]

			// console.log(typeArray)

			// Redo the header info
			var USA = Math.round((totalArray[(k*2)]+totalArray[(k*2 + 1)]) * 100) / 100;

			if (gotypename === "2000") {
				totalDiv.innerHTML = '<h2>Total Solar Capacity Installed in ' + gotypename + '</h2><h3>' + USA + ' GW across ' + statesnum + ' states</h3>';			
			} else if (gotypename < 2014) {
				totalDiv.innerHTML = '<h2>Total Solar Capacity Installed in ' + gotypename + '</h2><h3>' + USA + ' GW across ' + statesnum + ' states</h3><h4>An increase of <span class="green">' + increase + ' GW</span> since ' + prev_year + '</h4>';			
			} else {
				totalDiv.innerHTML = '<h2>Total Solar Capacity Projected in ' + gotypename + '</h2><h3>' + USA + ' GW across ' + statesnum + ' states</h3><h4>An increase of <span class="green">' + increase + ' GW</span> since ' + prev_year + '</h4>';		
			};
			
			// redifine the radius of circles
			var radius = d3.scale.sqrt()  
				.domain([0, 24500])
				.range([(5), (w / 15)]); 

			var arc = d3.svg.arc()
			  .outerRadius(function(d){    	
			  		// console.log(d)
			    	var x = Number(d.data.value) + Number(d.data.other)			    	
			      return radius(x); 
			  })
			  .innerRadius(0);

			//add a general box to add the pies into
			var piebox = svg
      .append("g")
      .attr("id","piebox");    
				
				// This attempts to create the arrays in such a way to avoid throwing errors when the pie
				// chart tries to build a nonexistent slice, i.e. when the slice is 0.
				// This tries to make it so that the array simply doesn't have the "0" pie slice.	
				for (var i = 0; i < data2.length; i++) {					
					centroidPie = path.centroid(data2[i]);

					var data_array = [
							{type: "Distributed PV", name:data2[i].properties.name,value: +data2[i].properties[type[0]], other: (+data2[i].properties[type[1]] + +data2[i].properties[type[2]]), x:centroidPie[0], y:centroidPie[1]},
	        		{type: "Utility Scale PV", name:data2[i].properties.name,value: +data2[i].properties[type[1]], other: (+data2[i].properties[type[0]] + +data2[i].properties[type[2]]), x:centroidPie[0], y:centroidPie[1]},
	        		{type: "CSP", name:data2[i].properties.name,value: +data2[i].properties[type[2]], other: (+data2[i].properties[type[0]] + +data2[i].properties[type[1]]), x:centroidPie[0], y:centroidPie[1]}
						];				

					//Build the pie in D3 create a pie box for this particular state's pie
					thisPie = piebox.append("g")

					//Add this pie to the above
					var g = thisPie.selectAll(".arc" )
          .data(pie(data_array))
        		.enter().append("g")        		
	          .attr("class", "arc")
	          .attr("transform", function(d) { 
	          	if (d.value != 0) {
	          		return "translate(" + path.centroid(data2[i]) + ")"; 	
	          	};	                    		
        		})
        		.on("click", arctip);
					
					g.append("path")
	        .attr("d", arc)
	        .style("fill", function(d) { 
	        	return color(d.data.type); });

				};

			var margin	= w / 20;
			// var barWidth = w - margin*2 - 50;

			var boxWidth = 40;
			var boxMargin = margin*1.5;
			var boxSegment = 3*boxWidth + (boxMargin);
			var barWidth = w - margin - boxSegment;
			var barPoint = margin + ((barWidth / num)*i)

		} //end bubbles function

	// create the tooltip
	function arctip(d) {     
		var fart = d.data.name;
		// grab the width to define breakpoints
		width = parseInt(d3.select("#master_container").style("width"))

		// Remove everything and start over.
    d3.selectAll(".tool").remove();
	    
	  centroid = [(d.data.x),(d.data.y)];

		toolName = d.data.name;       
		valuetip = Number(d.value);
		other = Number(d.data.other);
	  typetip = d.data.type

    // where it hangs based on view size
    if (width > 900) {
      if (centroid[1] < 250) {
        centroid_adjusted = [(centroid[0]-85),(centroid[1]+25)];
      } else {
        centroid_adjusted = [(centroid[0]-85),(centroid[1]-80)];
      };        
    }
    else if (width > 700) {  
      if (centroid[1] < 225) {
        centroid_adjusted = [(centroid[0]-85),(centroid[1]+25)];
      } else {
        centroid_adjusted = [(centroid[0]-85),(centroid[1]-80)];
      };
    }
    else if (width > 480) {
      if (centroid[0] < width / 2) {
        centroid_adjusted = [(width - 175),(5)];        
      } else {
        centroid_adjusted = [(5),(5)];               
      };
    } else {
      if (centroid[0] < 200) {
        centroid_adjusted = [(width - 175),(5)];        
      } else {
        centroid_adjusted = [(5),(5)];               
      };
    };    

    // where it hangs within the tip
    tip_text  = [(centroid_adjusted[0] + 80 + 5),(centroid_adjusted[1] + 20)];
    tip_text2  = [(centroid_adjusted[0] + 80 + 5),(centroid_adjusted[1] + 35)];
    tip_close = [(centroid_adjusted[0] + 80*2),(centroid_adjusted[1]+(15))];

    // build the rectangle
    var tooltipContainer = svg.append("g")
      .attr("id", "tooltip")
      .attr("class", "tool")
      .append("rect")
        // .attr("id", "tooltip")
        .attr("transform", function() { 
          return "translate(" + centroid_adjusted + ")"; })
        .attr("width", (170))
        .attr("height", (58))
        .attr("rx", 6)
        .attr("ry", 6)
  	
  	// tip texts
    svg
      .append("text")
      .attr("class","tip-text tool")
      .text(function(d){
          return toolName;
      })
      .attr("transform", function() { 
        return "translate(" + tip_text + ")"; });

    var toolbody = svg
      .append("text")
      .attr("class","tip-text2 tool")
      .attr("transform", function() { 
        return "translate(" + tip_text2 + ")"; });

    toolbody.append("tspan")
      .text(function(d){
        return "Total: " + Math.round((valuetip+other)*100)/100 + " GW";
      })
      .attr("x",0)
      .attr("y",0);

    toolbody.append("tspan")
      .text(function(d){              
        return typetip + ": " + valuetip + " GW";
      })
      .attr("fill", function(d){
      	if (typetip === "Distributed PV") {
      		return "#61AD00"
      	} else{
      		return "#19A9E2"
      	};
      		
      })
      .attr("x",0)
      .attr("y",15);

    svg.append("g")
      .attr("class", "closer tool")
      .attr("transform", function(){
        return "translate(" + tip_close + ")";
      })
        .append("text")
        .attr("class", "tip-text2 tool")
        .text("X").on("click", function(){
        	d3.selectAll(".tool").remove();
        });
	} //end tooltip function

		// begin looping stuff
		var num	= 4; //number of iterations, i.e. years		
		var i = 1; // which year you are on when you start 
		var play;

		var m=1;

		function start() {
			if (play != "undefined") {
				clearInterval(play);	
			};
			
			if (i === num) {
				i -= (num);
			};			
			play = setInterval(mechanic,1000);	
		}

		function pause() {

			if (m === 0 && i != num) {				
				$('.rpt2 span img').attr('src', 'img/mediaButtons_pause.png');				
				m+=1;
				play = setInterval(mechanic,1000);	
				// clearInterval(play);		 
			} else if (m === 1 && i != num) {
				$('.rpt2 span img').attr('src', 'img/mediaButtons_play.png');				
				m-=1;
				// play = setInterval(mechanic,1000);
				clearInterval(play);	
			} else {
				$('.rpt2 span img').attr('src', 'img/mediaButtons_pause.png'); //restart at the beginning??
				i = 0;
				play = setInterval(mechanic,1000);	
				// here i want to reset the variables to i=0 m=0
			}		
		}

		// what to do each iteration
		function mechanic() {			
			i += 1;		
			rebuildLoop(i);
			if (i === num) {							
				$('.rpt2 span img').attr('src', 'img/mediaButtons_redo.png');				
				clearInterval(play);		 
			}									
		}

		function rebuildLoop(i) {			
			// define this type, then send it in
			// var type = typeArray[k]
			
			// Wish I didn't have to go to the window EVERY time we build the bubbles. 
			// Wish i could do it on every change of window, set "globally" till next change...but alas.
			var width = parseInt(d3.select("#master_container").style("width"));			

			//convaluted way to add next and next and next color to lis.			
			if (i === 1) {
				$('.year').removeClass('activea');
				$('.year:first-child').addClass('activea')							
			} else {
				$('.activea').next().addClass('activea2')
				$('.year').removeClass('activea');
				$('.activea2').addClass('activea');
				$('.activea').removeClass('activea2');
			};


			// $(this).addClass('activea');
			BuildBubbles(width);

			// BuildBubbles(width, type)
		}
		
	  // initial run
	  resize(); 	    
	  start();		  

	  d3.select(window).on('resize', resize); 
	  // d3.selectAll("circle.bubble").on('mouseover', tooltip);
	  // d3.selectAll("g.arc").on('click', arctip);      
	  $('.rpt2').click(function(e) {
	  	pause();
	  });
	  // Do something on keystroke of escape....escape == 27.
	  $(document).keyup(function(e) {
		  if (e.keyCode == 27) { 
				d3.selectAll(".tool").remove();		  	
		  }   
		});

	  //function to add commas
		function numberWithCommas(x) {
		  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		var year = svg.selectAll(".year")
      .data(totals)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.Year) + ",0)"; });

  year.selectAll("rect")
      .data(function(d) { return d.megawatts; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1)  ; })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); });
		
}); //end totals.csv
}); //end states.json
}(jQuery));  

