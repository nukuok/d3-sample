var body = d3.select("body")
var svg = body.append("svg")
    .attr("width", 800)
    .attr("height", 600)

var g1 = svg.append('g')
var g2 = svg.append('g')

var circleClass = {
    init: function (){
	model1.call(this);
	view1.call(this);
    }
}

var c1 = Object.create(circleClass)
var c2 = Object.create(circleClass)

c1.init()
c2.init()

c1.draw(g1)
c2.draw(g2)

