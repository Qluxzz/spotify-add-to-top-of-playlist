const _fetch = window.fetch
window.fetch = async (...args) => {
  const [resource, initOptions = {}] = args
  const getOriginalResponse = () => _fetch(...args)

  if (initOptions.method !== "POST") return getOriginalResponse()

  if (resource !== "https://api-partner.spotify.com/pathfinder/v1/query")
    return getOriginalResponse()

  if (typeof initOptions.body !== "string") return getOriginalResponse()

  try {
    const requestBody = JSON.parse(initOptions.body)

    if (requestBody.operationName !== "addToPlaylist")
      return getOriginalResponse()

    requestBody.variables.newPosition.moveType = "TOP_OF_PLAYLIST"

    initOptions.body = JSON.stringify(requestBody)
  } catch (error) {
    console.error(
      `requestBody "${initOptions.body}" couldn't be parsed or didn't have the expected key 'variables.newPosition.moveType'. This can happen if Spotify have updated their API. Please open an issue on https://github.com/qluxzz/spotify-add-to-top-of-playlist/issues/new\n${error}`
    )

    return getOriginalResponse()
  }

  return _fetch(resource, initOptions)
}
