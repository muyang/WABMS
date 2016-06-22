(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ABM.Mouse = (function() {
    function Mouse(model, callback) {
      this.model = model;
      this.callback = callback;
      this.handleMouseMove = __bind(this.handleMouseMove, this);
      this.handleMouseUp = __bind(this.handleMouseUp, this);
      this.handleMouseDown = __bind(this.handleMouseDown, this);
      this.lastX = Infinity;
      this.lastY = Infinity;
      this.div = this.model.div;
      this.start();
    }

    Mouse.prototype.start = function() {
      this.div.addEventListener("mousedown", this.handleMouseDown, false);
      document.body.addEventListener("mouseup", this.handleMouseUp, false);
      this.div.addEventListener("mousemove", this.handleMouseMove, false);
      this.lastX = this.lastY = this.x = this.y = this.pixX = this.pixY = NaN;
      return this.moved = this.down = false;
    };

    Mouse.prototype.stop = function() {
      this.div.removeEventListener("mousedown", this.handleMouseDown, false);
      document.body.removeEventListener("mouseup", this.handleMouseUp, false);
      this.div.removeEventListener("mousemove", this.handleMouseMove, false);
      this.lastX = this.lastY = this.x = this.y = this.pixX = this.pixY = NaN;
      return this.moved = this.down = false;
    };

    Mouse.prototype.handleMouseDown = function(e) {
      this.down = true;
      return this.setXY(e);
    };

    Mouse.prototype.handleMouseUp = function() {
      return this.down = false;
    };

    Mouse.prototype.handleMouseMove = function(e) {
      return this.setXY(e);
    };

    Mouse.prototype.setXY = function(e) {
      var _ref;
      this.lastX = this.x;
      this.lastY = this.y;
      this.pixX = e.offsetX;
      this.pixY = e.offsetY;
      _ref = this.model.patches.pixelXYtoPatchXY(this.pixX, this.pixY), this.x = _ref[0], this.y = _ref[1];
      this.moved = (this.x !== this.lastX) || (this.y !== this.lastY);
      if (this.callback != null) {
        return this.callback(e);
      }
    };

    return Mouse;

  })();

}).call(this);
