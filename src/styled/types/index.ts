export interface Bem {
  blockName: string;
  modificatorSeparator?: string;
}

export interface StyledOptions {
  css?: string;
  bem?: string | Bem;
}

export interface AddModificatorOptions {
  makeObserve?: boolean;
}
