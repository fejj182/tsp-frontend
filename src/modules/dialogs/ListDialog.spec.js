import { shallowMount } from "@vue/test-utils";
import ListDialog from "./ListDialog";
import TripPanel from "@/modules/trip-panel/TripPanel";

describe("ListDialog", () => {
  it("should contain TripPanel", () => {
    const wrapper = shallowMount(ListDialog);
    expect(wrapper.find(TripPanel).exists()).toBe(true);
  });
});
