import stationsApi from "@/api/stations";

export const state = {
  station: {}
};

export const getters = {};

export const actions = {
  async getNearestStation({ commit }, location) {
    const station = await stationsApi.getNearestStation(location);
    commit("FETCH_NEAREST_STATION_SUCCESS", station);
  }
};

export const mutations = {
  FETCH_NEAREST_STATION_SUCCESS(state, station) {
    state.station = station;
  }
};
