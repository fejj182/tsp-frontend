import tripApi from "@/api/trip";

export const state = {
  startingStation: null,
  selectedStop: null,
  stops: [],
  savedTrip: []
};

export const getters = {
  //TODO: rename to showStopOptions?
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
  resetTrip({ dispatch, commit }) {
    dispatch("resetMap");
    commit("RESET_TRIP");
  },
  startTrip({ dispatch, commit }, station) {
    dispatch("resetTrip");
    dispatch("confirmStop", station);
    commit("SELECT_STARTING_STATION", station);
  },
  addToTrip({ dispatch, commit }, station) {
    dispatch("resetMap");
    dispatch("confirmStop", station);
    commit("SELECT_STARTING_STATION", station);
  },
  addNewStop({ commit }, payload) {
    commit("ADD_NEW_STOP", payload.stations);
  },
  removeStop({ commit }) {
    commit("REMOVE_STOP");
  },
  selectStop({ commit }, station) {
    commit("SELECT_STOP", station);
  },
  selectStartingInput({ commit }, station) {
    commit("SELECT_STARTING_STATION", station);
  }
};

export const mutations = {
  SELECT_STOP: (state, station) => {
    state.selectedStop = station;
  },
  RESET_TRIP: state => {
    state.stops = [];
    state.selectedStop = null;
    state.savedTrip = [];
  },
  ADD_NEW_STOP: (state, stations) => {
    const prevStops = state.stops.map(stop => {
      stop.readOnly = true;
      return stop;
    });
    state.stops = [...prevStops, { stations, readOnly: false }];
    if (state.selectedStop) {
      state.savedTrip = [...state.savedTrip, state.selectedStop];
    }
    state.selectedStop = null;
  },
  REMOVE_STOP: state => {
    const stops = state.stops.slice(0, state.stops.length - 1);
    if (stops.length > 0) {
      stops[stops.length - 1].readOnly = false;
    } else {
      state.startingStation = null;
    }
    state.stops = stops;

    state.selectedStop = state.savedTrip[state.savedTrip.length - 1];
    state.savedTrip = state.savedTrip.slice(0, state.savedTrip.length - 1);
  },
  SELECT_STARTING_STATION(state, station) {
    if (state.savedTrip.length === 0) {
      state.startingStation = station;
      state.savedTrip = [station];
    }
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
