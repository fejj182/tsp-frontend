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
    describe("closePopup", () => {
      it("should commit to the store", () => {
        let commit = jest.fn();
        module.actions.closePopup({ commit });
        expect(commit).toHaveBeenCalledWith("CLOSE_STATION_POPUP");
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
    describe("CLOSE_STATION_POPUP", () => {
      it("should set the open station", () => {
        let state = {
          openStation: {}
        };
        module.mutations.CLOSE_STATION_POPUP(state);
        expect(state.openStation).toEqual(null);
      });
    });
  });
});
