import { ReportModel } from '../models/ReportModel';
import { ReportExporter } from './ReportExporter';
import { ReportSectionType } from '../models/ReportSection';

export class HTMLExporter implements ReportExporter {
  public async export(model: ReportModel): Promise<string> {
    let html = `<!DOCTYPE html>
<html>
<head>
  <title>${model.metadata.title}</title>
  <style>
    body { font-family: sans-serif; margin: 20px; }
    .section { margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
  </style>
</head>
<body>
  <h1>Execution Report - ${model.metadata.title}</h1>
  <p><strong>Generated At:</strong> ${model.metadata.generatedAt.toISOString()}</p>
  <p><strong>Execution ID:</strong> ${model.metadata.executionId}</p>
`;

    for (const section of model.sections) {
      html += `<div class="section" id="${section.id}">\n`;
      html += `  <h2>${section.title}</h2>\n`;
      
      if (section.type === ReportSectionType.SUMMARY) {
        html += `  <ul>\n`;
        html += `    <li>Pass Count: ${section.content.passCount}</li>\n`;
        html += `    <li>Fail Count: ${section.content.failCount}</li>\n`;
        html += `    <li>Duration: ${section.content.durationMs}ms</li>\n`;
        html += `  </ul>\n`;
      } else if (section.type === ReportSectionType.VALIDATION) {
        html += `  <p>Total Findings: ${section.content.totalFindings}</p>\n`;
      } else if (section.type === ReportSectionType.RECOMMENDATION) {
        html += `  <ul>\n`;
        for (const rec of section.content.recommendations) {
          html += `    <li>${rec}</li>\n`;
        }
        html += `  </ul>\n`;
      } else {
        html += `  <pre>${JSON.stringify(section.content, null, 2)}</pre>\n`;
      }
      
      html += `</div>\n`;
    }

    html += `</body>\n</html>`;
    return html;
  }
}
