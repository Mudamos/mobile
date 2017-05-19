import React, { PropTypes } from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  clamp,
} from "ramda";

import {
  countTimingFunction,
  formatNumber,
  remainingDays,
  signatureEnabled,
} from "../../utils";

import locale from "../../locales/pt-BR";

import { MKProgress } from "react-native-material-kit";
import AnimateNumber from "react-native-animate-number";


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
  signaturesRequired,
  signaturesCount,
  finalDate,
}) => {
  const canSign = signatureEnabled({ finalDate });

  return (
    <View>
      <View style={styles.infoContainer}>
        <TargetPercentage signaturesRequired={signaturesRequired} signaturesCount={signaturesCount} />
        <SignaturesCount
          canSign={canSign}
          signaturesCount={signaturesCount}
          signaturesRequired={signaturesRequired}
          showGoal={canSign && !isRemainingDaysEnabled}
        />
        {canSign && isRemainingDaysEnabled && <RemainingDays finalDate={finalDate} />}
        {!canSign && renderPlipFinished()}
      </View>

      <Progress signaturesRequired={signaturesRequired} signaturesCount={signaturesCount} />
    </View>
  );
};

MetricsInfo.propTypes = {
  finalDate: PropTypes.string.isRequired,
  isRemainingDaysEnabled: PropTypes.bool,
  signaturesCount: PropTypes.number.isRequired,
  signaturesRequired: PropTypes.number.isRequired,
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

const TargetPercentage = ({ signaturesRequired, signaturesCount }) => {
  const percentage = progressPercentage({ signaturesRequired, signaturesCount });

  return (
    <View>
      <AnimateNumber
        value={percentage}
        countBy={2}
        timing={countTimingFunction}
        formatter={val => `${val}%`}
        style={styles.infoPercentageText}
      />
      <Text style={styles.infoPercentageSubtitle}>da meta atual</Text>
    </View>
  );
};

TargetPercentage.propTypes = {
  signaturesCount: PropTypes.number.isRequired,
  signaturesRequired: PropTypes.number.isRequired,
};

const SignaturesCount = ({ canSign, showGoal, signaturesCount, signaturesRequired }) => {
  const count = signaturesCount;
  const goal = signaturesRequired;

  const CountView = () =>
    <AnimateNumber
      value={count}
      timing={countTimingFunction}
      formatter={formatNumber}
      style={styles.infoText}
    />;

  return (
    <View style={[(showGoal ? { marginLeft: 5 } : {})]}>
      {
        showGoal &&
          <View style={{flexDirection: "row", alignItems: "flex-start"}}>
            <CountView />
            <Text style={[styles.infoTextSubtitle, { alignSelf: "center", marginLeft: 5 }]}>de</Text>
            <Text style={[styles.infoText, { marginLeft: 5 }]}>{formatNumber(goal)}</Text>
          </View>
      }

      {!showGoal && <CountView />}
      <Text style={styles.infoTextSubtitle}>{canSign ? "já assinaram" : "assinaram"}</Text>
    </View>
  );
};

SignaturesCount.propTypes = {
  canSign: PropTypes.bool,
  showGoal: PropTypes.bool,
  signaturesCount: PropTypes.number.isRequired,
  signaturesRequired: PropTypes.number.isRequired,
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

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "transparent",
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
});
