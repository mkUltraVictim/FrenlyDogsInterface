"use strict";

 // Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

// Web3modal instance
let web3Modal;
// Chosen wallet provider given by the dialog window
let provider;
let signer;
// Address of the selected account
let selectedAccount;
let web3;

function init() {
  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "4e63b472a552481cadd3ccb6901b875b"
      }
    }
  };
  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions,
    disableInjectedProvider: false,
  });

  console.log("Web3Modal instance is", web3Modal);
}


/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  web3 = new Web3(provider);

  console.log("Web3 instance is", web3);

  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId();
  // Load chain information over an HTTP API
  const chainData = evmChains.getChain(chainId);

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  // MetaMask does not give you all accounts, only the selected account
  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];
  document.querySelector("#connected").style.display = "block";
}



/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled")
}


/**
 * Connect wallet button pressed.
 */
async function onConnect() {

  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
}

//Make transactions to buy NFT.
async function onBuy() {
  let tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress, {from: selectedAccount});
  //Confirm approval and buy
  console.log("Calling allowance")
  tokenContract.methods.allowance(selectedAccount, nftAddress).call({from: selectedAccount}, function(error, result) {
    if(error) throw error;
    if(result < parseInt(mintCost)) {
      console.log("No allowance, approving")
      approveAndBuy(tokenContract);
    } else {
      console.log("Straight to buy");
      buy();
    }
  });
}
async function approveAndBuy(tokenContract) {
  tokenContract.methods.approve(nftAddress, mintCost+"0").send({from: selectedAccount}).then(function(receipt) {
    buy();
  });
}
async function buy() {
  let nftContract = new web3.eth.Contract(nftAbi, nftAddress, {from: selectedAccount});
  nftContract.methods.buy().send({from: selectedAccount}, function(receipt) {
    console.log("Bought");
  });
}

/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-buy").addEventListener("click", onBuy);
});
