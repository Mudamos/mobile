import { map, prop } from "ramda";

const extractValue = map(prop("value"));

const initialState = {
  links: {
    getToKnowMudamos: "https://www.mudamos.org/quem-somos",
    help: "https://itsrio2.typeform.com/to/nGzwjv",
    sendYourIdea: "https://itsrio2.typeform.com/to/iulNZI",
    whyProjectsLink: "https://www.mudamos.org/institucional/projetos-de-lei-de-iniciativa-popular",
  },
  config: {
    authenticatedSignersButtonTitle: "Lista de assinantes e outras informações",
    ineligibleToSignCitywidePlipReason: "Obrigado por seu apoio, mas você só pode assinar esse projeto de lei sendo eleitor do município para o qual ele se destina. Se deseja propor essa lei para o seu município, use a função \"Proponha um PL\" no menu do App.",
    ineligibleToSignStatewidePlipReason: "Obrigado por seu apoio, mas você só pode assinar esse projeto de lei sendo eleitor do estado para o qual ele se destina. Se deseja propor essa lei para o seu município, use a função \"Proponha um PL\" no menu do App.",
  },
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

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
