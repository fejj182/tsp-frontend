describe("trip_map", () => {
  it("should create trip using map", () => {
    cy.server();
    cy.route("POST", "api/trip", {
      alias: "some-alias"
    });

    cy.visit("http://localhost:8080/");
    cy.get("#map").click();
    cy.get(".div-icon-red").click();
    cy.get("[data-test-id=add-to-station]").click();
    cy.get("[data-test-id=save-trip]").click();
    cy.get("[data-test-id=success-alias]").should("exist");
    cy.get("[data-test-id=success-alias] .v-alert__content").should(
      "contain.text",
      "some-alias"
    );
  });
});
