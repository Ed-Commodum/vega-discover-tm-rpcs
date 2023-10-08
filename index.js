const EventEmitter = require('node:events');

const initialIps = [ "165.232.126.207", "167.71.44.7", "164.92.138.136", "185.246.86.71", "134.122.64.6", "39.59.237.19" ];
const inProgress = [];
const successful = []
const failed = [];

const checker = new EventEmitter();
checker.numRunning = 0;
checker.numChecked = 0;
checker.numFailures = 0;
checker.numSuccesses = 0;

const main = () => {

    const intervalId = setInterval(() => {
        console.log("Checking peer ips...")
    }, 3000);

    checker.on('newIp', checkIp);
    checker.on("done", () => {
        clearInterval(intervalId);
        console.log("Done.");
        console.log(`${checker.numChecked} IPs checked.`);
        console.log(`${checker.numFailures} failures.`);
        console.log(`${checker.numSuccesses} successes.`);

        console.log("Available RPCs detected at the following addresses: ");
        for (let ip of successful) {
            console.log(`http://${ip}:26657`);
        }
    });

    for (let ip of initialIps) {
        checkIp(ip);
    }

};

const checkIp = async (ip) => {

    checker.numRunning++;

    console.log(`Checking for available TM RPC at ip: ${ip}`);
    const rpcAddr = `http://${ip}:26657/net_info`
    inProgress.push(ip);

    const res = await fetch(rpcAddr).catch((err) => {
        failed.push(ip);
        inProgress.splice(inProgress.indexOf(ip), 1);
        checker.numRunning--;
        checker.numChecked++;
        checker.numFailures++;
        if (checker.numRunning == 0) {
            checker.emit("done");
        }
    });
    if (!res) return;
    const json = await res.json();

    if (json.result.peers) {
        successful.push(ip);
        inProgress.splice(inProgress.indexOf(ip), 1);
    }

    for (let peer of json.result.peers) {
        if ( inProgress.includes(peer.remote_ip) || successful.includes(peer.remote_ip) || failed.includes(peer.remote_ip) ) {
            continue
        }
        checker.emit("newIp", peer.remote_ip);
    }

    checker.numRunning--;
    checker.numChecked++;
    checker.numSuccesses++;
    if (checker.numRunning == 0) {
        checker.emit("done");
    }

}

main();