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

stateData.forEach(function(data) {
  data.age = +data.age;
  data.poverty = +data.poverty;
})

//scales and axes

var xPovertyScale = d3.scaleLinear() 
    .domain(d3.extent(stateData, d => d.poverty)) // NEW!(ish). What is `.extent()`
    .range([0, width]);

var yAgeScale = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d.age)])
    .range([height, 0]);

var bottomAxis = d3.axisBottom(xPovertyScale);
var leftAxis = d3.axisLeft(yAgeScale);

chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

chartGroup.append("g")
    .call(leftAxis);

// chartGroup.append("g")
//    .selectAll("dot")
//    .data(stateData)
//    .enter()
//    .append("circle")
//    .attr("cx", function(d){
//        return xPovertyScale(d.poverty);
//     })
//     .attr("cy", function(d){
//         return yAgeScale(d.age);
//     })
//     .attr("r", 5)
//     .style("fill", "#69b3a2");

//make dots
var scatterDots = chartGroup.selectAll("dot")
                  .data(stateData)
                  .enter().append("g");

scatterDots.append("circle")
            .attr("class", "dot")
            .attr("cx", function(d){
              return xPovertyScale(d.poverty);
           })
           .attr("cy", function(d){
               return yAgeScale(d.age);
           })
           .attr("r", 10)
           .style("fill", "#69b3a2");
scatterDots.append("text").text(function(d){
                          return d.abbr;
                          })
                          .attr("x", function (d) {
                            return xPovertyScale(d.poverty);
                        })
                        .attr("y", function (d) {
                            return yAgeScale(d.age)+3;
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
.text("Poverty(%)");

//y axis title
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", 0-height/2)
  .attr("y", 0-margin.left)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .attr("fill", "green")
  .text("Age");

}, function(error) {
    console.log(error);
  });