export const useFetch = (url: string, elco_session?: string) => {
  const cookie = elco_session ? `elco_session=${elco_session}` : ""
  return fetch(url, {
    headers: {
      Cookie: cookie,
      "X-Requested-With": "XMLHttpRequest",
    },
  })
}
