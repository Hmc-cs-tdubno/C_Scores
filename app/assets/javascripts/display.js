var margin = {top: 20, right: 70, bottom: 70, left: 40},
    width = 625 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom,
    padding = 25;
$('.insights').show();

 function drawBarGraph () {

    // add the SVG element
    var svg = d3.select("#bargraph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(responsivefy)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Set the scales for the axes
    var x = d3.scale.ordinal().rangeRoundBands([padding, width-padding], .05);
    var y = d3.scale.linear().range([height-padding, padding]);
    var colorScale = d3.scale.category20()

    d3.json("http://localhost:3000/api/bar",function(data){
      // Keep track of largest frequency for setting axis ticks
      var maxfreq = 0

      data = data.data
      // Cast data to be digestable by d3
      data.forEach(function(d){
        d.style = d.style;
        d.freq = +d.freq;
        if (d.freq > maxfreq) {
          maxfreq = d.freq
        }
      })

      // scale the range of the data
      x.domain(data.map(function(d) { return d.style; }));
      y.domain([0, d3.max(data, function(d) { return d.freq; })]);
      colorScale.domain(data.map(function (d) { return d.style; }));

      // Create new axis object
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")

      // Create new axis object
      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickFormat(barYAxisFormat())

      // If there are less than 10 datapoints for
      // a style use less than 10 ticks
      // otherwise use 10 ticks
      if (maxfreq < 10) {
        yAxis = yAxis.ticks(maxfreq)
      }

      // Add x-axis to chart
      svg.append("g")
          .attr("class", "x-axis-bar axis")
          .attr("transform", "translate(0," + (height-padding) + ")")
          .call(xAxis)
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "3em")
          .attr("dy", ".55em")
          .attr("transform", "rotate(0)" );

      // Add y-axis to chart
      svg.append("g")
          .attr("class", "y-axis-bar axis")
          .attr("transform", "translate("+(padding)+",0)")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - padding - margin.left)
          .attr("x",0 - ((height-padding) / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Frequency");

      // Add bars to chart
      svg.selectAll("bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.style); })
          .attr("y", function(d) { return y(d.freq); })
          .attr("width", x.rangeBand())
          .attr("height", function(d) { return (height-padding) - y(d.freq); })
          .attr("fill", function (d) { return colorScale(d.style)});

    });
}

function updateBarGraph() {
  var url = d3UpdateUrl("http://localhost:3000/api/bar?");

  // Set the scales for the axes
  var x = d3.scale.ordinal().rangeRoundBands([padding, width-padding], .05);
  var y = d3.scale.linear().range([height-padding, padding]);

  // Get the data again
  d3.json(url, function(error, data) {
    // Keep track of largest frequency for setting axis ticks
    var maxfreq = 0

    data = data.data
    // Cast data to be digestable by d3
    data.forEach(function(d){
      d.style = d.style;
      d.freq = +d.freq;
      if (d.freq > maxfreq) {
        maxfreq = d.freq
      }
    })


    // Update the domains of the x and y scales
    x.domain(data.map(function(d) { return d.style; }));
    y.domain([0, d3.max(data, function(d) { return d.freq; })]);


    var svg = d3.select("#bargraph");

    // // // // // // // // //
    //      UPDATE AXES     //
    // // // // // // // // //

    // Create new axis object
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // Add x-axis to graph
    svg.select(".x-axis-bar")
      .call(xAxis).selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "3em")
        .attr("dy", ".55em")
        .attr("transform", "rotate(0)" );

    // Create new axis object
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(barYAxisFormat());

    // If there are less than 10 datapoints for
    // a style use less than 10 ticks
    // otherwise use 10 ticks
    if (maxfreq < 10) {
      yAxis = yAxis.ticks(maxfreq)
    }

    // Add y-axis to graph and do nice animation
    svg.select(".y-axis-bar").transition()
      .duration(750)
      .call(yAxis);

    // // // // // // // // //
    //      UPDATE BARS     //
    // // // // // // // // //

    var bar = svg.selectAll(".bar").data(data)

    // Add new bars
    bar.enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.style); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.freq); })
      .attr("height", function(d) { return (height-padding) - y(d.freq); });

    // Remove old bars
    bar.exit().remove();

    //Update existing bars
    bar.transition()
      .duration(750)
      .attr("y", function(d) { return y(d.freq); })
      .attr("height", function(d) { return (height-padding) - y(d.freq); });
  });
}


