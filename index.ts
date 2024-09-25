import axios from "axios"
import {Receiver} from "sacn"
import NanoleafPanel from "./NanoleafPanel";
import * as fs from "node:fs";
import {Config} from "./config";

// load config
const config = JSON.parse(fs.readFileSync("config.json", "utf-8")) as Config

const NANOLEAF_IP_ADDRESS = config.controller.ip;
const NANOLEAF_TOKEN = config.controller.token;

const sACN = new Receiver({
    universes: [1],
    reuseAddr: true
});

const panels = config.panels.map(d => new NanoleafPanel(d.panelId, d.dmxAddress, 0, config.controller.ip, config.controller.socketPort));

main();

async function main() {
    await activateExtControl();
    sACN.on('packet', async (packet) => {
        // check whether something has changed
        // 3 channels per panel
        await Promise.all(panels.map(async panel => {
            if (packet.payloadAsBuffer![panel.dmxAddress - 1] !== panel.r ||
              packet.payloadAsBuffer![panel.dmxAddress] !== panel.g ||
              packet.payloadAsBuffer![panel.dmxAddress + 1] !== panel.b) {

                panel.r = packet.payloadAsBuffer![panel.dmxAddress - 1];
                panel.g = packet.payloadAsBuffer![panel.dmxAddress];
                panel.b = packet.payloadAsBuffer![panel.dmxAddress + 1];
                await panel.update()
            }
        }))
    });

}

//Activate extControl mode
async function activateExtControl() {
    try {
        await axios.put(`http://${NANOLEAF_IP_ADDRESS}:16021/api/v1/${NANOLEAF_TOKEN}/effects`, {
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
