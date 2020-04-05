export const state = {
  activeDurationRange: null
};

export const getters = {};

export const actions = {
  updateDurationRange({ commit }, range) {
    commit("SET_DURATION_RANGE", range);
  }
};

export const mutations = {
  SET_DURATION_RANGE: (state, range) => {
    state.activeDurationRange = range;
  }
};
