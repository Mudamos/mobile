const isErrorAlreadySigned = (e) => e.errorCode === 1019;
const isErrorSignWallet = (e) => e.errorCode === 1024;
const isErrorSignWalletNotFound = (e) => e.errorCode === 1020;

const isInvalidWallet = (e) =>
  isErrorSignWallet(e) || isErrorSignWalletNotFound(e);

export default function ApiError() {
  return {
    isErrorAlreadySigned,
    isErrorSignWallet,
    isErrorSignWalletNotFound,
    isInvalidWallet,
  };
}
