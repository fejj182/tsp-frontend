describe("trip_map", () => {
  it("should create trip using map", () => {
    cy.server();
    cy.route("POST", "api/trip", {
      alias: "some-alias"
    });

    cy.visit("http://localhost:8080/");
    cy.get(".Cookie__button").click();

    cy.get(".marker-purple:visible")
      .first()
      .click();
    cy.get(".leaflet-popup").should("have.length", 1);
    cy.get("[data-test-id=starting-destination").should("not.have.value", "");
    cy.get("[data-test-id=add-to-station]:visible").click();

    cy.get(".marker-red:visible")
      .first()
      .click();
    cy.get(".leaflet-popup").should("have.length", 1);
    cy.get("[data-test-id=add-to-station]:visible").click();
    cy.get("#stop-1 [data-test-id=stop]").should("not.have.value", "");

    cy.get("[data-test-id=save-trip]").click();
    cy.get("[data-test-id=success-alias]").should("exist");
    cy.get("[data-test-id=success-alias] .v-alert__content").should(
      "contain.text",
      "some-alias"
    );
  });

  it("should be able to reset a trip and not break UI", () => {
    cy.visit("http://localhost:8080/");
    cy.get(".Cookie__button").click();

    cy.get(".marker-purple:visible")
      .first()
      .click();
    cy.get(".leaflet-popup").should("have.length", 1);
    cy.get("[data-test-id=starting-destination").should("not.have.value", "");
    cy.get("[data-test-id=add-to-station]:visible").click();

    // using trip form here instead of marker as causes state change
    cy.get("#stop-1 [data-test-id=stop]").click();
    cy.get(".v-list-item:visible")
      .first()
      .click();

    cy.get("[data-test-id=reset-trip]").click();
    cy.get(".marker-purple").should("exist");
    cy.get(".leaflet-popup").should("not.exist");
    cy.get(".marker-purple:visible")
      .first()
      .click();
    cy.get(".leaflet-popup").should("have.length", 1);
  });
});
