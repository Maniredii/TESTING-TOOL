import { ReportModel } from '../models/ReportModel';
import { ReportExporter } from './ReportExporter';

export class PDFExporter implements ReportExporter {
  public async export(model: ReportModel): Promise<Buffer> {
    // In a real implementation, this would use Puppeteer or PDFKit to render the HTML model to a PDF buffer.
    // For now, we return a mocked buffer to satisfy the interface.
    const text = `PDF Report Stub for: ${model.metadata.title}`;
    return Buffer.from(text, 'utf-8');
  }
}
