import {Receiver} from "sacn"
import * as fs from "node:fs";
import {Config} from "./config";
import NanoleafController from "./NanoleafController";
import Logger from "./Logger";

const config = JSON.parse(fs.readFileSync("config.json", "utf-8")) as Config
const logger = new Logger(config.logging);

const sACN = new Receiver({
    universes: config.sACN.universes,
    iface: config.sACN.iface,
    reuseAddr: true
});

const controller = new NanoleafController(config, logger)

async function main() {
    await controller.init()

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