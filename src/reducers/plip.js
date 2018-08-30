const initialState = {
  userSignInfo: {},
  justSignedPlips: {},
  plipsSignInfo: {},
  plipsFavoriteInfo: {},
  isFetchingPlips: false,
  isFavoring: false,
  isFetchingPlipsNextPage: false,
  isRefreshingPlips: false,
  plips: [],
  allPlips: {
    plips: [],
    page: null,
    nextPage: null,
    loaded: false,
    isRefreshing: false,
    isFetching: false,
    isFetchingNextPage: false,
    error: null,
  },
  nationwidePlips: {
    plips: [],
    page: null,
    nextPage: null,
    loaded: false,
    isRefreshing: false,
    isFetching: false,
    isFetchingNextPage: false,
    error: null,
  },
  userLocationPlips: {
    plips: [],
    page: null,
    nextPage: null,
    loaded: false,
    isRefreshing: false,
    isFetching: false,
    isFetchingNextPage: false,
    error: null,
  },
  signedPlips: {
    plips: [],
    page: null,
    nextPage: null,
    loaded: false,
    isRefreshing: false,
    isFetching: false,
    isFetchingNextPage: false,
    error: null,
  },
  favoritePlips: {
    plips: [],
    page: null,
    nextPage: null,
    loaded: false,
    isRefreshing: false,
    isFetching: false,
    isFetchingNextPage: false,
    error: null,
  },
  currentPlip: null,
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "RESET_USER_PLIPS": {
      return {
        ...state,
        userLocationPlips: {
          plips: [],
          page: null,
          nextPage: null,
          loaded: false,
          isRefreshing: false,
          isFetching: false,
          isFetchingNextPage: false,
          error: null,
        },
        signedPlips: {
          plips: [],
          page: null,
          nextPage: null,
          loaded: false,
          isRefreshing: false,
          isFetching: false,
          isFetchingNextPage: false,
          error: null,
        },
        favoritePlips: {
          plips: [],
          page: null,
          nextPage: null,
          loaded: false,
          isRefreshing: false,
          isFetching: false,
          isFetchingNextPage: false,
          error: null,
        },
      }
    }
    case "RESET_USER_LOCATION_PLIPS": {
      return {
        ...state,
        userLocationPlips: {
          plips: [],
          page: null,
          nextPage: null,
          loaded: false,
          isRefreshing: false,
          isFetching: false,
          isFetchingNextPage: false,
          error: null,
        },
      }
    }
    case "ALL_PLIPS_FETCHED": {
      return {
        ...state,
        allPlips: {
          ...state.allPlips,
          plips: [...state.allPlips.plips, ...payload.plips],
          page: payload.page,
          nextPage: payload.nextPage,
          loaded: true,
          error: null,
          isFetching: false,
          isFetchingNextPage: false,
        },
      };
    }
    case "ALL_PLIPS_ERROR": {
      return {
        ...state,
        allPlips: {
          ...state.allPlips,
          isRefreshing: false,
          isFetching: false,
          isFetchingNextPage: false,
          error: payload.error,
        },
      };
    }
    case "REFRESH_ALL_PLIPS": {
      return {
        ...state,
        allPlips: {
          ...state.allPlips,
          plips: payload.plips,
          page: payload.page,
          nextPage: payload.nextPage,
          loaded: true,
          error: null,
        },
      };
    }
    case "REFRESHING_ALL_PLIPS": {
      return {
        ...state,
        allPlips: {
          ...state.allPlips,
          isRefreshing: payload.isRefreshing,
        },
      };
    }
    case "FETCHING_ALL_PLIPS": {
      return {
        ...state,
        allPlips: {
          ...state.allPlips,
          isFetching: payload.isFetching,
        },
      };
    }
    case "FETCHING_ALL_PLIPS_NEXT_PAGE": {
      return {
        ...state,
        allPlips: {
          ...state.allPlips,
          isFetchingNextPage: payload.isFetchingNextPage,
        },
      };
    }
    case "NATIONWIDE_PLIPS_FETCHED": {
      return {
        ...state,
        nationwidePlips: {
          ...state.nationwidePlips,
          plips: [...state.nationwidePlips.plips, ...payload.plips],
          page: payload.page,
          nextPage: payload.nextPage,
          loaded: true,
          error: null,
          isFetching: false,
          isFetchingNextPage: false,
        },
      };
    }
    case "NATIONWIDE_PLIPS_ERROR": {
      return {
        ...state,
        nationwidePlips: {
          ...state.nationwidePlips,
          isRefreshing: false,
          isFetching: false,
          isFetchingNextPage: false,
          error: payload.error,
        },
      };
    }
    case "REFRESH_NATIONWIDE_PLIPS": {
      return {
        ...state,
        nationwidePlips: {
          ...state.nationwidePlips,
          plips: payload.plips,
          page: payload.page,
          nextPage: payload.nextPage,
          loaded: true,
          error: null,
        },
      };
    }
    case "REFRESHING_NATIONWIDE_PLIPS": {
      return {
        ...state,
        nationwidePlips: {
          ...state.nationwidePlips,
          isRefreshing: payload.isRefreshing,
        },
      };
    }
    case "FETCHING_NATIONWIDE_PLIPS": {
      return {
        ...state,
        nationwidePlips: {
          ...state.nationwidePlips,
          isFetching: payload.isFetching,
        },
      };
    }
    case "FETCHING_NATIONWIDE_PLIPS_NEXT_PAGE": {
      return {
        ...state,
        nationwidePlips: {
          ...state.nationwidePlips,
          isFetchingNextPage: payload.isFetchingNextPage,
        },
      };
    }
    case "PLIPS_BY_USER_LOCATION_FETCHED": {
      return {
        ...state,
        userLocationPlips: {
          ...state.userLocationPlips,
          plips: [...state.userLocationPlips.plips, ...payload.plips],
          page: payload.page,
          nextPage: payload.nextPage,
          loaded: true,
          error: null,
          isFetching: false,
          isFetchingNextPage: false,
        },
      };
    }
    case "PLIPS_BY_USER_LOCATION_ERROR": {
      return {
        ...state,
        userLocationPlips: {
          ...state.userLocationPlips,
          isRefreshing: false,
          isFetching: false,
          isFetchingNextPage: false,
          error: payload.error,
        },
      };
    }
    case "REFRESH_PLIPS_BY_USER_LOCATION": {
      return {
        ...state,
        userLocationPlips: {
          ...state.userLocationPlips,
          plips: payload.plips,
          page: payload.page,
          nextPage: payload.nextPage,
          loaded: true,
          error: null,
        },
      };
    }
    case "REFRESHING_PLIPS_BY_USER_LOCATION": {
      return {
        ...state,
        userLocationPlips: {
          ...state.userLocationPlips,
          isRefreshing: payload.isRefreshing,
        },
      };
    }
    case "FETCHING_PLIPS_BY_USER_LOCATION": {
      return {
        ...state,
        userLocationPlips: {
          ...state.userLocationPlips,
          isFetching: payload.isFetching,
        },
      };
    }
    case "FETCHING_PLIPS_BY_USER_LOCATION_NEXT_PAGE": {
      return {
        ...state,
        userLocationPlips: {
          ...state.userLocationPlips,
          isFetchingNextPage: payload.isFetchingNextPage,
        },
      };
    }
    case "SIGNED_PLIPS_FETCHED": {
      return {
        ...state,
        signedPlips: {
          ...state.signedPlips,
          plips: [...state.signedPlips.plips, ...payload.plips],
          page: payload.page,
          nextPage: payload.nextPage,
          loaded: true,
          error: null,
          isFetching: false,
          isFetchingNextPage: false,
        },
      };
    }
    case "SIGNED_PLIPS_ERROR": {
      return {
        ...state,
        signedPlips: {
          ...state.signedPlips,
          isRefreshing: false,
          isFetching: false,
          isFetchingNextPage: false,
          error: payload.error,
        },
      };
    }
    case "REFRESH_SIGNED_PLIPS": {
      return {
        ...state,
        signedPlips: {
          ...state.signedPlips,
          plips: payload.plips,
          page: payload.page,
          nextPage: payload.nextPage,
          loaded: true,
          error: null,
        },
      };
    }
    case "REFRESHING_SIGNED_PLIPS": {
      return {
        ...state,
        signedPlips: {
          ...state.signedPlips,
          isRefreshing: payload.isRefreshing,
        },
      };
    }
    case "FETCHING_SIGNED_PLIPS": {
      return {
        ...state,
        signedPlips: {
          ...state.signedPlips,
          isFetching: payload.isFetching,
        },
      };
    }
    case "FETCHING_SIGNED_PLIPS_NEXT_PAGE": {
      return {
        ...state,
        signedPlips: {
          ...state.signedPlips,
          isFetchingNextPage: payload.isFetchingNextPage,
        },
      };
    }
    case "FAVORITE_PLIPS_FETCHED": {
      return {
        ...state,
        favoritePlips: {
          ...state.favoritePlips,
          plips: [...state.favoritePlips.plips, ...payload.plips],
          page: payload.page,
          nextPage: payload.nextPage,
          loaded: true,
          error: null,
          isFetching: false,
          isFetchingNextPage: false,
        },
      }
    }
    case "FAVORITE_PLIPS_ERROR": {
      return {
        ...state,
        favoritePlips: {
          ...state.favoritePlips,
          isRefreshing: false,
          isFetching: false,
          isFetchingNextPage: false,
          error: payload.error,
        },
      }
    }
    case "REFRESH_FAVORITE_PLIPS": {
      return {
        ...state,
        favoritePlips: {
          ...state.favoritePlips,
          plips: payload.plips,
          page: payload.page,
          nextPage: payload.nextPage,
          loaded: true,
          error: null,
        },
      }
    }
    case "REFRESHING_FAVORITE_PLIPS": {
      return {
        ...state,
        favoritePlips: {
          ...state.favoritePlips,
          isRefreshing: payload.isRefreshing,
        },
      };
    }
    case "FETCHING_FAVORITE_PLIPS": {
      return {
        ...state,
        favoritePlips: {
          ...state.favoritePlips,
          isFetching: payload.isFetching,
        },
      };
    }
    case "FETCHING_FAVORITE_PLIPS_NEXT_PAGE": {
      return {
        ...state,
        favoritePlips: {
          ...state.favoritePlips,
          isFetchingNextPage: payload.isFetchingNextPage,
        },
      };
    }
    case "PLIP_SIGNING":
      return {
        ...state,
        isSigning: payload.isSigning,
      };
    case "FAVORING_PLIPS":
      return {
        ...state,
        isFavoring: payload.isFavoring,
      };
    case "TOGGLE_FAVORITE":
      return {
        ...state,
        isFavoring: true,
      };
    case "PLIP_JUST_SIGNED":
      return {
        ...state,
        justSignedPlips: {
          ...state.justSignedPlips,
          [payload.plipId]: true,
        },
      };
    case "PLIP_REMOVE_JUST_SIGNED":
      return {
        ...state,
        justSignedPlips: {
          ...state.justSignedPlips,
          [payload.plipId]: false,
        },
      };
    case "PLIP_FETCHING_SIGNERS":
      return {
        ...state,
        isFetchingSigners: payload.isFetching,
        signersFetchError: false,
      };
    case "PLIP_SIGNERS":
      return {
        ...state,
        signers: payload.signers,
      };
    case "PLIP_FETCH_SIGNERS_ERROR":
      return {
        ...state,
        signersFetchError: true,
      };
    case "PLIP_CLEAR_SIGNERS":
      return {
        ...state,
        signers: null,
      };
    case "PLIP_CLEAR_SIGNERS_ERROR":
      return {
        ...state,
        signersFetchError: false,
      };
    case "PLIP_SHORT_SIGNERS":
      return {
        ...state,
        shortSigners: payload.users,
        shortSignersTotal: payload.total,
      };
    case "PLIP_USER_SIGN_INFO":
      return {
        ...state,
        userSignInfo: {
          ...state.userSignInfo,
          [payload.plipId]: payload.info,
        },
      };
    case "PLIP_SIGNING_PLIP":
      return {
        ...state,
        currentSigningPlip: payload.plip,
      };
    case "PLIP_FETCHING_PLIP_RELATED_INFO":
      return {
        ...state,
        isFetchingPlipRelatedInfo: payload.isFetching,
        fetchPlipRelatedInfoError: null,
      };
    case "PLIP_FETCH_PLIP_RELATED_INFO_ERROR":
      return {
        ...state,
        fetchPlipRelatedInfoError: true,
      };
    case "PLIP_PLIPS_SIGN_INFO_FETCHED":
      return {
        ...state,
        plipsSignInfo: { ...state.plipsSignInfo, ...payload.signInfo },
      };
    case "PLIP_PLIPS_FAVORITE_INFO_FETCHED":
      return {
        ...state,
        plipsFavoriteInfo: { ...state.plipsFavoriteInfo, ...payload.favoriteInfo },
      };
    case "PLIP_CLEAR_INFO":
      return {
        ...state,

        currentPlip: null,
        currentSigningPlip: null,
        fetchPlipRelatedInfoError: null,
        justSignedPlips: {},
        shortSigners: null,
        shortSignersTotal: null,
      };
    case "SET_CURRENT_PLIP":
      return {
        ...state,
        currentPlip: payload.plip,
      }
    case "SESSION_CLEAR_SESSION":
      return {
        ...state,
        fetchPlipRelatedInfoError: null,
        userSignInfo: {},
        justSignedPlips: {},
      };
    default:
      return state;
  }
};
