// https://bl.ocks.org/bstitt79/66fe8f50dccaac6a58094566d2a870fe
function packageHierarchy(classes) {
    var map = {};

    function find(name, data) {
	var node = map[name], i;
	if (!node) {
            node = map[name] = data || {name: name, children: []};
            if (name.length) {
		node.parent = find(name.substring(0, i = name.lastIndexOf("_")));
		node.parent.children.push(node);
		node.key = name.substring(i + 1);
            }
	}
	return node;
    }

    classes.forEach(function(d) {
	find(d.name, d);
    });

    return map[""];
}

// https://bl.ocks.org/bstitt79/66fe8f50dccaac6a58094566d2a870fe
function packageImports(nodes) {
    var map = {},
	imports = [];

    // Compute a map from name to node.
    nodes.forEach(function(d) {
	map[d.data.name] = d;
    });

    // For each import, construct a link from the source to target node.
    nodes.forEach(function(d) {
	if (d.data.imports) d.data.imports.forEach(function(i) {
            imports.push({source: map[d.data.name], target: map[i]});
	    imports.push({source: map[i], target: map[d.data.name]});
	});
    });

    return imports;
}

function genLinksDict(links){
    var resultDict = {};
    // console.log(links);
    links.forEach(function(d) {
	resultDict[d.source.data.key] = {};
	resultDict[d.target.data.key] = {};
    })
    return resultDict;
}

function edgeGraphModel(){
    this.model = {};
    this.setModel = function(model){
	this.model = model;
	this.root = d3.hierarchy(packageHierarchy(this.model), (d) => d.children);
	this.links = packageImports(this.root.descendants());
	this.nodes = this.root.descendants();
	this.linksDict = genLinksDict(this.links);
     };
    this.getModel = function(model){ return this.model; };
}

function edgeGraphController(){
    	// https://bl.ocks.org/bstitt79/66fe8f50dccaac6a58094566d2a870fe
	this.mouseovered = function(d) {
	    // node
	    // 	.each(function(n) { n.target = n.source = false; });

	    // link
	    // 	.classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
	    // 	.classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
	    // 	.filter(function(l) { return l.target === d || l.source === d; })
	    // 	.each(function() { this.parentNode.appendChild(this); });

	    // node
	    // 	.classed("node--target", function(n) { return n.target; })
	    // 	.classed("node--source", function(n) { return n.source; });
	}

	// https://bl.ocks.org/bstitt79/66fe8f50dccaac6a58094566d2a870fe
	this.mouseouted = function(d) {
	    // /* console.log("moouseout");*/
	    // link
	    // 	.classed("link--target", false)
	    // 	.classed("link--source", false);

	    // node
	    // 	.classed("node--target", false)
	    // 	.classed("node--source", false);
	}
}

function edgeGraphView(){
    this.draw = function(innerRadius, setNodeP){
	 var cluster = d3.cluster()
			 .size([360, innerRadius]);

	 const line = d3.radialLine()
			.radius(function(d) { return d.y; })
			.angle(function(d) { return d.x / 180 * Math.PI; })
			.curve(d3.curveBundle.beta(0.2));

	this.linkSelection = this.nodeg.append("g").selectAll(".link");
        this.nodeSelection = this.nodeg.append("g").selectAll(".node");

	this.nodeg.append("circle")
	    .attr("cx", 0)
	    .attr("cy", 0)
	    .attr("r", innerRadius)
	    .style("fill", "none")
	    .style("stroke", "blue")
	    .style("stroke-width", "2px")
	    .style("stroke-opacity", 0.2)

	cluster(this.root);

	var linksDict = this.linksDict;

	link = this.linkSelection
	    .data(this.links)
	    .enter().append('path')
	    .attr('class', 'link')
	    .attr('d', function(d){
		linksDict[d.source.data.key][d.target.data.key] = this;
		return line(d.source.path(d.target))
	    })

	// console.log(link);
	if (setNodeP) {
            node = this.nodeSelection
		.data(this.nodes.filter(function(n) { return !n.children; }))
		.enter().append("text")
		.style("font-size", 20)
		.attr("class", "node")
		.attr("dy", ".31em")
		.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "rotate(" + (90 - d.x) + ")" : "rotate(" + (90 - d.x)  + ")"); })
		.style("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
		.text(function(d) { return d.data.key; })
		// .on("mouseover", this.mouseovered)
		// .on("mouseout", this.mouseouted);
	}
    }
    this.remove = function(){
	this.nodeg.selectAll("g").remove();
    }
}

var edgeGraph = {
    init: function(g){
	this.nodeg = g;
	edgeGraphModel.call(this);
	edgeGraphController.call(this);
	edgeGraphView.call(this);
    }
}
