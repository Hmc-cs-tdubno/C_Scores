var margin = {top: 20, right: 70, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    padding = 50;

 function drawBarGraph () {
    // set the ranges
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    // add the SVG element
    var svg = d3.select("#bargraph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(responsivefy)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Keep track of largest frequency for setting axis ticks
    var maxfreq = 0

    var data = d3.json("http://localhost:3000/api/bar",function(data){
      data.data.forEach(function(d){
        d.style = d.style;
        d.freq = +d.freq;
        if (d.freq > maxfreq) {
          maxfreq = d.freq
        }
      })
      // scale the range of the data
      x.domain(data.data.map(function(d) { return d.style; }));
      y.domain([0, d3.max(data.data, function(d) { return d.freq; })]);

      // define the axis
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")

      var formatyAxis = d3.format('.0f')

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickFormat(formatyAxis)
          .ticks(maxfreq/4);

      // add axis
      svg.append("g")
          .attr("class", "x-axis-bar axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "3em")
          .attr("dy", ".55em")
          .attr("transform", "rotate(0)" );

      svg.append("g")
          .attr("class", "y-axis-bar axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Frequency");


      // Add bar chart
      svg.selectAll("bar")
          .data(data.data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.style); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.freq); })
          .attr("height", function(d) { return height - y(d.freq); });

    });
}

function updateBarGraph() {
  var url = d3UpdateUrl("http://localhost:3000/api/bar?");

  // Get the data again
  d3.json(url, function(error, data) {
    // Keep track of largest frequency for setting axis ticks
    var maxfreq = 0
    console.log(data.data)
    data.data.forEach(function(d){
      d.style = d.style;
      d.freq = +d.freq;
      if (d.freq > maxfreq) {
        maxfreq = d.freq
      }
    })

    // set the ranges
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
    var y = d3.scale.linear().range([height, 0]);

  	// Scale the range of the data again
    x.domain(data.data.map(function(d) { return d.style; }));
    y.domain([0, d3.max(data.data, function(d) { return d.freq; })]);


    // Select the section we want to apply our changes to
    var svg = d3.select("#bargraph");

    // KEEP X AXIS the same
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    svg.select(".x-axis-bar")
      .call(xAxis).selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "3em")
        .attr("dy", ".55em")
        .attr("transform", "rotate(0)" );

    // UPDATE Y AXIS
    var formatyAxis = d3.format('.0f')

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatyAxis);

    if (maxfreq < 10) {
      yAxis = yAxis.ticks(maxfreq)
    }


    svg.select(".y-axis-bar").transition()
      .duration(750)
      .call(yAxis);

    // // // // // // // // //
    // UPDATE SOME BARS YO //
    // // // // // // // // //

    var bar = svg.selectAll(".bar").data(data.data)


    // Add new bars
    bar.enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.style); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.freq); })
      .attr("height", function(d) { return height - y(d.freq); });

    // Remove old bars
    bar.exit().remove();

    //Update existing bars
    bar.transition()
      .duration(750)
      .attr("y", function(d) { return y(d.freq); })
      .attr("height", function(d) { return height - y(d.freq); });
  });
}


