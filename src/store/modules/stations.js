import stationsApi from "@/api/stations";

export const state = {
  activeStation: null,
  activeConnections: []
};

export const getters = {};

export const actions = {
  async getNearestStation({ dispatch, commit }, location) {
    commit("CLEAR_ACTIVE_STATION");
    const station = await stationsApi.getNearestStation(location);
    dispatch("addStationsToMap", station);
  },
  async addStationsToMap({ dispatch, commit }, startingStation) {
    commit("SET_ACTIVE_STATION", startingStation);
    commit("CLEAR_ACTIVE_CONNECTIONS");
    dispatch("resetTrip");
    const connections = await stationsApi.getConnections(startingStation.id);
    dispatch("addStopConnections", { connections });
    commit("SET_ACTIVE_CONNECTIONS", connections);
  },
  async addStopToTrip({ dispatch, commit }, station) {
    commit("SET_ACTIVE_STATION", station);
    commit("CLEAR_ACTIVE_CONNECTIONS");
    const connections = await stationsApi.getConnections(station.id);
    dispatch("addStopConnections", { connections });
    commit("SET_ACTIVE_CONNECTIONS", connections);
  }
};

export const mutations = {
  SET_ACTIVE_STATION(state, station) {
    state.activeStation = station;
  },
  SET_ACTIVE_CONNECTIONS(state, connections) {
    state.activeConnections = connections;
  },
  CLEAR_ACTIVE_STATION(state) {
    state.activeStation = null;
  },
  CLEAR_ACTIVE_CONNECTIONS(state) {
    state.activeConnections = [];
  }
};
