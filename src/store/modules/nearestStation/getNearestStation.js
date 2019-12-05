import stationsApi from "@/api/stations";

export const state = {
  station: {}
};

export const getters = {};

export const actions = {
  async getNearestStation({ commit }, location) {
    const station = await stationsApi.getNearestStation(location);
    commit("SET_ACTIVE_STATION", station);
  },
  setActiveStation({ commit }, station) {
    commit("SET_ACTIVE_STATION", station);
  }
};

export const mutations = {
  SET_ACTIVE_STATION(state, station) {
    state.station = station;
  }
};
