import { useMemo } from "react";

import TrackingTransparency, {
  TRACKING_STATUSES,
} from "../../services/tracking-transparency";

const trackingTransparency = TrackingTransparency();

export const useTrackingTransparencyService = () =>
  useMemo(
    () => ({
      trackingTransparency,
      TRACKING_STATUSES,
    }),
    [],
  );
