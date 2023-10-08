# Tendermint RPC Discovery Tool

This tool discovers TM RPCs on Vega Mainnet1 by checking the default TM RPC port on a list of IPs.

If you would like to discover RPCs on other networks, simple replace the ips in the `initialIps` array with the IPs of some existing TM RPCs on your network. This script does not verify the network so do not mix IPs from multiple networks.

## Usage

[Install nodejs](https://nodejs.org/en/download/package-manager)

```
git pull https://github.com/Ed-Commodum/vega-discover-tm-rpcs.git
cd vega-discover-tm-rpcs
node index.js
```