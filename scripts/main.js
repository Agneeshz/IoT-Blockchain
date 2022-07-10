const { ethers } = require("ethers");
let dist;

const Gpio = require("pigpio").Gpio;

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6 / 34321;

const trigger = new Gpio(23, { mode: Gpio.OUTPUT });
const echo = new Gpio(24, { mode: Gpio.INPUT, alert: true });

trigger.digitalWrite(0); // Make sure trigger is low

let check;
const watchHCSR04 = () => {
  let startTick;

  echo.on("alert", (level, tick) => {
    if (level == 1) {
      startTick = tick;
    } else {
      const endTick = tick;
      const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      dist = diff / 2 / MICROSECDONDS_PER_CM;
      const d = Number(dist.toFixed(0));
      let threshold = 6;
      if (d > threshold) console.log(d, "cm");

      // if(d!=dist)
      // {
      // console.log("hi");
      const main = async () => {
        if (d < threshold && check != d) {
          const provider = new ethers.providers.JsonRpcProvider(
            "https://eth-goerli.g.alchemy.com/v2/cOA5FqnMLYM3DOSMIy8hDIkLkZcYAu5n"
          );
          const sender = "0x7e835D3A034a15dE59FEffb2C50af3D12177A0EF";

          const privateKey =
            "db8a1e2473c15d96986f4efe600cae65874b21dfeb0372c736cc6b0b4835946a";
          const wallet = new ethers.Wallet(privateKey, provider);

          const ABI = [
            "function getDistance(uint256 dis) view public returns (bool flag)",
          ];

          const address = "0x99762A143A33444F0a1D72F3dcb6642178d50dB3";
          const contract = new ethers.Contract(address, ABI, provider);
          const calc = async () => {
            const balance1 = await provider.getBalance(sender);
            console.log("\nReading contract: ", address, "\n");
            console.log("Address of sender: ", sender, "\n");
            console.log(
              "Balance of sender: ",
              ethers.utils.formatEther(balance1),
              "Goerli ETH\n"
            );

            const contractWithWallet =  contract.connect(wallet);

            const flag = await contractWithWallet.getDistance(d);

            console.log(
              "WARNING: the smart contract has been triggered, distance not ideal",
              "\nDanger threshold met: ",
              flag,
              "\nThe distance recorded: ",
              d,
              " cm"
            );
          };
          if(flag==true)
          {
            const trans = async () => {
              console.log("\nThe danger threshold has now been met. Goerli ETH tokens will be transferred to the receiver")
              const receiver = "0x010A2621A111B338d82Dc20b46943199263DbA16"
              const balance2 = await provider.getBalance(receiver)
              console.log("Address of receiver: ", receiver)
              console.log("\nBalance of Receiver: ", ethers.utils.formatEther(balance2))
              const tx = await wallet.sendTransaction({
                to: receiver,
                value: ethers.utils.parseEther("0.001")
              })
              await tx.wait()
              console.log(tx)

              const senderBalanceAfter = await provider.getBalance(sender)
              const receiverBalanceAfter = await provider.getBalance(receiver)

              console.log("\nSender balance after transaction: ", ethers.utils.formatEther(senderBalanceAfter))
              console.log("\nReceiver balance after transaction: ", ethers.utils.formatEther(receiverBalanceAfter))
            }
            trans();
          }
          calc();
        }
        check = d;
      };
      main();
    }
  });
};

if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}

process.on("SIGINT", function () {
  //graceful shutdown
  console.log("Measurement stopped by user.");
  process.exit();
});

watchHCSR04();
// Trigger a distance measurement once per second
setInterval(() => {
  trigger.trigger(10, 1); // Set trigger high for 10 microseconds
}, 1000);
