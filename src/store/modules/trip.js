export const state = {
  connectionId: null,
  stops: []
};

export const getters = {};

export const actions = {
  selectConnection({ dispatch, commit }, connection) {
    dispatch("openPopup", connection);
    commit("SELECT_CONNECTION", connection.id);
  },
  resetTrip({ commit }) {
    commit("CLEAR_CONNECTION");
    commit("CLEAR_STOPS");
  },
  setStopConnections({ commit }, { connections }) {
    commit("ADD_STOP_CONNECTIONS", { connections });
  }
};

export const mutations = {
  SELECT_CONNECTION: (state, connectionId) => {
    state.connectionId = connectionId;
  },
  CLEAR_CONNECTION: state => {
    state.connectionId = null;
  },
  CLEAR_STOPS: state => {
    state.stops = [];
  },
  ADD_STOP_CONNECTIONS: (state, { connections }) => {
    state.stops = [...state.stops, { connections }];
  }
};
