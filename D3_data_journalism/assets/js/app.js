// @TODO: YOUR CODE HERE!

//define workspace area
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //pull data from csv
d3.csv("./data.csv").then(function(stateData) {
    console.log(stateData);

    //change the data i need from string to int
stateData.forEach(function(data) {
  data.income = +data.income;
  data.healthcare = +data.healthcare;
})

//scales and axes

var xScale = d3.scaleLinear() 
    .domain(d3.extent(stateData, d => d.healthcare)) // NEW!(ish). What is `.extent()`
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d.income)])
    .range([height, 0]);

var bottomAxis = d3.axisBottom(xScale);
var leftAxis = d3.axisLeft(yScale);

chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

chartGroup.append("g")
    .call(leftAxis);

// Step 1: Initialize Tooltip
var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`<strong>${d.state}<strong><hr>Healthcare: ${d.healthcare}%
        <br> Income: ${d.income}`);
        });

// Step 2: Create the tooltip in chartGroup.
chartGroup.call(toolTip);

//make dots
var scatterDots = chartGroup.selectAll("dot")
                  .data(stateData)
                  .enter().append("g");

//append the dots & add the mouseover/mouseout 
scatterDots.append("circle")
            .attr("class", "dot")
            .attr("cx", function(d){
              return xScale(d.healthcare);
           })
           .attr("cy", function(d){
               return yScale(d.income);
           })
           .attr("r", 10)
           .style("fill", "#69b3a2")
           .attr("stroke", "black")
           .on("mouseover", function(d) {
            toolTip.show(d, this);
            })
            .on("mouseout", function(d) {
            toolTip.hide(d);
            });

           

//append text to dots
scatterDots.append("text").text(function(d){
  return d.abbr;
  })
  .attr("x", function (d) {
    return xScale(d.healthcare);
  })
  .attr("y", function (d) {
    return yScale(d.income)+3;
    })
  .attr("font-family", "sans-serif")
  .attr("font-size", "12px")
  .attr("text-anchor", "middle")
  .attr("fill", "white");



//x axis title
chartGroup.append("text")
.attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
.attr("text-anchor", "middle")
.attr("font-size", "16px")
.attr("fill", "green")
.text("Healthcare(%)");

//y axis title
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", 0-height/2)
  .attr("y", 0-margin.left)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .attr("fill", "green")
  .text("Avg Income");

}, function(error) {
    console.log(error);
  });