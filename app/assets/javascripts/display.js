var margin = {top: 20, right: 20, bottom: 70, left: 40},
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
          .attr("class", "x-axis axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "3em")
          .attr("dy", ".55em")
          .attr("transform", "rotate(0)" );

      svg.append("g")
          .attr("class", "y-axis axis")
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

    svg.select(".x-axis")
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

    svg.select(".y-axis").transition()
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


function drawScatterGraph(style1, style2) {
    $("#scattergraph").remove()
    style1 = style1.toLowerCase();
    style2 = style2.toLowerCase();
    var margin1 = {top: 20, right: 20, bottom: 70, left: 40},
        width1 = 600 - margin1.left - margin1.right,
        height1 = 300 - margin1.top - margin1.bottom;

    var x1 = d3.scale.linear()
        .range([0, width1]);

    var y1 = d3.scale.linear()
        .range([height1, 0]);

    var color = d3.scale.category10();

    var xAxis1 = d3.svg.axis()
        .scale(x1)
        .orient("bottom");

    var yAxis1 = d3.svg.axis()
        .scale(y1)
        .orient("left");

    var svg2 = d3.select("#graphdiv").append("svg").attr("id", "scattergraph")
        .attr("width", width1 + margin1.left + margin1.right)
        .attr("height", height1 + margin1.top + margin1.bottom)
      .append("g")
        .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");


    // TODO: Throw a link to rails thing in there
    d3.json("http://localhost:3000/api/scatter&style1="+style1+"&style2="+style2, function(error, data) {
      if (error) throw error;
      data = data.data
      data.forEach(function(person) {
        person.style1 = +person.style1;
        person.style2 = +person.style2;
      });

      x1.domain(d3.extent(data, function(person) { return person.style1; })).nice();
      y1.domain(d3.extent(data, function(person) { return person.style2; })).nice();

      svg2.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(20," + height1 + ")")
          .call(xAxis1)
        .append("text")
          .attr("class", "label")
          .attr("transform", "translate(" + (width1 /2) + "," + (margin1.bottom - 20) + ")")
          .style("text-anchor", "middle")
          .text(style1);

      svg2.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(20,0)")
          .call(yAxis1)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin1.left - 10)
          .attr("x",0 - (height1 / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text(style2)

      svg2.selectAll(".dot")
          .data(data)
        .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 5)
          .attr("cx", function(person) {
            return x1(person.style1); })
          .attr("cy", function(person) {
            return y1(person.style2); })
          .style("fill", "black")

      // var legend = svg.selectAll(".legend")
      //     .data(color.domain())
      //   .enter().append("g")
      //     .attr("class", "legend")
      //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
      //
      // legend.append("rect")
      //     .attr("x", width1 - 18)
      //     .attr("width", 18)
      //     .attr("height", 18)
      //     .style("fill", color);
      //
      // legend.append("text")
      //     .attr("x", width1 - 24)
      //     .attr("y", 9)
      //     .attr("dy", ".35em")
      //     .style("text-anchor", "end")
      //     .text(function(d) { return d; });

    if ($('#bargraph').is(":visible")) {
      $('#scattergraph').hide();
    }
  });
}

function updateScatterGraph() {
  var url = d3UpdateUrl("http://localhost:3000/api/scatter?")+"&style1="+style1+"&style2="+style2

  d3.json("http://localhost:3000/api/scatter&style1="+style1+"&style2="+style2, function(error, data) {
    if (error) throw error;
    data = data.data
    data.forEach(function(person) {
      person.style1 = +person.style1;
      person.style2 = +person.style2;
    });

    // Scale the axes
    var x1 = d3.scale.linear()
        .range([0, width1]);

    var y1 = d3.scale.linear()
        .range([height1, 0]);

    // create axis objects
    var xAxis1 = d3.svg.axis()
        .scale(x1)
        .orient("bottom");

    var yAxis1 = d3.svg.axis()
        .scale(y1)
        .orient("left");

    // set domains
    x1.domain(d3.extent(data, function(person) { return person.style1; })).nice();
    y1.domain(d3.extent(data, function(person) { return person.style2; })).nice();

    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(20," + height1 + ")")
        .call(xAxis1)
      .append("text")
        .attr("class", "label")
        .attr("transform", "translate(" + (width1 /2) + "," + (margin1.bottom - 20) + ")")
        .style("text-anchor", "middle")
        .text(style1);

    svg2.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(20,0)")
        .call(yAxis1)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin1.left - 10)
        .attr("x",0 - (height1 / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(style2)

    svg2.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .attr("cx", function(person) {
          return x1(person.style1); })
        .attr("cy", function(person) {
          return y1(person.style2); })
        .style("fill", "black");

    if ($('#bargraph').is(":visible")) {
      $('#scattergraph').hide();
    }
  });
}


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
