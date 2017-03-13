if(!d3.chart) d3.chart = {};

d3.chart.treemap = function() {
  var g;
  var g1;
  var handle;
  var slider;
  var data_1;
  var data=[];
  var treemap;
  var color;
  var width = 400;
  var height = 400;
  var cx = 10; //margin
  var dispatch = d3.dispatch("click", "hover");
  var xAxis, yAxis, x, y;
  var isFirst;
  var root_data;
  var star_level = 0;
  var price_state = [1,1,1,1];
  var category_state = 0;
  var price_level = ["$","$$","$$$","$$$$"];


  function chart(container) {
    g = container;

    // g.append("g")
    // .classed("xaxis", true)
    // g.append("g")
    // .classed("yaxis", true)

    create();

  }

  chart.update = update;
  
  function create(){


      //var color = d3.scaleOrdinal(d3.schemeCategory20);
      color = d3.scaleOrdinal()
        .domain(["1", "0"])
        .range(["#b2ff66", "#E0E0E0"]);



      var x= d3.scaleLinear()
          .domain([1, 5])
          .range([height-50, 0])
          .clamp(true);

      var margin={top: 24, right: 0, bottom: 0, left: 0};

      g1 = g.append("g")
              .attr("class", "depth")

    //slider
      var svg_1=g.append("svg")
          svg_1.attr("width", 1000)      //less than 1000 will not show slider?!
                .attr("height", 250)


        slider = svg_1.append("g")
            .attr("class", "slider")
            .attr("transform", "translate(" + (width+30) + "," + 30+ ")");



      var price_button = svg_1.append("g")
          .attr("class","button")
          .attr("transform", "translate(" + (width+120) + "," + 50+ ")");

      price_button.selectAll("text")
          .data(price_level)
          .enter()
          .append("text")
          .text(function (d,i) {
              return d;
          })
          .attr("x",-20)
          .attr("y",function(d,i){return i*30 +15})
          .style("font-size", 15)
          .style("text-anchor","left")
          .style("fill","#b2ff66")
          .on("click",function(d,i){

              if(price_state[i]==1){
                  d3.select(this).style("fill","#E0E0E0");
              }
              else{
                  d3.select(this).style("fill","#b2ff66");
              }

              price_state[i]? price_state[i] = 0:price_state[i] =1;
              console.log(price_state);
             change();

          });


      var trackline = slider.insert("rect")
          .attr("class","trackline")
          .attr("x",-5)
          .attr("y",x.range()[1]-5)
              .attr("rx", 5)
              .attr("ry",5)
              .attr("width",10)
              .attr("height", (x.range()[0]-x.range()[1]+10))
              .style("fill","#b2ff60")
              .style("pointer-events","none");

      slider.append("line")
            .attr("class", "track")
            .attr("y2", x.range()[0])
            .attr("y1", x.range()[1])
            .style("opacity",0.2)
          .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-inset")
          .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-overlay")

            .call(d3.drag()
                .on("start.interrupt", function() { slider.interrupt(); })
                //.on("start drag", function() { hue(x.invert(d3.event.x)); }));
                .on("start drag", function(){dragging(x);}));


       slider.insert("g", ".track-overlay")
            .attr("class", "ticks")
            .attr("transform", "translate(" + 35 + ",5)")
          .selectAll("text")
          .data(x.ticks(9))
          .enter().append("text")
            .attr("class",function(d){return d +"startick";})
            .attr("y", x)
            .attr("text-anchor", "middle")
            .attr("opacity",0.7)
            .text(function(d) { return d + " stars"; });



      handle = slider.insert("circle", ".track-overlay")
            .attr("class", "handle")
            .attr("cy",x.range()[0])
            .attr("r", 9);

    main(root_data)

  }

  //highlights elements being hovered elsewhere
  chart.highlight = function(data) {
    //console.log(data);

    var rect = g.selectAll(".node")
        .style("stroke", "")
        .style("stroke-width", "")
        .style("fill", function(d) { return color(d.data.key); })

    //console.log(rect);
    if(data.length>0){
      //console.log(data[0].categories);
      //console.log(rect)

      rect.filter(function(d) { var dd=d3.select(this).data(); //console.log(dd); 
        return ((data[0].categories.indexOf(dd[0].parent.data.key)) != -1 ||(data[0].categories.indexOf(dd[0].parent.parent.data.key) != -1 ) && dd[0].data.key==1) ;})
        //.style("stroke", "black")
        //.style("stroke-width", 3)
        .style("fill", "#85e085");
    }

  }

function main(root){

  var node = g1
    .selectAll(".node")
    .data(root.leaves(),function (d) {

         if(d.parent.parent.data.key!="undefined"){ return d.parent.parent.data.key + d.data.key ;}

        // if(d.parent.data.key!="undefined"){ t.push(d.parent.data.key)}
        // if(d.parent.parent.data.key!="undefined"){ t.push(d.parent.parent.data.key)}
        // if(t.length>1){console.log(t);}
        //
        // return t;
    })
    .enter().append("rect")
      .attr("class", function (d) {
          return 'node'+ " "+ "s"+d.data.key ;
      })
      .style("fill", function(d) { return color(d.data.key); })
      .attr("opacity", 0.7)
      .attr("x", function(d) { return d.x0; } )
      .attr("y", function(d) { return d.y0; })
      .attr("width", function(d) { return d.x1 - d.x0 ; })
      .attr("height", function(d) { return d.y1 - d.y0 ; })
      // .style("fill", "#b2ff66")
      // .style("left", function(d) { return d.x0 + "px"; })
      // .style("top", function(d) { return d.y0 + "px"; })
      // .style("width", function(d) { return d.x1 - d.x0 + "px"; })
      // .style("height", function(d) { return d.y1 - d.y0 + "px"; });

  var tree_label = g1.selectAll(".node_label")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("class", "node_label")
      .attr("x", function(d) { return d.parent.parent.x0 + 3; })
      .attr("y", function(d) { return d.parent.parent.y0 + 20; })
      .style("font-size", function (d) { return (d.parent.parent.x1 - d.parent.parent.x0)/9;

      })
      .style('fill', 'grey')
      //.text("here")
      .text(function(d) { if(d.data.key=="0"){return "";}
          // if(d.parent.data.key!="undefined"){ return d.parent.data.key }
          if(d.parent.parent.data.key!="undefined"){ return d.parent.parent.data.key ;}
          if(d.parent.data.key =="undefined" && d.parent.parent.data.key =="undefined"){return "restaurant";}
      } )
      .style("pointer-events","none");

      node
          .on("mouseover", function(d) {
              // console.log(d);
              if(d.data.key =="1"){
                  d3.select(this).style("stroke", "black")

                  var v=[];
                  if(d.parent.data.key!="undefined"){ v.push(d.parent.data.key)}
                  if(d.parent.parent.data.key!="undefined"){ v.push(d.parent.parent.data.key)}
                  dispatch.call("hover", this, [v, d.data])

              }
    })
          .on("click",function (d) {
              if(d.data.key =="1"){
                  console.log("reach");

                  if(d3.select(this).attr("class") =="node s1"){
                      console.log("reach1");
                      //console.log(d3.select(this).attr("class") =="node s0");
                      d3.selectAll(".s1").style("fill","#b2ff66");
                      d3.selectAll(".s1").attr("class","node s1");

                      d3.select(this).style("fill","#85e085");
                      d3.select(this).attr("class","node s1 flip");

                      var t=[];
                      if(d.parent.data.key!="undefined"){ t.push(d.parent.data.key)}
                      if(d.parent.parent.data.key!="undefined"){ t.push(d.parent.parent.data.key)}
                      console.log("category",t);
                      category_state=t;
                      console.log("reach2");
                      dispatch.call("click", this, [t, d.data])
                      d3.event.stopPropagation();

                  }
                  else if(d3.select(this).attr("class") =="node s1 flip") {
                      d3.select(this).style("fill","#b2ff66");
                      d3.select(this).attr("class","node s1");
                      console.log("reach3");
                      category_state =0;
                      dispatch.call("click", this, [])
                      d3.event.stopPropagation();

                  }}

              // if(d.data.key =="1"){
              // var t=[];
              // if(d.parent.data.key!="undefined"){ t.push(d.parent.data.key)}
              // if(d.parent.parent.data.key!="undefined"){ t.push(d.parent.parent.data.key)}
              // console.log("category",t);
              // category_state=t;
              // dispatch.call("click", this, [t, d.data])
              // d3.event.stopPropagation();}
          });

    node
        .on("mouseout", function(d) {
      d3.select(this).style("stroke", "")
      dispatch.call("hover",this,[]);
    })

    map.on("click",function (d) {
        dispatch.call("click",this,[]);
        // d3.event.stopPropagation();
    })

}

function change(){
    var data_2 = [];
    var data_3 = [];

    data.forEach(function(d){
        if(d.stars>=hh && price_state[d.price-1] != 0){d.stars_cat=1;}
        else d.stars_cat=0;
    });

    // data.forEach(function(d) {
    //     if(d.stars>=star_level){d.stars_cat=1;}
    //     else d.stars_cat=0;
    // });
    //
    // data.forEach(function(d){
    //     if(price_state[d.price-1] != 0){
    //         d.stars_cat = 1;
    //     }else{ d.stars_cat = 0;}
    // });


    data.forEach(function(d){
        if(price_state[d.price-1] != 0){
            data_2.push(d);
        }
    });

    data_2.forEach(function(d){
        if(d.stars>=star_level){
            data_3.push(d);
        }
    });




    symbol_map.data(data_3);
    symbol_map.update();

    histogram.data(data_3);
    histogram.update();

    // update_text("Total: " + data_3.length);



    nest_1 = d3.nest()
        .key(function(d) { return d.cat1; })
        .key(function(d) { return d.cat2; })
        .key(function(d) { return d.stars_cat; })
        // .key(function(d){return d.price;})
        // .key(function(d){return d.})
        .rollup(function(leaves) { return leaves.length; });
//

    root_data = d3.hierarchy({values: nest_1.entries(data)}, function(d) { return d.values; })
        .sum(function(d) { return d.value; })
        .sort(function(a, b) { return b.value - a.value; });
    //console.log(root)
    treemap(root_data);
    //console.log(root);
    update()

    data_2 = [];
    data_3 = [];
}

function dragging(x){
     //console.log(x.invert(d3.event.x));
     h=x.invert(d3.event.y);
     //console.log(Math.round(h*2)/2);
     hh=Math.round(h*2)/2
     handle.attr("cy", x(hh));
     star_level =hh;

     var data_2 = [];
     var data_3 = [];


     console.log(d3.event.y);
    d3.select(".trackline").attr("height",d3.event.y);

  data.forEach(function(d){
    if(d.stars>=hh && price_state[d.price-1] != 0){d.stars_cat=1;}
    else d.stars_cat=0;
  });




  data.forEach(function(d){
      if(price_state[d.price-1] != 0){
          data_2.push(d);
      }
  });

  data_2.forEach(function(d){
        if(d.stars>=hh){
            data_3.push(d);
        }
    });

   symbol_map.data(data_3);
   symbol_map.update();

   histogram.data(data_3);
   histogram.update();




  nest_1 = d3.nest()
    .key(function(d) { return d.cat1; })
    .key(function(d) { return d.cat2; })
    .key(function(d) { return d.stars_cat; })
      // .key(function(d){return d.price;})
      // .key(function(d){return d.})
    .rollup(function(leaves) { return leaves.length; });


    root_data = d3.hierarchy({values: nest_1.entries(data)}, function(d) { return d.values; })
      .sum(function(d) { return d.value; })
      .sort(function(a, b) { return b.value - a.value; });

  //console.log(root)
  treemap(root_data);
  // console.log(root);
  update();
    // update_text("Total: " + data_3.length);

    data_2 = [];
    data_3 = [];
}

function update(){
    // root_data.leaves().forEach(function (d) { console.log(d);



    var node = g1.selectAll(".node")
    .data(root_data.leaves(),function (d) {

        if(d.parent.parent.data.key!="undefined"){ return d.parent.parent.data.key + d.data.key;}

    });


    tree_label = g1.selectAll(".node_label")
        .data(root_data.leaves());

    node
    .attr("class", function (d) { if(d3.select(this).attr("class")!="node s1 flip"){return 'node'+ " "+ "s"+d.data.key ;}else{ return "node s1 flip";}})
    .style("fill", function(d) { if(d3.select(this).attr("class")!="node s1 flip"){return color(d.data.key);}else{return "#85e085"; } })
    .attr("x", function(d) { return d.x0; } )
    .attr("y", function(d) { return d.y0; })
    .attr("width", function(d) { return d.x1 - d.x0 ; })
    .attr("height", function(d) { return d.y1 - d.y0 ; })
    .on("mouseover", function(d) {
        if(d.data.key =="1"){
            d3.select(this).style("stroke", "black");

            var v=[];
            if(d.parent.data.key!="undefined"){ v.push(d.parent.data.key)}
            if(d.parent.parent.data.key!="undefined"){ v.push(d.parent.parent.data.key)}

            dispatch.call("hover", this, [v, d.data])}
        })
    .on("click",function (d) {
        if(d.data.key =="1"){

            if(d3.select(this).attr("class") =="node s1"){
                //console.log(d3.select(this).attr("class") =="node s0");
                d3.selectAll(".s1").style("fill","#b2ff66");
                d3.selectAll(".s1").attr("class","node s1");

                d3.select(this).style("fill","#85e085");
                d3.select(this).attr("class","node s1 flip");

                var t=[];
                if(d.parent.data.key!="undefined"){ t.push(d.parent.data.key)}
                if(d.parent.parent.data.key!="undefined"){ t.push(d.parent.parent.data.key)}
                console.log("category",t);
                category_state=t;
                dispatch.call("click", this, [t, d.data])
                d3.event.stopPropagation();

            }
            else if(d3.select(this).attr("class") =="node s1 flip") {
                d3.select(this).style("fill","#b2ff66");
                d3.select(this).attr("class","node s1");
                console.log("reach")
                category_state =0;
                dispatch.call("click", this, [])
                d3.event.stopPropagation();

            }}



        // if(d.data.key =="1"){
        // var t=[];
        // if(d.parent.data.key!="undefined"){ t.push(d.parent.data.key)}
        // if(d.parent.parent.data.key!="undefined"){ t.push(d.parent.parent.data.key)}
        // // console.log("category",t);
        // category_state=t;
        // dispatch.call("click", this, [t, d.data])
        // d3.event.stopPropagation();}
        })
    .on("mouseout", function(d) {
            d3.select(this).style("stroke", "");
            dispatch.call("hover",this,[]);
        });

    node.enter()
    .append("rect")
    .attr("class", function (d) {


        // if(d3.select(this).attr("class")!="node s1 flip"){return 'node'+ " "+ "s"+d.data.key ;}else{ return "node s1 flip";

        if(d3.select(this).attr("class")!="node s1 flip")
        {return 'node'+ " "+ "s"+d.data.key ;}
        else{ return "node s1 flip";}
    })
    .style("fill", function(d) { if(d3.select(this).attr("class")!="node s1 flip"){return color(d.data.key);}else{return "#85e085"; } })
    .attr("opacity", 0.7)
    .attr("x", function(d) { return d.x0; } )
    .attr("y", function(d) { return d.y0; })
    .attr("width", function(d) { return d.x1 - d.x0 ; })
    .attr("height", function(d) { return d.y1 - d.y0 ; })
    .on("mouseover", function(d) {
        if(d.data.key =="1"){
            d3.select(this).style("stroke", "black")
            var v=[];
            if(d.parent.data.key!="undefined"){ v.push(d.parent.data.key)}
            if(d.parent.parent.data.key!="undefined"){ v.push(d.parent.parent.data.key)}

            dispatch.call("hover", this, [v, d.data])}
        })
    .on("mouseout", function(d) {
            d3.select(this).style("stroke", "")
            dispatch.call("hover",this,[])
        })
    .on("click",function (d) {
        if(d.data.key =="1"){

        if(d3.select(this).attr("class") =="node s1"){
            //console.log(d3.select(this).attr("class") =="node s0");
            d3.selectAll(".s1").style("fill","#b2ff66");
            d3.selectAll(".s1").attr("class","node s1");

            d3.select(this).style("fill","#85e085");
            d3.select(this).attr("class","node s1 flip");

                var t=[];
                if(d.parent.data.key!="undefined"){ t.push(d.parent.data.key)}
                if(d.parent.parent.data.key!="undefined"){ t.push(d.parent.parent.data.key)}
                console.log("category",t);
                category_state=t;
                dispatch.call("click", this, [t, d.data])
                d3.event.stopPropagation();

        }
        else if(d3.select(this).attr("class") =="node s1 flip") {
            d3.select(this).style("fill","#b2ff66");
            d3.select(this).attr("class","node s1");
            console.log("reach")
            category_state =0;
            dispatch.call("click", this, [])
            d3.event.stopPropagation();

        }}

        // if(d.data.key =="1"){
        // var t=[];
        // if(d.parent.data.key!="undefined"){ t.push(d.parent.data.key)}
        // if(d.parent.parent.data.key!="undefined"){ t.push(d.parent.parent.data.key)}
        // // console.log("category",t);
        // category_state=t;
        // dispatch.call("click", this, [t, d.data])
        // d3.event.stopPropagation();}
    });

    // g1.on("click",function (d) {
    //     dispatch.call("hover",this,[]);
    // })


    node.exit().remove();

    tree_label
        .attr("x", function(d) { return d.parent.parent.x0 + 3; })
        .attr("y", function(d) { return d.parent.parent.y0 + 20; })
        .style("font-size", function (d) { return (d.parent.parent.x1 - d.parent.parent.x0)/9;})
        .style('fill', 'grey')
        .text(function(d) {
            if(d.data.key=="0"){return "";}
            // if(d.parent.data.key!="undefined"){ return d.parent.data.key }
            if(d.parent.parent.data.key!="undefined"){ return d.parent.parent.data.key ;}
            if(d.parent.data.key=="undefined" && d.parent.parent.data.key=="undefined"){return "restaurant";}
        } )
        .style("pointer-events","none");


    tree_label .enter()
        .append("text")
        .attr("class", "node_label")
        .attr("x", function(d) { return d.parent.parent.x0 + 3; })
        .attr("y", function(d) { return d.parent.parent.y0 + 20; })
        .style("font-size", function (d) { return (d.parent.parent.x1 - d.parent.parent.x0)/9;})
        .style('fill', 'grey')
        .text(function(d) {

            if(d.data.key=="0"){return "";}
            // if(d.parent.data.key!="undefined"){ return d.parent.data.key; }
            if(d.parent.parent.data.key!="undefined"){ return d.parent.parent.data.key ;}
            if(d.parent.data.key!="undefined" && d.parent.parent.data.key!="undefined"){return "restaurant";}
        } )
        .style("pointer-events","none");

    tree_label.exit().remove();

}

  //combination getter and setter for the data attribute of the global chart variable
  chart.data = function(value, values_1) {
    var data_2 = [];
    if(!arguments.length) return data_1;

    data_1= value;
    // console.log(4444,data_1)

    data_categorties=values_1;


    var nest = d3.nest()
          .key(function(d) { return d.cat1; })
          .key(function(d) { return d.cat2; })
          .key(function(d) { return d.stars_cat; })
          // .key(function(d){return d.price;})
          .rollup(function(leaves) { return leaves.length; });

    treemap = d3.treemap()
          .size([width, height])
          .padding(0.5)
          .round(true);

    var count=[0,0];

    // grandparent.select("text")
    //           .text("Total Number of Businesses: "+ data_1.length);

      data=[];

    data_1.forEach(function(d) {
      data.push(d);

      for(i in d.categories){
        // console.log(d.categories[i]);
        for(j in data_categorties){
          //console.log(treemap_pre_date[j].key)
          //console.log(treemap_pre_date[j].values)
          if(d.categories[i]==data_categorties[j].key){   //like "french"
            //console.log(d.categories[i])
              if(count[0]==0){
                d.cat1=d.categories[i];
                count[0]++;

              }else{
                var cloneOfd = JSON.parse(JSON.stringify(d));
               //   console.log(cloneOfd);
                cloneOfd.cat1=d.categories[i];
                data.push(cloneOfd); 
              }
              break;          
          }
          if(data_categorties[j].values!=0){

            for(k in data_categorties[j].values){
              if(d.categories[i]==data_categorties[j].values[k].key){
                //console.log(d);
                if(count[1]==0){
                  d.cat2=d.categories[i];
                  count[1]++;
                }else{
                  d.cat2=d.categories[i];
                  var cloneOfd = JSON.parse(JSON.stringify(d));
                  // console.log(cloneOfd);
                  data.push(cloneOfd);                
                }
              }
              break;
            }
          }
      }}
      count=[0,0];
    });

      // data.forEach(function(d){
      //     if(price_state[d.price-1] != 0){
      //         data_2.push(d);
      //     }
      // });

      data.forEach(function(d){
          if(d.stars>=star_level && price_state[d.price-1] != 0){d.stars_cat=1;}
          else d.stars_cat=0;
      });

    root_data = d3.hierarchy({values: nest.entries(data)}, function(d) { return d.values; })
      .sum(function(d) { return d.value; })
      .sort(function(a, b) { return b.value - a.value; });

    treemap(root_data);

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

  chart.starlevel = function(){
        return star_level;
    }

    chart.pricestate = function(){
      return price_state;
    }
    chart.catstate = function () {
        return category_state;
    }

  return d3.rebind(chart, dispatch, "on");
}