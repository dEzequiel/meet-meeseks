let factory = require("../../src/meeseks/mrmeeseks.js");
const { expect } = require("@jest/globals");

describe("Proxy pattern", () => {
  test("should create meesek singleton using factory", () => {
    expect(factory.singleMrMeeseks.getInstace()).toBeTruthy;
  });

  test("two meeseks should be the same (singleton)", () => {
    let first_meesek = factory.singleMrMeeseks.getInstace();
    let second_meesek = factory.singleMrMeeseks.getInstace();

    expect(first_meesek === second_meesek).toBeTruthy;
  });

  test("playing with prototype", () => {
    let first_meesek = factory.singleMrMeeseks.getInstace();
    expect(first_meesek.speakOnCreate()).toBe("I'm Mr Meeseks! Look at meee!");
  });
});

describe("integration", () => {
  let meesek = null;
  let box = {};

  beforeEach(() => {
    // Tener un singleton de meesek antes de cada test
    meesek = factory.singleMrMeeseks.getInstace();

    // MOKEC FUNCTION //
    /**
     * box.pressButton() crea clones meeseks a partir de su prototype.
     * Asi eliminas la dependecia a box en los text.
     */

    const boxMock = jest
      .fn()
      .mockImplementation(() => Object.create(meesek))
      .mockName("boxMock");

    box.pressButton = boxMock;
  });

  // STRING_MATCHING
  test("can access constructor properties", () => {
    expect(meesek.messageOnCreate).toEqual(
      expect.stringMatching("I'm Mr Meeseks! Look at meee!")
    );
  });

  // REGULAR EXPRESSIONS + TO_MATCH
  test("speakOnRequest() generates random message", () => {
    const expectedRegrExpr = /^Oooh\b|\ssireee!$|\sma'am!$/;
    expect(meesek.speakOnRequest()).toMatch(expectedRegrExpr);
  });

  // OBJECT HAVE ON FLY ADDED PROPERTY
  test("makeRequest() should add new property on fly to a object && prototype should stay intact", () => {
    meesek.makeRequest("open", "Jerry's stupid mayonnaise jar");

    // Al llamar makeRequest() se le a;ade una nueva prop al prototype MrMeesek
    expect(meesek).toHaveProperty("action");
    expect(meesek.action()).toEqual(
      expect.stringMatching("open" + " " + "Jerry's stupid mayonnaise jar")
    );

    // El prototipo en si no contiene ninguna propiedad que sea 'accion', se le a;ade
    // al llamar al metodo makeRequest() [anterior test]
    let basedOnProtoMeesek = Object.create(meesek);
    expect(basedOnProtoMeesek.hasOwnProperty("action")).toBeFalsy();

    let meesekProto = Object.getPrototypeOf(meesek);
    expect(meesekProto).not.toHaveProperty("action");
  });

  test("fullFillRequest() calls this.action()", () => {
    // MOCK FUNCTIONS con IMPLEMENTATIONS

    /**
     * La funcion accion que necesita fulfillRequest
     * ha de ser creada previamente por makeRequest()
     * e inyectada en el objeto meeseeks.
     * No podemos depender de la implementacion de makeRequest()
     * para pasar este test => mockear la funcion accion() que
     * inyecta makeRequest() e inyectarla a mano en el objeto meeseeks
     */

    const actionMock = jest
      .fn()
      .mockImplementation(() => "open" + " " + "Jerry's head")
      .mockName("actionMock");

    meesek.action = actionMock;
    expect(meesek).toHaveProperty("action");

    // El objeto meesek invoca a la función fullFillRequest() y esta invoca al actionMock()
    expect(meesek.fullFillRequest()).toEqual(
      expect.stringMatching("open" + " " + "Jerry's head" + " All done!!")
    );

    // actionMock ha debido ser llamada desde fulllFillRequest()
    expect(actionMock).toHaveBeenCalled();
  });

  test("change prototype messageOnCreate", () => {
    //antes mockeada que asigna prototipo a objeto
    let clone = box.pressButton();

    // clone es un objeto que here del prototipo del objeto meesek, meesek hereda del prototitpo de MrMeesek
    expect(Object.getPrototypeOf(clone) === meesek).toBeTruthy;

    /**
        No estas modificando el objeto clone, estas modificando el prototipo del
        que ha heredado.
    */
    Object.getPrototypeOf(clone).messageOnCreate = "Hi!!";
    expect(meesek.messageOnCreate).toEqual(expect.stringMatching("Hi!!"));
    // Al heredar del prototipo, tambien hereda sus cambios.
    expect(clone.messageOnCreate).toEqual(expect.stringMatching("Hi!!"));

    expect(clone).toHaveProperty("messageOnCreate"); //Tiene la propiedad heredada
    expect(clone.hasOwnProperty("messageOnCreate")).toBeFalsy(); //No fue quien definio la propiedad, solo la heredo
  });
});
