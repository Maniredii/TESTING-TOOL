export class SelectorGenerator {
  
  /**
   * Generates a unique CSS selector for an element.
   * This is meant to be run inside the browser context, but can also be used here if needed.
   * In a real implementation, this would be injected.
   */
  public static generateCSS(el: Element): string {
    if (el.id) {
      return `#${el.id}`;
    }

    // Fallback to structural path
    const path = [];
    let current: Element | null = el;
    
    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let selector = current.nodeName.toLowerCase();
      
      if (current.id) {
        selector += `#${current.id}`;
        path.unshift(selector);
        break; // Stop at the first ID we find going up the tree
      } else {
        let sibling = current;
        let nth = 1;
        while (sibling.previousElementSibling) {
          sibling = sibling.previousElementSibling;
          if (sibling.nodeName.toLowerCase() == selector)
            nth++;
        }
        if (nth != 1) {
          selector += `:nth-of-type(${nth})`;
        }
      }
      path.unshift(selector);
      current = current.parentElement;
    }
    
    return path.join(' > ');
  }

  public static generateXPath(el: Element): string {
    if (el.id) {
      return `//*[@id="${el.id}"]`;
    }
    
    const parts = [];
    let current: Element | null = el;

    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let sibling = current;
      let position = 1;
      while (sibling.previousElementSibling) {
        sibling = sibling.previousElementSibling;
        if (sibling.nodeName === current.nodeName) {
          position++;
        }
      }
      
      const nodeName = current.nodeName.toLowerCase();
      parts.unshift(`${nodeName}[${position}]`);
      current = current.parentElement;
    }

    return `/${parts.join('/')}`;
  }
}
