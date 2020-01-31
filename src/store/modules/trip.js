export const state = {
  startingStation: null,
  selectedStop: null,
  stops: []
};

export const getters = {
  hasStops(state) {
    return state.stops.length > 0 && state.selectedStop != null;
  }
};

export const actions = {
  selectStop({ dispatch, commit }, station) {
    dispatch("openPopup", station);
    commit("SELECT_STOP", station);
  },
  resetTrip({ dispatch, commit }) {
    dispatch("resetMap");
    commit("CLEAR_STOPS");
  },
  addNewStop({ commit }, { stations }) {
    commit("ADD_NEW_STOP", { stations });
  },
  selectStartingInput({ commit }, station) {
    commit("SELECT_STARTING_STATION", station);
  }
};

export const mutations = {
  SELECT_STOP: (state, station) => {
    state.selectedStop = station;
  },
  CLEAR_STOPS: state => {
    state.stops = [];
    state.selectedStop = null;
  },
  ADD_NEW_STOP: (state, { stations }) => {
    const prevStops = state.stops.map(stop => {
      stop.readOnly = true;
      return stop;
    });
    state.stops = [...prevStops, { stations }];
  },
  SELECT_STARTING_STATION(state, station) {
    state.startingStation = station;
  }
};
