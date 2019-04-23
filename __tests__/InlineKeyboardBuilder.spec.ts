import { InlineKeyboardBuilder } from '../src';

describe('InlineKeyboardBuilder', () => {
  test('should build a keyboard with 3 rows. Each row with 1 button', () => {
    const YES_BUTTON = { text: 'Yes', callback_data: 'YES' };
    const NO_BUTTON = { text: 'No', callback_data: 'NO' };
    const LINK_BUTTON = { text: 'See more', url: 'some_url' };

    const builder = new InlineKeyboardBuilder();
    const expectedMarkup = [
      [YES_BUTTON],
      [NO_BUTTON],
      [LINK_BUTTON],
    ];

    builder
      .addButton(YES_BUTTON)
      .appendRow()
      .addButton(NO_BUTTON)
      .appendRow()
      .addButton(LINK_BUTTON);

    expect(builder.inline_keyboard).toEqual(expectedMarkup);
  });

  test('should build a keyboard with one row, two buttons', () => {
    const YES_BUTTON = { text: 'Yes', callback_data: 'YES' };
    const NO_BUTTON = { text: 'No', callback_data: 'NO' };
    const expectedMarkup = [
      [YES_BUTTON, NO_BUTTON],
    ];

    const builder = new InlineKeyboardBuilder();
    builder.distributeButtonsInRows(
      [YES_BUTTON, NO_BUTTON],
      2,
    );

    expect(builder.inline_keyboard).toEqual(expectedMarkup);
  })
});
