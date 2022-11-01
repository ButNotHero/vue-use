export interface Bem {
  blockName: string;
  modifierSeparator?: string;
}

export interface StyledOptions {
  css?: string;
  bem?: string | Bem;
}

export interface AddModifierOptions {
  makeObserve?: boolean;
}
