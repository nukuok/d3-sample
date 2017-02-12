var controller1 = function(){
    var mame = this;
    var dragfunction = d3.drag()
	// .container(function () {return this})
	.on("drag", function(d,i) {
	    mame.update(d3.event.x, d3.event.y, d3.select(this).attr('id'));
	})
    	.on("end", function(d,i) {
	    mame.set(d3.event.x, d3.event.y, d3.select(this).attr('id'));
	})
    this.circles
	.call(dragfunction)
};