function drawScatterGraph() {
    $("#scattergraph").remove();
    var style1 = $('#style1').val().toLowerCase();
    var style2 = $('#style2').val().toLowerCase();


    // Create url for grabing data
    var url = d3UpdateUrl("http://localhost:3000/api/scatter?")
    if (url != "http://localhost:3000/api/scatter") {
      url = url + "&style1="+style1+"&style2="+style2
    } else {
      url = url + "?style1="+style1+"&style2="+style2
    }

    // Set up scales for graph
    var x = d3.scale.linear().range([padding, width-padding]);
    var y = d3.scale.linear().range([height-padding, padding]);
    var color = d3.scale.category20b();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");


    // Add graph canvas to page
    var svg = d3.select("#graphdiv").append("svg").attr("id", "scattergraph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(responsivefy)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    d3.json(url, function(error, data) {
      if (error) throw error;
      data = data.data
      data.forEach(function(person) {
        person.style1 = +person.style1;
        person.style2 = +person.style2;
      });


      x.domain(d3.extent(data, function(person) { return person.style1; })).nice();
      y.domain(d3.extent(data, function(person) { return person.style2; })).nice();


      // Add x-axis to scatterplot
      svg.append("g")
          .attr("class", "x-axis-scatter axis")
          .attr("transform", "translate(0," + (height-padding) + ")")
          .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("transform", "translate(" + (width /2) + "," + (margin.bottom - 20) + ")")
          .style("text-anchor", "middle")
          .text(style1);

      // add y-axis to scatterplot
      svg.append("g")
          .attr("class", "y-axis-scatter axis")
          .attr("transform", "translate("+padding+",0)")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", (-1*padding) -margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text(style2)

      svg.selectAll(".dot")
          .data(data)
        .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 5)
          .attr("cx", function(person) {
            return x(person.style1); })
          .attr("cy", function(person) {
            return y(person.style2); })
          .style("fill", function(d) { return color(d.dataset)})
          .on("mouseover", function(d) {
              tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
              tooltip.html(d.dataset + "<br/> (" + d.style1
    	        + ", " + d.style2 + ")")
                   .style("left", (d3.event.pageX + 5) + "px")
                   .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
              tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
          });

    // Make sure the new scatter plot does not
    // appear while user is looking at bar graph
    if ($('#bargraph').is(":visible")) {
      $('#scattergraph').hide();
    }
  });
}


// BROKEN FUNCTION: Weirdly places data points in the wrong place
// function updateScatterGraph() {
//   var style1 = $('#style1').val().toLowerCase();
//   var style2 = $('#style2').val().toLowerCase();
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
//     data = data.data
//     data.forEach(function(person) {
//       person.style1 = +person.style1;
//       person.style2 = +person.style2;
//     });
//
//
//     // Scale the axes
//     var x = d3.scale.linear()
//         .range([padding, width-padding]);
//
//     var y = d3.scale.linear()
//         .range([height-padding, padding]);
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
//       .attr("transform", "translate(0," + (height-padding) + ")")
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
//         .attr("r", 2)
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

function deleteData() {
  url = d3UpdateUrl("http://localhost:3000/delete_individuals?");
  $.ajax(url, {
    method: "GET",
    success: function (data) {
      if (data.message = "Successfully deleted datasets") {
        $('.datasets').each(function (index) {
          if ($(this).is(":checked")) {
            $(this).parents("tr").remove()
            drawScatterGraph();
            updateBarGraph();
          }
        });
      } else {
        console.log("something is wrong")
      }
    }
  });
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

// // Code borrowed from Brendan Sudol
// // link: https://brendansudol.com/writing/responsive-d3
// // It allows us to make our graphs respond to the size of the page
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

function barYAxisFormat() {
  return d3.format('.0f')
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
