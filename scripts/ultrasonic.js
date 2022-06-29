import Sonar from "raspi-hc-sr04";

const Web3 = require("web3");
const EthereumTx = require("ethereumjs-tx");

export default function Home() {
  let sonar = new Sonar({ triggerPin: 4, echoPin: 31 });
  let distance;
  sonar.read((duration) => {
    distance = ((343.0 * duration) / 10000) * 0.5;
    console.log(`duration: ${duration} distance: ${distance}cm`);
  });

  let threshold = 3;
  if (distance < threshold) {
    instantiateContract = (args) => {
      const infura = `https://ropsten.infura.io/v3/1dcd4c1b8977447f9cf7b925ba7a57e4`;
      const web3 = new Web3(new Web3.providers.HttpProvider(infura));
      web3.eth.defaultAccount = process.env.ACCOUNT_ADDRESS;
      var abi = process.env.ABI;
      var pk = process.env.PRIVATEKEY; // private key of your account
      var toadd = process.env.WALLET_DESTINATION;
      var address = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; //Contract Address
      web3.eth.getTransactionCount(
        web3.eth.defaultAccount,
        function (err, nonce) {
          console.log("nonce value is ", nonce);
          const contract = new web3.eth.Contract(JSON.parse(abi), address, {
            from: web3.eth.defaultAccount,
            gas: 3000000,
          });
          const functionAbi = contract.methods.mymethodname(args).encodeABI();
          var details = {
            nonce: nonce,
            gasPrice: web3.utils.toHex(web3.utils.toWei("47", "gwei")),
            gas: 300000,
            to: address,
            value: 0,
            data: functionAbi,
          };
          const transaction = new EthereumTx(details);
          transaction.sign(Buffer.from(pk, "hex"));
          var rawData = "0x" + transaction.serialize().toString("hex");
          web3.eth
            .sendSignedTransaction(rawData)
            .on("transactionHash", function (hash) {
              console.log(["transferToStaging Trx Hash:" + hash]);
            })
            .on("receipt", function (receipt) {
              console.log(["transferToStaging Receipt:", receipt]);
            })
            .on("error", console.error);
        }
      );
    };
    const d = await distanceContract.getDistance();
    console.log("We got the distance", d);
  }
}
