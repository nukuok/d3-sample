var svg = d3.select("body")
    .append("svg")
    .attr("width", 400)
    .attr("height", 600)

var svg2 = d3.select("body")
    .append("svg")
    .attr("x", 400)
    .attr("y", 0)
    .attr("width", 400)
    .attr("height", 600)

var imageNodeg = svg.append("g")
    // .attr("transform", "translate(100,100)")

var h = Object.create(image);
h.init(imageNodeg);
h.draw("image/sample.jpg");

var data = ["image/sample.jpg","image/sample.jpg","image/sample.jpg","image/sample.jpg",]

function attach(nodeg){
    var obj = Object.create(image);
    obj.init(nodeg);
    obj.draw("image/sample.jpg")
}

var svg2nodegs = svg2.selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .call(attach)


