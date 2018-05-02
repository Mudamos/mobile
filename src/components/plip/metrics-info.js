import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import PropTypes from "prop-types";

import {
  any,
  clamp,
  isNil,
} from "ramda";

import {
  countTimingFunction,
  formatNumber,
  remainingDays,
  signatureEnabled,
} from "../../utils";

import {
  isNationalCause,
  isStateNationalCause,
  isUserGoals,
} from "../../models";

import locale from "../../locales/pt-BR";

import { MKProgress } from "react-native-material-kit";
import AnimateNumber from "react-native-animate-number";


const percentageFormatter = v => `${v}%`;

const noCounters = (...args) => any(isNil)(args);

const plipProgress = ({ signaturesRequired, signaturesCount }) => {
  if (!signaturesRequired || signaturesRequired == 0 || !signaturesCount) {
    return 0;
  }

  const count = signaturesCount || 0;
  const total = signaturesRequired;
  const progress = clamp(0, 1, count / total);

  return progress;
};

const progressPercentage = ({ signaturesRequired, signaturesCount }) => {
  return Math.floor(plipProgress({ signaturesRequired, signaturesCount }) * 100);
};

const messageForDaysLeft = ({ finalDate }) => {
  const days = remainingDays({ date: finalDate });
  if (days == null) return;

  if (days > 0) {
    const sufix = days > 1 ? "dias" : "dia";
    return `${formatNumber(days)} ${sufix}`;
  } else if (days === 0) {
    return locale.lastDay;
  }
};

const renderPlipFinished = () => {
  return (
    <View>
      <View style={{flex: 1, justifyContent: "flex-end"}}>
        <Text style={styles.infoTextSubtitle}>{locale.petitionEnded}</Text>
      </View>
    </View>
  );
};

const MetricsInfo = ({
  isRemainingDaysEnabled,
  plip,
  signaturesRequired,
  signaturesCount,
  totalSignaturesRequired,
  user,
  finalDate,
}) => {
  if (noCounters(signaturesRequired, totalSignaturesRequired)) return null;

  const canSign = signatureEnabled({ finalDate });
  const showGoal = canSign && !isRemainingDaysEnabled && !isNationalCause(plip);

  return (
    <View>
      <View style={styles.infoContainer}>
        <View style={isNationalCause(plip) ? styles.infoNationalCauseContainerRow : styles.infoContainerRow}>
          { !isNationalCause(plip) && <TargetPercentage
            signaturesRequired={signaturesRequired}
            signaturesCount={signaturesCount}
            append={showGoal ? "*" : ""}
          /> }
          <SignaturesCount
            canSign={canSign}
            plip={plip}
            signaturesCount={signaturesCount}
            signaturesRequired={signaturesRequired}
            showGoal={showGoal}
            user={user}
          />
          {canSign && isRemainingDaysEnabled && <RemainingDays finalDate={finalDate} />}
          {!canSign && renderPlipFinished()}
        </View>

        {
          showGoal &&
            <Text style={styles.finalGoalText}>* Nossa meta final é de {formatNumber(totalSignaturesRequired)} assinaturas</Text>
        }
      </View>

      <Progress signaturesRequired={signaturesRequired} signaturesCount={signaturesCount} />
    </View>
  );
};

MetricsInfo.propTypes = {
  finalDate: PropTypes.string.isRequired,
  isRemainingDaysEnabled: PropTypes.bool,
  plip: PropTypes.object.isRequired,
  signaturesCount: PropTypes.number,
  signaturesRequired: PropTypes.number,
  totalSignaturesRequired: PropTypes.number,
  user: PropTypes.object,
};

export default MetricsInfo;

const Progress = ({ signaturesRequired, signaturesCount }) => {
  return (
    <MKProgress
      style={styles.progress}
      progressAniDuration={1000}
      progressColor="#00db5e"
      progress={plipProgress({ signaturesRequired, signaturesCount })}
    />
  );
};

Progress.propTypes = {
  signaturesCount: PropTypes.number.isRequired,
  signaturesRequired: PropTypes.number.isRequired,
};

