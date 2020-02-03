export const state = {
  map: null
};

export const getters = {};

export const actions = {
  addMap({ commit }, map) {
    commit("ADD_MAP", map);
  }
};

export const mutations = {
  ADD_MAP: (state, map) => {
    state.map = map;
  }
};
