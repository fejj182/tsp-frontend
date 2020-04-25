export const state = {
  panes: null
};

export const getters = {};

export const actions = {
  addPanes({ commit }, panes) {
    commit("ADD_PANES", panes);
  }
};

export const mutations = {
  ADD_PANES: (state, panes) => {
    state.panes = panes;
  }
};
