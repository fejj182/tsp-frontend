describe("Trip", function() {
  it("should create and update a trip using form", function() {
    cy.server();
    cy.route("POST", "api/stations/connections").as("getConnections");
    cy.route("POST", "api/trip").as("saveTrip");
    createTrip();
    updateTrip();
  });
});

function createTrip() {
  cy.visit("http://localhost:8080/");
  cy.get(".Cookie__button").click();
  cy.get("[data-test-id=first-stop]").click();
  cy.get(".v-list-item__content")
    .first()
    .click();

  cy.get("#stop-1").click();
  cy.get(".v-list-item")
    .first()
    .click();
  cy.get("#stop-1").should("not.have.value", "");
  cy.get("[data-test-id=add-stop]").click();

  cy.get("#stop-2")
    .last()
    .click();
  cy.get(".v-list-item")
    .first()
    .click();
  cy.get("#stop-2").should("not.have.value", "");
  cy.get("[data-test-id=save-trip]").click();
  cy.wait("@saveTrip");

  cy.reload();

  // must assert should exist so cypress will wait before asserting value
  cy.get("#stop-1")
    .should("exist")
    .should("not.have.value", "");
  cy.get("#stop-2")
    .should("exist")
    .should("not.have.value", "");
}

function updateTrip() {
  cy.get("[data-test-id=reset-trip]").click();
  cy.get(".stop").should("not.exist");
  cy.get("[data-test-id=first-stop]").click();
  cy.get(".v-list-item__content")
    .first()
    .click();

  cy.get("#stop-1").click();
  cy.get(".v-list-item")
    .first()
    .click();
  cy.get("#stop-1").should("not.have.value", "");
  cy.get("[data-test-id=save-trip]").click();
  cy.get("[data-test-id=success-updated]").should("exist");

  cy.reload();
  cy.get("#stop-1")
    .should("exist")
    .should("not.have.value", "");
  cy.get("#stop-2").should("not.exist");
}
