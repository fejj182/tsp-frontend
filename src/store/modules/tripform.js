export const state = {
  connectionId: null
};

export const getters = {};

export const actions = {
  selectConnection({ commit }, connectionId) {
    commit("SELECT_CONNECTION", connectionId);
  },
  clearConnection({ commit }) {
    commit("CLEAR_CONNECTION");
  }
};

export const mutations = {
  SELECT_CONNECTION: (state, connectionId) => {
    state.connectionId = connectionId;
  },
  CLEAR_CONNECTION: state => {
    state.connectionId = null;
  }
};
