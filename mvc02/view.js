var view1 = function(target){
    this.circle = target.append("circle");

    this.draw = function(){
	this.circle
	    .attr("cx", this.x)
	    .attr("cy", this.y)
	    .attr("r", this.r)
	    // .attr("r", function(){return this.r})
	    .attr("storke", "black")
    }
    this.update = function(x_move, y_move){
	this.transform.x = x_move - this.x;
	this.transform.y = y_move - this.y;
	this.circle
	    .attr("transform", "translate(" + [this.transform.x,
					       this.transform.y] + ")")
    }
}
