/**
 * Created by hongzhangcheng on 12/12/16.
 */

if(!d3.chart) d3.chart = {};

d3.chart.suggestion = function(){

    var dispatch = d3.dispatch(chart, "hover");
    var g;
    var data;
    var title_font_size = "15px";
    var title_font_family = "Bree Serif";
    var width = width_tree  + 90;
    var height = height_tree/2;

    function chart(container) {
        g = container;
        create();
    }

    chart.update = update;


    function create() {
        g.append("text")
            .attr("class", "suggestion")
            .text("Top 5 popular restaurants:")
            .attr("x", 10)
            .attr("y", 15)
            .style("font-family", title_font_family)
            .style("font-size", title_font_size)
            .attr("text-anchor", "left");

        g.append("text")
            .attr("class", "suggestion")
            .text("The hidden pearls:")
            .attr("x", width/2)
            .attr("y", 15)
            .style("font-family", title_font_family)
            .style("font-size", title_font_size)
            .attr("text-anchor", "left");

    }

    function update() {
            var i = 0;
            var j = 0;
            var data_1 =[];
            var data_2 =[];

       data.sort(function (a,b) {
           return b.review_count - a.review_count
       })
       data.forEach(function (d) {
           if(i<5){ data_1.push(d);}
           i++;
       })

        // data.sort(function (a,b) {
        //     return b.stars - a.stars;
        // })

        data.forEach(function (d) {
            if(d.review_count < 100 && d.stars == 5){ data_2.push(d);}
            // j++;
        })




        // var data_1 =[data[0],data[1],data[2],data[3],data[4]];

       // data_1.forEach(function (d) {
       //     console.log(d.review_count);
       // })
       //
       // console.log(11112222,data_2);

      top5g =  g.append("g")
            .attr("class","top5")
            .attr("transform", "translate(" + 10 + "," + 15+ ")");

      hiddeng =  g.append("g")
          .attr("class","hiddeng")
          .attr("transform", "translate(" + width/2 + "," + 15+ ")");

      d3.selectAll(".top_5").remove();
      d3.selectAll(".hiddenp").remove();

      top5 = top5g.selectAll("text").data(data_1);
      hidden = hiddeng.selectAll("text").data(data_2);

      top5.enter()
          .append("text")
          .attr("class","top_5")
          .text(function (d) { return d.name;})
          .attr("x",function (d,i) {
              if(i<2){return (i)*width/6;}else{ return (i-2)*width/6;  }
          })
          .attr("y",function (d,i) {
              if(i<2){return height/4;}else{ return height/2;  }
          })
          .attr("text-anchor", "left")
          .style("font-size", 12)
          .on("click",function (d) {
              d3.selectAll(".top_5").style("fill","black");
              d3.select(this).style("fill","red");
              symbol_map.data([d]);
              symbol_map.update();
              businessinfo.data(d);
              businessinfo.update();
              d3.select("#rightpanel").transition().duration(200)
                  .style("right", +0 + "px");
          });


      hidden.enter()
            .append("text")
            .attr("class","top_5")
            .text(function (d) { return d.name;})
            .attr("x",function (d,i) {
                if(i<2){return (i)*width/6;}else{ return (i-2)*width/6;  }
            })
            .attr("y",function (d,i) {
                if(i<2){return height/4;}else{ return height/2;  }
            })
            .attr("text-anchor", "left")
          .style("font-size", 12)
          .on("click",function (d) {
              d3.selectAll(".top_5").style("fill","black");
              d3.select(this).style("fill","red");
              symbol_map.data([d]);
              symbol_map.update();
              businessinfo.data(d);
              businessinfo.update();
              d3.select("#rightpanel").transition().duration(200)
                  .style("right", +0 + "px");
      });




        //console.log(data["attributes"]["Price Range"])
        //
        // g.select(".name").remove();
        // g.append("text")
        //     .attr("class", "name")
        //     .text(data["name"])
        //     .attr("x", right_panel_width / 2)
        //     .attr("y", 20)
        //     .style("font-family", title_font_family)
        //     .style("font-size", title_font_size)
        //     .attr("text-anchor", "middle");
        //
        // g.select(".stars").remove();
        // g.append("text")
        //     .attr("class", "stars")
        //     .text("Stars: " + rate_star[data["stars"]])
        //     .attr("x", right_panel_width / 2)
        //     .attr("y", 40)
        //     .style("font-size", "10px")
        //     .attr("text-anchor", "middle");
        //
        // g.select(".price").remove();
        // g.append("text")
        //     .attr("class", "price")
        //     .text("Price:" + price_range[data["attributes"]["Price Range"]])
        //     .attr("x", right_panel_width / 2)
        //     .attr("y", 60)
        //     .attr("text-anchor", "middle");
        //
        // g.select(".reviews").remove();
        // g.append("text")
        //     .attr("class", "reviews")
        //     .text("Reviews: " + data["review_count"] )
        //     .attr("x", right_panel_width / 2)
        //     .attr("y", 80)
        //     .style("font-size", "10px")
        //     .attr("text-anchor", "middle");
        //
        // g.select(".categories").remove();
        //
        // g.append("text")
        //     .attr("class", "categories")
        //     .text(data["categories"], function () {
        //         return d;
        //     })
        //     .attr("x", right_panel_width / 2)
        //     .attr("y", 120)
        //     .style("font-size", "10px")
        //     .attr("text-anchor", "middle");
        //
        //
        // rg.remove();
        // rg = d3.select("#rightpanel .panel_svg").append("g").attr("id", "ratechart");
        // review()

    }


    //combination getter and setter for the data attribute of the global chart variable
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

        // console.log("suggestion data",data);

        data_1 = [];
        data_2 = [];
        data_3 = [];

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