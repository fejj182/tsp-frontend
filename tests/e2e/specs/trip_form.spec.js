import { startTripFromWelcome } from "../support/helpers";

describe("TripForm", function() {
  it("remove button should work", function() {
    cy.server();
    cy.route("GET", "api/destinations").as("getDestinations");
    cy.route("POST", "api/trip").as("saveTrip");
    cy.visit("http://localhost:8080/");
    cy.get(".Cookie__button").click();
    assertAddingAndRemoving();
    assertFullFlow();
    assertAfterRefresh();
    assertReset();
    assertWithoutDuration();
  });
});

function assertAddingAndRemoving() {
  cy.wait("@getDestinations");
  startTripFromWelcome();

  cy.get(".thumb-label").contains("0");
  cy.get(".thumb-label").contains("2");
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
  cy.get("#stop-2 [data-test-id=stop]").should("not.have.value", "");
  cy.get("#stop-1 [data-test-id=stop]").should("not.have.value", "");

  cy.get("#stop-2 .mdi-close").click();
  cy.get("#stop-1 .mdi-close").should("not.exist");
  cy.get("#stop-2 [data-test-id=stop]").should("not.exist");
  cy.get("#stop-1 [data-test-id=stop]").should("have.value", "");
}

function assertFullFlow() {
  add3Stops();
  cy.get("[data-test-id=more-options]").should("not.exist");
  cy.get("[data-test-id=save-trip]").click();
  cy.wait("@saveTrip");
  cy.get("[data-test-id=success-alias]").should("exist");
  cy.get("[data-test-id=success-alias] .v-alert__content").should(
    "contain.text",
    "created"
  );
  cy.get("[data-test-id=more-options]").should("exist");
}

function assertAfterRefresh() {
  cy.reload();

  cy.get("#stop-3 .mdi-close").click();
  assertAfterRemoveStop();
  cy.get("#stop-2 .mdi-close").click();
}

function add3Stops() {
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
  cy.get("[data-test-id=duration]").should("have.length", 3);
  cy.get("[data-test-id=total-duration]").should("exist");
}

function assertAfterRemoveStop() {
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

function assertReset() {
  cy.reload();
  cy.get("[data-test-id=more-options]").click();
  cy.get("[data-test-id=reset-trip]").click();
  cy.wait("@getDestinations");
  startTripFromWelcome();
  assertFullFlow();
}

function assertWithoutDuration() {
  cy.get("[data-test-id=more-options]").click();
  cy.get("[data-test-id=reset-trip]").click();
  cy.get("[data-test-id=starting-destination]").click();
  cy.get("#list-item-barcelona").click();
  cy.get("#find-destinations-btn").click();
  cy.get(".thumb-label").contains("0");
  cy.get(".thumb-label").contains("6+");
}
