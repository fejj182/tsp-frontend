import * as module from "./popups";

describe("popups", () => {
  describe("actions", () => {
    describe("openPopup", () => {
      it("should commit to the store", () => {
        let commit = jest.fn();
        let station = {};
        module.actions.openPopup({ commit }, station);
        expect(commit).toHaveBeenCalledWith("OPEN_STATION_POPUP", station);
      });
    });
  });
  describe("mutations", () => {
    describe("OPEN_STATION_POPUP", () => {
      it("should set the open station", () => {
        let state = {
          openStation: null
        };
        let station = {};
        module.mutations.OPEN_STATION_POPUP(state, station);
        expect(state.openStation).toEqual(station);
      });
    });
  });
});
