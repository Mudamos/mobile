export const qrCodeScannedData = ({ data }) => ({
  type: "QR_CODE_SCAN_SCANNED_DATA",
  payload: { data },
});
