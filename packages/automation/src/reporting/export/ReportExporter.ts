import { ReportModel } from '../models/ReportModel';

export interface ReportExporter {
  export(model: ReportModel): Promise<string | Buffer>;
}
