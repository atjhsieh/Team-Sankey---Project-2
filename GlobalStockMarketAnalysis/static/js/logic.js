// $.get( "/getindicator/data" );
$(function(){
    $("#widget-plot").dxBarGauge({
        startValue: 0,
        endValue: 100,
        values: [47.27, 65.32, 84.59, 71.86],
        label: {
            indent: 30,
            format: {
                type: "fixedPoint",
                precision: 1
            },
            customizeText: function (arg) {
                return arg.valueText + " %";
            }
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Index Data by Year",
            font: {
                size: 28
            }
        }
    });
});

fill_dropdown(); 

var keys = ["Index Rate of Return", "Unemployment", "Inflation", "GDP Rate"];

var margin = { left:40, right:20, top:20, bottom:30 };

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")");

var yAxisGroup = g.append("g")
    .attr("class", "y axis");

var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

 var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });

var allYearData = {};
// var yearData = {};

d3.json("../static/data/AllYears.json").then(function(data){
    // console.log(data);
    allYearData = data;
    // console.log(allYearData);
    var baseYear = 2018;
    yearData = allYearData.filter(function(d) { return d.Year === baseYear; }); 
    // console.log(yearData);
    // var keys = ["Index Rate of Return", "Unemployment", "Inflation", "GDP Rate"];
    // console.log(keys);
    
    // update(2012);

    
    x0.domain(yearData.map(function(d) { return d.Country; }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(yearData, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

    g.append("g")
    .selectAll("g")
    .data(yearData)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.Country) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return z(d.key); });

    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));
    
     // X Axis
     var xAxisCall = d3.axisBottom(x0);
     xAxisGroup.call(xAxisCall);
    
    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"));
    
    // Y Axis
     var yAxisCall = d3.axisLeft(y)
     yAxisGroup.call(yAxisCall);

});

function update(year) {
    
    var yearData = allYearData.filter(function(d) { return d.Year === +year; }); 
    // console.log(allYearData);
    console.log(yearData);
    // console.log(year);
    
    x0.domain(yearData.map(function(d) { return d.Country; }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(yearData, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();
    
    // JOIN new data with old elements.
    var rects = g.selectAll("g")
        .data(yearData);
    
    // EXIT old elements not present in new data.
    rects.exit().remove();
    
    // UPDATE old elements present in new data.
    rects
        .attr("y", function(d) { return y(d.value); })
        .attr("x", function(d) { return x1(d.key); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", x1.bandwidth());
    
    // ENTER new elements present in new data.
    rects.enter()
        .append("rect")
            .attr("y", function(d) { return y(d.value); })
            .attr("x", function(d) { return x1(d.key); })
            .attr("height", function(d) { return height - y(d.value); })
            .attr("width", x1.bandwidth())
            .attr("fill", "grey");

    //g.append("g")
    //.selectAll("g")
    //.data(yearData)
    //.enter().append("g")
    //  .attr("transform", function(d) { return "translate(" + x0(d.Country) + ",0)"; })
    //.selectAll("rect")
    //.data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    //.enter().append("rect")
    //  .attr("x", function(d) { return x1(d.key); })
    //  .attr("y", function(d) { return y(d.value); })
    //  .attr("width", x1.bandwidth())
    //  .attr("height", function(d) { return height - y(d.value); })
    //  .attr("fill", function(d) { return z(d.key); });
    
    var xAxisCall = d3.axisBottom(x0);
    xAxisGroup.call(xAxisCall);
    
    var yAxisCall = d3.axisLeft(y)
    yAxisGroup.call(yAxisCall);
    
}
    
    
function fill_dropdown() {
    var dropdown = d3.select("#selDataset");
    list_year = ["2012", "2013", "2014", "2015", "2016", "2017", "2018"];
    list_year.forEach((year) => {
        dropdown
        .append("option")
        .text(year)
        .property("value", year);
    }); 
}

function optionChanged(year) {
    // console.log(allYearData);
    // console.log(year);
    // update(year);
    
}

// Chart Params
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 50 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select(".regression-plot")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from an external CSV file
d3.csv("../static/data/data.csv", function(error, myData) {
  if (error) throw error;

  console.log(myData);
  console.log([myData]);

  // Create a function to parse date and time
  // var parseTime = d3.timeParse("%d-%b-%Y");

  // Format the data
  myData.forEach(function(data) {
    data.Year = +data.Year;
    data.ROR = +data.ROR;
    data.GDPRate = +data.GDPRate;
    data.Unemployment = +data.Unemployment;
    data.Inflation = +data.Inflation;
  });

  // Create scaling functions
  var xTimeScale = d3.scaleTime()
    .domain(d3.extent(myData, d => d.Year))
    .range([0, width]);

  var yLinearScale1 = d3.scaleLinear()
    .domain([0, d3.max(myData, d => d.ROR)])
    .range([height, -30]);

  var yLinearScale2 = d3.scaleLinear()
    .domain([0, d3.max(myData, d => d.GDPRate)])
    .range([height, -30]);



  // Create axis functions
  var bottomAxis = d3.axisBottom(xTimeScale);
    // .tickFormat(d3.timeFormat("%d-%b-%Y"));
  var leftAxis = d3.axisLeft(yLinearScale1);
  var rightAxis = d3.axisRight(yLinearScale2);

  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Add y1-axis to the left side of the display
  chartGroup.append("g")
    // Define the color of the axis text
    .classed("green", true)
    .call(leftAxis);

  // Add y2-axis to the right side of the display
  chartGroup.append("g")
    // Define the color of the axis text
    .classed("blue", true)
    .attr("transform", `translate(${width}, 0)`)
    .call(rightAxis);

  // Line generators for each line
  var line1 = d3.line()
    .x(d => xTimeScale(d.Year))
    .y(d => yLinearScale1(d.ROR));
  
  var line2 = d3.line()
    .x(d => xTimeScale(d.Year))
    .y(d => yLinearScale2(d.GDPRate));
  
  var line3 = d3.line()
    .x(d => xTimeScale(d.Year))
    .y(d => yLinearScale3(d.Unemployment)); 
  
  var line3 = d3.line()
    .x(d => xTimeScale(d.Year))
    .y(d => yLinearScale3(d.Inflation)); 

  // Append a path for line1
  chartGroup.append("path")
    .data([myData])
    .attr("d", line1)
    .classed("line green", true);

  // Append a path for line2
  chartGroup.append("path")
    .data([myData])
    .attr("d", line2)
    .classed("line blue", true);

  // Append a path for line3
  chartGroup.append("path")
    .data([myData])
    .attr("d", line3)
    .classed("line red", true);

  // Append a path for line3
  chartGroup.append("path")
    .data([myData])
    .attr("d", line4)
    .classed("line black", true);    


  // Append axes titles
  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .classed("dow-text text", true)
    .text("ROR");

  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 37})`)
    .classed("smurf-text text", true)
    .text("GDP Rate");
});
