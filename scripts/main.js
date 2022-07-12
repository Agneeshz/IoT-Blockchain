const { ethers } = require("ethers");
const Gpio = require("pigpio").Gpio;

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6 / 34321;

const trigger = new Gpio(23, { mode: Gpio.OUTPUT });
const echo = new Gpio(24, { mode: Gpio.INPUT, alert: true });
const channel = new Gpio(21, { mode: Gpio.INPUT, alert: true });

trigger.digitalWrite(0); // Make sure trigger is low


const flameDetect = () => {
  channel.on("alert", (level, tick) => {
    if (level == 1) {
      console.log("Flame Detected");
      const provider = new ethers.providers.JsonRpcProvider(
        "https://eth-goerli.g.alchemy.com/v2/cOA5FqnMLYM3DOSMIy8hDIkLkZcYAu5n"
      );
      const sender = "0x7e835D3A034a15dE59FEffb2C50af3D12177A0EF";

      const privateKey =
        "db8a1e2473c15d96986f4efe600cae65874b21dfeb0372c736cc6b0b4835946a";
      const wallet = new ethers.Wallet(privateKey, provider);

      const ABI = ["function flameDetect() public pure returns (bool inspect)"];
      let inspect;

      const address = "0x5074Bd946b8F2dcb7F3fF6B27cAD67A983116AB6";
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

        const contractWithWallet = contract.connect(wallet);

        inspect = await contractWithWallet.flameDetect();

        if (inspect == true) {
          const trans = async () => {
            console.log(
              "\nDANGER: Flame has been detected. Goerli ETH tokens will be transferred to the receiver"
            );
            const receiver = "0x010A2621A111B338d82Dc20b46943199263DbA16";
            const balance2 = await provider.getBalance(receiver);
            console.log("Address of receiver: ", receiver);
            console.log(
              "\nBalance of Receiver: ",
              ethers.utils.formatEther(balance2),
              "Goerli ETH"
            );
            const tx = await wallet.sendTransaction({
              to: receiver,
              value: ethers.utils.parseEther("0.0095"),
            });
            await tx.wait();
            console.log(tx);

            const senderBalanceAfter = await provider.getBalance(sender);
            const receiverBalanceAfter = await provider.getBalance(receiver);

            console.log(
              "\nSender balance after transaction: ",
              ethers.utils.formatEther(senderBalanceAfter),
              "Goerli ETH"
            );
            console.log(
              "\nReceiver balance after transaction: ",
              ethers.utils.formatEther(receiverBalanceAfter),
              "Goerli ETH"
            );
            console.log(
              "\nAmount Transferred: ",
              0.0095,
              "Goerli ETH"
            );
          };
          trans();
        }
      };
      calc();
    }
  });
};

const watchHCSR04 = () => {
  let startTick;

  echo.on("alert", (level, tick) => {
    if (level == 1) {
      startTick = tick;
    } else {
      let dist;
      let check;
      const endTick = tick;
      const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      dist = diff / 2 / MICROSECDONDS_PER_CM;
      const d = Number(dist.toFixed(0));
      let threshold = 6;
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

          const address = "0x5074Bd946b8F2dcb7F3fF6B27cAD67A983116AB6";
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

            const contractWithWallet = contract.connect(wallet);

            let flag = await contractWithWallet.getDistance(d);

            console.log(
              "WARNING: the smart contract has been triggered, distance not ideal",
              "\nDanger threshold met: ",
              flag,
              "\nThe distance recorded: ",
              d,
              " cm"
            );

            if (flag == true) {
              const trans = async () => {
                console.log(
                  "\nThe danger threshold has now been met. Goerli ETH tokens will be transferred to the receiver"
                );
                const receiver = "0x010A2621A111B338d82Dc20b46943199263DbA16";
                const balance2 = await provider.getBalance(receiver);
                console.log("Address of receiver: ", receiver);
                console.log(
                  "\nBalance of Receiver: ",
                  ethers.utils.formatEther(balance2),
                  "Goerli ETH"
                );
                const tx = await wallet.sendTransaction({
                  to: receiver,
                  value: ethers.utils.parseEther("0.0001"),
                });
                await tx.wait();
                console.log(tx);

                const senderBalanceAfter = await provider.getBalance(sender);
                const receiverBalanceAfter = await provider.getBalance(
                  receiver
                );

                console.log(
                  "\nSender balance after transaction: ",
                  ethers.utils.formatEther(senderBalanceAfter),
                  "Goerli ETH"
                );
                console.log(
                  "\nReceiver balance after transaction: ",
                  ethers.utils.formatEther(receiverBalanceAfter),
                  "Goerli ETH"
                );
                console.log(
                  "\nAmount Transferred: ",
                  0.0001,
                  "Goerli ETH"
                );
              };
              trans();
            }
          };
          calc();
        }
        check = d;
      };
      main();
    }
  });
};

watchHCSR04();
flameDetect();

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

// Trigger a distance measurement once per second
setInterval(() => {
  trigger.trigger(10, 1); // Set trigger high for 10 microseconds
}, 1000);
