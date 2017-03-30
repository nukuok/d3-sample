function barGraphModel(){
    this.model = {};
    this.setModel = function(model){
	this.model = model;
    }
}

function barGraphController(){
    this.update = function(data){
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 400 - margin.left - margin.right,
	    height = 100 - margin.top - margin.bottom;

	var x = this.x;
	var y = this.y;
	this.bars
	    .data(data)
	    .transition()
	    .duration(150)
	    .attr("x", function(d,i) { return x("State" + i); })
	    .attr("width", x.bandwidth())
	    .attr("y", function(d) { return y(d); })
	    .attr("height", function(d) { return height - y(d); });

	this.nodeg.selectAll(".num").remove()

	this.nodeg.selectAll(".num")
	    .data(data)
	    .enter().append("text")
	    .attr("class", "num")
	    .attr("fill", "red")
	    .attr("x", function(d,i) { return x("State" + i) + x.bandwidth() / 2; })
	    .attr("y", function(d) { return y(d) - 2; })
	    .style("text-anchor", "middle")
	    .text(function(d){return d;})
    }
}

function barGraphView(){
    this.draw = function(ii){
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 400 - margin.left - margin.right,
	    height = 100 - margin.top - margin.bottom;

	this.x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
	this.y = d3.scaleLinear()
            .range([height, 0]);

	var x = this.x;
	var y = this.y;
	// Scale the range of the data in the domains
	this.x.domain(this.model.map(function(d,i) { return "State" + i; }));
	// y.domain([0, d3.max(this.model)]);
	this.y.domain([0, 300]);

	this.nodeg.append("g")
	    .append("rect")
	    .attr("x", 0)
	    .attr("y", 0)
	    .attr("width", width)
	    .attr("height", height)
	    .attr("fill", "none")
	    .attr("stroke", "black")
	    .style("stroke-width", "0.5px")

	// append the rectangles for the bar chart
	this.bars = this.nodeg.selectAll(".bar")
	    .data(this.model)
	    .enter().append("rect")
	    .attr("fill", "blue")
	    .attr("class", "bar")
	    .attr("x", function(d,i) { return x("State" + i); })
	    .attr("width", x.bandwidth())
	    .attr("y", function(d) { return y(d); })
	    .attr("height", function(d) { return height - y(d); });

	this.nodeg.append("g")
	    .attr("transform", "translate(-120," + (height/2) + ")")
	    .append("text")
	    .text("==> State" + ii)

	// add the x Axis
	this.nodeg.append("g")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x));

	// add the y Axis
	this.nodeg.append("g")
	    .call(d3.axisLeft(y).ticks(4));
    }
}

var barGraph = {
    init: function(g){
	this.nodeg = g;
	barGraphModel.call(this);
	barGraphController.call(this);
	barGraphView.call(this);
    }
}
