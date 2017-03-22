function serverCircleModel(){
    this.model = {};
    this.setModel = function(model){
	this.model = model;
	this.model.stroke = this.model.stroke || "black";
	this.model.fill = this.model.fill || "gray";
	this.model.interval = this.model.interval || 2;
    };
    this.getModel = function(model){ return this.model; };
}

function serverCircleController(){
}

function serverCircleView(){
    this.draw = function(){
	this.g = this.parentg.append("g")
	    .attr("id", "serverCircle" + this.model.serverId)

	this.g.append("circle")
	    .attr("cx", this.model.cx)
	    .attr("cy", this.model.cy)
	    .attr("stroke", this.model.stroke)
	    .attr("fill", this.model.fill)
	    .attr("r", this.model.r)

	this.g.append("text")
	    .attr("x", this.model.cx)
	    .attr("y", this.model.cy - this.model.r - this.model.interval)
	    .attr("text-anchor", "middle")
	    .text(this.model.serverName)
    }

    this.remove = function(){
	d3.select("#" + "serverCircle" + this.model.serverId).remove()
    }

}

var serverCircle = {
    init: function(g){
	this.parentg = g;
	serverCircleModel.call(this);
	serverCircleController.call(this);
	serverCircleView.call(this);
    }
}


