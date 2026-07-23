import { InteractiveElement } from '../models';

export class DangerDetector {
  private static DANGER_KEYWORDS = [
    'delete', 'remove', 'erase', 'purchase', 'checkout', 'pay',
    'logout', 'sign out', 'deactivate', 'cancel subscription',
    'drop table', 'destroy', 'terminate'
  ];

  /**
   * Evaluates an element to see if interacting with it represents a dangerous action.
   * Checks accessible names, inner text, and semantic labels.
   */
  public static isDangerous(element: InteractiveElement): boolean {
    const textsToEvaluate = [
      element.text,
      element.accessibleName,
      element.value,
      element.label,
      element.attributes['title'],
      element.ariaAttributes['aria-label']
    ].filter(Boolean) as string[];

    const combinedText = textsToEvaluate.join(' ').toLowerCase();

    for (const keyword of this.DANGER_KEYWORDS) {
      if (combinedText.includes(keyword)) {
        return true;
      }
    }

    // Heuristics around class names indicating danger
    const classes = element.classNames.toLowerCase();
    if (classes.includes('btn-danger') || classes.includes('delete-btn')) {
      return true;
    }

    return false;
  }
}
