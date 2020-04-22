export const state = {
  openStation: null
};

export const getters = {};

export const actions = {
  openPopup({ commit }, station) {
    commit("OPEN_STATION_POPUP", station);
  },
  closePopup({ commit }) {
    commit("CLOSE_STATION_POPUP");
  }
};

export const mutations = {
  OPEN_STATION_POPUP: (state, station) => {
    state.openStation = station;
  },
  CLOSE_STATION_POPUP: state => {
    state.openStation = null;
  }
};
