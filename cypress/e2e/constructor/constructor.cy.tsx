const CONSTANTS = {
  MODAL: '[data-cy="modal"]',
  ADD_BUTTON_1: '[data-cy="add-button-1"]',
  ADD_BUTTON_2: '[data-cy="add-button-2"]',
  ADD_BUTTON_3: '[data-cy="add-button-3"]',
  ORDER_BUTTON: '[data-cy="button-order"]',
  CLOSE_BUTTON: '[data-cy="close-button"]'
};

describe('проверяем доступность приложения', function () {
  it('сервис должен быть доступен по адресу localhost:5173', function () {
    cy.visit('/');
  });
});

const getMockIngredients = () => {
  return cy.fixture('ingredients.json').then((data) => data.data);
};
describe('тестирование действий с ингридентами', () => {
  describe('Тест на отображение ингредиентов на странице', () => {
    it('страница должна корректно отображать ингредиенты на странице', () => {
      getMockIngredients().then((ingredients) => {
        cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
        cy.visit('/');

        ingredients.forEach((ingredient) => {
          cy.contains(ingredient._id).scrollIntoView().should('be.visible');
        });
      });
    });
  });

  describe('Тест на ыидимость добавленного ингредиента на странице', () => {
    it('на странице видно добавленный ингредиент', () => {
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
      cy.visit('/');

      cy.get(CONSTANTS.ADD_BUTTON_2).find('button').click();

      cy.get('[data-cy="burger-constructor-filling"]').within(() => {
        cy.get('[data-cy="i-2"]').should('exist');
      });
    });
  });

  describe('Тест на добавление несколько ингридентов', () => {
    it('на странице видно добавленные  ингредиенты ', () => {
      getMockIngredients().then((ingredients) => {
        cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
        cy.visit('/');

        cy.get(CONSTANTS.ADD_BUTTON_1).find('button').click();
        cy.get(CONSTANTS.ADD_BUTTON_2).find('button').click();
        cy.get(CONSTANTS.ADD_BUTTON_3).find('button').click();

        cy.get('[data-cy="burger-constructor-buns"]')
          .first()
          .within(() => {
            cy.contains(`${ingredients[0].name} (верх)`).should('exist');
          });

        cy.get('[data-cy="burger-constructor-buns"]')
          .last()
          .within(() => {
            cy.contains(`${ingredients[0].name} (низ)`).should('exist');
          });

        cy.get('[data-cy="burger-constructor-filling"]').within(() => {
          cy.get('[data-cy="i-2"]').should('exist');
          cy.get('[data-cy="i-3"]').should('exist');
        });
      });
    });
  });
});
describe('тестирование на показ и закрытие модального окна', () => {
  describe('Тест на показ модального окна ингредиента', () => {
    it('страница отображает модальное окно ингредиента', () => {
      getMockIngredients().then((ingredients) => {
        cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
        cy.visit('/');

        cy.get(CONSTANTS.ADD_BUTTON_1).find('a').click();

        cy.url().should('include', '/ingredients/1');

        cy.get(CONSTANTS.MODAL).should('be.visible');
        cy.get('[data-cy="i-1"]').within(() => {
          cy.get('img').should(
            'have.attr',
            'src',
            `${ingredients[0].image_large}`
          );
          cy.get('h3').should('contain.text', `${ingredients[0].name}`);
          cy.contains('Калории, ккал')
            .next()
            .should('contain.text', `${ingredients[0].calories}`);
          cy.contains('Белки, г')
            .next()
            .should('contain.text', `${ingredients[0].proteins}`);
          cy.contains('Жиры, г')
            .next()
            .should('contain.text', `${ingredients[0].fat}`);
          cy.contains('Углеводы, г')
            .next()
            .should('contain.text', `${ingredients[0].carbohydrates}`);
        });
      });
    });
  });

  describe('Тест закрытия модального окна ингредиента', () => {
    it('страница закрывает модальное окно ингредиента при нажатии на крестик', () => {
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
      cy.visit('/');

      cy.get(CONSTANTS.ADD_BUTTON_1).find('a').click();
      cy.get(CONSTANTS.CLOSE_BUTTON).click();
      cy.get(CONSTANTS.MODAL).should('not.exist');
      cy.url().should('include', '/');
    });

    it('страница закрывает модальное окно ингредиента при нажатии на оверлей', () => {
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
      cy.visit('/');

      cy.get(CONSTANTS.ADD_BUTTON_1).find('a').click();
      cy.get(CONSTANTS.MODAL).should('be.visible');

      cy.get(CONSTANTS.MODAL).then(($modal) => {
        const modalPosition = $modal[0].getBoundingClientRect();
        const clickX = modalPosition.right + 50;
        const clickY = modalPosition.top + modalPosition.height / 2;

        cy.get('body').click(clickX, clickY);
      });

      cy.get(CONSTANTS.MODAL).should('not.exist');
      cy.url().should('include', '/');
    });
  });
});
describe('тестирование оформления и создание заказа', () => {
  const mockAccessToken = '1234567889';
  const mockRefreshToken = '1234567889';

  beforeEach(() => {
    localStorage.setItem('refreshToken', mockRefreshToken);

    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
  });

  it('страница должна корректно отображать модальное окно оформления заказа, а также корректно оформлять заказ', () => {
    cy.visit('/');

    cy.wait('@getIngredients');

    cy.get(CONSTANTS.ADD_BUTTON_1).find('button').click();
    cy.get(CONSTANTS.ADD_BUTTON_2).find('button').click();
    cy.get(CONSTANTS.ADD_BUTTON_3).find('button').click();
    cy.intercept('POST', 'api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
        user: { email: 'blu@blu2.ru', name: 'jeyCromab' }
      }
    }).as('postLogin');

    cy.intercept('POST', 'api/orders', {
      statusCode: 200,
      body: {
        success: true,
        order: {
          _id: 'order123',
          status: 'done',
          name: 'Test Burger',
          createdAt: '2024-09-17T12:34:56.789Z',
          updatedAt: '2024-09-17T12:40:56.789Z',
          number: 12345,
          ingredients: ['ingredient1', 'ingredient2', 'ingredient3']
        }
      }
    }).as('postOrder');

    cy.get(CONSTANTS.ORDER_BUTTON).find('button').click();
    cy.get("[data-cy='login-button']").find('button').click();
    cy.wait('@postLogin');
    cy.get(CONSTANTS.ORDER_BUTTON).find('button').click();

    cy.wait('@postOrder');

    cy.get(CONSTANTS.MODAL).should('be.visible');
    cy.get(CONSTANTS.MODAL).should('contain', '12345');

    cy.get(CONSTANTS.CLOSE_BUTTON).click();
    cy.get(CONSTANTS.MODAL).should('not.exist');

    cy.get('[data-cy="burger-constructor-emptyBunTop"]')
      .first()
      .within(() => {
        cy.contains('Выберите булки').should('exist');
      });

    cy.get('[data-cy="burger-constructor-emptyBunBottom"]')
      .last()
      .within(() => {
        cy.contains('Выберите булки').should('exist');
      });

    cy.get('[data-cy="burger-constructor-notFilling"]').within(() => {
      cy.contains('Выберите начинку').should('exist');
    });
  });

  it('страница не должна отображать модальное окно оформления заказа при отсутствии начинки', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get(CONSTANTS.ADD_BUTTON_1).find('button').click();

    cy.get(CONSTANTS.ORDER_BUTTON).find('button').click();

    cy.get(CONSTANTS.MODAL).should('not.exist');
  });

  it('страница не должна отображать модальное окно оформления заказа при отсутствии булки', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get(CONSTANTS.ADD_BUTTON_2).find('button').click();
    cy.get(CONSTANTS.ADD_BUTTON_3).find('button').click();

    cy.get(CONSTANTS.ORDER_BUTTON).find('button').click();

    cy.get(CONSTANTS.MODAL).should('not.exist');
  });
});
