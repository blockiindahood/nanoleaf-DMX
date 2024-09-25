export interface Config {
    logging:    boolean;
    sACN: sACN
    controller: Controller;
    panels:     Panel[];
}

export interface sACN {
    universes: number[];
    iface:     string;
}

export interface Controller {
    ip:         string;
    apiPort:       number;
    socketPort: number;
    token:      string;
    autoSetupPanels: boolean;
}

export interface Panel {
    panelId:    number;
    dmxAddress: number;
}
