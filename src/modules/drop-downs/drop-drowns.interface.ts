export interface DropDown {
  value: number;
  label: string;
}

export enum DropDownsParam {
  'menu-items-drop-down' = 'menu-items-drop-down',
  'menu-items' = 'menu-items',
}

export type DropDownsExecute = Record<DropDownsParam, () => Promise<DropDown>>;

export type DropDownsExecuteById = Record<
  DropDownsParamById,
  (param: any) => Promise<DropDown>
>;

export enum DropDownsParamById {
}