function drawScatterGraph() {
    $("#scattergraph").remove();
    var style1 = $('#style1').val().toLowerCase();
    var style2 = $('#style2').val().toLowerCase();


    //Create url for grabing data
    var url = d3UpdateUrl("http://localhost:3000/api/scatter?")
    console.log(url)
    if (url != "http://localhost:3000/api/scatter") {
      url = url + "&style1="+style1+"&style2="+style2
    } else {
      url = url + "?style1="+style1+"&style2="+style2
    }

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg2 = d3.select("#graphdiv").append("svg").attr("id", "scattergraph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(responsivefy)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // TODO: Throw a link to rails thing in there
    d3.json(url, function(error, data) {
      if (error) throw error;
      data = data.data
      data.forEach(function(person) {
        person.style1 = +person.style1;
        person.style2 = +person.style2;
      });


      x.domain(d3.extent(data, function(person) { return person.style1; })).nice();
      y.domain(d3.extent(data, function(person) { return person.style2; })).nice();



      svg2.append("g")
          .attr("class", "x-axis-scatter axis")
          .attr("transform", "translate(20," + height + ")")
          .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("transform", "translate(" + (width /2) + "," + (margin.bottom - 20) + ")")
          .style("text-anchor", "middle")
          .text(style1);

      svg2.append("g")
          .attr("class", "y-axis-scatter axis")
          .attr("transform", "translate(20,0)")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left - 10)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text(style2)

      svg2.selectAll(".dot")
          .data(data)
        .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 5)
          .attr("cx", function(person) {
            return x(person.style1); })
          .attr("cy", function(person) {
            return y(person.style2); })
          .style("fill", "black")


      ////////////////////
      // TRENDLINE CODE //
      ////////////////////

      // var lg = calcLinear(data, "style1", "style2", d3.min(data, function(d){ return d.style1}), d3.min(data, function(d){ return d.style2}));
      // console.log(lg)
      // svg2.append("line")
	    //     .attr("class", "regression")
	    //     .attr("x1", x(lg.ptA.x))
	    //     .attr("y1", y(lg.ptA.y))
	    //     .attr("x2", x(lg.ptB.x))
	    //     .attr("y2", y(lg.ptB.y));

      // // Create format for equation
      // var decimalFormat = d3.format("0.2f");
      //
      // var xLabels = d3.extent(data, function(person) { return person.style1; })
      //
      // var xSeries = d3.range(1, xLabels.length + 1);;
      // var ySeries = data.map(function(person) { return person.style2 });
      //
      // var leastSquaresCoeff = leastSquares(xSeries, ySeries);
      //
      // var x1 = xLabels[0];
		  // var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
		  // var x2 = xLabels[xLabels.length - 1];
		  // var y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
		  // var trendData = [[x1,y1,x2,y2]];
      //
      // var trendline = svg2.selectAll(".trendline")
			// .data(trendData);
      //
  		// trendline.enter()
  		// 	.append("line")
  		// 	.attr("class", "trendline")
  		// 	.attr("x1", function(d) { return x(d[0]); })
  		// 	.attr("y1", function(d) { return y(d[1]); })
  		// 	.attr("x2", function(d) { return x(d[2]); })
  		// 	.attr("y2", function(d) { return y(d[3]); })
  		// 	.attr("stroke", "black")
  		// 	.attr("stroke-width", 1);
      //
  		// // display equation on the chart
  		// svg2.append("text")
  		// 	.text("eq: " + decimalFormat(leastSquaresCoeff[0]) + "x + " +
  		// 		decimalFormat(leastSquaresCoeff[1]))
  		// 	.attr("class", "text-label")
  		// 	.attr("x", function(d) {return x(x2) - 60;})
  		// 	.attr("y", function(d) {return y(y2) - 30;});
      //
  		// // display r-square on the chart
  		// svg2.append("text")
  		// 	.text("r-sq: " + decimalFormat(leastSquaresCoeff[2]))
  		// 	.attr("class", "text-label")
  		// 	.attr("x", function(d) {return x(x2) - 60;})
  		// 	.attr("y", function(d) {return y(y2) - 10;});

    if ($('#bargraph').is(":visible")) {
      $('#scattergraph').hide();
    }
  });
}


// BROKEN FUNCTION: Weirdly places data points in the wrong place
// function updateScatterGraph() {
//   [style1, style2] = getStyles()
//
//   //Create url for grabing data
//   var url = d3UpdateUrl("http://localhost:3000/api/scatter?")
//   if (url != "http://localhost:3000/api/scatter") {
//     url = url + "&style1="+style1+"&style2="+style2
//   } else {
//     url = url + "?style1="+style1+"&style2="+style2
//   }
//
//   d3.json(url, function(error, data) {
//     if (error) throw error;
//     console.log(data)
//     data = data.data
//     data.forEach(function(person) {
//       person.style1 = +person.style1;
//       person.style2 = +person.style2;
//     });
//
//
//     // Scale the axes
//     var x = d3.scale.linear()
//         .range([0, width]);
//
//     var y = d3.scale.linear()
//         .range([height, 0]);
//
//     // create axis objects
//     var xAxis = d3.svg.axis()
//         .scale(x)
//         .orient("bottom");
//
//     var yAxis = d3.svg.axis()
//         .scale(y)
//         .orient("left");
//
//     // set domains
//     x.domain(d3.extent(data, function(person) { return person.style1; })).nice();
//     y.domain(d3.extent(data, function(person) { return person.style2; })).nice();
//
//     var svg = d3.select("#scattergraph")
//
//     // Update Axes
//     svg.select(".x-axis-scatter").transition()
//       .duration(1000)
//       .call(xAxis);
//
//     svg.select(".y-axis-scatter").transition()
//       .duration(100)
//       .call(yAxis);
//
//     // // // // // // // // //
//     // UPDATE SOME Dots YO //
//     // // // // // // // // //
//     var dots = svg.selectAll(".dot").data(data)
//
//     // Add new dots
//     dots.enter().append("circle")
//         .attr("class", "dot")
//         .attr("r", 5)
//         .attr("cx", function(person) {
//           return x(person.style1); })
//         .attr("cy", function(person) {
//           return y(person.style2); })
//         .style("fill", "black")
//
//
//     // update old dots
//     dots.transition()  // Transition from old to new
//         .duration(1000)  // Length of animation
//         .each("start", function() {  // Start animation
//             d3.select(this)  // 'this' means the current element
//                 .attr("fill", "red")  // Change color
//                 .attr("r", 5);  // Change size
//         })
//         .delay(function(d, i) {
//             return i / data.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
//         })
//         //.ease("linear")  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
//         .attr("cx", function(d) {
//             return x(d.style1);  // Circle's X
//         })
//         .attr("cy", function(d) {
//             return y(d.style2);  // Circle's Y
//         })
//         .each("end", function() {  // End animation
//             d3.select(this)  // 'this' means the current element
//                 .transition()
//                 .duration(500)
//                 .attr("fill", "black")  // Change color
//                 .attr("r", 2);  // Change radius
//         });
//
//         // remove dots not in the current dataset anymore
//         dots.exit().remove()
//
//
//     if ($('#bargraph').is(":visible")) {
//       $('#scattergraph').hide();
//     }
//   });
// }


