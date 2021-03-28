export function startTripFromWelcome() {
  cy.get("[data-test-id=starting-destination]").click();
  cy.get("[data-test-id=countries]").click();
  cy.get("#list-item-amiens").should("exist");
  cy.get("[data-test-id=list-item-ES]").click();
  cy.get("#list-item-amiens").should("not.exist");
  cy.get("#list-item-barcelona").click();
  cy.get("[data-test-id=starting-destination]").should("not.have.value", "");
  cy.get("#max-journey-time").click();
  cy.get(".v-list-item:visible")
    .first()
    .click();
  cy.get("#find-destinations-btn").click();
}

export function startTripFromWelcomeBasic() {
  cy.get("[data-test-id=starting-destination]").click();
  cy.get("#list-item-barcelona").click();
  cy.get("#find-destinations-btn").click();
}
