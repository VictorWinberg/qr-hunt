export const doFetch = async (
  input: RequestInfo,
  init: RequestInit = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ res: any; err: any }> => {
  try {
    const response = await fetch(input, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      credentials: "include",
      ...init
    });
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }
    return { res: await response.json(), err: false };
  } catch (err) {
    alert(err);
    return { res: {}, err };
  }
};
