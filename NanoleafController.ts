import NanoleafPanel from "./NanoleafPanel";
import axios from "axios";
import dgram from "dgram";

export default class NanoleafController {
  ipAddress: string
  apiPort: number
  socketPort: number
  token: string
  private _panels: NanoleafPanel[] = []
  client: dgram.Socket

  constructor(ipAddress: string, apiPort: number, socketPort: number, token: string) {
    this.ipAddress = ipAddress;
    this.apiPort = apiPort;
    this.socketPort = socketPort;
    this.token = token;
    this.client = dgram.createSocket('udp4');
  }

  set panels(value: NanoleafPanel[]) {
    this._panels = value;
  }

  get panels(): NanoleafPanel[] {
    return this._panels;
  }

  updatePanel(panel: NanoleafPanel){
    return new Promise<void>((resolve, reject) => {
      this.client.send(panel.toBuffer(), this.socketPort, this.ipAddress, (err) => {
        if (err) {
          console.error('[Nanoleaf Controller - Panel ${this.id}]: Error sending UDP packet:', err);
          reject(err)
        } else {
          resolve()
        }
      });
    })
  }

  async activateExtControl() {
    try {
      console.log('[Nanoleaf Controller]: activating extControl...');
      await axios.put(`http://${this.ipAddress}:16021/api/v1/${this.token}/effects`, {
        write: {
          command: "display",
          animType: "extControl",
          extControlVersion: "v2"
        }
      });
      console.log('[Nanoleaf Controller]: extControl mode activated!');
    } catch (error) {
      console.error('[Nanoleaf Controller]: failed to activate extControl mode:', error);
    }
  }
}