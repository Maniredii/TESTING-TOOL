import { InteractiveElement } from '../models';
import { ElementType, ClassificationCategory } from '../types';
import { DangerDetector } from './DangerDetector';

export class ElementClassifier {
  
  /**
   * Classifies an element based on its extracted metadata
   */
  public static classify(element: InteractiveElement): void {
    // 1. Determine base type
    element.type = this.determineType(element);
    
    // 2. Determine semantic category
    element.classification = this.determineCategory(element);
  }

  private static determineType(el: InteractiveElement): ElementType {
    const tag = el.tag.toLowerCase();
    const role = el.role?.toLowerCase() || '';
    const typeAttr = el.attributes['type']?.toLowerCase() || '';

    if (tag === 'button' || role === 'button' || typeAttr === 'submit' || typeAttr === 'button') {
      return ElementType.BUTTON;
    }
    if (tag === 'a' || role === 'link') {
      return ElementType.LINK;
    }
    if (tag === 'input') {
      if (['checkbox'].includes(typeAttr)) return ElementType.CHECKBOX;
      if (['radio'].includes(typeAttr)) return ElementType.RADIO;
      if (['file'].includes(typeAttr)) return ElementType.FILE_UPLOAD;
      return ElementType.INPUT;
    }
    if (tag === 'textarea') return ElementType.TEXTAREA;
    if (tag === 'select' || role === 'listbox' || role === 'combobox') return ElementType.DROPDOWN;
    if (tag === 'form' || role === 'form') return ElementType.FORM;
    if (tag === 'img' || role === 'img' || tag === 'svg') return ElementType.IMAGE;
    if (tag === 'dialog' || role === 'dialog') return ElementType.DIALOG;

    return ElementType.UNKNOWN;
  }

  private static determineCategory(el: InteractiveElement): ClassificationCategory {
    // Check danger first
    if (DangerDetector.isDangerous(el)) {
      return ClassificationCategory.DANGER;
    }

    const type = el.type;
    const combinedText = [el.text, el.accessibleName, el.attributes['href']].join(' ').toLowerCase();

    // Authentication
    if (combinedText.includes('login') || combinedText.includes('sign in') || combinedText.includes('register') || combinedText.includes('sign up')) {
      return ClassificationCategory.AUTHENTICATION;
    }

    // Search
    if (combinedText.includes('search') || el.attributes['type'] === 'search') {
      return ClassificationCategory.SEARCH;
    }

    // Forms & Submissions
    if (type === ElementType.INPUT || type === ElementType.TEXTAREA || type === ElementType.CHECKBOX || type === ElementType.RADIO || type === ElementType.DROPDOWN) {
      return ClassificationCategory.FORM_INPUT;
    }

    if (type === ElementType.BUTTON && el.attributes['type'] === 'submit') {
      return ClassificationCategory.SUBMISSION;
    }

    // Navigation
    if (type === ElementType.LINK) {
      if (combinedText.includes('download')) return ClassificationCategory.DOWNLOAD;
      return ClassificationCategory.NAVIGATION;
    }

    return ClassificationCategory.UNCATEGORIZED;
  }
}
