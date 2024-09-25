export interface Config {
    sACN: sACN
    controller: Controller;
    panels:     Panel[];
}

export interface sACN {
    universes: number[];
}

export interface Controller {
    ip:         string;
    apiPort:       number;
    socketPort: number;
    token:      string;
}

export interface Panel {
    panelId:    number;
    dmxAddress: number;
}
