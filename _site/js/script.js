var totalDiv = document.getElementById('totalDiv')
	var boxWidth = 40;

// Set some variables
var width = parseInt(d3.select("#master_container").style("width")),
  height = width / 2;

var projection = d3.geo.albersUsa();

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

var imgWidth = 50;
var imgHeight = 50;

(function ($) { 

// load some data
// d3.json("/sites/prod/files/us_93_02_v3.json", function(error, us) {
d3.json("js/wind_vision_v9.json", function(error, us) {
	if (error) return console.error(error);

	var TheData = topojson.feature(us, us.objects.us_10m).features		

		// Do something on the click of selector
		
		$('.year').click(function(e) {
			if (m === 1) {
				$('.rpt2 span img').attr('src', 'img/mediaButtons_play.png');				
				m-=1;
			};

			clearInterval(play);
			var width = parseInt(d3.select("#master_container").style("width"));
			$('.year').removeClass('active');
			$(this).addClass('active');
			i =  Number($(this).attr("idnum"));
			BuildBubbles(width);
			console.log("you selected the year, at index: " + i)
			console.log("this is m: " + m)
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
				console.log('you cleared the interval in "pause"')
			} else {
				console.log('end of loop and rebiginng')
				$('.rpt2 span img').attr('src', 'img/mediaButtons_pause.png'); //restart at the beginning??
				i = 0;
				play = setInterval(mechanic,1000);	
				// here i want to reset the variables to i=0 m=0
			}		
			console.log('you hit pause at: ' + i)		
		}




		var data2 = topojson.feature(us, us.objects.us_10m).features

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
	    .data(topojson.feature(us, us.objects.us_10m).features)
	    .enter().append("path")
	      .attr("class", function(d) {return "state " + d.id; });

	      //this is building of the USA shape
		svg.append("path")
	    .datum(topojson.mesh(us, us.objects.us_10m, function(a,b) {return a !== b;}))
	    .attr("class", "state-boundary");

		var bubblediv = svg.append("g")
			.attr("class", "bubbles")

	      //build the bubbles for all data
		bubblediv.selectAll("circle")
			.data(topojson.feature(us, us.objects.us_10m).features)
			.enter().append("circle")
			.attr("class", "bubble")   	

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
					.scale(width * 1.2)
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

			// create the legend
			legend.append("circle")

	    legend.append("text")
	      .attr("dy", "1.3em")
	      .text(d3.format(".1s"));

	    // legend.append("text")
	    //     .text("Btu")
	    //     .attr("transform", "translate(" + (width - (radius2(10000) + 10)) + "," + (height - 10) + ")");      			

			var lgspot = [(path.centroid(TheData[29])[0] + (width / 7)),(path.centroid(TheData[29])[1] + (width / 20))] //using louisiana as reference

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

	    // resize paths of states
			svg.selectAll('path.state')
	    	.attr("d", path);

	  	svg.selectAll('path.state-boundary')
	  		.attr("d", path);
			
			//define here instead of there because if global resets it to 0 automatically which is NOT good :)
			var type = typeArray[k] // where to start
			// console.log(type)
			BuildBubbles(width, type);
		}
		
		// Tooltips section goes here

		function BuildBubbles(w, type) {		

			// var gotype = $(this).attr('data-year');
			
			//Set the new active category before the build, then you just rebuild the new one
			var gotype = $('.active').attr('data-year');

		     if (gotype == "00") { var k = 0; var gotypename = "2000"} 
		else if (gotype == "10") { var k = 1; var gotypename = "2010"} 
		else if (gotype == "13") { var k = 2; var gotypename = "2013"} 
		else if (gotype == "20") { var k = 3; var gotypename = "2020"} 
		else if (gotype == "30") { var k = 4; var gotypename = "2030"} 
		else if (gotype == "50") { var k = 5; var gotypename = "2050"} 
		else { var k = 0; var gotypename = "fart"}

// need to add in Biofuels

			var type = typeArray[k]

			// d3.selectAll(".sly").remove();

			// var USA = "100"

			// // Redo the header info
			// totalDiv.innerHTML = '<h2>' + gotypename + '</h2><h3>' + USA + ' Trillion BTU</h3>'

			// redifine the radius of circles
			var radius = d3.scale.sqrt()  
				.domain([0, 5])
				.range([(2), (w / 45)]); 

      // var data_array = [        
      //   {type: "Coal", value: data.properties.coal, x:centroid_adjusted[0], y:centroid_adjusted[1]},
      //   {type: "Crude", value: data.properties.crude, x:centroid_adjusted[0], y:centroid_adjusted[1]}
      //   ]

		// This is a loop
			svg.selectAll("circle.bubble")
	  		.data(topojson.feature(us, us.objects.us_10m).features)	        
		      .attr("transform", function(d) { 
		        return "translate(" + path.centroid(d) + ")"; })
		      .attr("r", function(d) { 		
		      	// var raw = d.properties[type]
		      	var raw = Number(d.properties[type[0]]) + Number(d.properties[type[1]])
		      	// var raw = Number(d.properties[type[0]]);
		      	// var raw = Number(d.properties[type[1]])

		      	// We exclude all numbers smaller than 0.1 GW!
		      	if (raw < 0.1) {
		      	} else {
		      		return radius(raw);
		      	};						        
		      })
		      .attr("text", function(d){ return d.properties.id});		

			var margin	= w / 20;
			// var barWidth = w - margin*2 - 50;

			var boxWidth = 40;
			var boxMargin = margin*1.5;
			var boxSegment = 3*boxWidth + (boxMargin);
			var barWidth = w - margin - boxSegment;
			var barPoint = margin + ((barWidth / num)*i)

		// svg
		// 	// .append("g")
	 //      .append("path")
	 //      .attr("d", d3.svg.symbol().type("triangle-up"))
	 //     	.attr("id", "slideTriangle")
	 //      .attr("class", "sly")
	 //      .attr("transform", function() { 
		//         return "translate("+ (barPoint + 1) +",24)"; })
	 //        .attr("width", 45)
	 //        .attr("height", 20);	      	        
  //     // .attr("d", d3.svg.symbol().type("triangle-up"))

		// svg
	 //      .append("text")
	 //      .attr("class","tip-text sly")
	 //      .text(function(d){
	 //          return i + 1993         
	 //      })
	 //      .attr("transform", function() { 
	 //        return "translate("+ barPoint +",43)"; });	

		} //end bubbles function

	// create the tooltip
	function tooltip(d) {         
		var gotype = $("select").val()

		     if (gotype == "00") { var k = 0; var gotypename = "2000"} 
		else if (gotype == "10") { var k = 1; var gotypename = "2010"} 
		else if (gotype == "13") { var k = 2; var gotypename = "2013"} 
		else if (gotype == "20") { var k = 3; var gotypename = "2020"} 
		else if (gotype == "30") { var k = 4; var gotypename = "2030"} 
		else if (gotype == "50") { var k = 5; var gotypename = "2050"} 
		else { var k = 0; var gotypename = "fart"}

		var type = typeArray[k]

		// grab the width to define breakpoints
		width = parseInt(d3.select("#master_container").style("width"))

		// Remove everything and start over.
    d3.selectAll(".tool").remove();

    

// store the data
	var data = d;
    if (this.className.animVal != "bubble" ) {
    	centroid = [(this.transform.animVal[0].matrix.e), (this.transform.animVal[0].matrix.f)]    	
    	toolName = this.innerHTML;
    	if (toolName === "Gulf of Mexico") {
    		j = 0;
    	}
    	else if (toolName === "Pacific") {
   			j = 1;
    	};    	
    	raw = offshore[j][type] / 1000;
    } else {
    	centroid = path.centroid(data);
    	toolName = data.properties.name;       
    	raw = data.properties[type]    
    };
   
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
        .attr("height", (55))
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
        return gotypename + ":";
      })
      .attr("x",0)
      .attr("y",0);

    toolbody.append("tspan")
      .text(function(d){
               
        return raw + " Trillion Btu";
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
	}

		// begin looping stuff
		var num	= 6; //number of iterations, i.e. years		
		var i = 1; // which year you are on when you start 
		// var k = 1; // which type of data you are looking at (total vs crude, etc)
		var play;

		var m=0;

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
				console.log('you cleared the interval in "pause"')
			} else {
				console.log('end of loop and rebiginng')
				$('.rpt2 span img').attr('src', 'img/mediaButtons_pause.png'); //restart at the beginning??
				i = 0;
				play = setInterval(mechanic,1000);	
				// here i want to reset the variables to i=0 m=0
			}		
			console.log('you hit pause at: ' + i)		
		}

		// what to do each iteration
		function mechanic() {			
			i += 1;		
			rebuildLoop(i);
			if (i === num) {							
				$('.rpt2 span img').attr('src', 'img/mediaButtons_redo.png');				
				clearInterval(play);		 
				console.log('you cleared the interval by reaching the end of mechanic')
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
				$('.year').removeClass('active');
				$('.year:first-child').addClass('active')							
			} else {
				$('.active').next().addClass('active2')
				$('.year').removeClass('active');
				$('.active2').addClass('active');
				$('.active').removeClass('active2');
			};


			// $(this).addClass('active');
			BuildBubbles(width);

			console.log('rebuildloop is at: ' + i)
			// BuildBubbles(width, type)
		}
		
		// initial run
	  resize(); 	    		  

	  // start looping
	  // start(); 

	  d3.select(window).on('resize', resize); 
	  d3.selectAll("circle.bubble").on('click', tooltip);
	  $('.rpt2').click(function(e) {
	  	pause();
	  });


	  //function to add commas
		function numberWithCommas(x) {
		  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

}); //end states.json
		}(jQuery));  

// var start1 = new Date().getTime()			
			// var elapsed = new Date().getTime() - start1;
			// console.log(elapsed)			