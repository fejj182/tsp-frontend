describe("trip_map", () => {
  it("should create trip using map", () => {
    cy.server();
    cy.route("POST", "api/destinations/connections").as("getConnections");

    cy.visit("http://localhost:8080/");
    cy.get(".Cookie__button").click();

    cy.get(".marker-purple-barcelona").click();
    cy.get(".leaflet-popup").should("exist");
    cy.get("[data-test-id=starting-destination").should("not.have.value", "");

    cy.get("[data-test-id=btn-begin-trip]:visible").click();
    cy.wait("@getConnections");
    cy.get("#stop-1 [data-test-id=stop]").should("exist");

    cy.get(".position-1").click();
    cy.get(".leaflet-popup").should("exist");

    cy.get(".marker-red-zaragoza").click();
    cy.get("[data-test-id=starting-destination").should("not.have.value", "");
    cy.get("#stop-1 [data-test-id=stop]").should("not.have.value", "");
    cy.get("g .leaflet-interactive").should("exist");
    cy.get(".leaflet-popup").should("exist");
    cy.get(".position-2").should("exist");
    cy.get("#duration").should("exist");

    cy.get(".btn-add").click();
    cy.get("[data-test-id=starting-destination").should("not.have.value", "");
    cy.get("#stop-1 [data-test-id=stop]").should("not.have.value", "");
    cy.get("#stop-2 [data-test-id=stop]").should("exist");

    cy.get("[data-test-id=save-trip]").click();
    cy.get("[data-test-id=success-alias]").should("exist");
    cy.get("[data-test-id=success-alias] .v-alert__content").should(
      "contain.text",
      "created"
    );
  });
  it("should be able to reset a trip and not break UI", () => {
    cy.server();
    cy.route("POST", "api/destinations/connections").as("getConnections");
    cy.visit("http://localhost:8080/");
    cy.get(".Cookie__button").click();

    cy.get(".marker-purple-barcelona").click();
    cy.get("[data-test-id=btn-begin-trip]:visible").click();

    // using trip form here instead of marker as causes state change
    cy.get("#stop-1 [data-test-id=stop]").click();
    cy.get(".v-list-item:visible")
      .first()
      .click();
    cy.get(".leaflet-popup").should("exist");

    cy.get("[data-test-id=reset-trip]").click();
    cy.get(".leaflet-popup").should("not.exist");
    cy.get(".marker-purple").should("exist");
    cy.get(".marker-purple-zaragoza").click();
    cy.get(".leaflet-popup").should("exist");
  });

  it("should create trip using map on mobile", () => {
    cy.server();
    cy.route("POST", "api/destinations/connections").as("getConnections");
    cy.viewport("iphone-6");
    cy.visit("http://localhost:8080/");
    cy.get(".Cookie__button").click();

    cy.get(".marker-purple-barcelona").click();
    cy.get(".leaflet-popup").should("exist");

    cy.get("[data-test-id=btn-begin-trip]:visible").click();
    cy.wait("@getConnections");

    cy.get(".position-1").click();
    cy.get(".leaflet-popup").should("exist");

    cy.get(".marker-red-zaragoza").click();
    cy.get("g .leaflet-interactive").should("exist");
    cy.get(".leaflet-popup").should("exist");
    cy.get(".position-2").should("exist");
    cy.get("#duration").should("exist");

    cy.get(".btn-add").click();
    cy.get("[data-test-id=icon-itinerary]").click();

    cy.get("[data-test-id=starting-destination").should("not.have.value", "");
    cy.get("#stop-1 [data-test-id=stop]").should("not.have.value", "");
    cy.get("#stop-2 [data-test-id=stop]").should("exist");

    cy.get("[data-test-id=save-trip]").click();
    cy.get("[data-test-id=success-alias]").should("exist");
    cy.get("[data-test-id=success-alias] .v-alert__content").should(
      "contain.text",
      "created"
    );
  });
});
