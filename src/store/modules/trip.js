export const state = {
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
  }
};
