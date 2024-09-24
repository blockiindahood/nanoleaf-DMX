import axios from "axios"
import {Receiver} from "sacn"
import NanoleafPanel from "./NanoleafPanel";

const NANOLEAF_IP_ADDRESS = '10.1.50.181';
const NANOLEAF_TOKEN = 'p49Kg95gDSIh3u1ft3TvFXxgH47qQM4d'; // Replace with your Nanoleaf Token
const NANOLEAF_UDP_PORT = 60222;

const sACN = new Receiver({
    universes: [1],
    iface: "10.200.1.245",
    reuseAddr: true
});

const panels = [
    new NanoleafPanel(15765, 1, 0, NANOLEAF_IP_ADDRESS, NANOLEAF_UDP_PORT),
    new NanoleafPanel(36279, 5, 0, NANOLEAF_IP_ADDRESS, NANOLEAF_UDP_PORT),
    new NanoleafPanel(49111, 9, 0, NANOLEAF_IP_ADDRESS, NANOLEAF_UDP_PORT),
    new NanoleafPanel(39730, 13, 0, NANOLEAF_IP_ADDRESS, NANOLEAF_UDP_PORT),
    new NanoleafPanel(37679, 17, 0, NANOLEAF_IP_ADDRESS, NANOLEAF_UDP_PORT),
    new NanoleafPanel(6621, 21, 0, NANOLEAF_IP_ADDRESS, NANOLEAF_UDP_PORT),
    new NanoleafPanel(9759, 25, 0, NANOLEAF_IP_ADDRESS, NANOLEAF_UDP_PORT),
    new NanoleafPanel(54503, 29, 0, NANOLEAF_IP_ADDRESS, NANOLEAF_UDP_PORT),
    new NanoleafPanel(59703, 33, 0, NANOLEAF_IP_ADDRESS, NANOLEAF_UDP_PORT),
]

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
