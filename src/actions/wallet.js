export const createWallet = () => ({
  type: "WALLET_CREATE",
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
