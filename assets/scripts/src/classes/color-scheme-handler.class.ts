import { ColorScheme } from '../enums';

/**
 * The `ColorSchemeHandler` class is responsible for handling the color scheme of the website. It allows the user to
 * toggle between the light and dark color scheme.
 *
 * - The color scheme can be toggled by clicking on elements with the specified selector.
 * - The color scheme is applied to the document's root element as `data-color-scheme` attribute with either the value
 *   `light` or `dark`.
 * - The color scheme is stored in the local storage to persist the user's preference if the color scheme differs from
 *   the user's system settings.
 * - The color scheme is updated automatically if the user's system settings change and no color scheme is stored in
 *   the local storage.
 * - The color scheme is transitioned if the View Transition API is available.
 *
 * @example
 * ```typescript
 * new ColorSchemeHandler('[data-color-scheme-toggle]');
 * ```
 */
export class ColorSchemeHandler {
  /**
   * Creates a new `ColorSchemeHandler` object.
   *
   * @param {string} toggleElementSelector - The CSS selector for the elements that will toggle the color scheme.
   */
  public constructor(protected readonly toggleElementSelector: string) {
    document.documentElement.dataset.colorScheme = this.activeColorScheme;

    this.registerEventListeners();
  }

  /**
   * Registers event listeners for toggling the color scheme and responding to system color scheme changes.
   */
  protected registerEventListeners(): void {
    this.registerToggleElementClickEventListener();
    this.registerSystemColorSchemeChangeEventListener();
  }

  /**
   * Registers the event listener for the click events on the toggle elements.
   */
  protected registerToggleElementClickEventListener(): void {
    document
      .querySelectorAll(this.toggleElementSelector)
      .forEach((element: Element): void => element.addEventListener('click', this.toggleColorScheme.bind(this)));
  }

  /**
   * Registers the event listener for changes of the system color scheme.
   */
  protected registerSystemColorSchemeChangeEventListener(): void {
    window
      .matchMedia('(prefers-color-scheme: light)')
      .addEventListener('change', this.applySystemColorScheme.bind(this));
  }

  /**
   * Gets the color scheme based on the user's system settings.
   *
   * @returns {ColorScheme} The system color scheme.
   */
  public get systemColorScheme(): ColorScheme {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? ColorScheme.Light : ColorScheme.Dark;
  }

  /**
   * Gets the stored color scheme from the local storage.
   *
   * @returns {ColorScheme | null} The stored color scheme or `null` if not set.
   */
  public get storedColorScheme(): ColorScheme | null {
    return localStorage.getItem('color-scheme') as ColorScheme | null;
  }

  /**
   * Gets the active color scheme, which is either the stored or the system color scheme.
   *
   * @returns {ColorScheme} The active color scheme.
   */
  public get activeColorScheme(): ColorScheme {
    return this.storedColorScheme ?? this.systemColorScheme;
  }

  /**
   * Toggles the color scheme between light and dark.
   *
   * @param {Event} event - The event object associated with the listener event.
   */
  protected toggleColorScheme(event: Event): void {
    event.preventDefault();

    const colorScheme: ColorScheme =
      this.activeColorScheme === ColorScheme.Light ? ColorScheme.Dark : ColorScheme.Light;

    if (document.startViewTransition) {
      document.startViewTransition((): void => this.applyColorScheme(colorScheme));
      return;
    }

    this.applyColorScheme(colorScheme);
  }

  /**
   * Applies the specified color scheme to the website.
   *
   * @param {ColorScheme} colorScheme - The color scheme to apply.
   */
  protected applyColorScheme(colorScheme: ColorScheme): void {
    document.documentElement.dataset.colorScheme = colorScheme;

    if (colorScheme !== this.systemColorScheme) {
      localStorage.setItem('color-scheme', colorScheme);
      return;
    }

    localStorage.removeItem('color-scheme');
  }

  /**
   * Applies the color scheme based on the user's system settings if no color scheme is stored.
   *
   * @param {MediaQueryListEvent} event - The event object associated with the listener event.
   */
  protected applySystemColorScheme({ matches: isLightColorScheme }: MediaQueryListEvent): void {
    if (this.storedColorScheme !== null) {
      return;
    }

    document.documentElement.dataset.colorScheme = isLightColorScheme ? ColorScheme.Light : ColorScheme.Dark;
  }
}
