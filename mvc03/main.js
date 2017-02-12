var body = d3.select("body")
var svg = body.append("svg")
    .attr("width", 800)
    .attr("height", 600)

var g1 = svg.append('g').attr("id", "g1")

var circleClass = {
    init: function (g){
	model1.call(this, g);
	view1.call(this);
	controller1.call(this);
    }
}

var cs = Object.create(circleClass)

cs.init("g1")

cs.draw()

