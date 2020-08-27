export function startTripFromWelcome() {
  cy.get("[data-test-id=starting-destination]").click();
  cy.get("#list-item-barcelona").click();
  cy.get("[data-test-id=starting-destination]").should("not.have.value", "");
  cy.get("#max-journey-time").click();
  cy.get(".v-list-item:visible")
    .first()
    .click();
  cy.get("#find-destinations-btn").click();
}
