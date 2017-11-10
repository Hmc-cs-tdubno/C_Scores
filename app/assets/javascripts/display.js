 function drawBarGraph () {
    var margin = {top: 20, right: 20, bottom: 70, left: 40},
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;


    // set the ranges
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    // define the axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")


    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);


    // add the SVG element
    var svg = d3.select("#bargraph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    var data = d3.json("http://localhost:3000/api/bar",function(data){
      data.data.forEach(function(d){
      d.style = d.style;
      d.freq = +d.freq;  

      })
      // scale the range of the data
      x.domain(data.data.map(function(d) { return d.style; }));
      y.domain([0, d3.max(data.data, function(d) { return d.freq; })]);

      // add axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .selectAll("texat")
          .style("text-anchor", "end")
          .attr("dx", "3em")
          .attr("dy", ".55em")
          .attr("transform", "rotate(0)" );

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 5)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
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
    d3.json("http://localhost:3000/api/scatter?style1="+style1+"&style2="+style2, function(error, data) {
      if (error) throw error;
      data = data.data
      data.forEach(function(person) {
        console.log(person)
        person.style1 = +person.style1;
        person.style2 = +person.style2;
      });

      x1.domain(d3.extent(data, function(person) { return person.style1; })).nice();
      y1.domain(d3.extent(data, function(person) { return person.style2; })).nice();

      svg2.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height1 + ")")
          .call(xAxis1)
        .append("text")
          .attr("class", "label")
          .attr("x", width1 - (width1 / 7))
          .attr("y",  -6)
          .text(style1);

      svg2.append("g")
          .attr("class", "y axis")
          .call(yAxis1)
        .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y1", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
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


    $(document).on('turbolinks:load', function () {


        // Show relevant buttons and hide irrelevant graphs when page first loads
        $('.insights').show();
        $("#stats").hide();
        $(".scatterlegend").hide();

        // Draw the graphs
        drawBarGraph();
        drawScatterGraph("Collaborator", "Contributor");
        $("#scattergraph").hide();


        // These functions hide graphs when we select a different graph to view
      var curcookie = '<%=cookies[:hello]%>'
      $('.insights').show();
      if (curcookie==0){
        showstart();
      }
      else if(curcookie==1) {
        showbarbutton();
      }
      else if(curcookie==2) {
        showscatter();
      }
      else if(curcookie==3) {
        statbutton();
      }
        $("#barbutton").click(function () {
            showbarbutton();
            document.cookie = "hello = 1";
        });

        $("#scatterbutton").click(function () {
            showscatter();
            document.cookie = "hello = 2";
        });

        $("#statbutton").click(function () {
            statbutton();
            document.cookie = "hello = 3";
        });


        // Change scatter graph axes
        $("#newscatter").click(function () {
          drawScatterGraph($("#style1").val(), $("#style2").val());
        })
    });
    
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