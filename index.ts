import {Receiver} from "sacn"
import NanoleafPanel from "./NanoleafPanel";
import * as fs from "node:fs";
import {Config} from "./config";
import NanoleafController from "./NanoleafController";

const config = JSON.parse(fs.readFileSync("config.json", "utf-8")) as Config

const sACN = new Receiver({
    universes: config.sACN.universes,
    reuseAddr: true
});

const controller = new NanoleafController(config.controller.ip, config.controller.apiPort, config.controller.socketPort, config.controller.token)
controller.panels = config.panels.map(d => new NanoleafPanel(d.panelId, d.dmxAddress, controller));

async function main() {
    await controller.activateExtControl();
    sACN.on('packet', async (packet) => {
        // check whether something has changed, with 3 channels per panel
        await Promise.all(controller.panels.map(async panel => {
            if (packet.payloadAsBuffer![panel.dmxAddress - 1] !== panel.r ||
              packet.payloadAsBuffer![panel.dmxAddress] !== panel.g ||
              packet.payloadAsBuffer![panel.dmxAddress + 1] !== panel.b) {

                panel.r = packet.payloadAsBuffer![panel.dmxAddress - 1];
                panel.g = packet.payloadAsBuffer![panel.dmxAddress];
                panel.b = packet.payloadAsBuffer![panel.dmxAddress + 1];
                await controller.updatePanel(panel);
            }
        }))
    });

}

main();