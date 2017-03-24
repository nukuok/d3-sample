// svg = d3.select("body")
//     .append("svg")
//     .attr("width", 1000)
//     .attr("height", 1000)

// nodeg = svg.append("g");

// sc1 = Object.create(serverCircle);
// sc1.init(nodeg);
// sc1.setModel({cx: 100, cy: 100, serverId: 1, r: 10, fill: "grey", serverName: "server1"});
// sc1.draw();

var diameter = 600,
    radius = diameter / 2,
    innerRadius = radius - 120;

var svg = d3.select("body").append("svg")
    .attr("width", diameter * 1.5)
    .attr("height", diameter * 1.5)

var rootg = svg.append("g")
    .attr("transform", "translate(" + 500 + "," + 200 + ")");


eg1 = Object.create(edgeGraph);
eg1.init(rootg);
eg1.setModel(servers);
eg1.draw();


var circleg = svg.append("g")
    .attr("transform", "translate(" + 500 + "," + 200 + ")")
var circle1 = circleg.append("circle")
    .attr("fill", "grey")
    .attr("stroke", "black")
    .attr("rx", 100)
    .attr("ry", 100)
    .attr("r", 10)

var circle2 = circleg.append("circle")
    .attr("fill", "grey")
    .attr("stroke", "black")
    .attr("rx", 100)
    .attr("ry", 100)
    .attr("r", 10)

// transition();
// Returns an attrTween for translating along the specified path element.
function transition1() {
    circle1.transition()
	.duration(1000)
	.attrTween("transform", translateAlong(eg1.linksDict.DA.BA))
}
function transition2() {
    circle2.transition()
	.duration(1000)
	.ease(d3.easeLinear)
	// .ease("linear")
	.attrTween("transform", translateAlong(eg1.linksDict.BA.CA))
}
function translateAlong(path) {
  var l = path.getTotalLength();
  return function(d, i, a) {
    return function(t) {
      var p = path.getPointAtLength(t * l);
      return "translate(" + p.x + "," + p.y + ")";
    };
  };
}
