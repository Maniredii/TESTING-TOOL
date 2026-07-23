import { ReportModel } from '../models/ReportModel';
import { ReportExporter } from './ReportExporter';
import { ReportSectionType } from '../models/ReportSection';

export class MarkdownExporter implements ReportExporter {
  public async export(model: ReportModel): Promise<string> {
    let md = `# Execution Report - ${model.metadata.title}\n\n`;
    md += `*Generated At:* ${model.metadata.generatedAt.toISOString()}\n`;
    md += `*Execution ID:* ${model.metadata.executionId}\n\n`;

    for (const section of model.sections) {
      md += `## ${section.title}\n\n`;
      
      if (section.type === ReportSectionType.SUMMARY) {
        md += `- Pass Count: ${section.content.passCount}\n`;
        md += `- Fail Count: ${section.content.failCount}\n`;
        md += `- Duration: ${section.content.durationMs}ms\n\n`;
      } else if (section.type === ReportSectionType.VALIDATION) {
        md += `- Total Findings: ${section.content.totalFindings}\n\n`;
      } else if (section.type === ReportSectionType.RECOMMENDATION) {
        for (const rec of section.content.recommendations) {
          md += `- ${rec}\n`;
        }
        md += '\n';
      } else {
        md += '```json\n';
        md += JSON.stringify(section.content, null, 2);
        md += '\n```\n\n';
      }
    }

    return md;
  }
}
