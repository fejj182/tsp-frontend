import { toHoursAndMinutes } from "./durationMapper";
describe("durationMapper", () => {
  it("should map duration to hours and minutes", () => {
    const duration = 100;
    expect(toHoursAndMinutes(duration)).toBe("1 hr 40 min");
  });

  it("should map duration to minutes only if < 60", () => {
    const duration = 59;
    expect(toHoursAndMinutes(duration)).toBe("59 min");
  });

  it("should return blank string if passed in undefined", () => {
    const duration = undefined;
    expect(toHoursAndMinutes(duration)).toBe("");
  });

  it("should return same string if passed in string", () => {
    const duration = "1 hr 59 min";
    expect(toHoursAndMinutes(duration)).toBe("1 hr 59 min");
  });
});
