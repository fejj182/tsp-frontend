export const state = {
  connectionId: null,
  stops: {}
};

export const getters = {};

export const actions = {
  selectConnection({ dispatch, commit }, connection) {
    dispatch("openPopup", connection);
    commit("SELECT_CONNECTION", connection.id);
  },
  clearConnection({ commit }) {
    commit("CLEAR_CONNECTION");
  },
  setStopConnections({ commit }, { connections, position }) {
    commit("SET_STOP_CONNECTIONS", { connections, position });
  }
};

export const mutations = {
  SELECT_CONNECTION: (state, connectionId) => {
    state.connectionId = connectionId;
  },
  CLEAR_CONNECTION: state => {
    state.connectionId = null;
  },
  SET_STOP_CONNECTIONS: (state, { connections, position }) => {
    state.stops = {
      ...state.stops,
      [position]: { connections }
    };
  }
};
