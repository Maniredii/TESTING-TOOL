import { RendererFactory, ReportFormat } from '../renderers/RendererFactory';
import { HTMLExporter } from '../export/HTMLExporter';
import { JSONExporter } from '../export/JSONExporter';
import { MarkdownExporter } from '../export/MarkdownExporter';
import { PDFExporter } from '../export/PDFExporter';

describe('RendererFactory', () => {
  let factory: RendererFactory;

  beforeEach(() => {
    factory = new RendererFactory();
  });

  it('should return HTMLExporter for HTML format', () => {
    const renderer = factory.getRenderer(ReportFormat.HTML);
    expect(renderer).toBeInstanceOf(HTMLExporter);
  });

  it('should return JSONExporter for JSON format', () => {
    const renderer = factory.getRenderer(ReportFormat.JSON);
    expect(renderer).toBeInstanceOf(JSONExporter);
  });

  it('should return MarkdownExporter for MARKDOWN format', () => {
    const renderer = factory.getRenderer(ReportFormat.MARKDOWN);
    expect(renderer).toBeInstanceOf(MarkdownExporter);
  });

  it('should return PDFExporter for PDF format', () => {
    const renderer = factory.getRenderer(ReportFormat.PDF);
    expect(renderer).toBeInstanceOf(PDFExporter);
  });
});
