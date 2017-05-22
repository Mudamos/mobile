import { map, prop } from "ramda";

const extractValue = map(prop("value"));

const initialState = {
  links: {
    getToKnowMudamos: "https://www.mudamos.org",
    help: "https://www.mudamos.org/ajuda",
    sendYourIdea: "https://www.mudamos.org/envie-sua-ideia",
    whyProjectsLink: "https://www.mudamos.org/institucional/projetos-de-lei-de-iniciativa-popular",
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
    default:
      return state;
  }
}
