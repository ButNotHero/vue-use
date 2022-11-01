import { ref, watch, computed } from 'vue';
import type { StyledOptions, AddModifierOptions } from './types';

/**
 * Удобное управление CSS внутри компонента
 * @param options Настройки. Если строка, то это класс для элемента
 */
export const useStyled = (options?: string | StyledOptions) => {
  const curCss = ref<string>('');
  const blockName = ref<string>('');
  const modifierSeparator = ref<string>('--');

  (function constructor(): void {
    if (!options || (typeof options !== 'object' && typeof options !== 'string')) return;

    if (typeof options !== 'object') {
      curCss.value = options as string;
      return;
    }

    const { css = '', bem = false } = options as StyledOptions;

    if (typeof bem === 'object' && bem?.blockName) {
      blockName.value = bem?.blockName;

      if (bem?.modifierSeparator) {
        modifierSeparator.value = bem.modifierSeparator;
      }
    } else if (typeof bem === 'string') {
      blockName.value = bem;
    }

    curCss.value = css;
  })();

  const getClasses = computed(() => curCss.value.trim());

  const haveCss = (css: string): boolean => {
    return curCss.value.includes(css);
  };

  const removeCss = (css: string) => {
    curCss.value = curCss.value.replace(css, '');
  };

  const addCss = (additionalCss: string, conditional?: (() => boolean) | boolean): void => {
    if (haveCss(additionalCss)) return;

    if (typeof conditional === 'undefined') {
      curCss.value += ` ${additionalCss}`;
    } else if (typeof conditional === 'boolean' && conditional) {
      curCss.value += ` ${additionalCss}`;
    } else if (typeof conditional === 'function' && conditional()) {
      curCss.value += ` ${additionalCss}`;
    }
  };

  const createModifier = (name: string): string =>
    `${blockName.value}${modifierSeparator.value}${name}`;

  const addModifier = (
    modifier?: string | string[],
    conditional?: () => boolean,
    options: AddModifierOptions = {},
  ) => {
    if (!modifier) return;

    const { makeObserve = true } = options;
    const css = Array.isArray(modifier) ? '' : createModifier(modifier);

    if (typeof conditional !== 'undefined') {
      if (makeObserve) {
        observe(css, conditional);
      } else {
        addCss(css, conditional);
      }
    } else {
      addCss(css);
    }
  };

  const updateCss = (css: string, isAdd: boolean) => {
    if (isAdd) {
      addCss(css);
    } else {
      removeCss(css);
    }
  };

  const observe = (additionalCss: string, conditional: () => boolean) => {
    if (typeof conditional === 'undefined') return;

    watch(
      () => conditional(),
      (newValue) => {
        updateCss(additionalCss, newValue);
      },
      { immediate: true },
    );
  };

  return {
    getClasses,
    addCss,
    observe,
    removeCss,
    haveCss,
    addModifier,
  };
};
