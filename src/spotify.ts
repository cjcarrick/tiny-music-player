import { uuid } from './lib'
import qs from 'qs'
import type { OK, Scopes } from './spotify.types'

export type Params = {
  client_id: string
  scopes: Scopes[]
  redirect_uri?: string
  /**
   * Basename of spotify endpoints
   *
   * @default 'https://api.spotify.com/v1'
   */
  basename?: string
}

export default class Spot {
  private scopes: Scopes[]
  /** The id of this app, generated in the spotify api console */
  private client_id: string
  /** Where the user is redirected upon authentication */
  private redirect_uri: string

  private basename: string

  /** Used to make requests */
  access_token: string | undefined

  /**
   * When the access_token will expire. This is a string representation of an
   * integer.
   *
   * @example
   *   ;`3600` // 1 hour
   */
  private expires: Date | undefined

  /**
   * The state saved to localstorage just before the user is sent to spotify.com
   * for authentication.
   */
  private state_sent: string | undefined
  /**
   * The state recieved from an authentication request. this should be the same
   * as the state stored in localstorage.
   */
  private state_recieved: string | undefined

  constructor(params: Params) {
    this.scopes = params.scopes
    this.client_id = params.client_id
    this.redirect_uri = params.redirect_uri || 'http://localhost:5173'

    this.basename = params.basename || 'https://api.spotify.com/v1'

    const hash = qs.parse(window.location.hash.substring(1))
    this.access_token = hash['access_token']?.toString()
    this.state_recieved = hash['state']?.toString()
    this.state_sent = localStorage.getItem('state_sent') || undefined

    if (parseInt(hash['expires_in']?.toString() || '0')) {
      this.expires = new Date(
        new Date().getTime() + parseInt(hash['expires_in']!.toString())
      )
      localStorage.setItem('expires', this.expires.toISOString())
    } else if (localStorage.getItem('expires')) {
      this.expires = new Date(localStorage.getItem('expires')!)
    } else {
      this.expires = undefined
    }
  }

  authenticated = () => {
    // These cases are perfectly reasonable and indicate (re)authentication is
    // necessary.
    if (!this.access_token) {
      console.warn('No access token.')
      return false
    }
    if (
      // Make sure we have an expiration date
      !this.expires ||
      // Check if access_token is expired
      !(this.expires.getTime() > new Date().getTime())
    ) {
      console.warn(
        'access_token is expired or expiration could not be determined.'
      )
      return false
    }

    // If any of the following are true, something went wrong
    if (!this.state_recieved) {
      throw new Error('No state recieved from spotify.')
    }
    if (!this.state_sent) {
      throw new Error('No state found in localstorage.')
    }
    if (this.state_recieved !== this.state_sent) {
      throw new Error('State mismatch.')
    }

    // If all of the above tests passed, we must be authenticated.
    return true
  }

  implicitGrant = () => {
    console.log(this.scopes.join(','))
    const state = uuid()
    localStorage.setItem('state_sent', state)
    const url =
      'https://accounts.spotify.com/authorize?' +
      qs.stringify({
        response_type: 'token',
        client_id: this.client_id,
        scope: this.scopes.join(','),
        redirect_uri: this.redirect_uri,
        state
      })
    window.location.href = url
  }

  private getter: <T extends keyof OK>(
    endpoint: T,
    params: {
      path?: { [key: string]: string | number | string[] }
      query?: { [key: string]: string | number | string[] }
    }
  ) => Promise<OK[T]> = async (endpoint, params) => {
    // Double check for authentication
    if (!this.authenticated) {
      this.implicitGrant()
    }

    // Return a typed promise for the reqested endpoint
    const res = await fetch(parseUrl(this.basename, endpoint, params), {
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    if (!res.ok) {
      // 401 = access token expired
      if (res.status == 401) {
        this.implicitGrant()
      }
      throw new Error(await res.text())
    }

    return await res.json()
  }

  /** Scopes: user-read-playback-state */
  player = () => this.getter('/me/player', {})

  /** Get the audio analysis for a track with the given id */
  analysis = (id: string) =>
    this.getter('/audio-analysis/{id}', { path: { id } })

  /** Scopes: _____ */
  library = () => this.getter('/me/tracks', {})

  devices = () => this.getter('/me/player/devices', {})

  search = (
    q: string,
    limit = 10,
    offset = 0,
    type: (
      | 'album'
      | 'artist'
      | 'playlist'
      | 'track'
      | 'show'
      | 'episode'
      | 'audiobook'
    )[] = ['album', 'track', 'artist']
  ) => this.getter('/search', { query: { q, type, offset, limit } })
}

/** Inserts path params, query params, and appends endpoints to basenames */
const parseUrl = (
  baseName: string,
  endpoint: string,
  params: {
    path?: { [key: string]: string | number | string[] }
    query?: { [key: string]: string | number | string[] }
  }
) =>
  baseName +
  endpoint.replaceAll(/\/{(^}*)}/g, (_, k) => `/${params.path?.[k]}`) +
  '?' +
  qs.stringify(params.query)
