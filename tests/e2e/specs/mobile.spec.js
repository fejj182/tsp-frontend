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

    assertNothingBroken();
  });
  it("should start from planner", () => {
    cy.server();
    cy.route("POST", "api/destinations/connections").as("getConnections");
    cy.viewport("iphone-6");
    cy.visit("http://localhost:8080/planner");
    cy.get(".Cookie__button").click();

    cy.get(".marker-starting-barcelona").click();
    cy.get(".leaflet-popup").should("exist");

    cy.get("[data-test-id=btn-add]:visible").click();
    cy.wait("@getConnections");

    assertNothingBroken();
  });
});

function assertNothingBroken() {
  cy.get(".position-1").click();
  cy.get(".leaflet-popup").should("exist");

  cy.get(".marker-connection-zaragoza").click();
  cy.get("g .leaflet-interactive").should("exist");
  cy.get(".leaflet-popup").should("exist");
  cy.get(".position-2").should("exist");
  cy.get("#duration").should("exist");

  cy.get("[data-test-id=btn-add]").click();

  cy.get("[data-test-id=btn-filter]").click();
  cy.get(".v-slider__thumb")
    .first()
    .click();
  cy.get("[data-test-id=trip-form-panel]").should("not.be.visible");

  cy.get(".mdi-close").click();

  cy.get("[data-test-id=clipboard-2]").click();
  cy.get("[data-test-id=filter-panel]").should("not.be.visible");

  cy.get("[data-test-id=starting-destination]").should("not.have.value", "");
  cy.get("#stop-1 [data-test-id=stop]").should("not.have.value", "");
  cy.get("#stop-2 [data-test-id=stop]").should("exist");

  cy.get("[data-test-id=more-options]").click();
  cy.get("[data-test-id=save-trip]").click();
  cy.get("[data-test-id=success-alias]").should("exist");
  cy.get("[data-test-id=success-alias] .v-alert__content").should(
    "contain.text",
    "created"
  );
}
