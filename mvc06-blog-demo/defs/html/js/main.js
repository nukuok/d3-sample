var diameter = 600,
    radius = diameter / 2,
    innerRadius = radius - 120;

var svg = d3.select("body").append("svg")
    .attr("width", diameter * 2)
    .attr("height", diameter * 1.5)

var rootg = svg.append("g")
    .attr("transform", "translate(" + 320 + "," + 250 + ")");

eg1 = Object.create(edgeGraph);
eg1.init(rootg);
eg1.setModel(servers);
eg1.draw(220, true);


var circleg = svg.append("g")
    .attr("transform", "translate(" + 320 + "," + 250 + ")")

var records = new Array(20).fill(0);
var circles = new Array(20).fill(0);


var circleColor = d3.scaleOrdinal(d3.schemeCategory20);
for (var i = 0; i < records.length; i++) {
    circles[i] = circleg.append("circle")
	.attr("fill", circleColor(i))
	.attr("stroke", "black")
	.attr("rx", eg1)
	.attr("ry", 100)
	.attr("r", 10)
}

var recordUpdate = function(){
    d3.json("/records", function(res){
	for (var i = 0; i < records.length; i++) {
	    if (records[i] != res[i]){
		circles[i].transition()
		    .delay(i * 240)
		    .duration(1000)
	    	    .ease(d3.easeLinear)
		    .attrTween("transform", translateAlong(eg1.linksDict["State" + records[i]]["State" + res[i]]))
	    }
	}
	records = res;
    })
}

setInterval(recordUpdate, 5000)

var subdata = new Array(6).fill(new Array(6).fill(0));
var subg = svg.append("g");
var barGraphs = []

var tempg;
for (var i = 0; i < subdata.length; i++) {
    tempg = subg.append("g")
	// .attr("transform", "translate(" + (700 + (i % 2) * 180) + "," + (20 + (i - i % 2) / 2 * 180) + ")")
	.attr("transform", "translate(" + 760 + "," + (20 + i * 90) + ")")
    var tempbg = Object.create(barGraph);
    tempbg.init(tempg);
    tempbg.setModel(subdata[i]);
    tempbg.draw(i);
    barGraphs.push(tempbg);
}

var countUpdate = function(){
    d3.json("/counts", function(res){
	subdata = res;
	for (var i = 0; i < subdata.length; i++) {
	    // console.log(i);
	    // console.log(res[i]);
	    barGraphs[i].update(res[i]);
	}
    })
}

setInterval(countUpdate, 5000)

// // transition();
// // Returns an attrTween for translating along the specified path element.
// function transition1() {
//     circle1.transition()
// 	.duration(1000)
// 	.attrTween("transform", translateAlong(eg1.linksDict.State0.State1))
// }
// function transition2() {
//     circle2.transition()
// 	.duration(1000)
// 	.ease(d3.easeLinear)
// 	.attrTween("transform", translateAlong(eg1.linksDict.State1.State2))
// }
function translateAlong(path) {
  var l = path.getTotalLength();
  return function(d, i, a) {
    return function(t) {
      var p = path.getPointAtLength(t * l);
      return "translate(" + p.x + "," + p.y + ")";
    };
  };
}
