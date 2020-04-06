describe("Trip", function() {
  it("should create and update a trip using form", function() {
    cy.server();
    cy.route("POST", "api/stations/connections").as("getConnections");
    createTrip();
    updateTrip();
  });
});

function createTrip() {
  cy.visit("http://localhost:8080/");
  cy.get("[data-test-id=destination-1]").click();
  cy.get(".v-list-item__content")
    .first()
    .click();

  cy.get("#stop-0").click();
  cy.get(".v-list-item")
    .first()
    .click();
  cy.get("[data-test-id=add-stop]").click();

  cy.get("#stop-1")
    .last()
    .click();
  cy.get(".v-list-item")
    .first()
    .click();
  cy.get("[data-test-id=save-trip]").click();

  cy.get("[data-test-id=reset-trip]").click();
  cy.get(".stop").should("not.exist");

  cy.reload();
  cy.get("#stop-0").should("exist");
  cy.get("#stop-1").should("exist");
}

function updateTrip() {
  cy.get("[data-test-id=reset-trip]").click();
  cy.get("[data-test-id=destination-1]").click();
  cy.get(".v-list-item__content")
    .first()
    .click();

  cy.get("#stop-0").click();
  cy.get(".v-list-item")
    .first()
    .click();
  cy.get("[data-test-id=save-trip]").click();
  cy.get("[data-test-id=success-updated]").should("exist");

  cy.reload();
  cy.get("#stop-0").should("exist");
  cy.get("#stop-1").should("not.exist");
}
