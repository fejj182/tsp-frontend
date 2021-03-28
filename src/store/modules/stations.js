import stationsApi from "@/api/stations";

export const state = {
  activeStation: null,
  activeConnections: [],
  startingStations: []
};

export const getters = {
  getStationsByCountries: state => countries => {
    if (countries.length == 0) {
      return state.startingStations;
    }
    return state.startingStations.filter(
      station => countries.indexOf(station.country) != -1
    );
  }
};

export const actions = {
  async fetchConnections({ dispatch, commit }, station) {
    commit("RESET_MAP");
    const connections = await stationsApi.getConnections(station.id);
    commit("SET_ACTIVE_STATION", station);
    commit("SET_ACTIVE_CONNECTIONS", connections);
    dispatch("addNewStop", { stations: connections });
  },
  async reloadConnections({ commit }, { station, connections }) {
    commit("SET_ACTIVE_STATION", station);
    commit("CLEAR_ACTIVE_CONNECTIONS");
    commit("SET_ACTIVE_CONNECTIONS", connections);
  },
  async refreshConnections({ commit, dispatch }, station) {
    const connections = await stationsApi.getConnections(station.id);
    commit("CLEAR_ACTIVE_CONNECTIONS");
    commit("SET_ACTIVE_CONNECTIONS", connections);
    dispatch("reloadStop", connections);
  },
  async fetchStartingStations({ commit }) {
    const stations = await stationsApi.getStations();
    commit("SET_STARTING_STATIONS", stations);
  },
  resetMap({ commit }) {
    commit("RESET_MAP");
  }
};

export const mutations = {
  SET_ACTIVE_STATION(state, station) {
    state.activeStation = station;
  },
  SET_ACTIVE_CONNECTIONS(state, connections) {
    state.activeConnections = connections;
  },
  CLEAR_ACTIVE_CONNECTIONS(state) {
    state.activeConnections = [];
  },
  RESET_MAP(state) {
    state.activeStation = null;
    state.activeConnections = [];
  },
  SET_STARTING_STATIONS(state, stations) {
    state.startingStations = stations;
  }
};
