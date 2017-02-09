var view1 = function(){
    this.draw = function(target){
	target.append("circle")
	    .attr("cx", this.x)
	    .attr("cy", this.y)
	    .attr("r", this.r)
	    // .attr("r", function(){return this.r})
	    .attr("storke", "black")
    }
}
