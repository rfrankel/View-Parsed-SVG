Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox();
    var bb2 = obj2.getBBox();
    var p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}];
    var d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        var res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y,
        dx = Math.max(Math.abs(x1 - x4) / 2, 10),
        dy = Math.max(Math.abs(y1 - y4) / 2, 10),
        x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            line: this.path(path).attr({stroke: color, fill: "none"}),
            from: obj1,
            to: obj2
        };
    }
};
 
var el;
window.onload = function () {
    var isDrag = false;
    var dragger = function (e) {
        this.dx = e.clientX;
        this.dy = e.clientY;
        isDrag = this;
        this.animate({"fill-opacity": .2}, 500);
        e.preventDefault && e.preventDefault();
    };
    var clicker = function () {
        console.log("entered mouse click function");
	var on = document.getElementById('outputname');
	on.innerHTML = this.name;
	var bb = this.getBBox();
	var ox = document.getElementById('outputx');
	ox.innerHTML = bb.x;
	var oy = document.getElementById('outputy');
	oy.innerHTML = bb.y;
	var ow = document.getElementById('outputw');
	ow.innerHTML = bb.width;
	var oh = document.getElementById('outputh');
	oh.innerHTML = bb.height;
	if (this.label) {
	    var bblabel = this.label.getBBox();
	    var olx = document.getElementById('outputlx');
	    olx.innerHTML = bblabel.x;
	    var oly = document.getElementById('outputly');
	    oly.innerHTML = bblabel.y;
	    var olw = document.getElementById('outputlw');
	    olw.innerHTML = bblabel.width;
	    var olh = document.getElementById('outputlh');
	    olh.innerHTML = bblabel.height;
	};  
    };

    var r = Raphael("holder", 165, 305);
    function isEven(num) {
	return !(num % 2);
    }


    var connections = []
    var shapes = [ r.rect(72,120,24,30),
		   r.text(79,139.5,">"),
		   r.ellipse(84,195,54.5,15),
		   r.text(36.5,199.5,"miller > cooper"),
		   r.rect(50.5,245,67,30),
		   r.text(57.5,264.5,"Require!"),
		   r.rect(41.5,0,85,30),
		   r.text(48.5,19.5,"BigMachine"),
		   r.ellipse(44,75,29,15),
		   r.text(22,79.5,"Cooper"),
		   r.ellipse(126.5,75,23.5,15),
		   r.text(110,79.5,"Miller")]
    for (var i = 0, ii = shapes.length; i < ii; i++) {
        var color = Raphael.getColor();
        if (isEven(i)) {
          var half = i/2; 
          var oddonemore = i + 1;
          shapes[i].label = shapes[oddonemore];
          shapes[i].name = "shape" + half;
          console.log("defined name of %s with number %d",shapes[half],half);
          shapes[oddonemore].name = "label" + half;
	};
        shapes[i].attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2});
        shapes[i].node.style.cursor = "move";
        shapes[i].mousedown(dragger);
        shapes[i].click(clicker);
    }
    shapes[5].attr({"stroke-width": 1});
    shapes[9].attr({"font-size": 28, "stroke-width": 1});
    shapes[10].attr({"fill-opacity": .9});
    shapes[11].attr({"font-size": 28, "stroke-width": 1});
    shapes[10].toFront();
    var st = r.set();
    st.push(
	r.path("M0 0 L165 0 L165 305 L0 305 L0 0 Z"),
	r.path("M0 0 L165 0 L165 290 L0 290 L0 0 Z"),
	r.path("M84 150 L84 180"),
	r.path("M84 244.9658 L84 210"),
	r.path("M44 30 L44 60"),
	r.path("M73 75 L84 75 L84 119.9561"),
	r.path("M124.5 30 L124.5 60"),
	r.path("M103 75 L88 75 L88 119.9561")
    );
    st.attr({stroke: "#fff", "stroke-width": 2});
    for (var i = 0, ii = st.length; i < ii; i++) {
        st[i].click(clicker);
    };
      connections.push(r.connection(shapes[0], shapes[2], "#fff"));
  //  connections.push(r.connection(shapes[2], shapes[4], "#fff", "#fff|5"));
  //  connections.push(r.connection(shapes[8], shapes[0], "#fff"));
  //  connections.push(r.connection(shapes[6], shapes[8], "#fff"));
  //  connections.push(r.connection(shapes[6], shapes[10], "#fff"));
  document.onmousemove = function (e) {
        e = e || window.event;
        if (isDrag) {
            isDrag.translate(e.clientX - isDrag.dx, e.clientY - isDrag.dy);
            for (var i = connections.length; i--;) {
                r.connection(connections[i]);
            }
            r.safari();
            isDrag.dx = e.clientX;
            isDrag.dy = e.clientY;
            console.log("dx is %d and dy is %d", isDrag.dx, isDrag.dy);
            console.log("in onmousemove function this is %s",this);
        }
    };
    document.onmouseup = function () {
        isDrag && isDrag.animate({"fill-opacity": 0}, 500);
        isDrag = false;
    };
};