export const fetcher = async (uri: string, params: object) => {
  const response = await fetch(uri, params);
  return response;
};
