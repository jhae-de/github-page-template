import { RecursiveKeyValuePair, type ResolvableTo } from 'tailwindcss/types/config';

const generateColorStops: (colorName: string) => RecursiveKeyValuePair = (colorName: string): RecursiveKeyValuePair =>
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].reduce(
    (colorStops: RecursiveKeyValuePair, colorStop: number): RecursiveKeyValuePair => ({
      ...colorStops,
      [colorStop]: `rgb(var(--theme-color-${colorName}-${colorStop}))`,
    }),
    {
      DEFAULT: `rgb(var(--theme-color-${colorName}-default))`,
    },
  );

const generateColors: (...colorNames: string[]) => ResolvableTo<RecursiveKeyValuePair> = (
  ...colorNames: string[]
): ResolvableTo<RecursiveKeyValuePair> =>
  colorNames.reduce(
    (colorNames: ResolvableTo<RecursiveKeyValuePair>, colorName: string): ResolvableTo<RecursiveKeyValuePair> => ({
      ...colorNames,
      [colorName]: generateColorStops(colorName),
    }),
    {},
  );

export { generateColors };
