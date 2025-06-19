// cypress/e2e/login.cy.ts
describe('Login flow', () => {
  it('muestra formulario y permite autenticarse', () => {
    cy.visit('/auth/login')
    cy.get('input[name="email"]').type('usuario@ejemplo.com')
    cy.get('input[name="password"]').type('MiPass123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
    cy.contains('Bienvenido')
  })
})
