import { DangerDetector } from '../classifiers/DangerDetector';
import { InteractiveElement } from '../models';
import { ElementType, ClassificationCategory } from '../types';

describe('DangerDetector', () => {
  const baseElement: InteractiveElement = {
    uniqueId: '1',
    tag: 'button',
    role: 'button',
    accessibleName: null,
    text: 'Click me',
    value: null,
    placeholder: null,
    label: null,
    classNames: 'btn',
    attributes: {},
    xpath: '',
    cssSelector: '',
    ariaAttributes: {},
    isVisible: true,
    isEnabled: true,
    isDisabled: false,
    boundingBox: { x: 0, y: 0, width: 10, height: 10 },
    parentId: null,
    childrenIds: []
  };

  it('should flag "Delete" buttons as dangerous', () => {
    const el = { ...baseElement, text: 'Delete Account' };
    expect(DangerDetector.isDangerous(el)).toBe(true);
  });

  it('should flag "Checkout" accessible names as dangerous', () => {
    const el = { ...baseElement, text: 'Proceed', accessibleName: 'Checkout Cart' };
    expect(DangerDetector.isDangerous(el)).toBe(true);
  });

  it('should flag dangerous class names', () => {
    const el = { ...baseElement, classNames: 'btn-danger' };
    expect(DangerDetector.isDangerous(el)).toBe(true);
  });

  it('should not flag standard benign buttons', () => {
    const el = { ...baseElement, text: 'Save Settings', accessibleName: 'Submit Form' };
    expect(DangerDetector.isDangerous(el)).toBe(false);
  });
});
