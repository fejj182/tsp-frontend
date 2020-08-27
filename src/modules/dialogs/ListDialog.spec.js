import { shallowMount, mount, createLocalVue } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import ListDialog from "./ListDialog";
import TripPanel from "@/modules/trip-panel/TripPanel";

Vue.use(Vuetify);

const localVue = createLocalVue();

describe("ListDialog", () => {
  let vuetify, mockStubs, mockStore;
  beforeEach(() => {
    vuetify = new Vuetify();
    mockStubs = {
      VDialog: {
        name: "v-dialog",
        template: "<span><slot></slot></span>"
      }
    };
    mockStore = {
      getters: {
        completeTrip: []
      }
    };
  });
  it("should contain TripPanel", () => {
    const wrapper = shallowMount(ListDialog, {
      stubs: mockStubs
    });
    expect(wrapper.find(TripPanel).exists()).toBe(true);
    expect(wrapper.find(TripPanel).props().showFilters).toBe(false);
  });

  it("should close dialog when event is emitted", () => {
    const wrapper = shallowMount(ListDialog, {
      data() {
        return {
          dialog: true
        };
      }
    });

    expect(wrapper.find("[data-test-id=list-dialog]").attributes().value).toBe(
      "true"
    );
    wrapper.find(TripPanel).vm.$emit("close-dialog");
    expect(wrapper.find("[data-test-id=list-dialog]").attributes().value).toBe(
      undefined
    );
  });

  it("should contain clipboard with number 0 if no stops selected", () => {
    const wrapper = mount(ListDialog, {
      localVue,
      vuetify,
      mocks: {
        $store: mockStore
      }
    });
    expect(wrapper.find("[data-test-id=clipboard-0]").exists()).toBe(true);
  });

  it("should contain clipboard with number 1 if 1 stop selected", () => {
    mockStore.getters.completeTrip = [{}];
    const wrapper = mount(ListDialog, {
      localVue,
      vuetify,
      mocks: {
        $store: mockStore
      }
    });
    expect(wrapper.find("[data-test-id=clipboard-0]").exists()).toBe(false);
    expect(wrapper.find("[data-test-id=clipboard-1]").exists()).toBe(true);
  });
});
