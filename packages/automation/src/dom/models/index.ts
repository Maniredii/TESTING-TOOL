import { ElementType, ClassificationCategory } from '../types';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface InteractiveElement {
  uniqueId: string;
  tag: string;
  role: string | null;
  accessibleName: string | null;
  text: string;
  value: string | null;
  placeholder: string | null;
  label: string | null;
  classNames: string;
  attributes: Record<string, string>;
  xpath: string;
  cssSelector: string;
  ariaAttributes: Record<string, string>;
  
  isVisible: boolean;
  isEnabled: boolean;
  isDisabled: boolean;
  
  boundingBox: BoundingBox | null;
  
  parentId: string | null;
  childrenIds: string[];
  
  // Classification fields added post-extraction
  type?: ElementType;
  classification?: ClassificationCategory;
}

export interface FormModel {
  uniqueId: string;
  action: string | null;
  method: string | null;
  inputs: string[]; // references InteractiveElement uniqueIds
  submitButtons: string[];
  type?: 'LOGIN' | 'SIGNUP' | 'SEARCH' | 'CONTACT' | 'UPLOAD' | 'UNKNOWN';
}

export interface PageModel {
  title: string;
  url: string;
  metaTags: Record<string, string>;
  forms: FormModel[];
  interactiveElements: InteractiveElement[];
}
