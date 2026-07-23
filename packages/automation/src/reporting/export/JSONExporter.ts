import { ReportModel } from '../models/ReportModel';
import { ReportExporter } from './ReportExporter';

export class JSONExporter implements ReportExporter {
  public async export(model: ReportModel): Promise<string> {
    return JSON.stringify(model, null, 2);
  }
}
