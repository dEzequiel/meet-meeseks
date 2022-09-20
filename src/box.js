let factory = require("./mrmeeseks");

function Box() {
  this.name = "Rick's box";
  this.meesek = null;
}

Box.prototype = {
  createMrMeesek: function () {
    if (!this.meesek) {
      this.meesek = factory.singleMrMeeseks.getInstace();
    }

    let meesekProto = Object.create(this.meesek);
    return meesekProto;
  },

  getProtoMeeseks: function () {
    return this.meesek;
  },

  pressButton: function (reality) {
    let mrMee = this.createMrMeesek();
    mrMee.speakOnCreate();
    reality.push(mrMee);
  },
};

var singletonFactory = (function () {
  function boxSingleton() {
    return new Box();
  }

  var instance;
  return {
    getInstace: function () {
      if (!instance) {
        instance = boxSingleton();
      }
      return instance;
    },
  };
})();

exports.singleBox = singletonFactory;
