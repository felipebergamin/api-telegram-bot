import { ReplyKeyboardBuilder } from '../src';

describe('ReplyKeyboardBuilder tests', () => {
  test('should build a reply keyboard with 3 rows', () => {
    const BUTTON1 = { text: 'Hi' };
    const BUTTON2 = { text: 'Send Location', request_location: true };
    const BUTTON3 = { text: 'Enviar Contact', request_contact: true };

    const expectedMarkup = [
      [BUTTON1],
      [BUTTON2],
      [BUTTON3],
    ];

    const markup = new ReplyKeyboardBuilder()
      .addButton(BUTTON1)
      .appendRow()
      .addButton(BUTTON2)
      .appendRow()
      .addButton(BUTTON3).keyboard;

    expect(markup).toEqual(expectedMarkup);
  });
});
