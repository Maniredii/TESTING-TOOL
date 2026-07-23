import { Page } from 'playwright';
import { AutomationEventEmitter } from '../events/AutomationEventEmitter';
import { ScreenshotCollector } from './screenshots/ScreenshotCollector';
import { VideoCollector } from './videos/VideoCollector';
import { DOMSnapshotCollector } from './snapshots/DOMSnapshotCollector';
import { NetworkCollector } from './network/NetworkCollector';
import { ConsoleCollector } from './console/ConsoleCollector';
import { StorageCollector } from './storage/StorageCollector';
import { TimelineBuilder } from './timeline/TimelineBuilder';
import { MetadataCollector } from './metadata/MetadataCollector';
import { CompressionManager } from './compression/CompressionManager';
import { ExportManager } from './export/ExportManager';
import { EvidenceBundle } from './models/EvidenceBundle';

export class EvidenceEngine {
  private page: Page;
  private emitter: AutomationEventEmitter;
  private executionId: string;
  private configurationId?: string;

  private screenshotCollector: ScreenshotCollector;
  private videoCollector: VideoCollector;
  private domSnapshotCollector: DOMSnapshotCollector;
  private networkCollector: NetworkCollector;
  private consoleCollector: ConsoleCollector;
  private storageCollector: StorageCollector;
  private timelineBuilder: TimelineBuilder;
  private metadataCollector: MetadataCollector;
  private compressionManager: CompressionManager;
  private exportManager: ExportManager;

  constructor(page: Page, executionId: string, configurationId?: string) {
    this.page = page;
    this.executionId = executionId;
    this.configurationId = configurationId;
    this.emitter = AutomationEventEmitter.getInstance();

    this.screenshotCollector = new ScreenshotCollector(page);
    this.videoCollector = new VideoCollector();
    this.domSnapshotCollector = new DOMSnapshotCollector(page);
    this.networkCollector = new NetworkCollector();
    this.consoleCollector = new ConsoleCollector();
    this.storageCollector = new StorageCollector(page);
    this.timelineBuilder = new TimelineBuilder();
    this.metadataCollector = new MetadataCollector(page);
    this.compressionManager = new CompressionManager();
    this.exportManager = new ExportManager();
  }

  public async initialize() {
    this.networkCollector.attach(this.page);
    this.consoleCollector.attach(this.page);
    
    const contextId = this.page.context().browser()?.contexts().indexOf(this.page.context()).toString() || '0';
    await this.videoCollector.registerPage(this.page, contextId);

    this.registerEventListeners();
  }

  private registerEventListeners() {
    this.emitter.on('action:started', async (data: { actionId: string; type: string }) => {
      this.timelineBuilder.startAction(data.actionId, data.type);
      this.consoleCollector.setCurrentActionId(data.actionId);
      
      const format = this.compressionManager.getScreenshotFormat();
      const shot = await this.screenshotCollector.capture('BEFORE_ACTION', data.actionId, format);
      this.timelineBuilder.linkEvidence(data.actionId, shot.id);
    });

    this.emitter.on('action:completed', async (data: { actionId: string; status: string }) => {
      const format = this.compressionManager.getScreenshotFormat();
      const shot = await this.screenshotCollector.capture('AFTER_ACTION', data.actionId, format);
      this.timelineBuilder.linkEvidence(data.actionId, shot.id);

      await this.domSnapshotCollector.capture(data.actionId);
      
      this.consoleCollector.setCurrentActionId(undefined);
      this.timelineBuilder.finishAction(data.actionId);
    });

    this.emitter.on('action:failed', async (data: { actionId: string; error: string }) => {
      const format = this.compressionManager.getScreenshotFormat();
      const shot = await this.screenshotCollector.capture('FAILURE', data.actionId, format);
      this.timelineBuilder.linkEvidence(data.actionId, shot.id);
      
      this.consoleCollector.setCurrentActionId(undefined);
      this.timelineBuilder.finishAction(data.actionId);
    });

    this.emitter.on('navigation:finished', async () => {
      const format = this.compressionManager.getScreenshotFormat();
      await this.screenshotCollector.capture('NAVIGATION', undefined, format);
    });
  }

  public async exportBundle(): Promise<EvidenceBundle> {
    const format = this.compressionManager.getScreenshotFormat();
    await this.screenshotCollector.capture('FINAL', undefined, format);
    
    const metadata = await this.metadataCollector.collect(this.executionId, this.configurationId);
    const storageData = await this.storageCollector.capture();

    return this.exportManager.createBundle(
      this.executionId,
      metadata,
      this.screenshotCollector.getCollection(),
      this.videoCollector.getCollection(),
      this.consoleCollector.getCollection(),
      this.networkCollector.getCollection(),
      this.timelineBuilder.getTimeline(),
      storageData,
      this.domSnapshotCollector.getSnapshots()
    );
  }
}
