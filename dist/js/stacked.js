if(!d3.chart) d3.chart = {};

d3.chart.stacked = function() {
  var g;
  var data;
  var width = 400;
  var height = 400;
  var cx = 10; //margin
  var dispatch = d3.dispatch(chart, "hover");
  var xAxis, yAxis, x, y;
  var isFirst;

  function chart(container) {
    g = container;

    g.append("g")
    .classed("xaxis", true)

    g.append("g")
    .classed("yaxis", true)

    create();
  }

   chart.update = update;
  
  function create(){

    isFirst = true;

    var stars=["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"];
        categories=["French", "Italian", "Asian","American", "Indian", "Mexican"];

    var data_1=[];
    

    for (s in categories){
      var dict = {};
      for (c in stars ){
        dict[stars[c]]=0;
      }
      dict["cat"]=categories[s];
      dict["total"]=0;
      //console.log(stars[s])
      data_1.push(dict);
    }

    for(i in data){
      for(j in data_1){
        if(data[i].cat==data_1[j].cat){
          //console.log(data_1[j]);
          //console.log(data[i].cat);
          data_1[j][data[i].stars]=data_1[j][data[i].stars]+1;
          data_1[j]["total"]=data_1[j]["total"]+1;
        }
      }
    }
    //console.log(data_1);

    data_1.sort(function(a, b) { return b.total - a.total; });
    
    x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .align(0.1);

    y = d3.scaleLinear()
        .rangeRound([height, 0]);

    // var z = d3.scaleOrdinal()
    //         .domain(categories)
    //         .range(["#ffffcc", "#ffeda0" , "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a" ]);
    var z= d3.scaleOrdinal()
      .domain(stars)
      .range(["#ffffcc", "#ffeda0" , "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a","#e31a1c", "#bd0026", "#800026" ]);
    
    x.domain(categories);
    y.domain([0, d3.max(data_1, function(d) { return d.total; })]);

    var stack = d3.stack().keys(stars);

    var data_2=stack(data_1);

    //console.log(data_2);

 
  var serie= g.selectAll(".serie")
              .data(data_2)
              .enter()
              .append("g")
              .attr("class", "serie")
              .attr("fill", function(d) { return z(d.key); })

      .selectAll("rect")
      .data(function(d) { return d; })
      .enter()
      .append("rect")
      .transition()
      .attr("x", function(d) {  return x(d.data.cat); })
      .attr("y", function(d) {  return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());


    //Define X axis
    xAxis = d3.axisBottom()
        .scale(x)
        .ticks(6);

    //Create X axis
    g.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + 300 + ")")
        .call(xAxis);

    //Rotate text on x axis
    g.selectAll(".xaxis text")
        .attr("transform", function(d) {
          return "translate(" + this.getBBox().height*-2 + "," + (this.getBBox().height+5) + ")rotate(-45)";
        });

    //Define y axis
    yAxis = d3.axisLeft()
        .scale(y)
        .ticks(10)
        .tickFormat(d3.format("d"));

    //Create y axis
    g.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + 0 + ",0)")
        .call(yAxis);

    var bar=g.selectAll("rect");
//console.log(bar);

    // console.log(stars);


    //Create legends
    var legend = g.selectAll(".legend")
        .data(stars)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
          return "translate(0," + (i * 20 + 10) + ")"
        })
        .style("font", "10px sans-serif");

    legend.append("rect")
        .attr("x", width+10)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width +6)
        .attr("y", 9)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function(d) {
          return d;
        });

        g.append("text")
        .attr("x", width)
        .attr("y", 0)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text("stars");

    bar.on("mouseover", function(d) {
      d3.select(this).style("stroke", "black")
      // console.log(d);
      // console.log(this.parentNode);
      var dd=d3.select(this.parentNode);
      // console.log(dd.data()[0].key);
      
      dispatch.call("hover", this, [d, dd.data()[0].key])
    })

    bar.on("mouseout", function(d) {
      d3.select(this).style("stroke", "")
      dispatch.call("hover",this,[])
    })

  }

  function update() {
    //console.log(data);

    

    var stars=["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"];
        categories=["French", "Italian", "Asian","American", "Indian", "Mexican"];

    var data_1=[];
    

    for (s in categories){
      var dict = {};
      for (c in stars ){
        dict[stars[c]]=0;
      }
      dict["cat"]=categories[s];
      dict["total"]=0;
      //console.log(stars[s])
      data_1.push(dict);
    }

    for(i in data){
      for(j in data_1){
        if(data[i].cat==data_1[j].cat){
          //console.log(data_1[j]);
          //console.log(data[i].cat);
          data_1[j][data[i].stars]=data_1[j][data[i].stars]+1;
          data_1[j]["total"]=data_1[j]["total"]+1;
        }
      }
    }
    //console.log(data_1);

    data_1.sort(function(a, b) { return b.total - a.total; });
    
    x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .align(0.1);

    y = d3.scaleLinear()
        .rangeRound([height, 0]);

    // var z = d3.scaleOrdinal()
    //         .domain(categories)
    //         .range(["#ffffcc", "#ffeda0" , "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a" ]);
    var z= d3.scaleOrdinal()
      .domain(stars)
      .range(["#ffffcc", "#ffeda0" , "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a","#e31a1c", "#bd0026", "#800026" ]);
    
    x.domain(categories);
    y.domain([0, d3.max(data_1, function(d) { return d.total; })]);

    // console.log(d3.max(data_1, function(d) { return d.total; }));

    if (d3.max(data_1, function(d) { return d.total; }) < 10) {

      yAxis.scale(y).ticks(d3.max(data_1, function(d) { return d.total; })).tickFormat(d3.format("d"));

    } else {

      yAxis.scale(y).ticks(10).tickFormat(d3.format("d"));

    }

    if (isFirst == true) {
      g.select(".yaxis")
          .remove();
      isFirst = false;
    }

    //Update y-axis
    g.select(".yaxis")
        .transition()
        .duration(500)
        .call(yAxis);

    var stack = d3.stack().keys(stars);

    var data_2=stack(data_1);

    //console.log(data_2);

 
  var serie= g.selectAll(".serie")
              .data(data_2)
              //.enter()
      //         .append("g")
      //         .attr("class", "serie")
      //         .attr("fill", function(d) { return z(d.key); })

       .selectAll("rect")
       .data(function(d) { return d; })
      // .enter()
      //.append("rect")
      .transition()
      .attr("x", function(d) {  return x(d.data.cat); })
      .attr("y", function(d) {  return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());




    var bar=g.selectAll("rect");
//console.log(bar);

    bar.on("mouseover", function(d) {
      d3.select(this).style("stroke", "#a6d96a")
      // console.log(d);
      // console.log(this.parentNode);
      var dd=d3.select(this.parentNode);
      // console.log(dd.data()[0].key);
      
      dispatch.call("hover", this, [d, dd.data()[0].key])
    })

    bar.on("mouseout", function(d) {
      d3.select(this).style("stroke", "")
      dispatch.call("hover",this,[])
    })
  }

  //highlights elements being hovered elsewhere
  chart.highlight = function(data) {
    //console.log(data);
    var serie = g.selectAll(".serie")
        .style("stroke", "")
        .style("stroke-width", "")

    var rect = g.selectAll(".serie rect")
        .style("stroke", "")
        .style("stroke-width", "")

    //console.log(rect);
    if(data.length>0){

      // serie.filter(function(d) { return (d.key==data[0].stars )})
      //   .style("stroke", "black")
      //   .style("stroke-width", 3)

      // console.log(data[0].cat);

      rect.filter(function(d) { var parent=d3.select(this.parentNode); return (d.data.cat==data[0].cat && parent.data()[0].key==data[0].stars )})
        .style("stroke", "#a6d96a")
        .style("stroke-width", 3)
    }

  }

  //combination getter and setter for the data attribute of the global chart variable
  chart.data = function(value) {
    if(!arguments.length) return data;
    data = value;
    return chart;
  }
    
  //combination getter and setter for the width attribute of the global chart variable
  chart.width = function(value) {
    if(!arguments.length) return width;
    width = value;
    return chart;
  }
    
  //combination getter and setter for the height attribute of the global chart variable
  chart.height = function(value) {
    if(!arguments.length) return height;
    height = value;
    return chart;
  }

  return d3.rebind(chart, dispatch, "on");
}