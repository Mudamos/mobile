import { connect } from "react-redux";

import {
  navigateBack,
  tseVoteAddressAcquired,
  voteCardIdAcquired,
} from "../actions";

import { log, logError } from "../utils";

import TSELayout from "../components/tse-layout";

const TSE_URL =
  "http://www.tse.jus.br/eleitor/servicos/titulo-de-eleitor/titulo-e-local-de-votacao/consulta-por-nome#form-consultar-local-votacao";
const source = { uri: TSE_URL };

const jsCode = ({ birthdate, name }) => {
  return `
    (function() {
      function fillOutForm() {
        var nameField = document.getElementsByName("nomeTituloCPF")[0];
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

      function clearOuterHTML() {
        [
          document.getElementById("nav-principal"),
          document.getElementById("search"),
        ].filter(Boolean).forEach(e => e.outerHTML = "");
      }
      clearOuterHTML();

      function removeUnusedHTML() {
        var classes = [
          "help-block",
          "breadcrumb__conteudo_full",
          "navbar-toggler",
          "menu__item busca",
          "acessibilidade",
          "rodape__links",
          "rodape__informacoes",
          "mapa",
          "ferramentas",
        ];

        classes.forEach(className => Array.from(document.getElementsByClassName(className)).forEach(e => e.remove()));

        var ids = [
          "compartilhar-conteudo",
          "coluna-lateral-interna",
          "faixa_aviso",
        ];

        ids.forEach(id => {
          var e = document.getElementById(id);

          if (e) {
            e.remove();
          }
        });
      }
      removeUnusedHTML();

      const getUserInfo = () => {
        const labels = document.getElementById("resposta-local-votacao");

        const nodes = labels.childNodes;

        const isVoteCard = text => {
          return /Inscrição: [0-9]{12}/gi.test(text);
        };

        const getVoteCard = text => {
          return text.match(/[0-9]{12}/g)[0];
        };

        const isVoteAddress = text => {
          return /Município: \\w+/.test(text);
        };

        const getVoteAddress = text => {
          const addressParts = text.replace("Município:", "").split(" - ");

          if (addressParts.length === 0) return;

          const uf = addressParts.slice(-1).join("").trim().toUpperCase();

          if (!uf) return;

          const city = addressParts.slice(0, addressParts.length - 1).join("").replace(/\\s{1,}/g," ").trim();

          if (!city) return;

          return { uf: uf, city: city };
        };

        const result = {};
        for (let i = 0; i < nodes.length; i++) {
          const content = nodes[i].innerText;
          if (isVoteCard(content)) {
            const voteCardId = getVoteCard(content);

            if (voteCardId) {
              result.voteCardId = voteCardId;
            }
          } else if (isVoteAddress(content)) {
            const voteAddress = getVoteAddress(content);

            if (voteAddress) {
              result.voteAddress = voteAddress;
            }
          }
        }

        if (Object.keys(result).length > 0) return result;
      };

      const postResponse = () => {
        const info = getUserInfo();

        if (info) {
          const message = JSON.stringify(info);
          clearInterval(updateInterval);
          window.ReactNativeWebView.postMessage(message);
        }
      };

      const hasFound = () => {
        const labels = document.getElementById("resposta-local-votacao");
        if (labels.hasChildNodes()) {
          return postResponse();
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

const mapDispatchToProps = (dispatch) => ({
  onBack: () => dispatch(navigateBack()),
  onMessage: (event) => {
    const message = event.nativeEvent.data;

    log(`webView: ${message}`);

    try {
      const { voteAddress, voteCardId } = JSON.parse(message);
      log({ voteCardId, voteAddress });

      if (/^\d{12}$/.test(voteCardId)) {
        log("payload contains voteCardId");

        dispatch(voteCardIdAcquired(voteCardId));
        dispatch(tseVoteAddressAcquired({ tseVoteAddress: voteAddress }));
        dispatch(navigateBack());
      }
    } catch (e) {
      logError(e);
    }
  },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,

  source,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(TSELayout);
