/**
 * JavaScript provoca cierta confusión en desarrolladores con experiencia en lenguajes basados en clases
 * (como Java o C++), por ser dinámico y no proporcionar una implementación de clases en sí mismo
 * (la palabra clave class se introdujo en ES2015, pero sólo para endulzar la sintaxis,
 * ya que JavaScript sigue estando basado en prototipos).
 */

// Creacion del prototipo.
// Un "constructor" en JavaScript es "solo" una función que pasa a ser llamada con el operador new.

function MrMeeseks() {
  this.id = 0; // Tendras una lista de Meeseks, el id no se puede repetir si se crea uno
  this.messageOnCreate = "I'm Mr Meeseks! Look at meee!";
  this.messageOnRequest = [
    "Oooh yeah! Can do!",
    "Yes sireee!",
    "Oh, yeah!, Yes, ma'am!",
  ];
  this.messageOnDone = "";
  this.messageOnExplode = "";
  this.request = "";
}

// MrMeeseks.prototype.speakOnCreate = function () {
//   console.log(this.messageOnCreate);
// };

MrMeeseks.prototype = {
  //   get: function () {
  //     return this.id;
  //   },

  //   getMessageOnRequest(index) {
  //     if (index instanceof string) {
  //       console.log("Should send a number");
  //     } else {
  //       return this.messageOnRequest[index];
  //     }
  //   },

  //   setRequest(request) {
  //     this.messageOnRequest.push(request)
  //   },

  speakOnCreate: function () {
    console.log(this.messageOnCreate);
    return this.messageOnCreate;
  },

  speakOnRequest: function () {
    let message =
      this.messageOnRequest[
        Math.floor(Math.random() * this.messageOnRequest.length)
      ];
    console.log(message);
    return message;
  },

  //Tienes una closure cuando una función cualquiera accede a una variable fuera de su contexto.
  makeRequest: function (desire, object) {
    let closure = function (thing) {
      function execute() {
        return desire + " " + object; // Esta accediento a desire y object que son del ambito de otra funcion.
      }
      return execute;
    };
    /**Puedes crear propiedades del objeto/prototipo Meeseks onfly.
     * La propiedad action es igual al valor de la function execute()
     */
    this.action = closure(object); // NUEVA PROP
    this.speakOnRequest();
  },

  fullFillRequest: function () {
    console.log(this.action() + " All done!!");
    return this.action() + " All done!!";
  },
};

// SINGLETON DEL OBJETO MRMEESEK //

/** Este objeto hereda directamente del prototipo de MrMeesek, que ha sido
 * alterado con nuevos metodos mas arriba. */
var singletonFactory = (function () {
  function meesekSingleton() {
    return new MrMeeseks();
  }

  var instance;
  return {
    getInstace: function () {
      if (!instance) {
        instance = meesekSingleton();
      }
      return instance;
    },
  };
})();

// Exportacion del singleton
exports.singleMrMeeseks = singletonFactory;
