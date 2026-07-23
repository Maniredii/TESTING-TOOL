import { ElementClassifier } from '../classifiers/ElementClassifier';
import { InteractiveElement } from '../models';
import { ElementType, ClassificationCategory } from '../types';

describe('ElementClassifier', () => {
  const createMockElement = (overrides: Partial<InteractiveElement>): InteractiveElement => ({
    uniqueId: '1',
    tag: 'div',
    role: null,
    accessibleName: null,
    text: '',
    value: null,
    placeholder: null,
    label: null,
    classNames: '',
    attributes: {},
    xpath: '',
    cssSelector: '',
    ariaAttributes: {},
    isVisible: true,
    isEnabled: true,
    isDisabled: false,
    boundingBox: { x: 0, y: 0, width: 10, height: 10 },
    parentId: null,
    childrenIds: [],
    ...overrides
  });

  it('should classify a standard button', () => {
    const el = createMockElement({ tag: 'button', text: 'Submit' });
    ElementClassifier.classify(el);
    expect(el.type).toBe(ElementType.BUTTON);
    expect(el.classification).toBe(ClassificationCategory.UNCATEGORIZED);
  });

  it('should classify a login button as AUTHENTICATION', () => {
    const el = createMockElement({ tag: 'button', text: 'Sign In' });
    ElementClassifier.classify(el);
    expect(el.classification).toBe(ClassificationCategory.AUTHENTICATION);
  });

  it('should classify a delete button as DANGER', () => {
    const el = createMockElement({ tag: 'button', text: 'Delete Account' });
    ElementClassifier.classify(el);
    expect(el.classification).toBe(ClassificationCategory.DANGER);
  });

  it('should identify a search input', () => {
    const el = createMockElement({ tag: 'input', attributes: { type: 'search' } });
    ElementClassifier.classify(el);
    expect(el.type).toBe(ElementType.INPUT);
    expect(el.classification).toBe(ClassificationCategory.SEARCH);
  });

  it('should identify form inputs', () => {
    const el = createMockElement({ tag: 'input', attributes: { type: 'text' } });
    ElementClassifier.classify(el);
    expect(el.type).toBe(ElementType.INPUT);
    expect(el.classification).toBe(ClassificationCategory.FORM_INPUT);
  });
});
