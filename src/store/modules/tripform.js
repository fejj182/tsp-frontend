export const state = {
  connectionId: null
};

export const getters = {};

export const actions = {
  selectConnection({ dispatch, commit }, connection) {
    dispatch("openPopup", connection);
    commit("SELECT_CONNECTION", connection.id);
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
