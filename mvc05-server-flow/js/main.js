svg = d3.select("body")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 1000)

nodeg = svg.append("g");

sc1 = Object.create(serverCircle);
sc1.init(nodeg);
sc1.setModel({cx: 100, cy: 100, serverId: 1, r: 10, fill: "grey", serverName: "server1"});
sc1.draw();