const TargetPercentage = ({ append, signaturesRequired, signaturesCount }) => {
  const percentage = progressPercentage({ signaturesRequired, signaturesCount });

  return (
    <View>
      <AnimateNumber
        value={percentage}
        countBy={10}
        timing={countTimingFunction}
        formatter={percentageFormatter}
        style={styles.infoPercentageText}
      />
      <Text style={styles.infoPercentageSubtitle}>da meta atual{append}</Text>
    </View>
  );
};

TargetPercentage.propTypes = {
  append: PropTypes.string,
  signaturesCount: PropTypes.number.isRequired,
  signaturesRequired: PropTypes.number.isRequired,
};

const SignaturesCount = ({ canSign, plip, showGoal, signaturesCount, signaturesRequired, user }) => {
  const count = signaturesCount;
  const goal = signaturesRequired;

  const CountView = () =>
    <AnimateNumber
      value={count}
      timing={countTimingFunction}
      formatter={formatNumber}
      style={styles.infoText}
    />;

  const getMessage = () => {
    if (isUserGoals({ user, plip })) {
      const location = isStateNationalCause(plip)
        ? user.address.state
        : user.address.city;

      return `pessoas em ${location} assinaram`;
    }

    if (isNationalCause(plip)) {
      return "pessoas assinaram no Brasil";
    }

    return canSign ? "já assinaram" : "assinaram";
  }

  const signatureMessage = getMessage();

  return (
    <View style={styles.signaturesCountContainer}>
      {
        showGoal &&
          <View style={{ alignSelf: "flex-end", flexDirection: "row", alignItems: "flex-start" }}>
            <CountView />
            <Text style={[styles.infoTextSubtitle, { alignSelf: "center", marginLeft: 5 }]}>de</Text>
            <Text style={[styles.infoText, { marginLeft: 5 }]}>{formatNumber(goal)}</Text>
          </View>
      }

      {!showGoal && <CountView />}
      <Text style={[styles.infoTextSubtitle, showGoal ? { alignSelf: "flex-end" } : null]} numberOfLines={2}>{signatureMessage}</Text>
    </View>
  );
};

SignaturesCount.propTypes = {
  canSign: PropTypes.bool,
  plip: PropTypes.object.isRequired,
  showGoal: PropTypes.bool,
  signaturesCount: PropTypes.number.isRequired,
  signaturesRequired: PropTypes.number.isRequired,
  user: PropTypes.object,
};

const RemainingDays = ({ finalDate }) => {
  return (
    <View>
      <Text style={styles.infoText}>{messageForDaysLeft({ finalDate })}</Text>
      <Text style={styles.infoTextSubtitle}>para o encerramento</Text>
    </View>
  );
};

RemainingDays.propTypes = {
  finalDate: PropTypes.string.isRequired,
};


const textShadow = {
  textShadowColor: "rgba(0,0,0, 1)",
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
};

const infoText = {
  color: "#fff",
  fontFamily: "lato",
  fontSize: 19,
  ...textShadow,
};

const infoTextSubtitle = {
  color: "rgba(255,255,255, 0.60)",
  fontFamily: "lato",
  fontSize: 12,
  ...textShadow,
};

const infoContainerRow = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

const styles = StyleSheet.create({
  finalGoalText: {
    marginTop: 10,
    textAlign: "right",

    ...infoTextSubtitle,
  },
  full: {
    flex: 1,
  },
  infoContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: "transparent",
  },
  infoContainerRow,
  infoNationalCauseContainerRow: {
    ...infoContainerRow,
    justifyContent: "space-around",
  },
  infoPercentageText: {
    ...infoText,
    color: "#fff",
    fontWeight: "bold",
  },
  infoPercentageSubtitle: {
    ...infoTextSubtitle,
  },
  infoText: {
    ...infoText,
  },
  infoTextSubtitle: {
    ...infoTextSubtitle,
  },
  progress: {
    height: 7,
    backgroundColor: "#484848",
  },
  signaturesCountContainer: {
    flex: 1,
    marginLeft: 5,
  },
});
