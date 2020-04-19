import tripApi from "@/api/trip";

export const state = {
  startingStation: null,
  selectedStop: null,
  stops: [],
  savedTrip: []
};

export const getters = {
  hasStops(state) {
    return (
      state.stops.length > 1 ||
      (state.stops.length == 1 && state.selectedStop != null)
    );
  },
  completeTrip(state) {
    return state.selectedStop
      ? [...state.savedTrip, state.selectedStop]
      : state.savedTrip;
  }
};

export const actions = {
  async fetchTrip({ commit }, payload) {
    const trip = await tripApi.get(payload.alias);
    if (trip && trip.length > 0) {
      commit("LOAD_TRIP", trip);
    }
  },
  selectStop({ commit }, station) {
    commit("SELECT_STOP", station);
  },
  resetTrip({ dispatch, commit }) {
    dispatch("resetMap");
    commit("CLEAR_STOPS");
  },
  addNewStop({ commit }, payload) {
    commit("ADD_NEW_STOP", payload.stations);
  },
  startTrip({ dispatch }, station) {
    dispatch("resetTrip");
    dispatch("selectStartingInput", station);
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
  ADD_NEW_STOP: (state, stations) => {
    const prevStops = state.stops.map(stop => {
      stop.readOnly = true;
      return stop;
    });
    state.stops = [...prevStops, { stations }];
    if (state.selectedStop) {
      state.savedTrip = [...state.savedTrip, state.selectedStop];
    }
    state.selectedStop = null;
  },
  SELECT_STARTING_STATION(state, station) {
    state.startingStation = station;
    state.savedTrip = [station];
  },
  LOAD_TRIP(state, trip) {
    state.startingStation = trip[0];
    const stops = trip.slice(1);

    state.stops = stops.map(station => {
      return {
        readOnly: true,
        fixed: station,
        stations: [station]
      };
    });
    state.selectedStop = trip[trip.length - 1];
    state.savedTrip = trip.slice(0, trip.length - 1);
  }
};
