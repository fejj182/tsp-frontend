export const state = {
  startingStation: null,
  selectedConnection: null,
  stops: []
};

export const getters = {};

export const actions = {
  selectConnection({ dispatch, commit }, connection) {
    dispatch("openPopup", connection);
    commit("SELECT_CONNECTION", connection);
  },
  resetTrip({ commit }) {
    commit("CLEAR_CONNECTION");
    commit("CLEAR_STOPS");
  },
  addStopConnections({ commit }, { connections }) {
    commit("ADD_STOP_CONNECTIONS", { connections });
  },
  selectStartingInput({ commit }, station) {
    commit("SELECT_STARTING_STATION", station);
  }
};

export const mutations = {
  SELECT_CONNECTION: (state, selectedConnection) => {
    state.selectedConnection = selectedConnection;
  },
  CLEAR_CONNECTION: state => {
    state.selectedConnection = null;
  },
  CLEAR_STOPS: state => {
    state.stops = [];
  },
  ADD_STOP_CONNECTIONS: (state, { connections }) => {
    state.stops = [...state.stops, { connections }];
  },
  SELECT_STARTING_STATION(state, station) {
    state.startingStation = station;
  },
};
