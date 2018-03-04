import { fxapp } from "../src";

test("ignore empty fx", () => {
  const main = fxapp({
    actions: {
      invalid: () => []
    }
  });
  expect(main.invalid()).toEqual([]);
});

test("throw for invalid fx", () =>
  expect(() =>
    fxapp({
      actions: {
        invalid: () => ["invalid"]
      }
    }).invalid()
  ).toThrow("no such fx type: invalid"));

test("allow adding new custom effect", () => {
  const externalState = { value: 2 };

  const main = fxapp({
    fx: [
      {
        name: "set",
        creator: action => ["set", { action }],
        runner(props, getAction) {
          getAction(props.action)(externalState);
        }
      }
    ],
    state: {
      value: 0
    },
    actions: {
      foo: fx => fx.set("set"),
      set: fx => fx.merge(fx.data),
      get: fx => fx.get()
    }
  });

  expect(main.get()).toEqual({
    value: 0
  });

  main.foo();
  expect(main.get()).toEqual({
    value: 2
  });

  externalState.value = 1;

  main.foo();
  expect(main.get()).toEqual({
    value: 1
  });
});
