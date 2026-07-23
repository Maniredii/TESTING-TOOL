import { InteractiveElement, FormModel } from '../models';

export class FormDetector {
  /**
   * Evaluates a group of elements inside a <form> tag to determine the form's semantic purpose
   */
  public static detectFormType(formElement: InteractiveElement, childElements: InteractiveElement[]): FormModel['type'] {
    const combinedText = childElements
      .map(el => `${el.text} ${el.accessibleName} ${el.attributes['name']} ${el.attributes['id']}`)
      .join(' ')
      .toLowerCase();

    const action = formElement.attributes['action']?.toLowerCase() || '';

    // Login heuristics
    if (combinedText.includes('password') && (combinedText.includes('email') || combinedText.includes('username'))) {
      if (combinedText.includes('login') || combinedText.includes('sign in') || action.includes('login')) {
        return 'LOGIN';
      }
    }

    // Signup heuristics
    if (combinedText.includes('password') && combinedText.includes('confirm')) {
      return 'SIGNUP';
    }
    if (combinedText.includes('register') || combinedText.includes('sign up') || action.includes('register')) {
      return 'SIGNUP';
    }

    // Search heuristics
    if (combinedText.includes('search') || action.includes('search')) {
      return 'SEARCH';
    }

    // Contact heuristics
    if (combinedText.includes('message') && combinedText.includes('subject')) {
      return 'CONTACT';
    }

    return 'UNKNOWN';
  }
}
