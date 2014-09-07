window.onload = function() {


	fabric.Object.prototype.borderColor = "red";

	this.canvas = new fabric.Canvas("c");

	this.canvas.setBackgroundColor('gray');

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
