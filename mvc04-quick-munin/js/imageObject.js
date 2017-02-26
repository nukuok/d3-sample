function imageModel(){
    this.model = {};
    this.model.upper = '';
    this.model.lower = '';
    this.model.startTime = '';
    this.model.endTime = ''; // get current in javascript
    this.model.method = {};
    this.model.method.set = function(){};
}

function imageView(){
    // var nodeg = this.nodeg();
    this.draw = function(d, i, j){
	this.nodeg
	    .append("image")
	    .attr("xlink:href", d)
	    .attr("x", 0)
	    // .attr("y", 0)
	    .attr("y", function(d,i,j){return 150 * i;})
	    .attr("width", 300)
	    .attr("height", 200)
    }
    this.remove = function(d, i, j){
	this.nodeg
	    .select("image")
	    .remove()
    }
}

function imageController(){
}

var image = {
    init: function(nodeg){
	this.nodeg = nodeg;
	imageModel.call(this);
	imageView.call(this);
	imageController.call(this);
    }
}

