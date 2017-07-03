import { map, prop } from "ramda";

const extractValue = map(prop("value"));

const initialState = {
  links: {
    getToKnowMudamos: "https://www.mudamos.org",
    help: "https://www.mudamos.org/ajuda",
    sendYourIdea: "https://www.mudamos.org/envie-sua-ideia",
    whyProjectsLink: "https://www.mudamos.org/institucional/projetos-de-lei-de-iniciativa-popular",
  },
  config: {
    ineligibleToSignCitywidePlipReason: "Obrigado por seu apoio, mas você só pode assinar esse projeto de lei sendo eleitor do município para o qual a lei se destina.",
    ineligibleToSignStatewidePlipReason: "Obrigado por seu apoio, mas você só pode assinar esse projeto de lei sendo eleitor do estado para o qual a lei se destina.",
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "REMOTE_CONFIG_FETCHED_LINKS": {
      const { links } = payload;
      const values = extractValue(links);

      return {
        ...state,
        links: {
          ...state.links,
          ...values,
        },
      };
    }
    case "REMOTE_CONFIG_FETCHED": {
      const { config } = payload;
      const values = extractValue(config);

      return {
        ...state,
        config: {
          ...state.config,
          ...values,
        },
      };
    }
    default:
      return state;
  }
}
