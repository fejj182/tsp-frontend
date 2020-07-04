describe("TripForm", function() {
  it("remove button should work", function() {
    cy.server();
    cy.route("GET", "api/destinations").as("getDestinations");
    cy.route("POST", "api/trip").as("saveTrip");
    cy.visit("http://localhost:8080/");
    cy.get(".Cookie__button").click();
    assertFirstStopAddAndClose();
    assertFullFlowAddAndClose();
    assertFullFlowSaveRefreshAndClose();
  });
});

function assertFirstStopAddAndClose() {
  cy.wait("@getDestinations");
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
  cy.get("#stop-1 .mdi-close").click();
  assertStateAfterReset();
}

function assertStateAfterReset() {
  cy.wait(250);
  cy.get(".marker-starting").should("exist");
  cy.get(".marker-connection").should("not.exist");
  cy.get("#stop-1 [data-test-id=stop]").should("not.exist");
  cy.get("[data-test-id=starting-destination]").should("have.value", "");
  cy.get(".position-1").should("not.exist");
  cy.get(".leaflet-popup").should("not.exist");
  cy.get("g .leaflet-interactive").should("not.exist");
}

function assertFullFlowAddAndClose() {
  add3Stops();
  cy.get("#stop-3 .mdi-close").click();
  assertStateAfterRemoveStop3();
  cy.get("#stop-2 .mdi-close").click();
  assertStateAfterRemoveStop2();
  cy.get("#stop-1 .mdi-close").click();
  assertStateAfterReset();
}

function assertFullFlowSaveRefreshAndClose() {
  add3Stops();
  cy.get("[data-test-id=save-trip]").click();
  cy.wait("@saveTrip");
  cy.reload();

  cy.get("#stop-3 .mdi-close").click();
  assertStateAfterRemoveStop3();
  cy.get("#stop-2 .mdi-close").click();
  assertStateAfterRemoveStop2();
  cy.get("#stop-1 .mdi-close").click();
  assertStateAfterReset();
}

function add3Stops() {
  cy.get("[data-test-id=starting-destination]").click();
  cy.get(".v-list-item")
    .first()
    .click();
  cy.get("#stop-1 [data-test-id=stop]").click();
  cy.get(".v-list-item:visible")
    .first()
    .click();
  cy.get("[data-test-id=add-stop]").click();
  cy.get("#stop-2 [data-test-id=stop]").click();
  cy.get(".v-list-item:visible")
    .first()
    .click();
  cy.get("[data-test-id=add-stop]").click();
  cy.get("#stop-3 [data-test-id=stop]").click();
  cy.get(".v-list-item:visible")
    .first()
    .click();
  cy.get(".position-1").should("exist");
  cy.get(".position-2").should("exist");
  cy.get(".position-3").should("exist");
  cy.get(".position-4").should("exist");
}

function assertStateAfterRemoveStop3() {
  cy.wait(250);
  cy.get("#stop-3").should("not.exist");
  cy.get("#stop-2 [data-test-id=stop]").should("have.value", "");
  cy.get("#stop-1 [data-test-id=stop]").should("not.have.value", "");
  cy.get(".position-1").should("exist");
  cy.get(".position-2").should("exist");
  cy.get(".position-3").should("not.exist");
  cy.get(".position-4").should("not.exist");
  cy.get(".marker-connection:visible").should("exist");
}

function assertStateAfterRemoveStop2() {
  cy.wait(250);
  cy.get("#stop-2").should("not.exist");
  cy.get("#stop-1 [data-test-id=stop]").should("have.value", "");
  cy.get(".position-1").should("exist");
  cy.get(".position-2").should("not.exist");
  cy.get(".position-3").should("not.exist");
  cy.get(".marker-connection:visible").should("exist");
}
