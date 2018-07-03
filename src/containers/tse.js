import { connect } from "react-redux";

import {
  navigateBack,
  voteCardIdAcquired,
} from "../actions";

import {
  currentUser,
} from "../selectors";

import {
  fromISODate,
  log,
  logError,
} from "../utils";

import TSELayout from "../components/tse-layout";


const TSE_URL = "http://apps.tse.jus.br/saae/consultaNomeDataNascimento.do";

const reactNativePostMessageBugHack = `
  var patchPostMessageFunction = function() {
    var originalPostMessage = window.postMessage;

    var patchedPostMessage = function(message, targetOrigin, transfer) {
      originalPostMessage(message, targetOrigin, transfer);
    };

    patchedPostMessage.toString = function() {
      return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
    };

    window.postMessage = patchedPostMessage;
  };

  patchPostMessageFunction();
`;

const jsCode = user => {
  return `
    ${reactNativePostMessageBugHack}

    (function() {
      function fillOutForm() {
        var nameField = document.getElementsByName("nomeEleitor")[0];
        var birthField = document.getElementsByName("dataNascimento")[0];
        const userName = ${user.name}
        const userBirthdate = ${user.birthdate && fromISODate(user.birthdate)}
        if (userName && nameField && !nameField.value) nameField.value = userName;
        if (userBirthdate && birthField && !birthField.value) birthField.value = userBirthdate;
      }
      fillOutForm();

      function removePrint() {
        var printBtn = document.getElementById("botoes_index_certidao");
        if (printBtn) printBtn.remove();
      }
      removePrint();

      function getVoteCardId() {
        var labels = document.getElementsByClassName("label_1");

        var isVoteCardLabel = function(text) {
          return /título de eleitor/gi.test(text);
        };

        var getVoteCardIdFromLabel = function(label) {
          var textNode = label.nextSibling;
          if (!textNode) return;

          var content = textNode.textContent;
          return (content || "").trim();
        };

        for (var i = 0; i < labels.length; i++) {
          var label = labels[i];
          if (isVoteCardLabel(label.textContent)) {
            var voteCardId = getVoteCardIdFromLabel(label);
            if (voteCardId) return voteCardId;
          }
        }
      }

      function postVoteCardId() {
        var voteCardId = getVoteCardId();

        if (voteCardId) {
          var message = JSON.stringify({voteCardId: voteCardId});
          window.postMessage(message, "*");
        }
      }

      setTimeout(postVoteCardId, 500);
    })();
  `;
};

const mapStateToProps = state => ({
  injectedJavaScript: jsCode(currentUser(state)),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(navigateBack()),
  onMessage: event => {
    const message = event.nativeEvent.data;

    log(`webView: ${message}`);

    try {
      const { voteCardId } = JSON.parse(message);
      log(voteCardId);

      if (/^\d{12}$/.test(voteCardId)) {
        log("payload contains voteCardId");

        dispatch(voteCardIdAcquired(voteCardId));
        dispatch(navigateBack());
      }
    } catch(e) {
      logError(e);
    }
  },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,

  source: { uri: TSE_URL },
});


export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(TSELayout);
