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
    cy.get("#stop-1 [data-test-id=stop]").should("not.have.value", "");
    cy.get("g .leaflet-interactive").should("exist");
    cy.get(".leaflet-popup").should("exist");
    cy.get(".position-2").should("exist");
    cy.get("#duration").should("exist");

    cy.get("[data-test-id=add-stop]").click();
    cy.get("[data-test-id=starting-destination]").should("not.have.value", "");
    cy.get("#stop-1 [data-test-id=stop]").should("not.have.value", "");
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
  it("should be able to reset a trip and not break UI", () => {
    //TODO: investigate if we can get rid of this test by modifying behaviour of reset

    cy.server();
    cy.route("POST", "api/destinations/connections").as("getConnections");
    cy.visit("http://localhost:8080/");
    cy.get(".Cookie__button").click();

    startTripFromWelcome();

    cy.wait("@getConnections");

    // using trip form here instead of marker as causes state change
    // wait for markers to be loaded before selecting input
    cy.wait(250);
    cy.get("#stop-1 [data-test-id=stop]").click();
    cy.get(".v-list-item:visible")
      .first()
      .click();
    cy.get(".leaflet-popup").should("exist");

    cy.get("[data-test-id=save-trip]").click();
    cy.get("[data-test-id=more-options]").click();
    cy.get("[data-test-id=reset-trip]").click();
    cy.get(".marker-connection-zaragoza").should("not.exist");
    cy.get(".leaflet-popup").should("not.exist");
    cy.get(".marker-starting").should("exist");
    cy.get(".marker-starting-zaragoza").click();
    cy.get(".leaflet-popup").should("exist");
  });
});
