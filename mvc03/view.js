var view1 = function(){
    this.circles = d3.select("#" + this.gname)
	.selectAll("circle")
	.data(this.models)
	.enter()
	.append("circle");

    this.draw = function(){
	parent = this.gname
	this.circles
	    .attr("cx", function(d){return d.x;})
	    .attr("cy", function(d){return d.y;})
	    .attr("r", function(d){return d.r;})
	    .attr("id", function(d,i){return parent  + "c" + i;})
	    .style("fill-opacity", .2)
	    .style("fill", "red")
    }
    this.update = function(x_move, y_move, id){
	// console.log(this.models[id[3]].transform.x);
	d3.select("#" + id)
	    .attr("transform", "translate(" + [this.models[id[3]].transform.x + x_move - this.models[id[3]].x,
					       this.models[id[3]].transform.y + y_move - this.models[id[3]].y] + ")")
    }
    this.set = function(x_move, y_move, id){
    	this.models[id[3]].transform.x += x_move - this.models[id[3]].x;
	this.models[id[3]].transform.y += y_move - this.models[id[3]].y;
	// console.log(this.models[id[3]].transform.x);
    }
}
