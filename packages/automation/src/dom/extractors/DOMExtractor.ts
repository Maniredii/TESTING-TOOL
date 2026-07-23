// This file contains the function that is injected into Playwright's page.evaluate()
// It must be completely self-contained and not rely on imports outside of its scope during execution.

export function extractDOMData() {
  const elements = document.querySelectorAll('*');
  const interactableTags = ['a', 'button', 'input', 'select', 'textarea', 'form', 'img', 'svg', 'dialog'];
  
  const extractedElements: any[] = [];
  let idCounter = 0;

  // Embedded Selector Generator to avoid import issues inside page.evaluate()
  const getCSSSelector = (el: Element): string => {
    if (el.id) return `#${el.id}`;
    const path = [];
    let current: Element | null = el;
    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let selector = current.nodeName.toLowerCase();
      if (current.id) {
        selector += `#${current.id}`;
        path.unshift(selector);
        break;
      } else {
        let sibling = current;
        let nth = 1;
        while (sibling.previousElementSibling) {
          sibling = sibling.previousElementSibling;
          if (sibling.nodeName.toLowerCase() == selector) nth++;
        }
        if (nth != 1) selector += `:nth-of-type(${nth})`;
      }
      path.unshift(selector);
      current = current.parentElement;
    }
    return path.join(' > ');
  };

  const getXPath = (el: Element): string => {
    if (el.id) return `//*[@id="${el.id}"]`;
    const parts = [];
    let current: Element | null = el;
    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let sibling = current;
      let position = 1;
      while (sibling.previousElementSibling) {
        sibling = sibling.previousElementSibling;
        if (sibling.nodeName === current.nodeName) position++;
      }
      parts.unshift(`${current.nodeName.toLowerCase()}[${position}]`);
      current = current.parentElement;
    }
    return `/${parts.join('/')}`;
  };

  elements.forEach((el) => {
    const tag = el.tagName.toLowerCase();
    
    // We only care about potentially interactive or structural elements for automation
    const isInteractable = interactableTags.includes(tag) || el.hasAttribute('role') || el.hasAttribute('tabindex');
    if (!isInteractable) return;

    const htmlEl = el as HTMLElement;
    const style = window.getComputedStyle(htmlEl);
    const rect = htmlEl.getBoundingClientRect();
    
    const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
    
    // Extract attributes
    const attributes: Record<string, string> = {};
    const ariaAttributes: Record<string, string> = {};
    
    Array.from(el.attributes).forEach(attr => {
      attributes[attr.name] = attr.value;
      if (attr.name.startsWith('aria-')) {
        ariaAttributes[attr.name] = attr.value;
      }
    });

    extractedElements.push({
      uniqueId: `elem_${idCounter++}`,
      tag,
      role: el.getAttribute('role'),
      accessibleName: el.getAttribute('aria-label') || (el as HTMLInputElement).alt || null,
      text: htmlEl.innerText?.trim() || '',
      value: (el as HTMLInputElement).value || null,
      placeholder: el.getAttribute('placeholder'),
      label: null, // Would require traversing linked <label> tags
      classNames: el.className || '',
      attributes,
      xpath: getXPath(el),
      cssSelector: getCSSSelector(el),
      ariaAttributes,
      isVisible,
      isEnabled: !el.hasAttribute('disabled'),
      isDisabled: el.hasAttribute('disabled'),
      boundingBox: isVisible ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null,
      parentId: null, // To be stitched later if needed
      childrenIds: []
    });
  });

  return {
    title: document.title,
    url: window.location.href,
    metaTags: {}, // Placeholder
    interactiveElements: extractedElements
  };
}
