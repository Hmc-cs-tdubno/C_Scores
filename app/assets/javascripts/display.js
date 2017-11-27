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
          .ticks(maxfreq);

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
        .tickFormat(formatyAxis)
        .ticks(maxfreq);

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
  var include = $('#current-datasets').val();
  var i = 0
  include.forEach(function (elem) {
    url += ("include" + i +"=" + elem + "&")
    i++;
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

// BROKEN FUNCTION: returns html elements instead of strings because of god knows why
// function getStyles() {
//   var style1 = $('#style1').val();
//   var style2 = $('#style2').val()
//   style1 = style1.toLowerCase();
//   style2 = style2.toLowerCase();
//
//   return [style1, style2]
// }
