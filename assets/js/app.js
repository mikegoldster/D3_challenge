var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("../assets/data/data.csv").then(function(stateData){
  // Step 1: Parse Data/Cast as numbers
  stateData.forEach(function(data) {
    data.age = +data.age;
    data.income = +data.income;
  });
// Step 2: Create scale functions
var xLinearScale = d3.scaleLinear()
.domain([28, d3.max(stateData, d => d.age)])
.range([0, width]);

var yLinearScale = d3.scaleLinear()
.domain([30000, d3.max(stateData, d => d.income)])
.range([height, 0]);

 // Step 3: Create initial axis functions
 var bottomAxis = d3.axisBottom(xLinearScale);
 var leftAxis = d3.axisLeft(yLinearScale);

// Step 4: Append Axes to the chart
 chartGroup.append("g")
 .attr("transform", `translate(0, ${height})`)
 .call(bottomAxis);

// append y axis
chartGroup.append("g")
 .call(leftAxis);

    // Step 5: Create Circles
// function used for updating circles group with a transition to
// new circles

var circlesGroup = chartGroup.selectAll("circle")
.data(stateData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.age))
.attr("cy", d => yLinearScale(d.income))
.attr("r", "10")
.attr("fill", "blue")
.attr("opacity", ".8");


var circleLabels = chartGroup.selectAll(null).data(stateData).enter().append("text");
  
  circleLabels
    .attr("x", function(d) {
      return xLinearScale(d.age);
    })
    .attr("y", function(d) {
      return yLinearScale(d.income);
    })
    .text(function(d) {
      return d.abbr;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

// Step 6: Initialize tool tip

var toolTip = d3.tip()
.attr("class", "tip")
.offset([80, -60])
.html(function(d) {
  return (`${d.state}<br> Average Age:${d.age}<br>Average Income: ${d.income}`);
});

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });


    // Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Average Income ($) by State");
  
    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Average Age by State");
    });