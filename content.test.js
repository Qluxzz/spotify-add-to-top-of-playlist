import { describe, vi, it, expect } from "vitest"
import "./content"

const CORRECT_URL = "https://api-partner.spotify.com/pathfinder/v1/query"
const CORRECT_METHOD = "POST"
const CORRECT_BODY = JSON.stringify({
  operationName: "addToPlaylist",
  variables: { newPosition: { moveType: "BOTTOM_OF_PLAYLIST" } },
})

const fetchInterceptor = window.Qluxzz.fetchInterceptor

describe("intercepts fetch requests correctly", () => {
  it("changes BOTTOM_OF_PLAYLIST to TOP_OF_PLAYLIST when URL, method and body is correct", async () => {
    const fn = vi.fn()

    await fetchInterceptor(fn)(CORRECT_URL, {
      method: CORRECT_METHOD,
      body: CORRECT_BODY,
    })

    expect(fn).toHaveBeenCalledWith(CORRECT_URL, {
      body: '{"operationName":"addToPlaylist","variables":{"newPosition":{"moveType":"TOP_OF_PLAYLIST"}}}',
      method: CORRECT_METHOD,
    })
  })

  it.each(["GET", "HEAD", "PUT", "DELETE", "PATCH", "OPTIONS"])(
    "doesn't change request if method is %s",
    async (method) => {
      console.log(method)
      const fn = vi.fn()

      await fetchInterceptor(fn)(CORRECT_URL, {
        method: method,
        body: CORRECT_BODY,
      })

      expect(fn).toHaveBeenCalledWith(CORRECT_URL, {
        body: CORRECT_BODY,
        method: method,
      })
    }
  )

  it.each([
    "https://open.spotify.com",
    "https://clienttoken.spotify.com/v1/clienttoken",
    "https://gew4-spclient.spotify.com/connect-state/v1/devices",
    "https://spclient.wg.spotify.com/collection/v2/contains?market=from_token",
  ])(
    "doesn't change request if url is anything else than the expected url",
    async (url) => {
      const fn = vi.fn()

      await fetchInterceptor(fn)(url, {
        method: CORRECT_METHOD,
        body: CORRECT_BODY,
      })

      expect(fn).toHaveBeenCalledWith(url, {
        method: CORRECT_METHOD,
        body: CORRECT_BODY,
      })
    }
  )

  it("doesn't change request if operationName is not 'addToPlaylist'", async () => {
    const fn = vi.fn()

    const requestBody = JSON.stringify({
      operationName: "x",
      variables: { newPosition: { moveType: "BOTTOM_OF_PLAYLIST" } },
    })

    await fetchInterceptor(fn)(CORRECT_URL, {
      method: CORRECT_METHOD,
      body: requestBody,
    })

    expect(fn).toHaveBeenCalledWith(CORRECT_URL, {
      body: requestBody,
      method: CORRECT_METHOD,
    })
  })

  it("doesn't change request if body is not JSON", async () => {
    const fn = vi.fn()

    const requestBody = "this isn't valid JSON :("

    await fetchInterceptor(fn)(CORRECT_URL, {
      method: CORRECT_METHOD,
      body: requestBody,
    })

    expect(fn).toHaveBeenCalledWith(CORRECT_URL, {
      body: requestBody,
      method: CORRECT_METHOD,
    })
  })

  it("doesn't change request if body structure is not correct", async () => {
    const fn = vi.fn()

    const requestBody = JSON.stringify({
      operationName: "addToPlaylist",
      variables: { foo: { bar: { biz: "BOTTOM_OF_PLAYLIST" } } },
    })

    await fetchInterceptor(fn)(CORRECT_URL, {
      method: CORRECT_METHOD,
      body: requestBody,
    })

    expect(fn).toHaveBeenCalledWith(CORRECT_URL, {
      body: requestBody,
      method: CORRECT_METHOD,
    })
  })
})
