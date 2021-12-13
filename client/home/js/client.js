import { ethers } from "./ether.js";
import {nftAddress, tokenAddress, mintCost, nftAbi, tokenAbi, url, buyTypeDiv} from "./data.js";

let provider;
let signer;
let accounts;
let connected = "none";

//Connect to metamask wallet if applicable
async function connectMetamask() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    connected = "meta";
}

//Change UI to select buy with metamask or wallet connect
async function buy() {
    buyTypeDiv.style.display = "inline-block";
}

//Approve transfer using metamask
async function approveMeta(tokenContract) {
    let tx = await tokenContract.approve(nftAddress, mintCost+"0");
}

//Approve transfer if needed using metamask
async function confirmApprovalMeta(account, tokenContract) {
    console.log("account: ",account," ",tokenAddress," ",nftAddress);
    let allowance = await tokenContract.allowance(account, nftAddress);
    if(allowance < mintCost) await approveMeta(tokenContract);
}

//Buy NFT using metamask
async function buyMeta() {
    await connectMetamask();
    accounts = await ethereum.request({method: 'eth_requestAccounts'});
    let tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider).connect(signer);
    let account = accounts[0];
    await confirmApprovalMeta(account, tokenContract);
    let nftContract = new ethers.Contract(nftAddress, nftAbi, provider).connect(signer);
    console.log("Approved token transfer");
    let tx = nftContract.buy();
    console.log("bought");
}

//Buy NFT using wallet connect TODO
async function buyWalletconnect() {
    
}

window.buy = buy;
window.buyMeta = buyMeta;
window.buyWalletconnect = buyWalletconnect;

async function init() {
    if(window.ethereum != undefined) accounts = await ethereum.request({ method: 'eth_requestAccounts' });
}

init();