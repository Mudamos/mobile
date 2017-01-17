const isErrorSignWallet = e => e.errorCode === 1024;
const isErrorSignWalletNotFound = e => e.errorCode === 1020;

const isInvalidWallet = e => isErrorSignWallet(e) || isErrorSignWalletNotFound(e);

export default function ApiError() {
  return {
    isErrorSignWallet: isErrorSignWallet,
    isErrorSignWalletNotFound: isErrorSignWalletNotFound,
    isInvalidWallet: isInvalidWallet,
  };
}
