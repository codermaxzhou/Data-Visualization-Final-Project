/**
 * Created by yihaozhou on 11/28/16.
 */
if(!d3.chart) d3.chart = {};

d3.chart.businessinfo = function() {
    var dispatch = d3.dispatch(chart, "hover");
    var g;
    var data;
    var title_font_size = "20px";
    var title_font_family = "Bree Serif";
    var info_font_size = "15px;"
    var rg;
    width = 900;
    height = 250;
    padding = 30;
    var border = 1;
    var bordercolor = 'black';
    var rateChartX = (right_panel_width - 200) / 2;
    var rateChartY = 150;
    var rate_star = { 1: "★", 2: "★★", 3: "★★★", 4: "★★★★", 5: "★★★★★",
        1.5: "★☆", 2.5: "★★☆", 3.5: "★★★☆", 4.5: "★★★★☆" };

    var price_range = { 1: "$", 2: "$$", 3: "$$$", 4: "$$$$"};



    function chart(container) {
        g = container;
        create();
    }

    chart.update = update;


    function create() {

        g.append("text")
            .attr("class", "name")
            .text("")
            .style("font-family", title_font_family)
            .style("font-size", title_font_size)
            .attr("text-anchor", "middle");

        g.append("div")
            .attr("class", "info")
            .text("")
            .attr("text-anchor", "middle")
            .style("font-family", title_font_family)
            .style("font-size", info_font_size);

        rg = d3.select("#rightpanel .panel_svg").append("g").attr("id", "ratechart");

    }

    function update() {

        g.select(".name").remove();
        g.append("text")
            .attr("class", "name")
            .text(data["name"] + "\n")
            .style("font-family", title_font_family)
            .style("font-size", title_font_size)
            .attr("text-anchor", "middle");

        g.select(".info").remove();
        g.append("div")
            .attr("class", "info")
            .style("font-size", info_font_size)
            .style("font-family", title_font_family)
            .attr("text-anchor", "middle")
            .text("Rate: " + rate_star[data["stars"]] + "\n");

        g.select(".info")
            .append("div")
            .attr("class", "info")
            .style("font-size", info_font_size)
            .style("font-family", title_font_family)
            .attr("text-anchor", "middle")
            .text("Price: " + price_range[data["attributes"]["Price Range"]] + "\n");


        g.select(".info")
            .append("div")
            .attr("class", "info")
            .style("font-size", info_font_size)
            .style("font-family", title_font_family)
            .attr("text-anchor", "middle")
            .text("Reviews: " + data["review_count"] + "\n");


        g.select(".info")
            .append("div")
            .attr("class", "info")
            .style("font-size", info_font_size)
            .style("font-family", title_font_family)
            .attr("text-anchor", "middle")
            .text("Category: " + data["categories"], function () {
                return d;
            });

        g.select(".info")
            .append("div")
            .attr("class", "info")
            .style("font-size", info_font_size)
            .style("font-family", title_font_family)
            .attr("text-anchor", "middle")
            .text("Address: " + data["full_address"] + "\n");

        rg.remove();
        rg = d3.select("#rightpanel .panel_svg").append("g").attr("id", "ratechart");
        review()

    }

    function review() {

        s1 = data.rating_count["1"] != undefined ? data.rating_count["1"] : 0;
        s2 = data.rating_count["2"] != undefined ? data.rating_count["2"] : 0;
        s3 = data.rating_count["3"] != undefined ? data.rating_count["3"] : 0;
        s4 = data.rating_count["4"] != undefined ? data.rating_count["4"] : 0;
        s5 = data.rating_count["5"] != undefined ? data.rating_count["5"] : 0;
        r1 = data.reviews["1"] != undefined ? data.reviews["1"] : [];
        r2 = data.reviews["2"] != undefined ? data.reviews["2"] : [];
        r3 = data.reviews["3"] != undefined ? data.reviews["3"] : [];
        r4 = data.reviews["4"] != undefined ? data.reviews["4"] : [];
        r5 = data.reviews["5"] != undefined ? data.reviews["5"] : [];

//        console.log([s1,s2,s3,s4,s5])
//        console.log([r1,r2,r3,r4,r5])
        star = [{"rate": s1, "content": r1}, {"rate": s2, "content": r2}, {"rate": s3, "content": r3}, {
            "rate": s4,
            "content": r4
        }, {"rate": s5, "content": r5}];
        stars = [1, 1, 1, 1, 1];
        stars_lable = ["1 star", "2 star", "3 star", "4 tar", "5 star"];

//        console.log(star);

        x = d3.scaleLinear()
            .domain([0, data.review_count]).range([0, width / 8]);

        y = d3.scaleBand()
            .domain(star.map(function (d, i) {
                return i;
            }))
            .range([2 * padding, 5 * padding], .1);

//        console.log(y.bandwidth());

        rg.append("line").attr("transform", "translate( " + rateChartX + " , " + rateChartY + " )")
            .attr("x1", padding)
            .attr("y1", 0)
            .attr("x2", padding)
            .attr("y2", y.bandwidth() * 5)
            .style("stroke", "black")
            .style("stoke-width", 1);


        backgroud = rg.append("g")
            .attr("transform", "translate( " + rateChartX + " , " + rateChartY + " )");

        backgroud.selectAll(".lable").data(stars_lable).enter()
            .append("text").attr("class", "lable")
            .text(function (d) {
                return d;
            })
            .attr("x", padding / 7)
            .attr("y", function (d, i) {
                return i * y.bandwidth() + y.bandwidth() / 2 + 3;
            })
            .style("text-anchor", "middle")
            .style("stroke-width", 0.5)
            .style("stroke", "black")
            .style("font-size", "10px")
            .style("font-family", title_font_family);

        backgroud.selectAll(".rect_backgroud")
            .data(stars)
            .enter()
            .append("rect")
            .attr("class", "rect_backgroud")
            .attr("x", padding)
            .attr("y", function (d, i) {
                return i * y.bandwidth();
            })
            .attr("width", x(data.review_count))
            .attr("height", y.bandwidth() - 2)
            .style("fill", "grey")
            .style("opacity", 0.1)
            .style("stroke", bordercolor)
            .style("stroke-width", border)
            .style("stroke-style", "inset");


        r_bar = rg.append("g")
            .attr("transform", "translate( " + rateChartX + " , " + rateChartY + " )");

        r_bar = r_bar.selectAll("rect").data(star);

        r_bar.transition().duration(200)
            .attr("width", function (d) {
                return x(d.rate);
            })
            .on("click", showreview);


        r_bar.enter().append("rect")
            .attr("class", "review_bar")
            .attr("x", padding)
            .attr("y", function (d, i) {
                return i * y.bandwidth();
            })
            .attr("width", function (d) {
                return x(d.rate);
            })
            .attr("height", y.bandwidth() - 2)
            .style("fill", "lightblue")
            .style("stroke", bordercolor)
            .style("stroke-width", 1)
            .style("stroke-style", "outset")
            .on("click", showreview);

        r_bar.exit().remove();


        p = d3.format(",.2%");

        r_bar.enter().append("text")
            .attr("class", "review_bar_text")
            .attr("x", x(data.review_count) + 35)
            .attr("y", function (d, i) {
                return i * y.bandwidth() + y.bandwidth() / 2 + 3;
            })
            .text(function (d) {
                return p(d.rate / data.review_count);
            })
            .style("text-anchor", "start")
            .style("font-size", "10px")
            .style("stroke-width", 0.5)
            .style("stroke", "black")
            .style("font-family", title_font_family);


        function showreview(d) {
            // console.log(d)
            d3.selectAll(".review_bar").style("fill", "lightblue");
            //
            d3.select(this).style("fill", "darkblue");
            d3.selectAll(".review_content").remove();

            var count = 0;

            var review = d3.select("#review");

            d.content.forEach(function (element) {
                if (count%2 == 0){
                    review.append("div")
                        .attr("class", "review_content")
                        .style("background-color", "grey")
                        .style("color", "white")
                        .style("font-family", "serif")
                        .style("font-size", "16px")
                        .text(element);
                }
                else {
                    d3.select("#review").append("div")
                        .attr("class", "review_content")
                        .style("background-color", "white")
                        .style("font-family", "serif")
                        .style("font-size", "16px")
                        .text(element);
                }
                count++;
            });

            review.transition().duration(200)
                .style("right", right_panel_width + "px");

            review.on("click", function() {
                review.transition().duration(200)
                    .style("right", -review_panel_width + "px");

            })
        }
    }



    //combination getter and setter for the data attribute of the global chart variable
    chart.data = function(value) {
        if(!arguments.length) return data;
        data = value;
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
