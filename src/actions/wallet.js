export const createWallet = payload => ({
  type: "WALLET_CREATE",
  payload,
});

export const creatingWallet = isCreating => ({
  type: "WALLET_CREATING",
  payload: { isCreating },
});

export const createWalletError = error => ({
  type: "WALLET_CREATE_ERROR",
  payload: { error },
});

export const walletAvailable = hasWallet => ({
  type: "WALLET_AVAILABLE",
  payload: { hasWallet },
});

export const existsLocalWallet = () => ({
  type: "WALLET_HAS_LOCAL",
});
