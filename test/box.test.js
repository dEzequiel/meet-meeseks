const { expect } = require("@jest/globals");
let factory = require("../src/box.js");

describe("Proxy pattern", () => {
  test("create box using factory singleton", () => {
    expect(factory.singleBox.getInstace().name).toBe("Rick's box");
  });

  test("factory return the same box everytime (singleton)", () => {
    let first_box = factory.singleBox.getInstace();
    let second_box = factory.singleBox.getInstace();

    expect(first_box === second_box).toBeTruthy;

    function Box() {
      this.name = "Rick's box";
      this.mrMeeseeks = null;
    }

    let box_mocked = new Box();
    expect(first_box === box_mocked).toBeFalsy;
    expect(first_box).not.toBeInstanceOf(Box);
  });
});

describe("", () => {
  let box = null;

  beforeEach(() => {
    box = factory.singleBox.getInstace();
  });

  test("", () => {
    let meesek = box.createMrMeesek();
    expect(meesek).toHaveProperty("messageOnCreate");

    /** messageOnCreate existe en el prototipo no en el objeto actual  */
    expect(meesek.hasOwnProperty("messageOnCreate")).toBeFalsy;
    expect(meesek.messageOnCreate).toEqual(
      expect.stringMatching("I'm Mr Meeseks! Look at meee!")
    );

    // Ahora la propiedad existe en el obejeto actual y no es heredada del prototipo
    meesek.messageOnCreate = "Caaaan doooo!!";
    expect(meesek.hasOwnProperty("messageOnCreate")).toBeTruthy;

    // Se mantiene el mensaje de messageOnCreate del prototipo
    let proto = box.getProtoMeeseks();
    expect(proto).toHaveProperty("messageOnCreate");
    expect(proto.messageOnCreate).toEqual(
      expect.stringMatching("I'm Mr Meeseks! Look at meee!")
    );
  });

  test("pressButton() should bring meesek to reality", () => {
    let reality = [];
    box.pressButton(reality);

    expect(reality).toHaveLength(1);

    expect(reality[0]).toHaveProperty(
      "messageOnCreate",
      "I'm Mr Meeseks! Look at meee!"
    );

    let meesek = box.getProtoMeeseks();
    expect(reality[0]).toEqual(expect.objectContaining(meesek));
  });
});
