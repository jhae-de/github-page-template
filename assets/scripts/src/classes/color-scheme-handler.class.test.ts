import { ColorScheme } from '../enums';
import { ColorSchemeHandler } from './color-scheme-handler.class';

describe('ColorSchemeHandler', (): void => {
  let colorSchemeHandler: ColorSchemeHandler;

  beforeAll((): void => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(
        (query: string): Pick<MediaQueryList, 'matches' | 'addEventListener'> => ({
          matches: query === `(prefers-color-scheme: light)`,
          addEventListener: jest.fn(),
        }),
      ),
    });
  });

  beforeEach((): void => {
    document.body.innerHTML = `<div data-color-scheme-toggle></div>`;
    localStorage.clear();

    colorSchemeHandler = new ColorSchemeHandler('[data-color-scheme-toggle]');
  });

  describe('constructor', (): void => {
    it('applies the active color scheme', (): void => {
      jest.spyOn(ColorSchemeHandler.prototype, 'activeColorScheme', 'get').mockReturnValue(ColorScheme.Dark);

      new ColorSchemeHandler('_toggle_element_selector_');

      expect(document.documentElement.dataset.colorScheme).toBe(ColorScheme.Dark);
    });

    it('registers the event listeners', (): void => {
      jest.spyOn(ColorSchemeHandler.prototype as never, 'registerEventListeners');

      colorSchemeHandler = new ColorSchemeHandler('_toggle_element_selector_');

      expect(colorSchemeHandler['registerEventListeners']).toHaveBeenCalledTimes(1);
    });
  });

  describe('get systemColorScheme', (): void => {
    it.each([
      { systemColorScheme: 'light', expectedColorScheme: ColorScheme.Light },
      { systemColorScheme: 'dark', expectedColorScheme: ColorScheme.Dark },
    ])(
      'returns $expectedColorScheme when system preference is $systemColorScheme',
      ({
        systemColorScheme,
        expectedColorScheme,
      }: {
        systemColorScheme: string;
        expectedColorScheme: ColorScheme;
      }): void => {
        window.matchMedia = jest.fn().mockImplementation(
          (query: string): Pick<MediaQueryList, 'matches' | 'addEventListener'> => ({
            matches: query === `(prefers-color-scheme: ${systemColorScheme})`,
            addEventListener: jest.fn(),
          }),
        );

        expect(colorSchemeHandler.systemColorScheme).toBe(expectedColorScheme);
      },
    );
  });

  describe('get storedColorScheme', (): void => {
    it('returns null when no color scheme is stored', (): void => {
      expect(colorSchemeHandler.storedColorScheme).toBeNull();
    });

    it.each([
      { storedColorScheme: ColorScheme.Light, expectedColorScheme: ColorScheme.Light },
      { storedColorScheme: ColorScheme.Dark, expectedColorScheme: ColorScheme.Dark },
    ])(
      'returns $expectedColorScheme when $storedColorScheme color scheme is stored',
      ({
        storedColorScheme,
        expectedColorScheme,
      }: {
        storedColorScheme: ColorScheme;
        expectedColorScheme: ColorScheme;
      }): void => {
        localStorage.setItem('color-scheme', storedColorScheme);

        expect(colorSchemeHandler.storedColorScheme).toBe(expectedColorScheme);
      },
    );
  });

  describe('get activeColorScheme', (): void => {
    it('returns the stored color scheme when it is set', (): void => {
      jest.spyOn(colorSchemeHandler, 'storedColorScheme', 'get').mockReturnValue(ColorScheme.Dark);

      expect(colorSchemeHandler.activeColorScheme).toBe(ColorScheme.Dark);
    });

    it('returns the system color scheme when no color scheme is stored', (): void => {
      jest.spyOn(colorSchemeHandler, 'storedColorScheme', 'get').mockReturnValue(null);
      jest.spyOn(colorSchemeHandler, 'systemColorScheme', 'get').mockReturnValue(ColorScheme.Light);

      expect(colorSchemeHandler.activeColorScheme).toBe(ColorScheme.Light);
    });
  });

  describe('toggleColorScheme', (): void => {
    it('prevents the default event behavior', (): void => {
      const event: Event = new Event('click');
      jest.spyOn(event, 'preventDefault');

      document.querySelector('[data-color-scheme-toggle]')?.dispatchEvent(event);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('uses startViewTransition if available', (): void => {
      document.startViewTransition = jest.fn((callback: () => void): void => callback()) as never;
      jest.spyOn(colorSchemeHandler, 'activeColorScheme', 'get').mockReturnValue(ColorScheme.Light);
      jest.spyOn(colorSchemeHandler as never, 'applyColorScheme');

      document.querySelector('[data-color-scheme-toggle]')?.dispatchEvent(new Event('click'));

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(document.startViewTransition).toHaveBeenCalledTimes(1);
      expect(colorSchemeHandler['applyColorScheme']).toHaveBeenCalledWith(ColorScheme.Dark);
    });

    it('falls back to applyColorScheme if startViewTransition is not available', (): void => {
      document.startViewTransition = undefined as never;
      jest.spyOn(colorSchemeHandler, 'activeColorScheme', 'get').mockReturnValue(ColorScheme.Dark);
      jest.spyOn(colorSchemeHandler as never, 'applyColorScheme');

      document.querySelector('[data-color-scheme-toggle]')?.dispatchEvent(new Event('click'));

      expect(colorSchemeHandler['applyColorScheme']).toHaveBeenCalledWith(ColorScheme.Light);
    });
  });

  describe('applyColorScheme', (): void => {
    it.each([
      { activeColorScheme: ColorScheme.Light, newColorScheme: ColorScheme.Dark },
      { activeColorScheme: ColorScheme.Dark, newColorScheme: ColorScheme.Light },
    ])(
      'toggles from $activeColorScheme to $newColorScheme when the active color scheme is $activeColorScheme',
      ({
        activeColorScheme,
        newColorScheme,
      }: {
        activeColorScheme: ColorScheme;
        newColorScheme: ColorScheme;
      }): void => {
        document.documentElement.dataset.colorScheme = activeColorScheme;

        colorSchemeHandler['applyColorScheme'](newColorScheme);

        expect(document.documentElement.dataset.colorScheme).toBe(newColorScheme);
      },
    );

    it('stores the color scheme if it does not match the system color scheme', (): void => {
      jest.spyOn(colorSchemeHandler, 'systemColorScheme', 'get').mockReturnValue(ColorScheme.Light);

      colorSchemeHandler['applyColorScheme'](ColorScheme.Dark);

      expect(localStorage.getItem('color-scheme')).toBe(ColorScheme.Dark);
    });

    it('removes the stored color scheme if it matches the system color scheme', (): void => {
      jest.spyOn(colorSchemeHandler, 'systemColorScheme', 'get').mockReturnValue(ColorScheme.Light);
      localStorage.setItem('color-scheme', ColorScheme.Dark);

      colorSchemeHandler['applyColorScheme'](ColorScheme.Light);

      expect(localStorage.getItem('color-scheme')).toBeNull();
    });
  });

  describe('applySystemColorScheme', (): void => {
    it.each([
      { systemColorScheme: ColorScheme.Light, expectedColorScheme: ColorScheme.Light },
      { systemColorScheme: ColorScheme.Dark, expectedColorScheme: ColorScheme.Dark },
    ])(
      'applies the $expectedColorScheme color scheme when the system preference is $systemColorScheme and no color scheme is stored',
      ({
        systemColorScheme,
        expectedColorScheme,
      }: {
        systemColorScheme: ColorScheme;
        expectedColorScheme: ColorScheme;
      }): void => {
        document.documentElement.dataset.colorScheme = '';

        colorSchemeHandler['applySystemColorScheme']({
          matches: systemColorScheme === ColorScheme.Light,
        } as never);

        expect(document.documentElement.dataset.colorScheme).toBe(expectedColorScheme);
      },
    );

    it('does not change the color scheme when a color scheme is stored', (): void => {
      jest.spyOn(colorSchemeHandler, 'storedColorScheme', 'get').mockReturnValue(ColorScheme.Dark);
      document.documentElement.dataset.colorScheme = ColorScheme.Dark;

      colorSchemeHandler['applySystemColorScheme']({ matches: true } as never);

      expect(document.documentElement.dataset.colorScheme).toBe(ColorScheme.Dark);
    });
  });
});
