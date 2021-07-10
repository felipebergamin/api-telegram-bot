import { KeyboardBuilder } from '../src/builders';

describe('KeyboardBuilder', () => {
  test('should build a inline_keyboard', () => {
    const YES_BUTTON = { text: 'Yes', callback_data: 'YES' };
    const NO_BUTTON = { text: 'No', callback_data: 'NO' };
    const LINK_BUTTON = { text: 'See more', url: 'some_url' };

    const expectedMarkup = [[YES_BUTTON], [NO_BUTTON], [LINK_BUTTON]];

    const { keyboard } = KeyboardBuilder()
      .button(YES_BUTTON)
      .newRow()
      .button(NO_BUTTON)
      .newRow()
      .button(LINK_BUTTON);

    expect(keyboard).toEqual(expectedMarkup);
  });

  test('should build a reply_keyboard', () => {
    const BUTTON1 = { text: 'Hi' };
    const BUTTON2 = { text: 'Send Location', request_location: true };
    const BUTTON3 = { text: 'Enviar Contact', request_contact: true };

    const expectedMarkup = [[BUTTON1], [BUTTON2], [BUTTON3]];

    const markup = KeyboardBuilder()
      .button(BUTTON1)
      .newRow()
      .button(BUTTON2)
      .newRow()
      .button(BUTTON3).keyboard;

    expect(markup).toEqual(expectedMarkup);
  });

  test("shouldn't add a new row if there is a empty row at the end of keyboard", () => {
    const expectedMarkup = [['Start'], ['End']];
    const { keyboard } = KeyboardBuilder()
      .newRow()
      .newRow()
      .button('Start')
      .newRow()
      .newRow()
      .button('End');

    expect(keyboard).toEqual(expectedMarkup);
  });
});
