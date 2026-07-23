import { Page } from 'playwright';
import { PageModel, InteractiveElement, FormModel } from '../models';
import { extractDOMData } from '../extractors/DOMExtractor';
import { ElementClassifier } from '../classifiers/ElementClassifier';
import { FormDetector } from '../classifiers/FormDetector';
import { ElementType } from '../types';
import { Logger } from '../../utils/Logger';

const logger = new Logger('DOMAnalyzer');

export class DOMAnalyzer {
  
  /**
   * Orchestrates the extraction and classification of the entire DOM for a given Playwright Page
   */
  public static async analyze(page: Page): Promise<PageModel> {
    logger.info(`Starting DOM Analysis on ${page.url()}`);
    
    try {
      // 1. Inject and execute the extractor script directly inside the browser
      // We stringify the function and invoke it to bypass context isolation
      const rawData = await page.evaluate(`(${extractDOMData.toString()})()`) as any;
      
      const interactiveElements: InteractiveElement[] = rawData.interactiveElements;
      
      // 2. Run Classifications on every extracted element
      logger.info(`Extracted ${interactiveElements.length} elements. Beginning classification...`);
      for (const element of interactiveElements) {
        ElementClassifier.classify(element);
      }

      // 3. Assemble Form Models
      const forms: FormModel[] = [];
      const formElements = interactiveElements.filter(el => el.type === ElementType.FORM);
      
      for (const formEl of formElements) {
        // Find inputs that belong to this form (simplified heuristic: relying on DOM hierarchy or simple proximity for now)
        // In a perfect system we'd use parentId, but for V1 we'll just group them
        // Let's assume the extractor was updated to pass child relations. For now, we mock the inputs array.
        const formModel: FormModel = {
          uniqueId: formEl.uniqueId,
          action: formEl.attributes['action'] || null,
          method: formEl.attributes['method'] || null,
          inputs: [], 
          submitButtons: [],
          type: FormDetector.detectFormType(formEl, []) // Passing empty array for child elements as placeholder
        };
        forms.push(formModel);
      }

      const pageModel: PageModel = {
        title: rawData.title,
        url: rawData.url,
        metaTags: rawData.metaTags,
        forms,
        interactiveElements
      };

      logger.info(`DOM Analysis complete. Found ${forms.length} forms.`);
      return pageModel;

    } catch (error: any) {
      logger.error('Failed to analyze DOM', error);
      throw new Error(`DOM Analysis failed: ${error.message}`);
    }
  }
}
