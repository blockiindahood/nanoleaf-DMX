import dgram from "dgram";

export default class NanoleafPanel {
  client: dgram.Socket;
  id: number;
  dmxAddress: number;
  r: number = 0;
  g: number = 0;
  b: number = 0;
  transitionTime: number;
  controller_IP: string;
  controller_PORT: number;

  constructor(id: number, dmxAddress: number, transitionTime: number, controller_IP: string, controller_PORT: number) {
    this.id = id;
    this.dmxAddress = dmxAddress;
    this.transitionTime = transitionTime;
    this.client = dgram.createSocket('udp4');
    this.controller_IP = controller_IP;
    this.controller_PORT = controller_PORT;
  }

  public update(){
    return new Promise<void>((resolve, reject) => {
      this.client.send(this.toBuffer(), this.controller_PORT, this.controller_IP, (err) => {
        if (err) {
          console.error('[Nanoleaf Panel ${this.id}]: Error sending UDP packet:', err);
          reject(err)
        } else {
          //console.log(`[Nanoleaf Panel ${this.id}]: updated successfully via UDP`);
          resolve()
        }
      });
    })
  }

  private toBuffer() {
    const buffer = Buffer.alloc(10);  // 2 bytes for nPanels + 8 bytes per panel * 1 panels

    // nPanels: 1 panels
    buffer.writeUInt16BE(1, 0);

    // Panel 1: ID 118, RGB(255, 0, 255) dimmed to 50% (so 128, 0, 128), transitionTime = 1200ms
    buffer.writeUInt16BE(this.id, 2);   // Panel ID
    buffer.writeUInt8(this.r, 4); // R (dimmed to 50%)
    buffer.writeUInt8(this.g, 5); // G
    buffer.writeUInt8(this.b, 6); // B
    buffer.writeUInt8(0, 7);                 // W (ignored)
    buffer.writeUInt16BE(0, 8);             // Transition time (in Big Endian)

    return buffer
  }
}