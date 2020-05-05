describe("TripForm", function() {
  it("remove button should work", function() {
    cy.server();
    cy.visit("http://localhost:8080/");
    cy.get(".Cookie__button").click();
    cy.get("[data-test-id=starting-destination]").click();
    cy.get(".v-list-item")
      .first()
      .click();
    cy.get("[data-test-id=starting-destination]").should("not.have.value", "");
    cy.get("#stop-1 [data-test-id=stop]").click();
    cy.get(".v-list-item:visible")
      .first()
      .click();
    cy.get("#stop-1 [data-test-id=stop]").should("not.have.value", "");
    cy.get("[data-test-id=add-stop]").click();

    cy.get("#stop-2 [data-test-id=stop]").click();
    cy.get(".v-list-item:visible")
      .first()
      .click();
    cy.get("#stop-2 .mdi-close").click();
    cy.get("#stop-2").should("not.exist");
    cy.get("#stop-1 [data-test-id=stop]").should("not.have.value", "");
    cy.get("#stop-1 .mdi-close").click();
    cy.get("#stop-1 [data-test-id=stop]").should("not.exist");
    cy.get("[data-test-id=starting-destination]").should("have.value", "");
    cy.get(".leaflet-popup").should("not.exist");
  });
});
