describe("trip_map", () => {
  it("should create trip using map", () => {
    cy.server();
    cy.route("POST", "api/trip", {
      alias: "some-alias"
    });

    cy.visit("http://localhost:8080/");
    cy.get(".Cookie__button").click();
    cy.get("#map").click();
    cy.get(".marker-purple")
      .first()
      .click();
    cy.get("[data-test-id=starting-destination").should("not.have.value", "");
    cy.get("[data-test-id=add-to-station]:visible").click();
    cy.get(".marker-red")
      .first()
      .click();
    cy.get("[data-test-id=add-to-station]:visible").click();
    cy.get("#stop-1 [data-test-id=stop]").should("not.have.value", "");
    cy.get("[data-test-id=save-trip]").click();
    cy.get("[data-test-id=success-alias]").should("exist");
    cy.get("[data-test-id=success-alias] .v-alert__content").should(
      "contain.text",
      "some-alias"
    );
  });
});
