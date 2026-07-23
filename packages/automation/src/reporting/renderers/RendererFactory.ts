import { ReportExporter } from '../export/ReportExporter';
import { HTMLExporter } from '../export/HTMLExporter';
import { MarkdownExporter } from '../export/MarkdownExporter';
import { JSONExporter } from '../export/JSONExporter';
import { PDFExporter } from '../export/PDFExporter';

export enum ReportFormat {
  HTML = 'HTML',
  MARKDOWN = 'MARKDOWN',
  JSON = 'JSON',
  PDF = 'PDF'
}

export class RendererFactory {
  public getRenderer(format: ReportFormat): ReportExporter {
    switch (format) {
      case ReportFormat.HTML:
        return new HTMLExporter();
      case ReportFormat.MARKDOWN:
        return new MarkdownExporter();
      case ReportFormat.JSON:
        return new JSONExporter();
      case ReportFormat.PDF:
        return new PDFExporter();
      default:
        throw new Error(`Unsupported report format: ${format}`);
    }
  }
}
