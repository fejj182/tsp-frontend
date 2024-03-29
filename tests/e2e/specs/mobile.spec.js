import { startTripFromWelcome } from "../support/helpers";

describe("Mobile", () => {
  it("should start from welcome", () => {
    cy.server();
    cy.route("GET", "api/destinations").as("getDestinations");
    cy.route("POST", "api/destinations/connections").as("getConnections");
    cy.viewport("iphone-6");
    cy.visit("http://localhost:8080");
    cy.get(".Cookie__button").click();

    cy.wait("@getDestinations");
    startTripFromWelcome();
    cy.wait("@getConnections");

    assertWorking();
  });
  it("should redirect from planner", () => {
    cy.server();
    cy.route("GET", "api/destinations").as("getDestinations");
    cy.route("POST", "api/destinations/connections").as("getConnections");
    cy.viewport("iphone-6");
    cy.visit("http://localhost:8080/trip-planner");
    cy.get(".Cookie__button").click();

    cy.wait("@getDestinations");
    startTripFromWelcome();
    cy.wait("@getConnections");

    assertWorking();
  });
});

function assertWorking() {
  cy.get(".position-1").click();
  cy.get(".leaflet-popup").should("exist");

  cy.get("[data-test-id=starting-destination]").should("not.have.value", "");
  cy.get("#stop-1 .v-select__slot").click();
  cy.get(".v-list-item:visible")
    .first()
    .click();
  cy.get("#stop-1 .v-select__selection").should("not.have.text", "");

  cy.get("#duration").should("exist");
  cy.get("[data-test-id=add-stop]").click();
  cy.get("#stop-2 .v-select__slot").click();
  cy.get(".v-list-item:visible")
    .first()
    .click();

  cy.get("#total-duration").should("exist");

  cy.get("[data-test-id=btn-filter]").click();
  cy.get(".v-slider__thumb")
    .first()
    .click();
  cy.get("[data-test-id=trip-form-panel]").should("not.be.visible");
  cy.get("[data-test-id=close-filters]").click();

  cy.get("#find-offers-btn").should("be.visible");
  cy.get("[data-test-id=save-trip]").should("be.visible");

  cy.get(".mdi-chevron-down").click();

  cy.get("#find-offers-btn").should("not.be.visible");
  cy.get("[data-test-id=save-trip]").should("not.be.visible");

  cy.get(".mdi-chevron-up").click();
  cy.get("[data-test-id=save-trip]").click();
  cy.get("[data-test-id=success-alias]").should("exist");
  cy.get("[data-test-id=success-alias] .v-alert__content").should(
    "contain.text",
    "created"
  );
  cy.get("[data-test-id=more-options]").should("exist");
}
