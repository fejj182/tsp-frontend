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
    dispatch("selectStartingInput", station);
    dispatch("addStopToTrip", station);
  },
  async addStopToTrip({ dispatch, commit }, station) {
    commit("SET_ACTIVE_STATION", station);
    commit("CLEAR_ACTIVE_CONNECTIONS");
    const connections = await stationsApi.getConnections(station.id);
    commit("SET_ACTIVE_CONNECTIONS", connections);
    dispatch("addConnectionsToForm", { connections });
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
