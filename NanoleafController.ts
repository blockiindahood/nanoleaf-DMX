import NanoleafPanel from "./NanoleafPanel";
import axios from "axios";
import dgram from "dgram";
import Logger from "./Logger";
import {Config} from "./types/config";

export default class NanoleafController {
  ipAddress: string
  apiPort: number
  socketPort: number
  token: string
  private _panels: NanoleafPanel[] = []
  client: dgram.Socket
  logger: Logger
  config: Config

  constructor(config: Config, logger: Logger) {
    this.ipAddress = config.controller.ip;
    this.apiPort = config.controller.apiPort;
    this.socketPort = config.controller.socketPort;
    this.token = config.controller.token;
    this.client = dgram.createSocket('udp4');
    this.logger = logger;
    this.config = config;
  }

  set panels(value: NanoleafPanel[]) {
    this._panels = value;
  }

  get panels(): NanoleafPanel[] {
    return this._panels;
  }

  async init() {
    const controllerData = await axios.get(`http://${this.ipAddress}:${this.apiPort}/api/v1/${this.token}`)
    const panelIds = controllerData.data.panelLayout.layout.positionData.map((d: any) => d.panelId) as number[];
    panelIds.pop() //remove the first panel, because it is the controller

    this.logger.log('[Nanoleaf Controller]: Available Panels', panelIds);

    if(this.config.controller.autoSetupPanels){
      //only works, if panels are daysi-chained
      this.panels = panelIds.map((panelId, index) => new NanoleafPanel(panelId, 1 + index * 3, this));
    }else{
      this.panels = this.config.panels.map(d => new NanoleafPanel(d.panelId, d.dmxAddress, this));
    }

    await this.activateExtControl();
  }

  updatePanel(panel: NanoleafPanel){
    return new Promise<void>((resolve, reject) => {
      this.client.send(panel.toBuffer(), this.socketPort, this.ipAddress, (err) => {
        if (err) {
          this.logger.log(`[Nanoleaf Controller - Panel ${panel.id}]: Error sending UDP packet:`, err);
          reject(err)
        } else {
          this.logger.log(`[Nanoleaf Controller - Panel ${panel.id}]: Sending UDP packet`);
          resolve()
        }
      });
    })
  }

  async activateExtControl() {
    try {
      this.logger.log('[Nanoleaf Controller]: activating extControl...');
      await axios.put(`http://${this.ipAddress}:16021/api/v1/${this.token}/effects`, {
        write: {
          command: "display",
          animType: "extControl",
          extControlVersion: "v2"
        }
      });
      this.logger.log('[Nanoleaf Controller]: ExtControl mode activated!');
    } catch (error) {
      this.logger.log('[Nanoleaf Controller]: Failed to activate extControl mode:', error);
    }
  }
}