/**
 * Created by Dmitri Russu <dmitri.russu@gmail.com> on 01.08.2014.
 */

(function(global) {
	'use strict';

	var fabric = global.fabric || (global.fabric = { }),
		degreesToRadians = fabric.util.degreesToRadians,
		object = fabric.util.object;

	if (fabric.Scene) {
		fabric.warn('fabric.Scene is already defined');
		return;
	}

	/**
	 * Scene Class
	 * @class fabric.Scene
	 * @extends fabric.Object
	 * @see {@link fabric.Scene#initialize} for constructor definition */
	fabric.Scene = fabric.util.createClass(fabric.Object, {
		type: 'scene',

		backgroundColor: null,
		backgroundSrc: null,

		originalOptions: {left:0, top: 0, width: 0 , height: 0, angle: 0, scaleX: 1, scaleY: 1},

		initialize: function(canvas, objects, options) {

			if (canvas === undefined) {
				fabric.warn('fabric.Scene missing canvas container');
				return;
			}

			fabric.Object.prototype.canvas = canvas;

			options = options || {};

			this.saveSceneOriginalOptions(options);

			this._objects = objects || [];

			this.originalState = { };
			this.callSuper('initialize', options);

			this.setCoords();
			this.saveOriginalObjectsOptions();

			this.actions();
		},

		/**
		 * Save Scene Original Options
		 */
		saveSceneOriginalOptions: function(options) {
			this.originalOptions = options;

			if (this.originalOptions.scaleX === undefined || this.scaleY === undefined) {
				this.originalOptions.scaleX = this.scaleX;
				this.originalOptions.scaleY = this.scaleY;
			}

			if ( this.originalOptions.angle === undefined ) {
				this.originalOptions.angle = this.angle;
			}
		},

		/**
		 * Save Original Objects Options
		 */
		saveOriginalObjectsOptions: function() {
			for(var i in this._objects) {

				this._objects[i].left += this.left;
				this._objects[i].top += this.top;


				this._objects[i].originalObjectsOptions = {
					left: this._objects[i].left,
					top: this._objects[i].top,
					width: this._objects[i].width,
					height: this._objects[i].height
				};
			}

		},

		/**
		 * Add Object on Scene
		 * @param object
		 * @returns {fabric.Scene}
		 */
		addObject : function(object) {
			this._objects.push(object);

			return this;
		},

		actions: function() {
			var _this = this;

			this.on('object:moving', function(options){
				_this.onMoving(options);
			});

			this.on('object:scaling', function(options){
				_this.onScaling(options);
			});

			this.on('object:rotating', function(options){
				_this.onRotation(options);
			});
		},

		onMoving: function(options) {

			if (options.target.type === this.type) {
				var objectsLength = options.target._objects.length,
					objects = options.target._objects;

				if ( objectsLength ) {
					var sceneOffsetLeft = (options.target.left - options.target.originalOptions.left),
						sceneOffsetTop =  (options.target.top - options.target.originalOptions.top);

					for(var i in options.target._objects) {
						options.target._objects[i].left = (options.target._objects[i].left - options.target.pLeft) + sceneOffsetLeft;
						options.target._objects[i].top = (options.target._objects[i].top - options.target.pTop) + sceneOffsetTop;
					}

					if ( options.target.pLeft !== sceneOffsetLeft || options.target.pTop !== sceneOffsetTop) {
						options.target.pLeft = sceneOffsetLeft;
						options.target.pTop = sceneOffsetTop;
					}
				}
			}
		},

		onScaling: function(options) {
			if (options.target.type === this.type) {
				//Do Something
				var objectsLength = options.target._objects.length,
					objects = options.target._objects;

				if ( objectsLength ) {

					var sceneScaleX = (options.target.scaleX - options.target.originalOptions.scaleX),
						sceneScaleY = (options.target.scaleY - options.target.originalOptions.scaleY);

					for(var i in objects) {
						//options.target._objects[i].left = this.oCoords.tl.x;
						//options.target._objects[i].top = this.oCoords.tl.y;
						//options.target._objects[i].left = options.target.left + (options.target._objects[i].originalObjectsOptions.left * (options.target.scaleX));
						//options.target._objects[i].width = (options.target._objects[i].originalObjectsOptions.width * options.target.scaleX);
						//options.target._objects[i].scaleX = options.target.scaleX * (this.flipX ? -1 : 1);
						//
						//options.target._objects[i].top = options.target.top + (options.target._objects[i].originalObjectsOptions.top * (options.target.scaleY));
						//options.target._objects[i].height = (options.target._objects[i].originalObjectsOptions.height * options.target.scaleY);
						//options.target._objects[i].scaleY = options.target.scaleY * (this.flipY ? -1 : 1);


						options.target._objects[i].left =
								(((options.target._objects[i].left - options.target.pLeft) + options.target.left) * (options.target.scaleX - options.target.pScaleX));

						options.target._objects[i].top =
						(((options.target._objects[i].top - options.target.pTop) + options.target.top ) * (options.target.scaleY - options.target.pScaleY));

						options.target._objects[i].scaleX = (options.target._objects[i].scaleX - options.target.pScaleX) + sceneScaleX;
						options.target._objects[i].scaleY = (options.target._objects[i].scaleY - options.target.pScaleY) + sceneScaleY;


					}
				}
			}
		},

		onRotation: function(options) {
			if (options.target.type === this.type) {
				//Do Something

				var objectsLength = options.target._objects.length,
					objects = options.target._objects;

				if ( objectsLength ) {

					var groupAngle = (options.target.angle * (Math.PI / 180));

					for(var i in options.target._objects) {

//						options.target._objects[i].originX = options.target._objects[i].originY = 'center';
//
//						var R = Math.sqrt(Math.pow((options.target.left - options.target._objects[i].left), 2) +
//							Math.pow((options.target.top - options.target._objects[i].top), 2));
//
//
//						var sxCos = (options.target.left * Math.cos(groupAngle)),
//							sxSin = (options.target.left * Math.sin(groupAngle)),
//							syCos = (options.target.top * Math.cos(groupAngle)),
//							sySin = (options.target.top * Math.sin(groupAngle)),
//							sx = sxCos - sySin,
//							sy = syCos + sxSin;
//
//						var xCos = (options.target._objects[i].left * Math.cos(groupAngle)),
//							xSin = (options.target._objects[i].left * Math.sin(groupAngle)),
//							yCos = (options.target._objects[i].top * Math.cos(groupAngle)),
//							ySin = (options.target._objects[i].top * Math.sin(groupAngle)),
//							x = (xCos - ySin),
//							y = (yCos + xSin);
//
//
//						options.target._objects[i].left = x;
//						options.target._objects[i].top = y;

//						options.target._objects[i].left = (R * Math.cos((groupAngle - options.target.pAngle) + groupAngle)) + options.target.left;
//						options.target._objects[i].top = (R * Math.sin((groupAngle - options.target.pAngle) + groupAngle)) + options.target.top;

//						options.target._objects[i].angle = options.target.angle;
					}
				}

//				console.log('Rotation', this._getLeftTopCoords());

//				console.log('Rotation', options.target.type);
			}
		},

		setBackgroundColor: function(color) {
			this.backgroundColor = color;
		},

		setBackgroundImage: function(imageSrc) {
			this.backgroundSrc = imageSrc;
		},

		setBackgroundSvg: function(svgUrl) {

		},

		/**
		 * Draw Background Color
		 */
		drawBackgroundColor: function(ctx){
			if ( this.backgroundColor ) {
				ctx.save();
				var pClicked = new fabric.Point(this.left, this.top),
					pLeftTop = new fabric.Point(this.width / 2, this.height /2),

					rotated = fabric.util.rotatePoint(
						pClicked, pLeftTop, fabric.util.degreesToRadians(this.angle));

				console.log('Scene Rotation leftTop', rotated);

				ctx.rect(rotated.x, rotated.y, this.width * this.scaleX, this.height * this.scaleY);
				ctx.fillStyle = this.backgroundColor;
				ctx.fillRect(rotated.x, rotated.y, this.width * this.scaleX, this.height * this.scaleY);
				ctx.restore();
			}
		},


		drawBackgroundImage: function(ctx) {
			if ( this.backgroundSrc ) {
				var imageObj = new Image();

				imageObj.addEventListener("load", function() {
					ctx.drawImage(imageObj, this.left, this.top, this.width, this.height);
				}, false);

				imageObj.src = this.backgroundSrc;
			}
		},

		/**
		 * Render Objects
		 * @param ctx
		 */
		render: function(ctx) {
			this.ctx = ctx;

			// do not render if object is not visible
			if (!this.visible) return;

			//Draw Background
			this.drawBackgroundColor(ctx);
			this.drawBackgroundImage(ctx);

			ctx.save();

			// the array is now sorted in order of highest first, so start from end
			this.callSuper('_renderControls', ctx);

			if ( this.pLeft === undefined && this.pTop === undefined) {
				this.pLeft = (this.left - this.originalOptions.left);
				this.pTop = (this.top - this.originalOptions.top);
			}

			if ( this.pAngle === undefined ) {
				this.pAngle = (this.angle - this.originalOptions.angle);
			}

			if ( this.pScaleX === undefined && this.pScaleY === undefined) {
				this.pScaleX = (this.scaleX - this.originalOptions.scaleX);
				this.pScaleY = (this.scaleY - this.originalOptions.scaleY);
			}

			var sceneOffsetLeft = (this.left - this.originalOptions.left),
				sceneOffsetTop =  (this.top - this.originalOptions.top);
			var sceneAngle = (this.angle - this.originalOptions.angle);

			var sceneScaleX = (this.scaleX - this.originalOptions.scaleX),
				sceneScaleY = (this.scaleY - this.originalOptions.scaleY);


			this.clipTo && fabric.util.clipContext(this, ctx);


			for (var i = 0, len = this._objects.length; i < len; i++) {
				this._objects[i].originalState = {};

				this._objects[i].setCoords();
				this._objects[i].render(ctx);
			}

			if ( this.pLeft !== sceneOffsetLeft || this.pTop !== sceneOffsetTop) {
				this.pLeft = sceneOffsetLeft;
				this.pTop = sceneOffsetTop;
			}

			if ( this.pAngle !== sceneAngle ) {
				this.pAngle = sceneAngle;
			}

			if ( this.pScaleX !== sceneScaleX || this.pScaleY !== sceneScaleY ) {
				this.pScaleX = sceneScaleX;
				this.pScaleY = sceneScaleY;
			}

			this.clipTo && ctx.restore();

			ctx.restore();
		},

		/**
		 * @private
		 */
		_getRotatedLeftTop: function(object) {
			var groupAngle = this.getAngle() * (Math.PI / 180);
			return {
				left: (-Math.sin(groupAngle) * object.getTop() * this.get('scaleY') +
					Math.cos(groupAngle) * object.getLeft() * this.get('scaleX')),

				top:  (Math.cos(groupAngle) * object.getTop() * this.get('scaleY') +
					Math.sin(groupAngle) * object.getLeft() * this.get('scaleX'))
			};
		},

		/**
		 * Renders controls and borders for the object
		 * @param {CanvasRenderingContext2D} ctx Context to render on
		 * @param {Boolean} [noTransform] When true, context is not transformed
		 */
		_renderControls: function(ctx, noTransform) {

			this.callSuper('_renderControls', ctx, noTransform);
			for (var i = 0, len = this._objects.length; i < len; i++) {
				this._objects[i]._renderControls(ctx);
			}
		},


		/**
		 * Set Animation Delay
		 * @param delay
		 * @returns {fabric.SvgAnimation}
		 */
		setDelay: function(delay) {
			this.delay = delay;

			return this;
		}
	});

	/**
	 * Indicates that instances of this type are async
	 * @static
	 * @memberOf fabric.SvgAnimation
	 * @type Boolean
	 * @default
	 */
	fabric.Scene.async = true;

})(typeof exports !== 'undefined' ? exports : this);

