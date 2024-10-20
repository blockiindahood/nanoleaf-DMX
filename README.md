
# nanoleaf-sACN

A libary to control Nanoleaf (only tested with Shapes) via sACN. 

To be able to work properly, a Nanoleaf controller and at least one panel is needed.
Each panel has 3 attributes (R,G,B) and can be controlled via an unique DMX address.

Feel free to contact me via [eMail](mailto:development@luca-hess.de) or create an issue.

The script has a config that is build up like below: 

### config.json explanation

- **`logging`**: `true` | `false`  
  Enables or disables logging. If set to `true`, logs are created during the program's execution.

#### sACN Settings

- **`sACN`**: Object containing the settings for sACN communication.
  - **`universes`**: `[1]`  
    List of universes used for sACN communication. In this example, universe `1` is used.
  - **`iface`**: `"10.200.1.245"`  
    The IP address of the network interface used to receive sACN data.

#### Controller Settings

- **`controller`**: Object containing the settings for the Nanoleaf controller.
  - **`ip`**: `"10.1.50.181"`  
    The IP address of the Nanoleaf controller to be targeted.
  - **`apiPort`**: `16021`  
    The port used for API communication with the Nanoleaf device.
  - **`socketPort`**: `60222`  
    The port used for the socket connection to receive data.
  - **`token`**: `"abc"`  
    Authentication token required for connecting to the Nanoleaf device.       **Note**: Treat this token like a password and store it securely.
    It has to be generated via the following instructions: https://forum.nanoleaf.me/docs (5.1.1)
  - **`autoSetupPanels`**: `true` | `false`  
    If set to `true`, the configuration of panels will be done automatically.
    **Note**: The Panels Settings are not being used if set to true!
  - **`autoSetupDMXStartAddress`**: `1`  
    Specifies the starting DMX address for automatic configuration.
    **Note:** Each panel has 3 attributes: R,G,B

#### Panels Settings (Only used when autoSetupPanels is false!)

- **`panels`**: Array of panel configurations.
  - **`panelId`**: `15765`  
    The unique ID of the Nanoleaf panel to be controlled.
    (IDs can be found via the API https://forum.nanoleaf.me/docs (5.2) or via the logging function. They'l get listed at the start of the program.)
  - **`dmxAddress`**: `1`  
    The DMX address assigned to this panel. This address determines which sACN 
    data is applied to the panel. **Note:** Each panel has 3 attributes: R,G,B



## Installation

```bash
  git clone https://github.com/blockiindahood/nanoleaf-sACN.git
  nanoleaf-sACN
  npm i
```
    
## Deployment

To deploy this project use either pm2 or simply just node.

```bash
  npm run build
  npm run start
```
or
```bash
  npm install pm2 -g
  pm2 start dist/index.js
```

## Acknowledgements

 - [sACN JS Libary](https://github.com/k-yle/sACN)
 - [Nanoleaf API](https://forum.nanoleaf.me/docs)


## License

[MIT](https://choosealicense.com/licenses/mit/)

