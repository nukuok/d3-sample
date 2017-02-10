var controller1 = function(){
    var mame = this;
    var dragfunction = d3.drag()
	.on("drag", function(d,i) {
	    // console.log(d3.event.x);
	    // console.log(d3.event.y);
	    mame.update(d3.event.x, d3.event.y);
	})
    this.circle
	.call(dragfunction)};
