import paneConfigs from "@/modules/map/panes/paneConfigs";

export const state = {
  activeDurationRange: [0, paneConfigs.NUMBER_OF_PANES - 1]
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
