export interface Config {
    controller: Controller;
    panels:     Panel[];
}

export interface Controller {
    ip:         string;
    port:       number;
    socketPort: number;
    token:      string;
}

export interface Panel {
    panelId:    number;
    dmxAddress: number;
}
