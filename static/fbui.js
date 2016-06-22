(function() {
  ABM.FirebaseUI = (function() {
    function FirebaseUI(fbname, model, ui) {
      var k, v, _ref, _ref1;
      this.fbname = fbname;
      this.model = model;
      this.ui = ui;
      this.fb = new Firebase(fbname);
      this.refs = {};
      _ref = this.ui;
      for (k in _ref) {
        v = _ref[k];
        this.refs[k] = this.fb.child(k);
      }
      this.vals = {};
      _ref1 = this.ui;
      for (k in _ref1) {
        v = _ref1[k];
        this.vals[k] = v.val;
      }
      this.resetModel();
      this.fb.set(ui, function(val) {
        return console.log(val != null ? "FB error: " + val : "FB ready");
      });
      this.fb.on('child_changed', (function(_this) {
        return function(snapshot) {
          console.log("childChange", snapshot.name(), snapshot.val().val);
          return _this.setModelValue(snapshot.name(), snapshot.val().val);
        };
      })(this));
      console.log("--- Firebase setup");
    }

    FirebaseUI.prototype.setModelValue = function(name, value) {
      var setter;
      console.log("setModelValue: " + name + ", " + value);
      this.vals[name] = value;
      if (this.ui[name].type === "button") {
        if (value) {
          this.setUIValue(name, false);
        } else {
          return;
        }
      }
      if ((setter = this.ui[name].setter) != null) {
        return this.model[setter](value);
      } else {
        return this.model[name] = value;
      }
    };

    FirebaseUI.prototype.setUIValue = function(name, value, push) {
      if (push == null) {
        push = false;
      }
      console.log("setUIValue: " + name + ", " + value + ", " + push);
      return this.refs[name].child('val')[push ? "push" : "set"](value);
    };

    FirebaseUI.prototype.getUIValue = function(name) {
      return this.vals[name];
    };

    FirebaseUI.prototype.resetModel = function() {
      var k, v, _ref, _results;
      _ref = this.ui;
      _results = [];
      for (k in _ref) {
        v = _ref[k];
        if (v.type !== "button") {
          _results.push(this.setModelValue(k, v.val));
        }
      }
      return _results;
    };

    FirebaseUI.prototype.resetUI = function() {
      var k, v, _ref, _results;
      _ref = this.ui;
      _results = [];
      for (k in _ref) {
        v = _ref[k];
        if (v.type !== "button") {
          _results.push(this.setUIValue(k, v.val));
        }
      }
      return _results;
    };

    return FirebaseUI;

  })();

}).call(this);
