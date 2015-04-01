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
	.domain([0, 5])
	.range([(2), (width / 45)]); 

var legend = svg.append("g")
  .attr("class", "legend")    
  .selectAll("g")
	.data([5, 20, 40])
	.enter().append("g");

var legend2 = svg.append("g")
	.attr("class", "legend2")
	.selectAll("g")
	.data(["Land Based","Offshore"])
	.enter().append("g")

var imgWidth = 50;
var imgHeight = 50;

// Pie chart colors 
var color = d3.scale.ordinal()
    .range(["#8BCC00", "#19A9E2"]);
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


(function ($) { 
// load some data
// d3.json("js/wind_vision_v10.json", function(error, us) {
d3.json("js/wind_vision_50m_contiguous.json", function(error, us) {
	if (error) return console.error(error);

	var TheData = topojson.feature(us, us.objects.us_50m_contiguous).features		

		// Do something on the click of selector
		
		$('.year').click(function(e) {
			if (m === 1) {
				$('.rpt2 span img').attr('src', '/sites/prod/files/mediaButtons_play.png');				
				m-=1;
			};
			clearInterval(play);
			var width = parseInt(d3.select("#master_container").style("width"));
			$('.year').removeClass('activea');
			$(this).addClass('activea');
			i =  Number($(this).attr("idnum"));
			BuildBubbles(width);
			// console.log("you selected the year, at index: " + i)
			// console.log("this is m: " + m)
		});	

		function pause() {

			if (m === 0 && i != num) {				
				$('.rpt2 span img').attr('src', '/sites/prod/files/mediaButtons_pause.png');				
				m+=1;
				play = setInterval(mechanic,1000);	
				// clearInterval(play);		 
			} else if (m === 1 && i != num) {
				$('.rpt2 span img').attr('src', '/sites/prod/files/mediaButtons_play.png');				
				m-=1;
				// play = setInterval(mechanic,1000);
				clearInterval(play);	
				// console.log('you cleared the interval in "pause"')
			} else {
				// console.log('end of loop and rebiginng')
				$('.rpt2 span img').attr('src', '/sites/prod/files/mediaButtons_pause.png'); //restart at the beginning??
				i = 0;
				play = setInterval(mechanic,1000);	
				// here i want to reset the variables to i=0 m=0
			}		
			// console.log('you hit pause at: ' + i)		
		}

// preload the data and sort it for year 2050
		var data2 = topojson.feature(us, us.objects.us_50m_contiguous).features
		.sort(function(a, b) { 
			// return b.properties.Landbased2050 - a.properties.Landbased2050; 
			var raw1 = Number(a.properties.Landbased2050) + Number(a.properties.Offshore2050)
	  	var raw2 = Number(b.properties.Landbased2050) + Number(b.properties.Offshore2050)
			return raw2 - raw1; 
		});

		var totalArray = [0,0,0,0,0,0,0,0,0,0,0,0];
		for (var i = 0; i  < data2.length; i++) { 
			var data3 = data2[i].properties;

			totalArray[0]  = Number(data3.Landbased2000) + Number(totalArray[0]) ;
			totalArray[1]  = Number(data3.Offshore2000)  + Number(totalArray[1]) ;
			totalArray[2]  = Number(data3.Landbased2010) + Number(totalArray[2]) ;
			totalArray[3]  = Number(data3.Offshore2010)  + Number(totalArray[3]) ;
			totalArray[4]  = Number(data3.Landbased2013) + Number(totalArray[4]) ;
			totalArray[5]  = Number(data3.Offshore2013)  + Number(totalArray[5]) ;
			totalArray[6]  = Number(data3.Landbased2020) + Number(totalArray[6]) ;
			totalArray[7]  = Number(data3.Offshore2020)  + Number(totalArray[7]) ;
			totalArray[8]  = Number(data3.Landbased2030) + Number(totalArray[8]) ;
			totalArray[9]  = Number(data3.Offshore2030)  + Number(totalArray[9]) ;
			totalArray[10] = Number(data3.Landbased2050) + Number(totalArray[10]);
			totalArray[11] = Number(data3.Offshore2050)  + Number(totalArray[11]);
		};

		var typeArray = [[],[],[],[],[],[]];

// This is where the data names are grouped.
		for (var datapoint in data2[0].properties){
		 	if (datapoint.slice(-2) == "00") {
	 			typeArray[0].push(datapoint)
	 		}
	 		else if (datapoint.slice(-2) == "10") {
	 			typeArray[1].push(datapoint)
	 		}
	 		else if (datapoint.slice(-2) == "13") {
	 			typeArray[2].push(datapoint)
	 		}
	 		else if (datapoint.slice(-2) == "20") {
	 			typeArray[3].push(datapoint)
	 		}	 		
	 		else if (datapoint.slice(-2) == "30") {
	 			typeArray[4].push(datapoint)
	 		}
	 		else if (datapoint.slice(-2) == "50") {
	 			typeArray[5].push(datapoint)
	 		};
	 	}

		//build a map outside of resize
		svg.selectAll(".state")
	    .data(topojson.feature(us, us.objects.us_50m_contiguous).features)
	    .enter().append("path")
	      .attr("class", function(d) {return "state " + d.id; });

	      //this is building of the USA shape
		svg.append("path")
	    .datum(topojson.mesh(us, us.objects.us_50m_contiguous, function(a,b) {return a !== b;}))
	    .attr("class", "state-boundary");

// build the bubbles/pies outside of the loop so that when you rebuild, 
// you are replacing the existing, not creating all new

		// var bubblediv = svg.append("g")
		// 	.attr("class", "bubbles")

	 //      //build the bubbles for all data
		// bubblediv.selectAll("circle")
		// 	.data(topojson.feature(us, us.objects.us_50m_contiguous).features)
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

			var radius = d3.scale.sqrt()  
				.domain([0, 5])
				.range([(2), (width / 45)]); 

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
	      .text(function(d){return d});

	      // hang the legend based on louisiana's location
			var lgspot = [(path.centroid(TheData[8])[0] + (width / 7)),(path.centroid(TheData[8])[1] + (width / 20))] //using louisiana as reference

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
		  	.text("Wind Power Capacity")
		  	.attr("x",0)
	      .attr("y",0);

		  legendText.append("tspan")
		  	.text("In Gigawatts (GW)")
		  	.attr("x",0)
	      .attr("y",25);

// hang the legend2 based on louisiana's location
			var lgspot2 = [(radius(10)+25), 25];
			var lgspot3 = [(radius(10)+25), (35 + (radius(10) * 2))];
			
			var legend2Text = svg.append("g")
				.attr("class", "legend2Text lg")
				.append("text")
				.attr("dy", "1.3em")			  
			  .attr("text-anchor","middle")

			  legend2Text.append("tspan")
			  .text("WIND POWER")
			  .attr("x", function(d) { return  (radius(10)+25) })
			  .attr("y", 0); 

			  legend2Text.append("tspan")
			  .text("TYPE")
			  .attr("x", function(d) { return  (radius(10)+25) })
			  .attr("y", 30); 

			// add a second legend for the colors
			legend2.append("circle")

	    legend2.append("text")
	      .attr("dy", "1.3em")
	      .text(function(d){
	      	return d;
	      })
	      .attr("text-anchor","middle")
	      .attr("y", function(d) { return  radius(40)/2 })
	      .attr("x", "0"); 
	      
			legend2        
				.attr("transform", function(d) { 
					if (d === "Land Based") {
						return "translate(" + lgspot2 + ")"; 
					} else{
						return "translate(" + lgspot3 + ")"; 
					}
				});	        

	    legend2.selectAll("circle")
	    	.attr("class","lg")
	    	.attr("cy","40")
	      .attr("r", function(d) { return radius(12); })
	      .attr("stroke", "#fff")
	      .attr("fill", function(d) {
	      	if (d === "Land Based") {
		    		return "rgb(185,224,102)"
		    	} else{
		    		return "rgb(116,202,236)"
		    	};	      	
	      });

	    legend2.selectAll("text")
	    	.attr("class","lg")
	      .attr("fill","rgb(51,51,51)"); 
			
			//define here instead of there because if global resets it to 0 automatically which is NOT good :)
			var type = typeArray[k] // where to start
			// console.log(type)
			BuildBubbles(width, type);
		}		

		function BuildBubbles(w, type) {		

			// remove the pies and tools for next build
			d3.selectAll(".arc").remove();
			d3.selectAll(".tool").remove();
			d3.select("#piebox").remove();
			
			//Set the new activea category before the build, then you just rebuild the new one
			var gotype = $('.activea').attr('datayear');

		     if (gotype == "00") { var k = 0; var gotypename = "2000"; var statesnum = "4" ; var increase = 0; var prev_year = "2000"} 
		else if (gotype == "10") { var k = 1; var gotypename = "2010"; var statesnum = "27"; var increase = 37.73; var prev_year = "2000"} 
		else if (gotype == "13") { var k = 2; var gotypename = "2013"; var statesnum = "34"; var increase = 20.84; var prev_year = "2010"} 
		else if (gotype == "20") { var k = 3; var gotypename = "2020"; var statesnum = "36"; var increase = 52.31; var prev_year = "2013"} 
		else if (gotype == "30") { var k = 4; var gotypename = "2030"; var statesnum = "47"; var increase = 110.66; var prev_year = "2020"} 
		else if (gotype == "50") { var k = 5; var gotypename = "2050"; var statesnum = "48"; var increase = 180.15; var prev_year = "2030"};

			var type = typeArray[k]

			// Redo the header info
			var USA = Math.round((totalArray[(k*2)]+totalArray[(k*2 + 1)]) * 100) / 100;

			if (gotypename === "2000") {
				totalDiv.innerHTML = '<h2>Total Energy Produced in ' + gotypename + '</h2><h3>' + USA + ' GW across ' + statesnum + ' states</h3>';			
			} else if (gotypename < 2014) {
				totalDiv.innerHTML = '<h2>Total Energy Produced in ' + gotypename + '</h2><h3>' + USA + ' GW across ' + statesnum + ' states</h3><h4>An increase of <span class="green">' + increase + ' GW</span> since ' + prev_year + '</h4>';			
			} else {
				totalDiv.innerHTML = '<h2>Total Energy Projected in ' + gotypename + '</h2><h3>' + USA + ' GW across ' + statesnum + ' states</h3><h4>An increase of <span class="green">' + increase + ' GW</span> since ' + prev_year + '</h4>';		
			};
			
			// redifine the radius of circles
			var radius = d3.scale.sqrt()  
				.domain([0, 5])
				.range([(2), (w / 45)]); 

			var arc = d3.svg.arc()
			  .outerRadius(function(d){    	
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
					if (data2[i].properties[type[0]] < 0.1 && data2[i].properties[type[1]] < 0.1) {
						data_array = [];
					} else if (data2[i].properties[type[0]] < 0.1) {						
						var data_array = [
	        		{type: "Offshore", name:data2[i].properties.name,value: data2[i].properties[type[1]], other: data2[i].properties[type[0]], x:centroidPie[0], y:centroidPie[1]}
						];
					} else if (data2[i].properties[type[1]] < 0.1)  {
						var data_array = [
							{type: "Land Based", name:data2[i].properties.name,value: data2[i].properties[type[0]], other: data2[i].properties[type[1]], x:centroidPie[0], y:centroidPie[1]}
						];
					} else {						
						var data_array = [
							{type: "Land Based", name:data2[i].properties.name,value: data2[i].properties[type[0]], other: data2[i].properties[type[1]], x:centroidPie[0], y:centroidPie[1]},
	        		{type: "Offshore", name:data2[i].properties.name,value: data2[i].properties[type[1]], other: data2[i].properties[type[0]], x:centroidPie[0], y:centroidPie[1]}
						];
					};
					
					// console.log(data_array)

					//Build the pie in D3 create a pie box for this particular state's pie
					thisPie = piebox.append("g")

					//Add this pie to the above
					var g = thisPie.selectAll(".arc" )
          .data(pie(data_array))
        		.enter().append("g")        		
	          .attr("class", "arc")
	          .attr("transform", function() { 
          		return "translate(" + path.centroid(data2[i]) + ")"; 
        		})
        		.on("click", arctip);
					
					g.append("path")
	        .attr("d", arc)
	        .style("fill", function(d) { return color(d.data.type); });

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
      	if (typetip === "Land Based") {
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
		var num	= 6; //number of iterations, i.e. years		
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
				$('.rpt2 span img').attr('src', '/sites/prod/files/mediaButtons_pause.png');				
				m+=1;
				play = setInterval(mechanic,1000);	
				// clearInterval(play);		 
			} else if (m === 1 && i != num) {
				$('.rpt2 span img').attr('src', '/sites/prod/files/mediaButtons_play.png');				
				m-=1;
				// play = setInterval(mechanic,1000);
				clearInterval(play);	
				// console.log('you cleared the interval in "pause"')
			} else {
				// console.log('end of loop and rebiginng')
				$('.rpt2 span img').attr('src', '/sites/prod/files/mediaButtons_pause.png'); //restart at the beginning??
				i = 0;
				play = setInterval(mechanic,1000);	
				// here i want to reset the variables to i=0 m=0
			}		
			// console.log('you hit pause at: ' + i)		
		}

		// what to do each iteration
		function mechanic() {			
			i += 1;		
			rebuildLoop(i);
			if (i === num) {							
				$('.rpt2 span img').attr('src', '/sites/prod/files/mediaButtons_redo.png');				
				clearInterval(play);		 
				// console.log('you cleared the interval by reaching the end of mechanic')
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

			// console.log('rebuildloop is at: ' + i)
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
}); //end states.json
		}(jQuery));  

