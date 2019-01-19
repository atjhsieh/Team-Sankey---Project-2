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

// Chart Params
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 70, left: 50 };

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
d3.csv("data.csv", function(error, myData) {
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

  console.log([myData].Year);

  // Create scaling functions
  var xTimeScale = d3.scaleTime()
    .domain(d3.extent(myData, d => d.Year))
    .range([0, width]);

  var yLinearScale1 = d3.scaleLinear()
    .domain([d3.min(myData, d => d.ROR), d3.max(myData, d => d.ROR)])
    .range([height, 0]);

  var yLinearScale2 = d3.scaleLinear()
    .domain([d3.min(myData, d => d.GDPRate), d3.max(myData, d => d.GDPRate)])
    .range([height, 0]);
    



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

  //Line generators for each line
  var line1 = d3.line()
    .x(d => xTimeScale(d.Year))
    .y(d => yLinearScale1(d.ROR));
  
  var line2 = d3.line()
    .x(d => xTimeScale(d.Year))
    .y(d => yLinearScale2(d.GDPRate));
  
  var line3 = d3.line()
    .x(d => xTimeScale(d.Year))
    .y(d => yLinearScale2(d.Unemployment)); 
  
  var line4 = d3.line()
    .x(d => xTimeScale(d.Year))
    .y(d => yLinearScale2(d.Inflation)); 

  //Append a path for line1
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
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("fill", "none");

  // Append a path for line4
  chartGroup.append("path")
    .data([myData])
    .attr("d", line4)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", "none");   


  // Append axes titles
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 7})`)
    .classed("ROR-text text", true)
    .text("ROR");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .classed("GDP-text text", true)
    .text("GDP Rate");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 35 })`)
    .classed("UE-text text", true)
    .text("Unemployment");
  
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 50})`)
    .classed("inflation-text text", true)
    .text("Inflation");




});
