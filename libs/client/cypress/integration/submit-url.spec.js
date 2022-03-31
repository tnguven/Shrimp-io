describe('Submit url', () => {
  beforeEach(() => {
    cy.visit('http://localhost');
  });

  beforeEach(() => {
    cy.getCookie('token').then(({ value }) => {
      console.log(value);
      Cypress.Cookies.preserveOnce('token', value);
    });
  });

  it('display landing page', () => {
    cy.title().should('eq', 'Home | Shrimp url');
    cy.get('[alt="Shrimp logo"]');
    cy.get('h1').should('have.length', 2);
    cy.get('h1').first().should('have.text', 'Shorten links on your domain');
    cy.get('h1').last().should('have.text', 'Your short links history');

    cy.get('h2').should('have.length', 1);
    cy.get('h2').first().should('have.text', 'Start from here ');
    cy.get('[alt="Start here arrow icon"]');

    cy.get('p').first().should('have.text', 'Shorten and share short URLs');

    cy.get('label').should('have.length', 3);
    cy.get('label').first().should('have.text', 'Enter a long URL to make a shrimpURL');
    cy.get('input').invoke('attr', 'placeholder').should('contain', 'Enter a long URL');
    cy.get('[type=submit]').should('have.text', 'Shrimp my URL');
  });

  it('can add url', () => {
    const url = 'https://bbc.co.uk';
    cy.get('#urlInput').type(url);
    cy.get('#urlInput').should('have.value', url);
    cy.get('[type=submit]').click();

    cy.get('#longUrl').then(($input) => {
      const longUrl = $input.val();
      cy.get(`p:contains(${longUrl})`).should('have.text', longUrl);
    });

    cy.get('#generated-shortUrl').then(($input) => {
      const shortUrl = $input.val();
      cy.get(`a:contains(${shortUrl})`).should('have.text', `${shortUrl} `);
    });

    cy.get('[data-test-id=url-link-list] li').should('have.length', 1);
    cy.get('button:contains(Delete)').should('have.length', 1);
    cy.get('button:contains(Copy)').should('have.length', 1);
    cy.wait(2000);
  });

  it('can add another url url', () => {
    cy.get('[data-testid=create-url]')
      .should('have.text', 'Create another Shrimp')
      .click({ force: true });

    const url = 'https://en.wikipedia.org/wiki/Wikimedia_Foundation';
    cy.get('#urlInput').type(url);
    cy.get('#urlInput').should('have.value', url);
    cy.get('[type=submit]').click();

    cy.get('#longUrl').then(($input) => {
      const longUrl = $input.val();
      cy.get(`p:contains(${longUrl})`).should('have.text', longUrl);
    });

    cy.get('#generated-shortUrl').then(($input) => {
      const shortUrl = $input.val();
      cy.get(`a:contains(${shortUrl})`).should('have.text', `${shortUrl} `);
    });

    cy.get('[data-test-id=url-link-list] li').should('have.length', 2);
    cy.get('button:contains(Delete)').should('have.length', 2);
    cy.get('button:contains(Copy)').should('have.length', 2);
    cy.wait(2000);
  });

  it('can add another url and go to link, click should increase', () => {
    cy.get('[data-testid=create-url]')
      .should('have.text', 'Create another Shrimp')
      .click({ force: true });

    const url =
      'https://www.nasa.gov/press-release/record-setting-nasa-astronaut-crewmates-return-from-space-station-0';
    cy.get('#urlInput').type(url);
    cy.get('#urlInput').should('have.value', url);
    cy.get('[type=submit]').click();

    cy.get('#longUrl').then(($input) => {
      const longUrl = $input.val();
      cy.get(`p:contains(${longUrl})`).should('have.text', longUrl);
    });

    cy.get('#generated-shortUrl').then(($input) => {
      const shortUrl = $input.val();
      cy.get(`a:contains(${shortUrl})`).should('have.text', `${shortUrl} `).click();
      cy.wait(2000);
      cy.visit('http://localhost');
    });

    cy.get('[data-test-id=url-link-list] li').should('have.length', 3);
    cy.get('button:contains(Delete)').should('have.length', 3);
    cy.get('button:contains(Copy)').should('have.length', 3);
    cy.get('p:contains(clicks 1)').should('have.length', 1);
    cy.wait(2000);
  });

  it('delete first created link', () => {
    cy.get('button:contains(Delete)').last().click();
    cy.get('button:contains(Confirm)').should('have.text', 'Confirm').last().click();
  });

  it('delete rest of the link list', () => {
    cy.get('button:contains(Clear all)')
      .should('have.text', 'Clear all')
      .click({ waitForAnimations: true, animationDistanceThreshold: 0 })
      .then(() => {
        cy.get('button:contains(Yes)').should('have.text', 'Yes').click();
      });
  });
});
