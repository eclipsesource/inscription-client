import { IvyIcons } from '@axonivy/editor-icons';

export interface FieldsetControl {
  label: string;
  icon: IvyIcons;
  active?: boolean;
  action: () => void;
}
