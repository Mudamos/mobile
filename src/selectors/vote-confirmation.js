import { compose, prop } from "ramda";

const baseVoteConfirmation = prop("voteConfirmation");

export const isSendingVoteConfirmation = compose(
  prop("isSaving"),
  baseVoteConfirmation,
);

export const isSendingVoteCodeConfirmation = isSendingVoteConfirmation;
