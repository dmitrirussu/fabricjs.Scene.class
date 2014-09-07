window.onload = function() {

	fabric.Object.prototype.hasRotatingPoint = false;


	fabric.Object.prototype.hasBorders = true;
	fabric.Object.prototype.padding = 3;
	fabric.Object.prototype.cornerSize = 10;
	fabric.Object.prototype.cornerColor = '#2d3c47';
	fabric.Object.prototype.borderColor = '#2d3c47';
	fabric.Object.prototype.transparentCorners = false;

	//new Fabric Object Properties
	fabric.Object.prototype.hasCornerRotatingPoint = true;
	fabric.Object.prototype.cornerRotationSize = 7;
	fabric.Object.prototype.cornerRotating = 'tr'; // 	tr, tl, bl, br, ml, mt, mb, mr
	fabric.Object.prototype.cornerRotatingPointOffset = 4;

	fabric.Object.prototype.borderColor = "red";

	this.canvas = new fabric.Canvas("c");

	this.canvas.setBackgroundColor('#e6e6e6');

	var rect = new fabric.Rect({ width: 200, height: 50, fill: '#faa', rx: 10, ry: 10, left: 200, top: 150 });
	var text = new fabric.Text('Do stuff with me!', { fontSize: 20, fontFamily: 'Georgia', left: 200, top: 150 });


	var scene = new fabric.Scene([rect, text], {
		left: 0,
		top: 0,
		width: this.canvas.getWidth(),
		height: this.canvas.getHeight(),
		selectable: true,
		angle: 0});


	this.canvas.add(scene);

};
