window.Qluxzz = {}
window.Qluxzz.fetchInterceptor =
  (fetch) =>
  async (...args) => {
    const [resource, initOptions = {}] = args
    const getOriginalResponse = () => fetch(...args)

    if (initOptions.method !== "POST") return getOriginalResponse()

    if (resource !== "https://api-partner.spotify.com/pathfinder/v1/query")
      return getOriginalResponse()

    if (typeof initOptions.body !== "string") return getOriginalResponse()

    let requestBody

    try {
      requestBody = JSON.parse(initOptions.body)
    } catch (error) {
      console.error(
        `Request body could not be parsed. This can happen if Spotify have updated their API. Please open an issue on https://github.com/qluxzz/spotify-add-to-top-of-playlist/issues/new\nRequest body was ${initOptions.body}\n${error}`
      )
      return getOriginalResponse()
    }

    if (requestBody.operationName !== "addToPlaylist")
      return getOriginalResponse()

    try {
      requestBody.variables.newPosition.moveType = "TOP_OF_PLAYLIST"
    } catch (error) {
      console.error(
        `Request body didn't have the expected key 'variables.newPosition.moveType'. This can happen if Spotify have updated their API. Please open an issue on https://github.com/qluxzz/spotify-add-to-top-of-playlist/issues/new\nRequest body was ${requestBody}\n${error}`
      )

      return getOriginalResponse()
    }

    initOptions.body = JSON.stringify(requestBody)

    return fetch(resource, initOptions)
  }

window.fetch = window.Qluxzz.fetchInterceptor(window.fetch)
