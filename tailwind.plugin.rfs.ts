import { Declaration, Root, Rule } from 'postcss';
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { PluginAPI, type PluginCreator } from 'tailwindcss/types/config';

export const rfsPlugin: {
  handler: PluginCreator;
  config?: Partial<Config>;
} = plugin(({ addVariant }: PluginAPI): void => {
  // @ts-expect-error: TS2345: Type mismatch for the `definition` argument.
  addVariant('rfs', ({ container, separator }: { container: Root; separator: string }): void => {
    container.walkRules((rule: Rule): void => {
      rule.walkDecls((decl: Declaration): void => {
        // @ts-expect-error: TS2339: Property `selector` does not exist on type.
        if (decl.parent?.selector.startsWith('.text-') && decl.prop === 'line-height') {
          return;
        }

        decl.value = `rfs(${decl.value})`;
      });

      rule.selector = `.rfs\\${separator}${rule.selector.slice(1)}`;
    });
  });
});
