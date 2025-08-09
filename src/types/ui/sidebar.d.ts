export type NavigationActionFunction = () => void;

export interface NavigationMenuItem {
  key: string;
  label: string;
  icon?: string;
  path?: string;
  action?: NavigationActionFunction;
  color?: string;
  children?: NavigationMenuItem[];
}
