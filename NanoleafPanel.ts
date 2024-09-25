import NanoleafController from "./NanoleafController";

export default class NanoleafPanel {
  id: number;
  dmxAddress: number;
  r: number = 0;
  g: number = 0;
  b: number = 0;
  controller: NanoleafController

  constructor(id: number, dmxAddress: number, controller: NanoleafController) {
    this.id = id;
    this.dmxAddress = dmxAddress;
    this.controller = controller;
  }

  toBuffer() {
    const buffer = Buffer.alloc(10);    // 2 bytes for nPanels + 8 bytes per panel * 1 panels

    buffer.writeUInt16BE(1, 0);         // nPanels: 1 panels (how many panels being updated with this buffer)

    buffer.writeUInt16BE(this.id, 2);   // Panel ID (in Big Endian)
    buffer.writeUInt8(this.r, 4);       // R
    buffer.writeUInt8(this.g, 5);       // G
    buffer.writeUInt8(this.b, 6);       // B
    buffer.writeUInt8(0, 7);            // W (ignored)
    buffer.writeUInt16BE(0, 8);         // Transition time (in Big Endian)

    return buffer
  }
}