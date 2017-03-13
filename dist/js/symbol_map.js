
if(!d3.chart) d3.chart = {};

d3.chart.symbol_map = function() {
  var g;
  flag=0;  //0 is all data, 1 is filtered
  var data;
  var width = 400;
  var height = 400;
  var cx = 10;
  var size_scale = 30;
  //var dispatch = d3.dispatch(chart, "hover");
  //var dispatch = d3.dispatch(chart, "reset");
  var dispatch = d3.dispatch("hover", "reset", "click");
  var map;
  // var state_h = 1;

    

    // var projection=d3.geoMercator()
    // //.center([ -73.6, 45.56 ])
    // .center([ -73.6, 45.52 ])   //downtown area
    // .scale([ width*300 ]);
    // //.translate([700, 230]);

  function chart(container,mapp) {
    g = container;
    map=mapp;
    isClick="undefined";
    update();


  }
  chart.update = update;

  function update() {
      var x = d3.scaleOrdinal()
      .domain(["0", "1", "2", "3", "4", "5", "6", "7", "8","9", "10", "11", "12", "13", "14", "15", "16", "17","18"])
      .range(["0", "0", "0", "0", "0", "0", "0", "0", "0","1", "1", "2", "3", "4", "6", "8", "10", "15","20"]);

      map.on("click",function(d){
          dispatch.call("click",this,[]);

          d3.select(".isOnClick").attr("class","symbols").style("stroke","").attr("fill", function(d){return color(d.stars);});

          //d3.event.stopPropagation();
      })

    data.forEach(function(d) {
      d.LatLng = new L.LatLng(d.latitude,
                  d.longitude)
    })


      // var onclick=d3.select(".isOnClick");
      // //console.log(data);

      
      // if(onclick.data().length==0){

      // }else{
      // //console.log(onclick.data()[0].business_id);
      // data.forEach(function(d){ if(d.business_id==onclick.data()[0].business_id){ data.splice(data.indexOf(d), 1); return;}})
            
      // }
      
     var symbols = g.selectAll("circle")
      .data(data,function(d){return d.business_id;})
      .enter()
      .append("circle")
      .attr("r", x(map.getZoom()))
      .attr("fill", function(d){ return color(d.stars);})
      .style("opacity", 0.6)
      .attr("class", "symbols")


      .on("mouseover", function(d) {
      if(d3.select(this).attr("class")=="isOnClick"){
        return;
      }else{
        d3.select(this).style("stroke", "black").attr("class","isOnMouseOver").style("stroke-width", 3);
      }
      
      //console.log(d3.select(this));
      dispatch.call("hover",this,[d])
    })
     .on("click",function(d){
      var c=g.select(".isOnClick");
     // console.log("clicked res",d)
        if(c.data().length!=0){
         // console.log("here");
          c.style("stroke","").attr("fill", function(d){return color(d.stars);})
          .attr("class","symbols");
        }

         d3.select(this).style("stroke","black").style("stroke-width", 5).attr("fill","#85e085").attr("class","isOnClick");
         dispatch.call("click",this,[d]);
         d3.event.stopPropagation();})

    .on("mouseout", function(d) {
      //var c=g.select(".isOnMouseOver");
      //console.log(d3.select(this).class());
      if(d3.select(this).attr("class")!="isOnMouseOver"){
          //console.log("not the same circle");
      }else{
        //console.log("the same circle");
        d3.select(this).style("stroke", "").attr("class","symbols")
        dispatch.call("hover",this,[])       
      }

    })


      // console.log(map);
      //
    map.on("viewreset", reset);
    reset();


  }


  // function update() {
  
  //    var symbols = g.selectAll("circle")
  //     .data(data, key);

  //     symbols.transition()
  //     .attr("r", "3px")
  //     .attr("fill", function(d){ return color(d.stars);})
  //     .style("opacity", 0.6)
  //     .attr("class", "symbol")



  //     symbols.enter()
  //     .append("circle")
  //     //.transition()
  //     .attr("r", "3px")
  //     .attr("fill", function(d){ return color(d.stars);})
  //     .style("opacity", 0.6)
  //     .attr("class", "symbol")

  //     symbols.exit()
  //      .remove()


  //   .on("mouseover", function(d) {
  //     //console.log("hahhh");
  //     d3.select(this).style("stroke", "black")
  //     dispatch.call("hover",this,[d])
  //   })

  //   .on("mouseout", function(d) {
  //     d3.select(this).style("stroke", "")
  //     dispatch.call("hover",this,[])
  //   })

  //   map.on("viewreset", reset);
  //   reset();

  //}

  function reset(){
    //var map=container;
   // console.log(map.getCenter());
      //    map.on("click",function(d){
      //     dispatch.call("click",this,[]);

      //     d3.select(".isOnClick").attr("class","symbols").style("stroke", "").attr("fill", function(d){return color(d.stars);});

      //     //d3.event.stopPropagation();
      // })
    
    var x = d3.scaleOrdinal()
      .domain(["0", "1", "2", "3", "4", "5", "6", "7", "8","9", "10", "11", "12", "13", "14", "15", "16", "17","18"])
      .range(["0", "0", "0", "0", "0", "0", "0", "0", "0","1", "1", "2", "3", "4", "6", "8", "10", "15","20"]);

      // var onclick=d3.select(".isOnClick");
      // console.log(data);

      
      // if(onclick.data().length==0){

      // }else{
      // //console.log(onclick.data()[0].business_id);
      // data.forEach(function(d){ if(d.business_id==onclick.data()[0].business_id){ data.splice(data.indexOf(d), 1); return;}})
            
      // }
      // console.log(onclick.data()[0]);
      // console.log(data);

      symbols=g.selectAll("circle")
              .data(data, function(d){return d.business_id;})


              
      symbols.exit().remove();

      symbols
      .attr("r", x(map.getZoom()))
          
          .style("opacity", 0.6)
      .attr("transform", 
          function(d) { 
          return "translate("+ 
          map.latLngToLayerPoint(d.LatLng).x +","+ 
          map.latLngToLayerPoint(d.LatLng).y +")";
        }
      )
      symbols.select(".symbols").attr("fill", function(d){ return color(d.stars);})
      symbols.select(".isOnClick").attr("fill", "#85e085");
 

      // symbols.select("class",".isOnClick")
      //   .style("stroke",function(){console.log(d);}).style("stroke-width", 5).attr("fill","#85e085"); cannot do this bc the circle and data correlation changes

      symbols.enter().append("circle")
            .attr("r", x(map.getZoom()))
            .attr("fill", function(d){ return color(d.stars);})
            .style("opacity", 0.6)
            .attr("class", "symbols")
            .attr("transform", 
                      function(d) { 
                      return "translate("+ 
                      map.latLngToLayerPoint(d.LatLng).x +","+ 
                      map.latLngToLayerPoint(d.LatLng).y +")";
                    }

                  )     
      .on("mouseover", function(d) {
      if(d3.select(this).attr("class")=="isOnClick"){
        return;
      }else if(d3.select(this).attr("class")=="isOnMouseOver"){
        d3.select(this).style("stroke", "black").style("stroke-width", 3);
      }else{
        d3.select(this).style("stroke", "black").attr("class","isOnMouseOver").style("stroke-width", 3);
      }
      
      //console.log(d3.select(this));
      dispatch.call("hover",this,[d])
    })
     .on("click",function(d){
      var c=g.select(".isOnClick");

      console.log(c.data()[0].stars)
        if(c.data().length!=0){
          //console.log("here");
          c.style("stroke","").attr("fill", function(d){return color(d.stars);})
          .attr("class","symbols");
        }

         d3.select(this).style("stroke","black").style("stroke-width", 5).attr("fill","#85e085").attr("class","isOnClick");
         dispatch.call("click",this,[d]);
         d3.event.stopPropagation();})

    .on("mouseout", function(d) {
      //var c=g.select(".isOnMouseOver");
      //console.log(d3.select(this).class());
      if(d3.select(this).attr("class")=="isOnMouseOver"){
        d3.select(this).style("stroke", "").attr("class","symbols")
        dispatch.call("hover",this,[])  
      }else if(d3.select(this).attr("class")=="isOnClick"){
        return;
      }

    })
    



      symbols.exit().remove();
      //console.log(map.getZoom());

      //dispatch.call("reset",this, data)

  }


  chart.highlight = function(data) {
        //console.log(data);
        var symbols = g.selectAll("circle.symbol")
        .style("stroke", "")
        .style("stroke-width", "")
        
        symbols.data(data)
        .style("stroke", "black")
        .style("stroke-width", 3)
    }

    
    
  chart.data = function(value) {
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
  chart.width = function(value) {
    if(!arguments.length) return width;
    width = value;
    return chart;
  }
  chart.height = function(value) {
    if(!arguments.length) return height;
    height = value;
    return chart;
  }

  chart.currenres =function(){
      return current_res;
  }



  return d3.rebind(chart, dispatch, "on");
}

