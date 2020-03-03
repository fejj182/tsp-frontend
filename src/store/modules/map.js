export const state = {
  map: null,
  panes: null
};

export const getters = {};

export const actions = {
  addMap({ commit }, map) {
    commit("ADD_MAP", map);
  },
  addPanes({ commit }, panes) {
    commit("ADD_PANES", panes);
  }
};

export const mutations = {
  ADD_MAP: (state, map) => {
    state.map = map;
  },
  ADD_PANES: (state, panes) => {
    state.panes = panes;
  }
};
