describe("Trip", function() {
  it("should create and update a trip using form", function() {
    cy.server();
    cy.route("POST", "api/stations/connections").as("getConnections");
    cy.route("POST", "api/trip").as("saveTrip");
    cy.visit("http://localhost:8080/");
    cy.get(".Cookie__button").click();
    createTrip();
    updateTrip();
    resetTrip();
  });
});

function createTrip() {
  cy.get("[data-test-id=starting-destination]").click();
  cy.get(".v-list-item__content")
    .first()
    .click();

  cy.get("#stop-1 [data-test-id=stop]").click();
  cy.get(".v-list-item:visible")
    .first()
    .click();
  cy.get("#stop-1 [data-test-id=stop]").should("not.have.value", "");
  cy.get("[data-test-id=add-stop]").click();

  cy.get("#stop-2 [data-test-id=stop]")
    .last()
    .click();
  cy.get(".v-list-item:visible")
    .first()
    .click();
  cy.get("#stop-2 [data-test-id=stop]").should("not.have.value", "");

  cy.get("[data-test-id=save-trip]").click();
  cy.wait("@saveTrip");

  cy.reload();

  cy.get("#stop-1 [data-test-id=stop]")
    .should("exist")
    .should("not.have.value", "");
  cy.get("#stop-2 [data-test-id=stop]")
    .should("exist")
    .should("not.have.value", "");
}

function updateTrip() {
  assertFixedStopNotClickable();
  assertTripReloadedAfterUpdate();
  assertStopCanBeAdded();
  assertTripCanBeRebuilt();
}

function resetTrip() {
  cy.reload();
  cy.get("[data-test-id=reset-trip]").click();
  cy.get(".stop").should("not.exist");
  cy.reload();
  cy.get(".stop").should("not.exist");
}

function assertFixedStopNotClickable() {
  cy.get("#stop-1 [data-test-id=stop]").click();
  cy.get(".v-list-item").should("not.exist");
  cy.get("#stop-1 .v-icon").click();
  cy.get(".v-list-item").should("not.exist");
}

function assertTripReloadedAfterUpdate() {
  cy.reload();
  cy.get("[data-test-id=save-trip]").click();
  cy.get("[data-test-id=success-updated]").should("exist");
  cy.reload();
  cy.get("#stop-1 [data-test-id=stop]")
    .should("exist")
    .should("not.have.value", "");
  cy.get("#stop-2 [data-test-id=stop]")
    .should("exist")
    .should("not.have.value", "");
}

function assertStopCanBeAdded() {
  cy.get("[data-test-id=add-stop]").click();
  cy.get("#stop-3 [data-test-id=stop]").click();
  cy.get(".v-list-item:visible")
    .first()
    .click();
  cy.get("#stop-3 [data-test-id=stop]").should("not.have.value", "");

  cy.get("[data-test-id=save-trip]").click();
  cy.get("[data-test-id=success-updated]").should("exist");

  cy.reload();

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
  cy.get(".v-list-item__content")
    .first()
    .click();

  cy.get("#stop-1 [data-test-id=stop]").click();
  cy.get(".v-list-item:visible")
    .first()
    .click();
  cy.get("#stop-1 [data-test-id=stop]").should("not.have.value", "");

  cy.get("[data-test-id=save-trip]").click();
  cy.get("[data-test-id=success-updated]").should("exist");
}
