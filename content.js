const _fetch = window.fetch
window.fetch = async (...args) => {
  const [resource, initOptions = {}] = args
  const getOriginalResponse = () => _fetch(...args)

  if (initOptions.method !== "POST") return getOriginalResponse()

  if (resource !== "https://api-partner.spotify.com/pathfinder/v1/query")
    return getOriginalResponse()

  if (typeof initOptions.body !== "string") return getOriginalResponse()

  const requestBody = JSON.parse(initOptions.body)

  if (requestBody.operationName !== "addToPlaylist")
    return getOriginalResponse()

  requestBody.variables.newPosition.moveType = "TOP_OF_PLAYLIST"

  initOptions.body = JSON.stringify(requestBody)

  return _fetch(resource, initOptions)
}
