import type { AxiosError } from "axios";

export const requestMessageFormatter = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestResponseOrSimpleMessage: AxiosError | any,
) =>
  requestResponseOrSimpleMessage?.response?.data?.message ||
  requestResponseOrSimpleMessage;
