import { shallowMount } from "@vue/test-utils";
import Header from "./Header";
import ListDialog from "@/modules/dialogs/ListDialog";
import HelpDialog from "@/modules/dialogs/HelpDialog";

describe("Header", () => {
  beforeEach(() => {
    window.innerWidth = 1000;
  });
  it("should contain logo as a link", () => {
    const wrapper = shallowMount(Header);
    expect(wrapper.find("a > img").exists()).toBe(true);
  });

  it("should show h1", () => {
    const wrapper = shallowMount(Header);
    expect(wrapper.find("h1").isVisible()).toBe(true);
  });

  it("should hide h1 on mobile ", () => {
    window.innerWidth = 500;
    const wrapper = shallowMount(Header);
    expect(wrapper.find("h1").isVisible()).toBe(false);
  });

  it("should not contain ListDialog on desktop", () => {
    const wrapper = shallowMount(Header);
    expect(wrapper.find(ListDialog).exists()).toBe(false);
  });

  it("should contain ListDialog on mobile", () => {
    window.innerWidth = 500;
    const wrapper = shallowMount(Header);
    expect(wrapper.find(ListDialog).exists()).toBe(true);
  });

  it("should contain HelpDialog", () => {
    const wrapper = shallowMount(Header);
    expect(wrapper.find(HelpDialog).exists()).toBe(true);
  });
});
