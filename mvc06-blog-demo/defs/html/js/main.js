var diameter = 600,
    radius = diameter / 2,
    innerRadius = radius - 120;

var svg = d3.select("body").append("svg")
    .attr("width", diameter * 2)
    .attr("height", diameter * 1.5)

var rootg = svg.append("g")
    .attr("transform", "translate(" + 300 + "," + 300 + ")");

var subdata;
var subgs = svg.append("g");

d3.json("/counts", function(res){
    subdata = res;
    var tempg
    for (var i = 0; i < subdata.length; i++) {
	tempg = subgs.append("g")
	    .attr("transform", "translate(" + (700 + (i % 2) * 180) + "," + (150 + (i - i % 2) / 2 * 180) + ")")
	var tempeg = Object.create(edgeGraph);
	tempeg.init(tempg);
	tempeg.setModel(servers);
	tempeg.draw(80, false);
    }
})

eg1 = Object.create(edgeGraph);
eg1.init(rootg);
eg1.setModel(servers);
eg1.draw(220, true);


var circleg = svg.append("g")
    .attr("transform", "translate(" + 300 + "," + 300 + ")")

var records = new Array(20).fill(0);
var circles = new Array(20).fill(0);

for (var i = 0; i < records.length; i++) {
    circles[i] = circleg.append("circle")
    .attr("fill", "grey")
    .attr("stroke", "black")
    .attr("rx", eg1)
    .attr("ry", 100)
    .attr("r", 5)
}

d3.json("/records", function(res){
    for (var i = 0; i < records.length; i++) {
	circles[i].transition()
	    .duration(1000)
	    .attrTween("transform", translateAlong(eg1.linksDict["State" + records[i]]["State" + res[i]]))
    }
    records = res;
})

// transition();
// Returns an attrTween for translating along the specified path element.
function transition1() {
    circle1.transition()
	.duration(1000)
	.attrTween("transform", translateAlong(eg1.linksDict.State0.State1))
}
function transition2() {
    circle2.transition()
	.duration(1000)
	.ease(d3.easeLinear)
	.attrTween("transform", translateAlong(eg1.linksDict.State1.State2))
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
