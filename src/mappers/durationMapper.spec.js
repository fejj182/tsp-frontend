import { toHoursAndMinutes } from "./durationMapper";
describe("durationMapper", () => {
  it("should map duration to hours and minutes", () => {
    const duration = 100;
    expect(toHoursAndMinutes(duration)).toBe("1h 40m");
  });

  it("should map duration to minutes only if < 60", () => {
    const duration = 59;
    expect(toHoursAndMinutes(duration)).toBe("59m");
  });
});
