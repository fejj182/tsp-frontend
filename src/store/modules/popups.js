export const state = {
  openStation: null
};

export const getters = {};

export const actions = {
  openPopup({ commit }, station) {
    commit("OPEN_STATION_POPUP", station);
  }
};

export const mutations = {
  OPEN_STATION_POPUP: (state, station) => {
    state.openStation = station;
  }
};
