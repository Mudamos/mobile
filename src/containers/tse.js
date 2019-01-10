import { connect } from "react-redux";

import {
  navigateBack,
  voteCardIdAcquired,
} from "../actions";

import {
  log,
  logError,
} from "../utils";

import TSELayout from "../components/tse-layout";

const TSE_URL = "http://www.tse.jus.br/eleitor/servicos/titulo-de-eleitor/titulo-e-local-de-votacao/consulta-por-nome#form-consultar-local-votacao";

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

const jsCode = ({ birthdate, name }) => {
  return `
    ${reactNativePostMessageBugHack}

    (function() {
      function fillOutForm() {
        var nameField = document.getElementsByName("nomeTituloEleitor")[0];
        var birthField = document.getElementsByName("dataNascimento")[0];
        const userName = "${name}";
        const userBirthdate = "${birthdate}";
        if (userName && nameField && !nameField.value) nameField.value = userName;
        if (userBirthdate && birthField && !birthField.value) birthField.value = userBirthdate;
      }
      fillOutForm();

      function removePrint() {
        var printBtn = document.getElementById("botoes_index_certidao");
        if (printBtn) printBtn.remove();
      }
      removePrint();

      document.getElementById("nav-principal").outerHTML = "";
      document.getElementById("search").outerHTML = "";
      Array.from(document.getElementsByClassName("help-block")).forEach(
        (element, index, array) => {
          element.remove();
        }
      );

      const getVoteCardId = () => {
        const labels = document.getElementById("resposta-local-votacao");

        const nodes = labels.childNodes;

        const isVoteCard = text => {
          return /Inscrição: [0-9]{12}/gi.test(text);
        };

        const getVoteCard = text => {
          return text.match(/[0-9]{12}/g)[0];
        };

        for (let i = 0; i < nodes.length; i++) {
          const content = nodes[i].innerHTML;
          if (isVoteCard(content)) {
            const voteCardId = getVoteCard(content);

            if (voteCardId) {
              return voteCardId;
            }
          }
        }
      };

      const postVoteCardId = () => {
        const voteCardId = getVoteCardId();
        if (voteCardId) {
          const message = JSON.stringify({voteCardId: voteCardId});
          clearInterval(updateInterval);
          window.postMessage(message, "*");
        }
      };

      const hasFound = () => {
        const labels = document.getElementById("resposta-local-votacao");
        if (labels.hasChildNodes()) {
          return postVoteCardId();
        } else {
          return null;
        }
      };

      const updateInterval = setInterval(() => hasFound(), 500);
    })();
  `;
};

const mapStateToProps = (state, ownProps) => ({
  injectedJavaScript: jsCode({
    birthdate: ownProps.birthdate,
    name: ownProps.name,
  }),
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
