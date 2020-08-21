import { startTripFromWelcome } from "../support/helpers";

describe("Trip", function() {
  it("should create and update a trip using form", function() {
    cy.server();
    cy.route("GET", "api/destinations").as("getDestinations");
    cy.route("POST", "api/destinations/connections").as("getConnections");
    cy.route("POST", "api/trip").as("saveTrip");
    cy.visit("http://localhost:8080/");
    cy.get(".Cookie__button").click();
    createTrip();
    assertStopCanBeAdded();
    assertTripCanBeRebuilt();
    resetTrip();
  });
});

function createTrip() {
  cy.wait("@getDestinations");
  startTripFromWelcome();

  cy.get(".position-1").should("exist");

  cy.get("#stop-1 [data-test-id=stop]").click();
  cy.get(".v-list-item:visible")
    .first()
    .click();
  cy.get("#stop-1 [data-test-id=stop]").should("not.have.value", "");
  cy.get(".position-2").should("exist");
  cy.get("g .leaflet-interactive").should("exist");
  cy.get(".leaflet-popup").should("exist");

  cy.get("[data-test-id=add-stop]").click();
  cy.get("#stop-2 [data-test-id=stop]")
    .first()
    .click();
  cy.get(".v-list-item:visible")
    .first()
    .click();
  cy.get("#stop-2 [data-test-id=stop]").should("not.have.value", "");

  cy.get("[data-test-id=save-trip]").click();
  cy.wait("@saveTrip");

  cy.reload();
  assertReloadedTripInCorrectState();

  cy.get("[data-test-id=save-trip]").click();
  cy.get("[data-test-id=success-updated]").should("exist");

  cy.reload();
  assertReloadedTripInCorrectState();
}

function resetTrip() {
  cy.get("[data-test-id=reset-trip]").click();
  cy.get(".stop").should("not.exist");
  cy.reload();
  cy.get(".stop").should("not.exist");
}

function assertReloadedTripInCorrectState() {
  cy.get(".leaflet-popup").should("not.exist");
  cy.get("[data-test-id=starting-destination]")
    .should("exist")
    .should("not.have.value", "");
  cy.get("#stop-1 [data-test-id=stop]")
    .should("exist")
    .should("not.have.value", "");
  cy.get("#stop-2 [data-test-id=stop]")
    .should("exist")
    .should("not.have.value", "");
  cy.get(".position-1").should("exist");
  cy.get(".position-2").should("exist");
  cy.get(".position-3").should("exist");
  cy.get("g .leaflet-interactive").should("have.length", 2);
  cy.get("#stop-1 [data-test-id=stop]").click();
  cy.get(".v-list-item").should("not.exist");
  cy.get("#stop-1 .v-icon").click();
  cy.get(".v-list-item").should("not.exist");
}

function assertStopCanBeAdded() {
  cy.get("[data-test-id=add-stop]").click();
  cy.get(".marker-connection:visible").should("exist");
  cy.get("#stop-3 [data-test-id=stop]").click();
  cy.get(".v-list-item:visible")
    .first()
    .click();
  cy.get("#stop-3 [data-test-id=stop]").should("not.have.value", "");

  cy.get("[data-test-id=save-trip]").click();
  cy.get("[data-test-id=success-updated]").should("exist");

  cy.reload();

  cy.get("[data-test-id=starting-destination]")
    .should("exist")
    .should("not.have.value", "");
  cy.get("#stop-1 [data-test-id=stop]")
    .should("exist")
    .should("not.have.value", "");
  cy.get("#stop-2 [data-test-id=stop]")
    .should("exist")
    .should("not.have.value", "");
  cy.get("#stop-3 [data-test-id=stop]")
    .should("exist")
    .should("not.have.value", "");
}

function assertTripCanBeRebuilt() {
  cy.get("[data-test-id=starting-destination]").click();
  cy.get(".v-list-item")
    .first()
    .click();

  cy.get("#stop-1 [data-test-id=stop]").click();
  cy.get(".v-list-item:visible")
    .first()
    .click();
  cy.get("#stop-1 [data-test-id=stop]").should("not.have.value", "");

  cy.get("[data-test-id=save-trip]").click();
  cy.get("[data-test-id=success-updated]").should("exist");
  cy.get("[data-test-id=starting-destination]")
    .should("exist")
    .should("not.have.value", "");
  cy.get("#stop-1 [data-test-id=stop]")
    .should("exist")
    .should("not.have.value", "");
}