/////////////////////////
// UI UPDATE FUNCTIONS //
////////////////////////

function showscatter(){
  $("#bargraph").hide();
  $("#stats").hide();
  $(".legend").show(800);
  $(".hline").show(800);
  $("#scattergraph").show(800);
  $(".scatterlegend").show(800);
}
function showstart(){
  $('.insights').show();
  $("#scattergraph").hide();
  $("#stats").hide();
  $(".scatterlegend").hide();
}
function showbarbutton(){
  $("#scattergraph").hide();
  $("#stats").hide();
  $(".legend").show(800);
  $(".hline").show(800);
  $("#bargraph").show(800);
  $(".scatterlegend").hide();
}

function statbutton(){
  $("#bargraph").hide();
  $("#scattergraph").hide();
  $(".hline").hide(400);
  $(".legend").hide(400);
  $("#stats").show(800);
  $(".scatterlegend").hide();
}


//////////////////////////
//   HELPER FUNCTIONS   //
//////////////////////////

function d3UpdateUrl(url) {
  // Grab relevant values from data set 'select' tag
  // and add them as parameters to url
  var i = 0
  $('.datasets').each(function (index) {
    if ($(this).is(":checked")) {
      url += ("include" + i +"=" + $(this).val() + "&")
      i++;
    }
  });
  return url.slice(0, -1);
}

// Code borrowed from Brendan Sudol
// link: https://brendansudol.com/writing/responsive-d3
// It allows us to make our graphs respond to the size of the page
function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
        containerWidth = parseInt(svg.style("width")),
        containerHeight = parseInt(svg.style("height")),
        aspect = containerWidth / containerHeight;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + containerWidth + " " + containerHeight)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    // to register multiple listeners for same event type,
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + svg.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}

// returns slope, intercept and r-square of the line
function leastSquares(xSeries, ySeries) {
	var reduceSumFunc = function(prev, cur) { return prev + cur; };

	var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
	var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

	var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
		.reduce(reduceSumFunc);

	var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
		.reduce(reduceSumFunc);

	var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
		.reduce(reduceSumFunc);

	var slope = ssXY / ssXX;
	var intercept = yBar - (xBar * slope);
	var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

	return [slope, intercept, rSquare];
}

function calcLinear(data, x, y, minX, minY){
   /////////
   //SLOPE//
   /////////

   // Let n = the number of data points
   var n = data.length;

   // Get just the points
   var pts = [];
   data.forEach(function(d,i){
     var obj = {};
     obj.x = d[x];
     obj.y = d[y];
     obj.mult = obj.x*obj.y;
     pts.push(obj);
   });

   // Let a equal n times the summation of all x-values multiplied by their corresponding y-values
   // Let b equal the sum of all x-values times the sum of all y-values
   // Let c equal n times the sum of all squared x-values
   // Let d equal the squared sum of all x-values
   var sum = 0;
   var xSum = 0;
   var ySum = 0;
   var sumSq = 0;
   pts.forEach(function(pt){
     sum = sum + pt.mult;
     xSum = xSum + pt.x;
     ySum = ySum + pt.y;
     sumSq = sumSq + (pt.x * pt.x);
   });
   var a = sum * n;
   var b = xSum * ySum;
   var c = sumSq * n;
   var d = xSum * xSum;

   // Plug the values that you calculated for a, b, c, and d into the following equation to calculate the slope
   // slope = m = (a - b) / (c - d)
   var m = (a - b) / (c - d);

   /////////////
   //INTERCEPT//
   /////////////

   // Let e equal the sum of all y-values
   var e = ySum;

   // Let f equal the slope times the sum of all x-values
   var f = m * xSum;

   // Plug the values you have calculated for e and f into the following equation for the y-intercept
   // y-intercept = b = (e - f) / n
   var b = (e - f) / n;

   // Print the equation below the chart
   // document.getElementsByClassName("equation")[0].innerHTML = "y = " + m + "x + " + b;
   // document.getElementsByClassName("equation")[1].innerHTML = "x = ( y - " + b + " ) / " + m;

   // return an object of two points
   // each point is an object with an x and y coordinate
   return {
     ptA : {
       x: minX,
       y: m * minX + b
     },
     ptB : {
       y: minY,
       x: (minY - b) / m
     }
   }

 }

// BROKEN FUNCTION: returns html elements instead of strings because of god knows why
// function getStyles() {
//   var style1 = $('#style1').val();
//   var style2 = $('#style2').val()
//   style1 = style1.toLowerCase();
//   style2 = style2.toLowerCase();
//
//   return [style1, style2]
// }
