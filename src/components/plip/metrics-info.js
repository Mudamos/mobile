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
  formatNumber,
  remainingDays,
  signatureEnabled,
} from "../../utils";

import locale from "../../locales/pt-BR";

import { MKProgress } from "react-native-material-kit";
import AnimateNumber from "react-native-animate-number";

// slow start, slow end
const timingFunction = (interval, progress) => interval * (1 - Math.sin(Math.PI*progress)) * 10;

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
    <View style={{flex: 0.7}}>
      <View style={{flex: 1, justifyContent: "flex-end"}}>
        <Text style={styles.infoTextSubtitle}>{locale.petitionEnded}</Text>
      </View>
    </View>
  );
};

const MetricsInfo = ({ signaturesRequired, signaturesCount, finalDate }) => {
  const enabled = signatureEnabled({ finalDate });
  return (
    <View>
      <View style={styles.infoContainer}>
        <TargetPercentage signaturesRequired={signaturesRequired} signaturesCount={signaturesCount} />
        <SignaturesCount signaturesCount={signaturesCount} />
        {enabled && <RemainingDays finalDate={finalDate} />}
        {!enabled && renderPlipFinished()}
      </View>

      <Progress signaturesRequired={signaturesRequired} signaturesCount={signaturesCount} />
    </View>
  );
};

MetricsInfo.propTypes = {
  finalDate: PropTypes.string,
  signaturesCount: PropTypes.number.isRequired,
  signaturesRequired: PropTypes.number,
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
  signaturesCount: PropTypes.number,
  signaturesRequired: PropTypes.number,
};

const TargetPercentage = ({ signaturesRequired, signaturesCount }) => {
  const percentage = progressPercentage({ signaturesRequired, signaturesCount });

  return (
    <View style={styles.full}>
      <AnimateNumber
        value={percentage}
        countBy={2}
        timing={timingFunction}
        formatter={val => `${val}%`}
        style={styles.infoPercentageText}
      />
      <Text style={styles.infoPercentageSubtitle}>da meta</Text>
    </View>
  );
};

TargetPercentage.propTypes = {
  signaturesCount: PropTypes.number,
  signaturesRequired: PropTypes.number,
};

const SignaturesCount = ({ signaturesCount }) => {
  const count = signaturesCount || 0;

  return (
    <View style={{ flex: 1.5 }}>
      <AnimateNumber
        value={count}
        timing={timingFunction}
        formatter={formatNumber}
        style={styles.infoText}
      />
      <Text style={styles.infoTextSubtitle}>já assinaram</Text>
    </View>
  );
};

SignaturesCount.propTypes = {
  signaturesCount: PropTypes.number,
};

const RemainingDays = ({ finalDate }) => {
  return (
    <View style={{ flex: 2 }}>
      <Text style={styles.infoText}>{messageForDaysLeft({ finalDate })}</Text>
      <Text style={styles.infoTextSubtitle}>para o encerramento</Text>
    </View>
  );
};

RemainingDays.propTypes = {
  finalDate: PropTypes.string,
};


const textShadow = {
  textShadowColor: "rgba(0,0,0, 1)",
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
};

const infoText = {
  color: "#fff",
  fontFamily: "lato",
  fontSize: 24,
  ...textShadow,
};

const infoTextSubtitle = {
  color: "rgba(255,255,255, 0.60)",
  fontFamily: "lato",
  fontSize: 13,
  ...textShadow,
};

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
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
