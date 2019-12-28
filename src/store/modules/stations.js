import stationsApi from "@/api/stations";

export const state = {
  station: {},
  connections: []
};

export const getters = {
  connectionCoordSets: state => {
    return state.connections.map(connection => connection.coords);
  }
};

export const actions = {
  async getNearestStation({ dispatch }, location) {
    const station = await stationsApi.getNearestStation(location);
    dispatch("addStationsToMap", station);
  },
  async addStationsToMap({ commit }, station) {
    commit("SET_ACTIVE_STATION", station);
    const connections = await stationsApi.getConnections(station.id);
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
