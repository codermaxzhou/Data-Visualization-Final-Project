if(!d3.chart) d3.chart = {};

d3.chart.histogram = function() {
    var g;
    var data;
    var width = 400;
    var height = 400;
    var cx = 10; //margin
    var dispatch = d3.dispatch("hover","click");
    var left_label = 35;
    var bottom_label = 15;
    var left_axis = 20;
    var bottom_axis = 20;
    var xticks = 5;
    var yticks = 4;
    var xAxis, yAxis, x, y;
    var isFirst;
    var maxx;  //set the historgram x axis to the same domain

  function chart(container) {
    g = container;

    // g.append("g")
    // .classed("xaxis", true)

    // g.append("g")
    // .classed("yaxis", true)

    create();
  }
  chart.update = update;
    
  function create() {

      //isFirst = true;


      create_rect()

      //Define X axis
      xAxis = d3.axisBottom()
          .scale(x)
          .ticks(xticks)
          .tickSize(4,0);

      //Create X axis
      g.append("g")
          .attr("class", "xaxis")
          .attr("transform", "translate(" + (left_label + left_axis) + ", "+(height+1.5)+" )")
          .call(xAxis);


      //Define y axis
      yAxis = d3.axisLeft()
          .scale(y)
          .ticks(yticks)
          .tickSize(4,0);

      // //Create y axis
      // g.append("g")
      //     .attr("class", "yaxis")
      //     .attr("transform", "translate(" + (left_label + left_axis) + ",0)")
      //     .call(yAxis);

      //Create y axis
      g.append("g")
          .attr("class", "yaxis")
          .attr("transform", "translate(" + (left_label + left_axis) + ",0)")
          .call(yAxis);

      //Add titles to the axes
      g.append("text")
          .attr("text-anchor", "middle")
          .attr("transform", "translate("+(left_label-15)+", " + height/2 + ")rotate(-90)")
          .text("Num of Businesses")
          .style("fill","grey")
          .attr("font-size","10px");

      g.append("text")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + (width-40) + ", " + (height-5) + ")")
          .text("Num of Reviews")
          .style("fill","grey")
          .attr("font-size","10px");




   d3.selectAll('g.tick')
      .select('text')
      .style('fill', "#d6d6c2");


    // circles
    // .transition()
    // .attr({
    //       cx: function(d,i) { return createdScale(d.created) },
    //       cy: function(d,i) { return yScale(d.score) },
    //       r: function(d) { return commentScale(d.num_comments)},
    //       title: function(d) { return "Number of comments for " + d.id + ": " + d.num_comments}
    // })
    //   .style("fill", function(d) {  return d.color })
    //   .style("opacity", 0.75)

    //circles.exit().remove()
    //console.log(bar);
    // bar.on("mouseover", function(d) {
    //   d3.select(this).style("stroke", "#f46d43")
    //   //dispatch.hover([d])
    //   dispatch.call("hover", this, [d])
    // })



    // bar.on("mouseout", function(d) {
    //   d3.select(this).style("stroke", "")
    //   dispatch.call("hover",this,[])
    // })
  }

  function create_rect(){
      var review = d3.map();
       data.forEach(function(d){ review.set(d.business_id ,d.review_count); });
    
    if(data.length==0){ 
    //console.log("here");  
      return;
    }

       maxx=d3.max(review.values())+1;
      //X axis scale
      x = d3.scaleLinear()
      .domain([0,d3.max(review.values())+1])     //add 1 here bc the largest number will not be shown in highlight otherwise. highlight >= x0, <x1
      .rangeRound([0, (width-left_label-left_axis)]);


      var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(20))
        (review.values());

            //y axis scale
      y = d3.scaleLinear()
      .domain([0, d3.max(bins, function(d) { return d.length; })])
      .range([height, 0]);

      var bar = g.selectAll("rect")
        .data(bins)
        .enter().append("rect")
        .attr("class","histogram")
        .attr("x", function(d){ return x(d.x0) + left_label + left_axis;})
        .attr("y",function(d){return y(d.length);})
        //.attr("width", function(d){return (x(bins[0].x1) - x(bins[0].x0) - 1);})
        .attr("width", function(d){return (x(bins[0].x1 - bins[0].x0)*0.9);})
        .attr("height", function(d) { if(d.length==0){return 0;} else{ return height - y(d.length)+1.5; } })    //everything else add a 1px offset
        .attr("fill", "#D999A2")   //6C7A89
        .attr("opacity", 0.8);


    bar.on("click",function (d) {
        //console.log(d);
        var dd=d.x0;

        //if(){
          //if click on the same bar, remove effect

        //}else{
          g.selectAll("rect")
            .filter(function(d){return d.x0>=dd;})
            .style("fill", "#f46d43");

          g.selectAll("rect")
            .filter(function(d){return d.x0<dd;})
            .style("fill", "#D999A2");

          dispatch.call("click", this, [d]);   //this is to filter on map
        //}

      });
  }

  function update() {
    //console.log(data);
    var bar=g.selectAll("rect")
    

    //console.log(bar.data());
    if(data.length==0){ 
    //console.log("here");  
    bar.remove();
      //create_rect();
      return;
    }

  if(bar.data().length==0){ 
    //console.log("here");  
      create_rect();
      return;
    }

    bar.transition()
        .style("fill", "");

    //when update, first remove the click effect from the last action

       var review=d3.map();
       data.forEach(function(d){ review.set(d.business_id ,d.review_count); });
       //console.log(d3.max(review.values()));

       if(d3.max(review.values())<400){
        maxx=400;
       }else{
        maxx=d3.max(review.values())+1;
       }


      x = d3.scaleLinear()
      .domain([0,maxx])     //add 1 here bc the largest number will not be shown in highlight otherwise. highlight >= x0, <x1
      .rangeRound([0, (width-left_label-left_axis)]);

      var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(20))
        (review.values());

      //console.log(bins);

      //y axis
      y = d3.scaleLinear()
      .domain([0, d3.max(bins, function(d) { return d.length; })])
      .range([height, 0]);

      // //console.log(isFirst);

      // if (isFirst == true) {
      //     g.select(".yaxis")
      //         .remove();
      //     isFirst = false;
      // }

      // if (d3.max(bins, function(d) { return d.length; }) < yticks) {

      if (d3.max(bins, function(d) { return d.length; }) < yticks) {

          yAxis.scale(y).ticks(d3.max(bins, function(d) { return d.length; })).tickFormat(d3.format("d"));

      } else {

          yAxis.scale(y).ticks(yticks).tickFormat(d3.format("d"));

      }

      if (d3.max(bins, function(d) { return d.length; }) < xticks) {

          xAxis.scale(x).ticks(d3.max(bins, function(d) { return d.length; })).tickFormat(d3.format("d"));

      } else {

          xAxis.scale(x).ticks(xticks).tickFormat(d3.format("d"));

      }

      //Update x-axis
      g.select(".xaxis")
          .transition()
          .duration(500)
          .call(xAxis);

      //Update y-axis
      g.select(".yaxis")
          .transition()
          .duration(500)
          .call(yAxis);

      d3.selectAll('g.tick')
      .select('text')
      .style('fill', "#d6d6c2");



      bar.data(bins)
      //bar.exit().remove();


      bar
      //.attr("fill", "#D999A2")
      .transition()
        .attr("x", function(d){  return x(d.x0) + left_label + left_axis;})
        .attr("y",function(d){return y(d.length);})
        .attr("width", function(d){return (x(bins[0].x1 - bins[0].x0)*0.9);})
        .attr("height", function(d) { if(d.length==0){return 0;} else{ return height - y(d.length)+2; } })
        .attr("fill", "#D999A2")
          // .on("click",function (d) {
          //     d3.select(this).style("stroke", "#f46d43");
          //     //dispatch.hover([d])
          //     dispatch.call("click", this, [d]);
          // });
      
    // bar.on("mouseover", function(d) {
    //   d3.select(this).style("stroke", "black")
    //   //dispatch.hover([d])
    //   dispatch.call("hover", this, [d])
    // })

    // bar.on("mouseout", function(d) {
    //   d3.select(this).style("stroke", "")
    //   dispatch.call("hover",this,[])
    // })
    bar.on("click",function (d) {
        //console.log(d);
        var dd=d.x0;

        //if(){
          //if click on the same bar, remove effect

        //}else{
          g.selectAll("rect")
            .filter(function(d){return d.x0>=dd;})
            .style("fill", "#f46d43");

          g.selectAll("rect")
            .filter(function(d){return d.x0<dd;})
            .style("fill", "#D999A2");

          dispatch.call("click", this, [d]);   //this is to filter on map
        //}

      });
  }
    
  //highlights elements being hovered elsewhere
  chart.highlight = function(data) {
    var bar = g.selectAll("rect")
        .style("fill", "")
        .style("stroke-width", "");

    if(data.length>0){
      //console.log(data[0].review_count);

      bar.filter(function(d) { return (d.x0 <=data[0].review_count && d.x1>data[0].review_count); })
        .style("fill", "#f46d43")
        .style("stroke-width", 3);
    }

  }

  //combination getter and setter for the data attribute of the global chart variable
  chart.data = function(value) {
    // if(!arguments.length) return data;
    // var data_1 =[];
    // var data_2 =[];
    // var price = treemap.pricestate();
    //   value.forEach(function(d){
    //       if(price[d.price-1] != 0){
    //           data_1.push(d);
    //       }
    //   });

    //   data_1.forEach(function(d){
    //       if(d.stars>=treemap.starlevel()){
    //           data_2.push(d);
    //       }
    //   });
    // data = data_2;
    // data_1 = [];
    // data_2 = [];
    // return chart
        if(!arguments.length) return data;
    var data_1 = [];
    var data_2 = [];
    var data_3 = [];

    var price = treemap.pricestate();
    var categories =treemap.catstate();

     // console.log(1234,categories);

      value.forEach(function(d){
          if(price[d.price-1] != 0){
              data_1.push(d);
          }
      });
      data_1.forEach(function(d) {
          if(d.stars>=treemap.starlevel()){
              // console.log("d.star",d.stars);
              // console.log("starlevel()",treemap.starlevel());
            data_2.push(d)
          }
      });

      if(categories != 0){
      data_2.forEach(function (d) {
              for (i in d.categories) {
                  for (j in categories){
                      if (d.categories[i] == categories[j]) {

                          data_3.push(d);

                      }
                  }

              }

      })
      data = data_3;
      }else{data = data_2;}



      data_1 = [];
      data_2 = [];
      data_3 = [];
    //flag=flag;
    return chart;
      }

  chart.get_data_length=function(){
    return data.length;
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

// Copies a variable number of methods from source to target.
d3.rebind = function(target, source) {
  var i = 1, n = arguments.length, method;
  while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
  return target;
};

// Method is assumed to be a standard D3 getter-setter:
// If passed with no arguments, gets the value.
// If passed with arguments, sets the value and returns the target.
function d3_rebind(target, source, method) {
  return function() {
    var value = method.apply(source, arguments);
    return value === source ? target : value;
  };
}



