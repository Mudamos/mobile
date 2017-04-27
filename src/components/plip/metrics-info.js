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
      <Progress signaturesRequired={signaturesRequired} signaturesCount={signaturesCount} />

      <View style={styles.infoContainer}>
        <TargetPercentage signaturesRequired={signaturesRequired} signaturesCount={signaturesCount} />
        <SignaturesCount signaturesCount={signaturesCount} />
        {enabled && <RemainingDays finalDate={finalDate} />}
        {!enabled && renderPlipFinished()}
      </View>
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
  return (
    <View style={styles.full}>
      <Text style={styles.infoPercentageText}>{progressPercentage({ signaturesRequired, signaturesCount })}%</Text>
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
      <Text style={styles.infoText}>{formatNumber(count)}</Text>
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


const infoText = {
  color: "#fff",
  fontFamily: "lato",
  fontSize: 24,
};

const infoTextSubtitle = {
  color: "#c7c7c7",
  fontFamily: "lato",
  fontSize: 13,
};

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  infoPercentageText: {
    ...infoText,
    color: "#00db5e",
    fontWeight: "bold",
  },
  infoPercentageSubtitle: {
    ...infoTextSubtitle,
    color: "#00db5e",
  },
  infoText: {
    ...infoText,
  },
  infoTextSubtitle: {
    ...infoTextSubtitle,
  },
  progress: {
    height: 14,
    backgroundColor: "#484848",
  },
});
