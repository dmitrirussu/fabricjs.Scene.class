/**
 * Created by Dmitri Russu <dmitri.russu@gmail.com> on 01.08.2014.
 */

(function(global) {
	'use strict';

	var fabric = global.fabric || (global.fabric = { }),
		extend = fabric.util.object.extend;

	if (fabric.Scene) {
		fabric.warn('fabric.Scene is already defined');
		return;
	}

	/**
	 * Scene Class
	 * @class fabric.Scene
	 * @extends fabric.Object
	 * @see {@link fabric.Scene#initialize} for constructor definition */
	fabric.Scene = fabric.util.createClass(fabric.Object, fabric.Collection, {
		type: 'scene',

		originalOptions: {left:0, top: 0, width: 0 , height: 0, angle: 0, scaleX: 1, scaleY: 1},

		initialize: function(objects, options) {
			options = options || { };

			this.saveSceneOriginalOptions(options);

			this._objects = objects || [];

			this.originalState = { };
			this.callSuper('initialize');


			if (options) {
				extend(this, options);
			}

			this.setCoords();
			this.saveOriginalObjectsOptions();
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

		/**
		 * Render Objects
		 * @param ctx
		 */
		render: function(ctx) {
			this.ctx = ctx;

			// do not render if object is not visible
			if (!this.visible) return;

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


			this.clipTo && fabric.util.clipContext(this, ctx);

			for (var i = 0, len = this._objects.length; i < len; i++) {
				this._objects[i].originalState = {};

				this._objects[i].left = ((this._objects[i].left - this.pLeft) + sceneOffsetLeft);
				this._objects[i].top = ((this._objects[i].top - this.pTop) + sceneOffsetTop);

				this._objects[i].angle = (this._objects[i].angle - this.pAngle) + sceneAngle;

				this._objects[i].scaleX = this.scaleX;
				this._objects[i].scaleY = this.scaleY;

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
