export enum ChartType {
  PIE = 'PIE',
  BAR = 'BAR',
  LINE = 'LINE',
}

export interface ChartDataSeries {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
}

export interface ChartModel {
  type: ChartType;
  title: string;
  labels: string[]; // X-axis or Pie slices
  series: ChartDataSeries[];
}
