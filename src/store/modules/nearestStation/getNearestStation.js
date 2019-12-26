import stationsApi from "@/api/stations";

//TODO: change name of module?

export const state = {
  station: {},
  connections: []
};

export const getters = {};

export const actions = {
  async getNearestStation({ commit }, location) {
    const station = await stationsApi.getNearestStation(location);
    // TODO: try catch with error
    commit("SET_ACTIVE_STATION", station);
  },
  async changeTripFormStartingStation({ commit }, station) {
    commit("SET_ACTIVE_STATION", station);
    const connections = await stationsApi.getConnections(station.id);
    // TODO: try catch with error
    commit("SET_ACTIVE_CONNECTIONS", connections);
  }
};

export const mutations = {
  SET_ACTIVE_STATION(state, station) {
    state.station = station;
  },
  SET_ACTIVE_CONNECTIONS(state, connections) {
    state.connections = connections;
  }
};
