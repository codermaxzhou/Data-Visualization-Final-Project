if(!d3.chart) d3.chart = {};

d3.chart.heatmap = function() {
    var dispatch = d3.dispatch(chart, "hover");
    var g;
    var margin = {top: 6, right: 0, bottom: 0, left: 6},
        width = 200,
        height = 100,
        // gridSize = Math.floor((width - 30) / 24),
        gridWidth = Math.floor((width - 15) / 24),
        gridHeight = Math.floor((height - 15) / 7),
        grid_x_offset =  0,
        legendElementWidth = gridWidth,
        buckets = 9,
        rawdata,
        colors = ['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b'],
        days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        times = [ "4a", "8a", "12a", "4p", "8p", "12p"];

    var data = [];

    // console.log(data);

    function chart(container) {
        g = container;
        // console.log(g)
        processData(rawdata);
        // console.log(rawdata);
        // console.log(data);
        create(data);
    }

// change raw data format to {day, hour, value}
    function processData(dataset) {

        for (i = 0; i < 7; i++) {
            for (j = 0; j < 24; j++) {
                data.push({day: i, hour: j, value: 0});
            }
        }

        for (var property in dataset) {
            if (dataset.hasOwnProperty(property)) {
                var temp = property.split("-");
                for (var item in data) {
                    if (data[item].day == +temp[1] && data[item].hour == +temp[0]) {
                        data[item].value = dataset[property];
                    }
                }
//            data.push({day: +temp[1], hour: +temp[0], value: dataset[property]});
            }
        }

    }


    var create = function (data) {

        // console.log(right_panel_width)
        g.attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + (right_panel_width - right_panel_padding * 2 - width) + "," + 20 + ")");
        var dayLabels = g.selectAll(".dayLabel")
            .data(days)
            .enter().append("text")
            .text(function (d) {
                return d;
            })
            .attr("x", 0)
            .attr("y", function (d, i) {
                return i * gridHeight;
            })
            .style("text-anchor", "end")
            .attr("transform", "translate(0," + (margin.top+8) + ")")
            .attr("class", function (d, i) {
                return ((i >= 1 && i <= 5) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis");
            });

        var timeLabels = g.selectAll(".timeLabel")
            .data(times)
            .enter().append("text")
            .text(function (d) {
                return d;
            })
            .attr("x", function (d, i) {
                return i * gridWidth * 4 + gridWidth;
            })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + (margin.left+6) + ", 0)")
            .attr("class", function (d, i) {
                return ((i >= 1 && i <= 4) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis");
            });

        var colorScale = d3.scaleQuantile()
            .domain([0,1,2,3,4,5,6,7,8])
            .range(colors);

        var cards = g.selectAll(".hour")
            .data(data, function (d) {
                return d.day + ':' + d.hour;
            });

        cards.enter().append("rect")
            .attr("x", function (d) {
                return (d.hour) * gridWidth + margin.left;
            })
            .attr("y", function (d) {
                return (d.day) * gridHeight + margin.top;
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "hour bordered")
            .attr("width", gridWidth)
            .attr("height", gridHeight)
            .style("fill", function(d) { return colorScale(0); })
            .transition().duration(200)
            .style("fill", function(d) { return colorScale(d.value); });

        // cards.transition().duration(1000)
        //     .style("fill", function (d) {
        //         return colorScale(d.value + 1);
        //     });

        // cards.select("title").text(function (d) {
        //     return d.value;
        // });

        // cards.exit().remove();

    }


    //combination getter and setter for the data attribute of the global chart variable
    chart.data = function(value) {
        if(!arguments.length) return rawdata;
        rawdata = value;
        // console.log(rawdata)
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
