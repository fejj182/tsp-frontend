import { startTripFromWelcome } from "../support/helpers";

describe("Trip Map", () => {
  it("should create trip using map", () => {
    cy.server();
    cy.route("POST", "api/destinations/connections").as("getConnections");

    cy.visit("http://localhost:8080/");
    cy.get(".Cookie__button").click();

    startTripFromWelcome();

    cy.wait("@getConnections");
    cy.get(".marker-starting-barcelona").should("not.exist");
    cy.get("#stop-1 [data-test-id=stop]").should("exist");

    cy.get(".position-1").click();
    cy.get(".leaflet-popup").should("exist");

    cy.get(".marker-connection-madrid").should("not.be.visible");
    cy.get(".marker-connection-zaragoza").click();
    cy.get("[data-test-id=starting-destination]").should("not.have.value", "");
    cy.get("#stop-1 .v-select__selection").should("not.have.text", "");
    cy.get("g .leaflet-interactive").should("exist");
    cy.get(".leaflet-popup").should("exist");
    cy.get(".position-2").should("exist");
    cy.get("#duration").should("exist");

    cy.get("[data-test-id=add-stop]").click();
    cy.get("[data-test-id=starting-destination]").should("not.have.value", "");
    cy.get("#stop-1 .v-select__selection").should("not.have.text", "");
    cy.get("#stop-2 [data-test-id=stop]").should("exist");
    cy.get(".marker-connection-madrid").click();
    cy.get("[data-test-id=add-stop]").click();
    cy.get("[data-test-id=duration]").should("have.length", 2);
    cy.get("[data-test-id=total-duration]").should("exist");

    cy.get("[data-test-id=save-trip]").click();
    cy.get("[data-test-id=success-alias]").should("exist");
    cy.get("[data-test-id=success-alias] .v-alert__content").should(
      "contain.text",
      "created"
    );
  });
});
