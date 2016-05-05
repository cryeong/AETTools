(function(window) {
	var MathFAK = function( params ) {
		SVGGL.call(this, params);
		var foreign = document.createElementNS(SVGSettings.namespace,'foreignObject');
		foreign.setAttribute('x','0');
		foreign.setAttribute('y','0');
		foreign.setAttribute('width','200');
		foreign.setAttribute('height','100%');
		var body = document.createElementNS(SVGSettings.xhtmlNS,'body');
		this.p = document.createElementNS(SVGSettings.xhtmlNS, 'p');
		this.p.setAttribute('style','font-size:'+SVGSettings.fontSize+';font-family:'+SVGSettings.fontName+';overflow:hidden;');
		this.p.innerHTML = "welcome!";
		body.appendChild(this.p);
		foreign.appendChild(body);
		this.surface.appendChild(foreign);
	};
	var m = MathFAK.prototype = new SVGGL();
	// override clear()
	m.super_clear = m.clear;
	m.clear = function() {
		this.super_clear();
		this.p.innerHTML = "";
	};
	m.trace = function(p_str) {
		this.p.innerHTML += p_str+"<br/>";
	};
	m.drawLines = function(args) {
		if (args.length == 0) return;
		if (args.length > 0) {
			if (typeof(args[0]) === "boolean") {
				if (args[0]) {
					if (args[1] instanceof Point || args[1] instanceof Object) { // only work for those explicitly defined
						this.moveTo(args[1].x, args[1].y);
						args.splice(0, 2);
						this.drawLines(args);
						return;
					} else if(typeof(args[1]) === "number") {
						if (typeof(args[2]) === "number") {
							this.moveTo(args[1], args[2]);
							args.splice(0, 3);
							this.drawLines(args);
							return;
						} else if (args[2] instanceof Point) {
							this.moveTo(args[1]);
							args.splice(0, 2);
							this.drawLines(args);
							return;
						}
					}
				} else {
					this.moveTo(0, 0);
					args.shift();
					this.drawLines(args);
					return;
				}
			} else if (args[0] instanceof Point || args[0] instanceof Object) {
				this.lineTo(args[0].x, args[0].y);
				args.shift();
				this.drawLines(args);
				return;
			} else if (typeof(args[0]) === "number") {
				if (args[1] instanceof Point) {
					this.lineTo(args[0], 0);
					args.shift();
					this.drawLines(args);
					return;
				} else if (typeof(args[1]) === "number") {
					this.lineTo(args[0], args[1]);
					args.splice(0,2);
					this.drawLines(args);
					return;
				}
			}
		}
	};
	m.l_ = function() {
		this.lastAngle = 0.0;
		var args = [];
		Array.prototype.push.apply( args, arguments );
		if (args.length == 0) return;
		if (args.length == 1) {
			if (args[0] instanceof Point || args[0] instanceof Object) {
				this.drawLine(0,0,args[0].x, args[0].y);
				return;
			} else if(typeof(args[0]) === "number") {
				this.drawLine(0,0,args[0], 0);
				return;
			}
		} else if (args.length > 1) {
			if (args.length == 2) {
				if ( typeof(args[0]) === "number" && typeof(args[1]) === "number") {
					this.drawLine(0,0,args[0], args[1]);
					return;
				}
			}
			this.drawLines([true].concat(args));
			return;
		}
	};
	window.MathFAK = MathFAK;
}(window));
/////////ATE
//node
(function(window) {
	var ATNode = function() {};
	var a = ATNode.prototype = {
		solve: function() { return null; }
	};
	window.ATNode = ATNode;
}(window));
//row
(function(window) {
	var ATRow = function() {
		this.lineLength = 0;
		this.linespan = 0;
		this.line = 0;
		this.start = 0;
		this.length = 0;
	};
	var a = ATRow.prototype = {
		run: function() {},
		record: function(p_line, p_start, p_length) {
			this.line = p_line;
			this.start = p_start;
			this.length = p_length;
			return this;
		}
	};
	window.ATRow = ATRow;
}(window));
//function
(function(window){
	var ATFunc = function(p_children) {
		ATNode.call(this);
		this.children = p_children;
	};
	var a = ATFunc.prototype = new ATNode();
	window.ATFunc = ATFunc;
}(window));
//leaf
(function(window) {
	var matchAttrByChar = function(char) {
		if('xru'.indexOf(char)>-1) return 'x';
		else if('ygv'.indexOf(char)>-1) return 'y';
		else if('zbs'.indexOf(char)>-1) return 'z';
		else if('wat'.indexOf(char)>-1) return 'w';
	};
	var ATLeaf = function(p_store, p_attr, p_name) {
		if(typeof(p_name) == 'undefined') p_name = '';
		ATNode.call(this);
		this.store = p_store;
		this.attr = typeof(p_attr) != 'undefined' ? p_attr: "";
		this.objectname = p_name;
	};
	var a = ATLeaf.prototype = new ATNode();
	a.solve = function() {
		if(this.attr != "") {
			if(this.attr.length > 1) {
				if(/^[xyzwrgbauvst]+$/gi.test(this.attr)) {
					var _s = this.store.stock;
					var _c = this.attr.split('');
					var _p = new Point();
					if(_c[0]) _p.x = _s[_c[0]];
					if(_c[1]) _p.y = _s[_c[1]];
					if(_c[2]) _p.z = _s[_c[2]];
					if(_c[3]) _p.w = _s[_c[3]];
					return _p;
				}
			} else {
				if(/^[rgbauvst]+$/gi.test(this.attr))
					return this.store.stock[matchAttrByChar(this.attr)];
				else
					return this.store.stock[this.attr];
			}
		}
		return this.store.stock;
	};
	window.ATLeaf = ATLeaf;
}(window));
//branch
(function(window) {
	var ATBranch = function( p_left, p_right ) {
		ATNode.call(this);
		this.left = p_left; // ATNode
		this.right = p_right; // ATNode
	};
	var a = ATBranch.prototype = new ATNode();
	window.ATBranch = ATBranch;
}(window));
// branch - add
(function(window){
	var ATAddBranch = function( p_left, p_right ) {
		ATBranch.apply(this, arguments);
	};
	var a = ATAddBranch.prototype = new ATBranch();
	a.solve = function() {
		var l = this.left.solve();
		var r = this.right.solve();
		if(l instanceof Point || r instanceof Point) {
			if(typeof(l) === "number")
				l = new Point(l,l);
			else if(typeof(r) === "number")
				r = new Point(r,r);
		}
		if(l instanceof Point && r instanceof Point)
			return l.add_r(r);
		else
			return l + r;
	};
	window.ATAddBranch = ATAddBranch;
}(window));
// branch - subtract
(function(window){
	var ATSubtractBranch = function(p_left, p_right) {
		ATBranch.apply(this, arguments);
	};
	var a = ATSubtractBranch.prototype = new ATBranch();
	a.solve = function() {
		var l = this.left.solve();
		var r = this.right.solve();
		if(l instanceof Point || r instanceof Point) {
			if(typeof(l) === "number")
				l = new Point(l,l);
			else if(typeof(r) === "number")
				r = new Point(r,r);
		}
		if(l instanceof Point && r instanceof Point)
			return l.sub_r(r);
		else
			return l - r;
	};
	window.ATSubtractBranch = ATSubtractBranch;
}(window));
// branch - divide
(function(window){
	var ATDivideBranch = function(p_left, p_right) {
		ATBranch.apply(this, arguments);
	};
	var a = ATDivideBranch.prototype = new ATBranch();
	a.solve = function() {
		var l = this.left.solve();
		var r = this.right.solve();
		if (l instanceof Point || r instanceof Point) {
			var n = 0.0;
			var pt;
			var c = false;
			if (typeof(l) === "number" && r instanceof Point) {
				n = l;
				pt = r;
				c = true;
			} else if (l instanceof Point && typeof(r) === "number") {
				n = r;
				pt = l;
				c = false;
			}
			if (pt)
				return (c)?new Point(pt.x / n, pt.y / n):new Point(n / pt.x, n / pt.y);
			else
				return l.x / r.x + l.y / r.y;
		}
		else
			return l / r;
	};
	window.ATDivideBranch = ATDivideBranch;
}(window));
// branch - multiply
(function(window) {
	var ATMultiplyBranch = function(p_left, p_right) {
		ATBranch.apply(this, arguments);
	};
	var a = ATMultiplyBranch.prototype = new ATBranch();
	a.solve = function() {
		var l = this.left.solve();
		var r = this.right.solve();
		if (l instanceof Point || r instanceof Point) {
			var n = 0.0;
			var pt;
			if (typeof(l) === "number" && r instanceof Point) {
				n = l;
				pt = r;
			} else if (l instanceof Point && typeof(r) === "number") {
				n = r;
				pt = l;
			}
			if (pt)
				return new Point(pt.x * n, pt.y * n, pt.z * n, pt.w * n);
			else
				return l.x * r.x + l.y * r.y + l.z * r.z  + l.w * r.w;
		}
		else
			return l * r;
	};
	window.ATMultiplyBranch = ATMultiplyBranch;
}(window));
// branch - larger
(function(window) {
	var ATLargerBranch = function(p_left, p_right) {
		ATBranch.apply(this, arguments);
	};
	var a = ATLargerBranch.prototype = new ATBranch();
	a.solve = function() {
		var l = this.left.solve();
		var r = this.right.solve();
		return l > r;
	};
	window.ATLargerBranch = ATLargerBranch;
}(window));
// branch - larger
(function(window) {
	var ATLesserBranch = function(p_left, p_right) {
		ATBranch.apply(this, arguments);
	};
	var a = ATLesserBranch.prototype = new ATBranch();
	a.solve = function() {
		var l = this.left.solve();
		var r = this.right.solve();
		return l < r;
	};
	window.ATLesserBranch = ATLesserBranch;
}(window));
// function - atan2
(function(window) {
	var ATAtan2Func = function(p_children) {
		ATFunc.call(this, p_children);
	};
	var a = ATAtan2Func.prototype = new ATFunc();
	a.solve = function() {
		return Math.atan2(this.children[0].solve(), this.children[1].solve());
	};
	window.ATAtan2Func = ATAtan2Func;
}(window));
// function - atan
(function(window) {
	var ATAtanFunc = function(p_children) {
		ATFunc.call(this, p_children);
	};
	var a = ATAtanFunc.prototype = new ATFunc();
	a.solve = function() {
		return Math.atan(this.children[0].solve());
	};
	window.ATAtanFunc = ATAtanFunc;
}(window));
// function - cos
(function(window) {
	var ATCosFunc = function(p_children) {
		ATFunc.call(this, p_children);
	};
	var a = ATCosFunc.prototype = new ATFunc();
	a.solve = function() {
		return Math.cos(this.children[0].solve());
	};
	window.ATCosFunc = ATCosFunc;
}(window));
// function - sin
(function(window) {
	var ATSinFunc = function(p_children) {
		ATFunc.call(this, p_children);
	};
	var a = ATSinFunc.prototype = new ATFunc();
	a.solve = function() {
		return Math.sin(this.children[0].solve());
	};
	window.ATSinFunc = ATSinFunc;
}(window));
// function - abs
(function(window) {
	var ATAbsFunc = function(p_children) {
		ATFunc.call(this, p_children);
	};
	var a = ATAbsFunc.prototype = new ATFunc();
	a.solve = function() {
		return Math.abs(this.children[0].solve());
	};
	window.ATAbsFunc = ATAbsFunc;
}(window));
// function - length
(function(window) {
	var ATLenFunc = function(p_children) {
		ATFunc.call(this, p_children);
	};
	var a = ATLenFunc.prototype = new ATFunc();
	a.solve = function() {
		var v = this.children[0].solve();
		return Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z+v.w*v.w);
	};
	window.ATLenFunc = ATLenFunc;
}(window));
// function - norm
(function(window) {
	var ATNormFunc = function(p_children) {
		ATFunc.call(this, p_children);
	};
	var a = ATNormFunc.prototype = new ATFunc();
	a.solve = function() {
		var v = this.children[0].solve();
		var len = Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z+v.w*v.w);
		return new Point(v.x/len, v.y/len, v.z/len, v.w/len);
	};
	window.ATNormFunc = ATNormFunc;
}(window));
// function - norm
(function(window) {
	var ATVecFunc = function(p_children) {
		ATFunc.call(this, p_children);
	};
	var a = ATVecFunc.prototype = new ATFunc();
	a.solve = function() {
		var p = new Point();
		if (this.children) {
			if (this.children[0])
				p.x = this.children[0].solve();
			if (this.children[1])
				p.y = this.children[1].solve();
			if (this.children[2])
				p.z = this.children[2].solve();
			if (this.children[3])
				p.w = this.children[3].solve();
		}
		return p;
	};
	window.ATVecFunc = ATVecFunc;
}(window));
// row - Color
(function(window) {
	var ATCcRow = function(p_color) {
		ATRow.call(this);
		this.color = p_color;
	};
	var a = ATCcRow.prototype = new ATRow();
	window.ATCcRow = ATCcRow;
}(window));
// row - Draw
(function(window) {
	var ATDwRow = function(p_arr) {
		ATRow.call(this);
		this.arr = p_arr;
	};
	var a = ATDwRow.prototype = new ATRow();
	a.points = function() {
		var ar = [];
		var i = 0;
		for (i = 0; i < this.arr.length; i++)
			ar.push(this.arr[i].solve());
		return ar;
	};
	window.ATDwRow = ATDwRow;
}(window));
// row - If
(function(window) {
	var ATIfRow = function(p_line, p_length, p_elength, p_cond, p_codes, p_else) {
		ATRow.call(this);
		this.linespan = p_line;
		this.lineLength = p_length;
		this.elength = p_elength;
		this.cond = p_cond;
		this.codes = p_codes;
		this.elses = typeof(p_else) != 'undefined' ? p_else : "";
		this.rows = [];
		this.erows = [];
		this.compare = null;
	};
	var a = ATIfRow.prototype = new ATRow();
	a.should = function() {
		return this.compare.solve();
	};
	a.load = function(p_comp) {
		this.compare = p_comp;
	};
	window.ATIfRow = ATIfRow;
}(window));
// row - While
(function(window) {
	var ATWhRow = function(p_line, p_length, p_cond, p_codes) {
		ATRow.call(this);
		this.linespan = p_line;
		this.lineLength = p_length;
		this.cond = p_cond;
		this.codes = p_codes;
		this.rows = [];
		this.compare = null;
	};
	var a = ATWhRow.prototype = new ATRow();
	a.should = function() {
		return this.compare.solve();
	};
	a.load = function(p_comp) {
		this.compare = p_comp;
	};
	window.ATWhRow = ATWhRow;
}(window));
// row - Print
(function(window) {
	var ATPrRow = function(p_arr) {
		ATRow.call(this);
		this.arr = p_arr;
	};
	var a = ATPrRow.prototype = new ATRow();
	a.strings = function(p_comp) {
		var ar = [];
		var i = 0;
		for (i = 0; i < this.arr.length; i++)
			ar.push(this.arr[i].solve());
		return ar;
	};
	window.ATPrRow = ATPrRow;
}(window));
// row - Routine
(function(window) {
	var ATRoutine = function(p_line, p_length, p_index, p_return, p_scope, p_codes, p_params) {
		ATRow.call(this);
		this.linespan = p_line;
		this.lineLength = p_length;
		this.index = p_index;
		this.result = p_return;
		this.scope = p_scope;
		this.codes = p_codes;
		this.rows = [];
		this.params = [];
		for( var i in p_params)
			this.params.push(this.scope[p_params[i]]);
	};
	var a = ATRoutine.prototype = new ATRow();
	window.ATRoutine = ATRoutine;
}(window));
// row - return
(function(window) {
	var ATRtRow = function(p_store, p_node, p_attr) {
		ATRow.apply(this);
		this.node = p_node;
		this.store = p_store;
		this.attr = typeof(p_attr) != 'undefined' ? p_attr : "";
	};
	var a = ATRtRow.prototype = new ATRow();
	a.run = function() {
		if(this.attr == "")
			this.store.stock = this.node.solve();
		else
			this.store.stock[this.attr] = this.node.solve();
	};
	window.ATRtRow = ATRtRow;
}(window));
// row - store
(function(window) {
	var ATStore = function(p_stock, p_name) {
		if(typeof(p_name) == 'undefined') p_name = '';
		this.stock = p_stock;
		this.objectname = p_name;
	};
	var a = ATStore.prototype = {
		solve: function() {
			return this.stock;
		}
	};
	window.ATStore = ATStore;
}(window));
// row - vec
(function(window) {
	var ATvRow = function(p_store, p_node, p_attr) {
		ATRow.call(this);
		this.store = p_store;
		this.node = p_node;
		this.attr = typeof(p_attr) != 'undefined' ? p_attr : "";
	};
	var a = ATvRow.prototype = new ATRow();
	a.run = function() {
		if (this.attr == "")
			this.store.stock = this.node.solve();
		else
			this.store.stock[this.attr] = this.node.solve();
	};
	window.ATvRow = ATvRow;
}(window));
(function(window) {
	var ATEditor = function(params) {
		this.delegate = window;
		if(typeof(params) != 'undefined') {
			this.delegate = typeof(params.delegate) != 'defined' ? params.delegate : window;
		} else 
			params = {};
		this.sfm = new SFM();
		this.saveFile = "log.txt";
		this.exportFile = "codes.txt";
		this.W = window.innerWidth;
		this.H = window.innerHeight;
		this.WH = this.W/2.0;
		this.HH = this.H/2.0;
		this.port = document.createElement('div');
		this.offset = new Point(this.WH, this.HH);
		//this.offset = new Point(512, 384);
		this.mf = new MathFAK({offset:{x:this.offset.x,y:this.offset.y}});
		this.scale = params.scale || 1.0;
		this.mf.scale(1.0/this.scale, 1.0/this.scale);
		//this.mf.scale(0.5,0.5)
		this.cm = new CookieManager( window.location.hostname );
		this.port.appendChild(this.mf.surface);
		this.dict = {}; // hash array
		this.loop = {};
		this.func = {};
		this.svcount = 0;
		this.slcount = 0;
		this.rows = [];
		this.rowcount = 0;
		this.textcount = 0;
		this.row_length = 0;
		this.root_index = 0;
//*
		this.formula = "\
float i1 = 0\n\
float i2 = 0\n\
float i3 = 9\n\
float i4 = 0\n\
float radius = 150.0\n\
float rad = 1 * PI / i3\n\
float localr = 0\n\
float r = atan2( my, mx )\n\
while( i1 < i3 ) {\n\
\tlocalr = i1 * rad + r\n\
\tfloat vx = cos( localr ) * radius\n\
\tfloat vy = sin( localr ) * radius\n\
\tvec2( 0, 0 ) _ vec2( vx,vy )\n\
\ti4 = 0\n\
\twhile( i4 < i3 ) {\n\
\t\tvec2( vx, vy ) _ vec2( vx + cos( i4 * rad - localr ) * radius, vy + sin(i4 * rad - localr ) * radius )\n\
\t\ti4 = i4 + 1\n\
\t}\n\
\ti1 = i1 + 1\n\
}\n\
// i1 = %i1\n\
// i2 = %i2\n\
// rad = %rad\n\
";
//*/
/*
		this.formula = "\
float i1 = 0\n\
float i2 = 0\n\
float i3 = 9\n\
float i4 = 0\n\
float radius = 150.0\n\
float rad = 2 * PI / i3\n\
float localr = 0\n\
float r = atan2( my, mx )\n\
while( i1 < i3 ) {\n\
\tlocalr = i1 * rad + r\n\
\tfloat vx = cos( localr ) * radius\n\
\tfloat vy = sin( localr ) * radius\n\
\tvec2( 0, 0 ) _ vec2( vx,vy )\n\
\ti4 = 0\n\
\twhile( i4 < 5 ) {\n\
\t\tvec2( vx, vy ) _ vec2( vx + cos( i4 * rad - localr ) * radius, vy + sin(i4 * rad - localr ) * radius )\n\
\t\ti4 = i4 + 1\n\
\t}\n\
\ti1 = i1 + 1\n\
}\n\
// i1 = %i1\n\
// i2 = %i2\n\
// rad = %rad\n\
";
//*/
		// see http://www.webdeveloper.com/forum/showthread.php?166053-Check-if-element-is-visible-when-style-not-set-in-the-tag
		var computedCss= function(who, cssproperty) {
			var val= '';
			val= who.style[cssproperty]; // return the property if it is set inline
			if(!val) {
				if(who.currentStyle){
					return who.currentStyle[cssproperty];
					//return IE inherited style;
				}
				/* the rest of the code transforms camelCase to hyphenated-css
				and returns the inherited style in most of the other browsers
				*/
				var dv= document.defaultView || window;
				if(dv && dv.getComputedStyle) {
					if (/[a-z][A-Z]/.test(cssproperty)) {
						cssproperty= cssproperty.replace(/[A-Z]/g, function (w) {
							return "-" + w.toLowerCase();
						});
					}
				}
				val= dv.getComputedStyle(who,'').getPropertyValue(cssproperty);
			}
			return (val)? val: '';
		}

		var toggleAppearance = function(el) {
			if(typeof(el.appearanceToggler) == 'undefined') {
				var visible = computedCss(el, 'display');
				el.appearanceToggler = (visible && visible != 'none');
			}
			if(el.appearanceToggler)
				el.savedStyle = el.style.display;

			el.appearanceToggler = !el.appearanceToggler;

			el.style.display = (el.appearanceToggler)?el.savedStyle:'none';
		};

		// interaction
		this.dragging = false;

		var self = this;
		this.dragging = false;
		var evtTarget = this.mf.surface;
		var m = new Point();
		var mx = 0.0;
		var my = 0.0;
		var shouldBubble = true;
		evtTarget.addEventListener( "mousemove", function( e ) {
			if(self.delegate && self.delegate.s_mousemove)
				self.delegate.s_mousemove(e);
			e.preventDefault();
			if( !e ) { e = window.event; }
			mx = e.clientX;
			my = e.clientY;
			if( self.dragging ) {
				m.x = (mx-self.offset.x)*self.mf.scaleX;
				m.y = (my-self.offset.y)*self.mf.scaleY;
				self.dict["mx"].stock = m.x;
				self.dict["my"].stock = m.y;
				self.step();
			}
		}, shouldBubble );
		evtTarget.addEventListener( "mousedown", function( e ) {
			if(self.delegate && self.delegate.s_mousedown)
				self.delegate.s_mousedown(e);
			e.preventDefault();
			if( !e ) { e = window.event; }
			mx = e.clientX;
			my = e.clientY;
			m.x = (mx-self.offset.x)*self.mf.scaleX;
			m.y = (my-self.offset.y)*self.mf.scaleY;

			self.dragging = true;
			self.dict["sx"].stock = m.x;
			self.dict["sy"].stock = m.y;

		}, shouldBubble );
		evtTarget.addEventListener( "mouseup", function( e ) {
			if(self.delegate && self.delegate.s_mouseup)
				self.delegate.s_mouseup(e);
			e.preventDefault();
			self.dragging = false;
		}, shouldBubble );
		document.onkeydown = function (ev) {
			var key;
			var isCtrl;
			if (window.event) {
				key = window.event.keyCode;
				isCtrl = window.event.ctrlKey ? true : false;
			} else {
				key = ev.which;
				isCtrl = ev.ctrlKey ? true : false;
			}
			if ( isCtrl ) {
				switch (key) {
					case 17: // ignore ctrl key
						break;
					case 223: // ctrl + ` to toggle the editor
						toggleAppearance(thecontainer);
						break;
					default:
						break;
				}
			}
		};


		// textfield
		var thecontainer = this.container = document.createElement('div');
		this.container.setAttribute('style', 'position: absolute !important; top: 200px !important; left: 0px !important; padding: 0px !important; margin: 0px !important;')
		this.port.appendChild(this.container);

		this.textContainer = document.createElement('div');
		this.container.appendChild(this.textContainer);

		this.editor = document.createElement('textarea');
		this.editor.setAttribute('style', 'padding: 0px !important; margin: 0px !important; width: 250px; height:300px; border:1px solid #ccc !important; resize: auto !important;');
		this.cm.set( 'atcodes', this.formula );
		this.editor.value = this.formula;
		this.textContainer.appendChild(this.editor);

		var compileButton = document.createElement('button');
		compileButton.setAttribute('style','padding: 0px !important; margin: 0px !important;');
		compileButton.innerHTML = "compile!";
		compileButton.onclick = function(e) {
			self.formula = self.editor.value;
			self.build();
		};
		this.container.appendChild(compileButton);

		var saveButton = document.createElement('button');
		saveButton.setAttribute('style','padding: 0px !important; margin: 0px !important;');
		saveButton.innerHTML = "save!";
		saveButton.onclick = function(e) {
			//*
			if(self.sfm.ready)
				self.sfm.writeToFile(self.saveFile, self.editor.value, function(e) {
					console.log("save successful!");
				});
			//*/
			self.cm.set( 'atcodes', self.editor.value );
		};
		this.container.appendChild(saveButton);

		var exportButton = document.createElement('button');
		exportButton.setAttribute('style','padding: 0px !important; margin: 0px !important;');
		exportButton.innerHTML = "export!";
		exportButton.onclick = function(e) {
			if(self.sfm.ready)
			{
				var f_str = self.editor.value;
				; f_arr = f_str.split('\n');
				var i = 0;
				var f_export = "";
				for( i = 0; i < f_arr.length; i++) {
					f_export += f_arr[i] + "\\n\\\n";
				}
				self.sfm.writeToFile(self.exportFile, f_export, function(e) {
					console.log("save successful!");
				});
			}
				
		};
		this.container.appendChild(exportButton);

		var showExportButton = document.createElement('button');
		showExportButton.setAttribute('style','padding: 0px !important; margin: 0px !important;');
		showExportButton.innerHTML = "show export!";
		showExportButton.onclick = function(e) {
			if(self.sfm.ready) {
				
				window.open(self.sfm.getFileLink(self.exportFile), "export","status=0, toolbar=0, menubar=0, width=700, height=550");
				//window.open("javascript:var d=document,b=d.body,t=d.createElement('textarea');b.appendChild(t);t.setAttribute('style','width:100%;height:100%;');t.value='"+self.cm.get( 'atcodes' ).replace(/\n/gi,'\\\\n\\\\\\ \\n')+"';void(0);", "export","status=0, toolbar=0, menubar=0, width=700, height=550");
			}		
		};
		this.container.appendChild(showExportButton);

		var closeButton = document.createElement('button');
		closeButton.setAttribute('style','padding: 0px !important; margin: 0px !important;');
		closeButton.innerHTML = "close!";
		closeButton.onclick = function(e) {
			
			document.body.removeChild(self.port);	
		};
		this.container.appendChild(closeButton);

		
		this.sfm.boot(function() {
			self.editor.value = self.formula;
			self.sfm.readFromFile(self.saveFile, function(result) {
				self.editor.value = result != "" ? result : self.formula;
			});
		});
		
		//self.editor.value = this.cm.get( 'atcodes' );
		
		this.initDictionary();
	};
	ATEditor.prototype = {
		initDictionary: function() {
			this.dict["mx"] = new ATStore(0.0);
			this.dict["my"] = new ATStore(0.0);
			this.dict["sx"] = new ATStore(0.0);
			this.dict["sy"] = new ATStore(0.0);
			this.dict["PI"] = new ATStore(Math.PI);
			this.dict["PIH"] = new ATStore(Math.PI/2);
			this.dict["R2D"] = new ATStore(180/Math.PI);
			this.dict["D2R"] = new ATStore(Math.PI/180);
			this.dict["W"] = new ATStore(this.W);
			this.dict["H"] = new ATStore(this.H);
		},
		step: function() {
			this.mf.clear();
            this.mf.lineStyle('#000000');
            this.mf.l_(-this.WH/this.scale, 0, this.WH/this.scale, 0);
			this.mf.l_(0, -this.HH/this.scale, 0, this.HH/this.scale);
            this.run(this.rows);
		},
		build: function() {
			this.dict = {}; // hash array
			this.loop = {};
			this.func = {};
			this.svcount = 0;
			this.slcount = 0;
			this.rows = [];
			this.rowcount = 0;
			this.textcount = 0;
			this.row_length = 0;
			this.root_index = 0;
			this.initDictionary();
			this.compile(this.formula, this.rows);
			this.mf.flush();
			this.step();
		},
		run: function( p_rows ) {
			if( p_rows.length == 0 ) return;
			var i = 0;
			var c = null; // ATRow
			var cl = 0;
			var stt = 0;
			var len = 0;
			for( i = 0; i < p_rows.length; i++ ) {
				try {
					c = p_rows[i];
					cl = c.line;
					stt = c.start;
					len = c.length;
					if(c instanceof ATvRow)
						c.run()
					else if(c instanceof ATDwRow)
						this.mf.l_.apply(this.mf, c.points());
					else if(c instanceof ATPrRow)
						this.mf.trace(c.strings().join(""));
					else if(c instanceof ATCcRow)
						this.mf.lineStyle(c.color);
					else if(c instanceof ATWhRow)
						while(c.should())
							this.run(c.rows);
					else if(c instanceof ATIfRow)
						if(c.should())
							this.run(c.rows);
						else
							this.run(c.erows);
					else if(c instanceof ATRoutine)
						this.run(c.rows);
					else if(c instanceof ATRtRow)
						c.run();
					else
						continue;
				} catch( e ) {
					this.mf.trace("error at row "+cl+", e = "+e);
				}
			}
		},
		compile: function(p_str, p_rows) {
			var f_pattern = /(([a-z0-9&]*|[\.\d]*)\s*\(([^\(\)]*?)\)(:(void|float|vec2|open|closed))*\s*\{)([^\{\}]*)\}(?:(\s*else\s*\{)([^\{\}]*)\})*/m;
			var f_matches = [];
			var f_index = 0;
			var f_origin_str = "";
			var f_cond = "";
			var f_row = null; // ATRow
			var f_func = "";
			var f_return_type = "";
			var f_content = "";
			var f_store = null; // ATStore
			var f_scope = {};
			var f_params = [];
			var f_routine = null; // ATRoutine
			var f_else = "";
			var f_length = 0;
			while(f_matches = p_str.match(f_pattern)) {
				//debugger;
				f_index = this.slcount;
				f_origin_str = f_matches[0];
				f_func = f_matches[2];
				f_cond = f_matches[3];
				f_return_type = f_matches[5];
				f_content = f_matches[6];
				f_else = f_matches[8];
				f_length = f_matches[1].length;
				if(f_func == "while") {
					f_row = new ATWhRow(f_origin_str.split('\n').length, f_length, f_cond.replace(/\s+/g, ''), f_content);
					this.dict["#" + f_index] = f_row;
					p_str = p_str.replace(f_pattern, "#" + f_index);
					this.slcount++;
				} else if (f_func == "if") {
					f_row = new ATIfRow(f_origin_str.split('\n').length, f_length, (f_matches[7])?f_matches[7].length:0, f_cond.replace(/\s+/g, ''), f_content, (f_else)?f_else:"");
					this.dict["'" + f_index] = f_row;
					p_str = p_str.replace(f_pattern, "'" + f_index);
					this.slcount++;
				} else {
					f_store = new ATStore();
					if (f_return_type == "closed")
						f_scope = {};
					else if (f_return_type == "open")
						f_scope = this.dict;
					f_params = f_cond.replace(/\s+/g, '').split(",");
					for(var p_s in f_params)
						f_scope[f_params[p_s]] = new ATStore();
					f_routine = new ATRoutine(f_origin_str.split('\n').length, f_length, f_index, f_store, f_scope, f_content, f_params);
					this.func[f_func] = f_routine; // save function on lists, for later checking use
					this.dict["@" + f_index] = f_routine;
					this.dict["~" + f_index] = f_store;
					//f_row = 
					p_str = p_str.replace(f_pattern, "@" + f_index);
					this.slcount++;
				}
			}
			this.analyze(p_str, p_rows, this.dict, this.root_index);
		},
		analyze: function(p_str, p_rows, p_scope, p_scope_index) {

			var l = p_str.split('\n');
			var line = "";
			var matches;
			var gs = 0;
			var splitvar;
			var variable_name = "";
			var f_store;
			var f_row;
			p_scope_index = typeof(p_scope_index) != 'undefined' ? p_scope_index: 0.0;
			
			var i = 0;
			for (i = 0; i < l.length; i++) {
				
				if (l[i] == "") {
					//textcount++;
					this.rowcount++;
					continue;
				}
				line = l[i];

				this.row_length = line.length;
				f_row = null;
				if (line.match(/\/\/(.*)/i)) {
					// comments
					line += " ";
					var f_pattern = /([^%]*)%(\([^%]*\)|[^%]*\)|[^\s,]*)(.*)/i;
					matches = line.match(f_pattern);
					if (!matches)
						f_row = new ATPrRow([new ATStore(line)]);
					else {
						var f_begin = "";
						var f_contents = "";
						var f_bracket = "";
						var f_end = "";
						var f_merge = "";
						var f_arr = [];
						var f_index = -1;
						while (matches) {
							f_index = this.svcount;
							f_begin = matches[1];
							f_contents = (matches[2])?matches[2]:"";
							f_end = matches[3];
							f_arr.push(new ATStore(f_begin));
							if (f_contents.indexOf("(") != -1) {
								f_store = new ATStore();
								p_scope["&" + f_index] = f_store;
								p_rows.push(new ATvRow(f_store, this.interpret(f_contents.replace(/\s+/g, ''), p_rows, p_scope)).record(this.rowcount,this.textcount,this.row_length));
								f_arr.push(f_store);
								this.svcount++;
							}
							else
								f_arr.push(p_scope[f_contents.replace(/\s+/g, '')]);
							line = f_end;
							matches = line.match(f_pattern);
						}
						f_arr.push(new ATStore(f_end));
						f_row = new ATPrRow(f_arr);
					}
				} else if (matches = line.match(/\b(vec|mat|float)(\d*)\s+(\w[\d\w]*)\s*={1}\s*(.*)/i)) {
					// declaration
					if (matches[1] == "vec")
						f_store = new ATStore(new Point());
					else if (matches[1] == "float")
						f_store = new ATStore(0.0);
					else
						f_store = new ATStore();
					f_store.objectname = matches[3];
					p_scope[matches[3]] = f_store;
					f_row = new ATvRow(f_store, this.interpret(matches[4].replace(/\s+/g, ''), p_rows, p_scope));
				} else if (matches = line.match(/([^\s]*)\s*={1}\s*(.*)/i)) {
					// operation
					splitvar = matches[1].split(".");
					variable_name = splitvar[0];
					f_row = new ATvRow(p_scope[variable_name], this.interpret(matches[2].replace(/\s+/g, ''), p_rows, p_scope), (splitvar.length > 1)?splitvar[1]:"")
				} else if (matches = line.match(/#(\d*)/)) {
					f_row = this.dict[matches[0]];
					this.textcount += f_row.linelength+1;
					f_row.load(this.interpret(f_row.cond, p_rows, p_scope));
					this.analyze(f_row.codes, f_row.rows, p_scope, p_scope_index);
					this.rowcount += f_row.linespan;
				} else if (matches = line.match(/'(\d*)/)) {
					f_row = this.dict[matches[0]];
					this.textcount += f_row.linelength+1;
					f_row.load(this.interpret(f_row.cond, p_rows, p_scope));
					if(f_row.codes && f_row.codes != "")
						this.analyze(f_row.codes, f_row.rows, p_scope, p_scope_index);
					if (f_row.elses && f_row.elses != "") {
						this.textcount += f_row.elength+1;
						this.analyze(f_row.elses, f_row.erows, p_scope, p_scope_index);
					}
					this.rowcount += f_row.linespan;
				} else if (matches = line.match(/@(\d*)/)) {
					f_row = this.dict[matches[0]];
					this.textcount += f_row.linelength+1;
					this.analyze(f_row.codes, f_row.rows, f_row.scope, f_row.index);
					this.rowcount += f_row.linespan;
					f_row = null;
				} else if (matches = line.match(/return\s+(.*)/)) {
					f_row = new ATRtRow(this.dict["~" + p_scope_index], this.interpret(matches[1].replace(/\s+/g, ''), p_rows, p_scope));
				} else if (line.match(/(.*\_+.*)/i)) {
					// drawing
					var d = line.replace(/\s+/g, '').split("_");
					var ps = [];
					for (var j = 0; j < d.length; j++)
						ps.push(this.interpret(d[j], p_rows, p_scope));
					f_row = new ATDwRow(ps);
				} else if (matches = p_str.match(/0x([a-fA-F\d]{1,8})/)) {
					f_row = new ATCcRow("#"+matches[1]);
				} else {
					// falls
				}
				if (f_row)
					p_rows.push(f_row.record(this.rowcount, this.textcount, this.row_length));
				this.textcount += line.length;
				this.rowcount++;
			}
		},
		interpret: function( p_str, p_rows, p_scope ) {
			// find & remove brackets
			var f_matches;
			var f_pattern;
			var f_side = "";
			var f_body = "";
			var f_node = null;
			var f_index = -1;
			var f_children;
			var f_args;
			var f_store;
			var f_routine;
			f_pattern = /(\d*|[a-z0-9&]*|[\.\d]*)\(([^\(\)]*?)\)/;
			while (f_matches = p_str.match(f_pattern)) {
				f_index = this.svcount;
				f_side = f_matches[1];
				f_body = f_matches[2];
				f_node = null;
				if (f_body != "") {
					if (f_side != "") {
						if (this.isFunc(f_side)) {
							f_children = [];
							f_args = f_body.split(",");
							for(var f_str in f_args)
								f_children.push(this.solve(f_args[f_str], p_scope));
							f_node = this.createFunc(f_side, f_children);
						} else {
							f_routine = this.func[f_side];
							if (f_routine) {
								f_children = [];
								f_args = f_body.split(",");
								for (var k = 0; k < f_args.length; k++)
									p_rows.push(new ATvRow(f_routine.params[k], this.solve(f_args[k], p_scope)));
								p_rows.push(f_routine);
								f_node = new ATLeaf(f_routine.result);
							} else
								f_node = new ATMultiplyBranch(this.solve(f_side, p_scope), this.solve(f_body, p_scope));
						}
					} else {
						f_node = this.solve(f_body, p_scope);
					}
				}
				if (f_node) {
					f_store = new ATStore();
					p_scope["&" + f_index] = f_store;
					p_rows.push(new ATvRow(f_store, f_node).record(this.rowcount,this.textcount,this.row_length));
					this.svcount++;
				}
				p_str = p_str.replace(f_pattern, "&" + f_index);
			}
			return this.solve(p_str, p_scope);
		},
		solve: function(p_str, p_scope) {
			var f_matches;
			var f_index = -1;
			f_matches = p_str.match(/(.*?)(<|>|==|!=)(.*)/);
			if (!f_matches) {
				f_matches = p_str.match(/(.*?[^\*\/\+\-])([\+\-])(.*)/);
			}
			if (!f_matches) {
				//f_matches = p_str.match(/(.*?)([\*\/])(.*)/); // first occurrence
				f_matches = p_str.match(/(.*)([\*|\/])(.*)/); // last occurrence
			}
			if (!f_matches) {
				f_matches = p_str.match(/(.*?)([\+\-])(.*)/);
			}
			if (f_matches) {
				return this.createBranch(f_matches[2],(f_matches[1]=="")?new ATLeaf(new ATStore(0)):this.solve(f_matches[1], p_scope),this.solve(f_matches[3], p_scope));
			}
			var n = parseFloat(p_str);
			if (!isNaN(n))
				return new ATLeaf(new ATStore(n));
			else {
				var spt = p_str.split(".");
				var variable_name = spt[0];
				return new ATLeaf(p_scope[variable_name], (spt[1])?spt[1]:"", variable_name);
			}
			return null;
		},
		createBranch: function( p_operator, p_left, p_right ) {
			if (p_operator == "+")
				return new ATAddBranch(p_left, p_right);
			else if (p_operator == "-")
				return new ATSubtractBranch(p_left, p_right);
			else if (p_operator == "<")
				return new ATLesserBranch(p_left, p_right);
			else if (p_operator == ">")
				return new ATLargerBranch(p_left, p_right);
			else if (p_operator == "*")
				return new ATMultiplyBranch(p_left, p_right);
			else if (p_operator == "/")
				return new ATDivideBranch(p_left, p_right);
			return null;
		},
		createFunc: function( p_func, p_children ) {
			if (p_func == "sin")
				return new ATSinFunc(p_children);
			else if (p_func == "cos")
				return new ATCosFunc(p_children);
			else if (p_func == "abs")
				return new ATAbsFunc(p_children);
			else if (p_func == "atan")
				return new ATAtanFunc(p_children);
			else if (p_func == "atan2")
				return new ATAtan2Func(p_children);
			else if (p_func == "norm")
				return new ATNormFunc(p_children);
			else if (p_func == "len")
				return new ATLenFunc(p_children);
			else if (p_func.indexOf("vec")>-1)
				return new ATVecFunc(p_children);
			return null;
		},
		isFunc: function( p_str ) {
			return "absasinacosatan2sqrtnormlenvec2mat2".indexOf(p_str) > -1;
		},
		// extra
		// http://stackoverflow.com/questions/69430/is-there-a-way-to-make-text-unselectable-on-an-html-page
		disableSelection: function(target) {
			if (typeof target.onselectstart != "undefined") //IE route
				target.onselectstart = function() { return false; }
			else if (typeof target.style.MozUserSelect != "undefined") //Firefox route
				target.style.MozUserSelect = "none";
			else //All other route (ie: Opera)
				target.onmousedown = function() { return false; }
			target.style.cursor = "default";
		}
	};
	window.ATEditor = ATEditor;
}(window));

(function(window){
	// http://www.html5rocks.com/en/tutorials/file/filesystem/
	var SFM = function(p_type) {
		this.fs = null;
		this.cwd = null;
		this.filesList = {};
		this.ready = false;
		this.type = typeof(p_type) != 'undefined' ? p_type : window.PERSISTENT;
	};
	var s = SFM.prototype = {
		errorHandler: function(e) {
			var msg = '';
			switch (e.code) {
				case FileError.QUOTA_EXCEEDED_ERR:
					msg = 'QUOTA_EXCEEDED_ERR';
					break;
				case FileError.NOT_FOUND_ERR:
					msg = 'NOT_FOUND_ERR';
					break;
				case FileError.SECURITY_ERR:
					msg = 'SECURITY_ERR';
					break;
				case FileError.INVALID_MODIFICATION_ERR:
					msg = 'INVALID_MODIFICATION_ERR';
					break;
				case FileError.INVALID_STATE_ERR:
					msg = 'INVALID_STATE_ERR';
					break;
				default:
					msg = 'Unknown Error';
					break;
			};
			console.log('Error: ' + msg);
		},
		createDirectory: function(p_directory_name) {

		},
		markExisted: function(p_file_name) {
			this.filesList[p_file_name] = true;
		},
		fileIsExisted: function(p_file_name) {
			return typeof(this.filesList[p_file_name]) != 'undefined';
		},
		getFileLink: function(p_file_name) {
			return "filesystem:"+window.location.origin+"/persistent/"+p_file_name;
		},
		writeToFile: function(p_file_name, p_str, p_callback, p_check) {
			var self = this;
			var chk = typeof(p_check) != 'undefined'? p_check : true;
			this.cwd.getFile(p_file_name, {create: true, exclusive: chk}, function(fileEntry) {
				// fileEntry.isFile === true
				// fileEntry.name == 'XXX.XXX'
				// fileEntry.fullPath == '/XXX.XXX'
				fileEntry.createWriter(function(fileWriter) {
					//var bb = new window.WebKitBlobBuilder(); // Note: window.WebKitBlobBuilder in Chrome 12.
					// deprecated
					var bb = new Blob([p_str]);
					//bb.append(p_str);
					fileWriter.onwrite = function(e) {
						fileWriter.onwrite = function(e) {
							p_callback(e);
						};
						//fileWriter.write(bb.getBlob('text/plain'));
						fileWriter.write(bb);
					};
					fileWriter.onerror = function(e) {
						console.log(e);
					};

					// overwrite contents
					fileWriter.truncate(0);
				}, function(e) {
					console.log(e);
				});
			}, function(e) { //error, file existed error if exclusive is specified to true
				console.log(e);
				// how to identify error?
				self.writeToFile(p_file_name, p_str, p_callback, false);
			});
		},
		readFromFile: function(p_file_name, p_callback) {
			this.cwd.getFile(p_file_name, {}, function(fileEntry) {
				// Get a File object representing the file,
				// then use FileReader to read its contents.
				fileEntry.file(function(file) {
					var reader = new FileReader();

					reader.onloadend = function(e) {
						p_callback(this.result);
					};
					reader.readAsText(file);
				}, function(e) {
					console.log(e);
				});

			}, function(e) {
				console.log(e);
			});
		},
		boot: function(ready) {
			// store file permamently, use persistent than temporary, ask for 1mb
			var self = this;
			if(window.webkitStorageInfo)
				window.webkitStorageInfo.requestQuota(self.type, 1024*1024, function(grantedBytes) {
					window.requestFileSystem(self.type, grantedBytes, function(fs) {
						console.log('Opened file system: ' + fs.name);

						self.fs = fs;
						self.cwd = fs.root;

						if(ready) ready();
						self.ready = true;
					}, self.errorHandler);
				}, function(e) {
					console.log('Error', e);
				});
		}
	};
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	window.SFM = SFM;
}(window));
(function(window){
	var CookieManager = function( p_domain ) {
		this.domain = p_domain;
	};
	var c = CookieManager.prototype = {
		set: function( p_key, p_value, p_life ) {
			p_life = typeof(p_life) != 'undefined' ? p_life : 7;
			document.cookie = p_key + "=" + encodeURIComponent( p_value ) + "; max-age=" + 60 * 60 * 24 * p_life + "; path=/; domain=" + this.domain;
			console.log(p_key + "=" + encodeURIComponent( p_value ) + "; max-age=" + 60 * 60 * 24 * p_life + "; path=/; domain=" + this.domain);
		},
		get: function ( p_key, p_decode ) {
			p_decode = typeof(p_decode) != 'undefined' ? p_decode : true;
			var cookieString = document.cookie;
			if (cookieString.length != 0) {
				var cookieValue = cookieString.match ( new RegExp('([^;]*)\s*atcodes=([^;]*)') );
				if(cookieValue)
					if(p_decode)
						return decodeURIComponent ( cookieValue[2] ) ;
					else
						return cookieValue[2];
			}
			return '';
		},
		remove: function( p_key ) {
			document.cookie = p_key + "=; max-age=0; path=/; domain=" + this.domain;
		}
	};
	window.CookieManager = CookieManager;
}(window));