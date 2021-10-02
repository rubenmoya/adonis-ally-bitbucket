import type {
  AllyUserContract,
  ApiRequestContract,
  LiteralStringUnion,
} from '@ioc:Adonis/Addons/Ally'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Oauth2Driver, ApiRequest, RedirectRequest } from '@adonisjs/ally/build/standalone'

export type BitbucketAccessToken = {
  token: string
  type: 'bearer'
}

/**
 * Available Bitbucket scopes
 *
 * @link https://support.atlassian.com/bitbucket-cloud/docs/use-oauth-on-bitbucket-cloud/#Scopes
 */
export type BitbucketScopes =
  | 'account'
  | 'account:write'
  | 'team'
  | 'team:write'
  | 'repository'
  | 'repository:write'
  | 'repository:admin'
  | 'pullrequest'
  | 'pullrequest:write'
  | 'snippet'
  | 'snippet:write'
  | 'issue'
  | 'issue:write'
  | 'wiki'
  | 'email'
  | 'webhook'

export type BitbucketDriverConfig = {
  driver: 'bitbucket'
  clientId: string
  clientSecret: string
  callbackUrl: string
  authorizeUrl?: string
  accessTokenUrl?: string
  userInfoUrl?: string
  userEmailUrl?: string

  scopes?: LiteralStringUnion<BitbucketScopes>[]
}

/**
 * Bitbucket driver to login user via Bitbucket
 */
export class BitbucketDriver extends Oauth2Driver<BitbucketAccessToken, BitbucketScopes> {
  protected authorizeUrl = 'https://bitbucket.org/site/oauth2/authorize'
  protected accessTokenUrl = 'https://bitbucket.org/site/oauth2/access_token'
  protected userInfoUrl = 'https://api.bitbucket.org/2.0/user'
  protected userEmailUrl = 'https://api.bitbucket.org/2.0/user/emails'
  protected codeParamName = 'code'
  protected errorParamName = 'error'
  protected stateCookieName = 'bitbucket_oauth_state'
  protected stateParamName = 'state'
  protected scopeParamName = 'scope'
  protected scopesSeparator = ' '

  constructor(ctx: HttpContextContract, public config: BitbucketDriverConfig) {
    super(ctx, config)

    this.loadState()
  }

  protected configureRedirectRequest(request: RedirectRequest<BitbucketScopes>) {
    request.scopes(this.config.scopes || ['account', 'email'])
    request.param('grant_type', 'authorization_code')
    request.param('response_type', 'code')
  }

  public accessDenied() {
    return this.ctx.request.input('error') === 'user_denied'
  }

  public async user(
    callback?: (request: ApiRequest) => void
  ): Promise<AllyUserContract<BitbucketAccessToken>> {
    const accessToken = await this.accessToken()
    const user = await this.getUserInfo(accessToken.token, callback)

    return {
      ...user,
      token: accessToken,
    }
  }

  public async userFromToken(
    accessToken: string,
    callback?: (request: ApiRequest) => void
  ): Promise<AllyUserContract<{ token: string; type: 'bearer' }>> {
    const user = await this.getUserInfo(accessToken, callback)

    return {
      ...user,
      token: {
        token: accessToken,
        type: 'bearer' as const,
      },
    }
  }

  protected getAuthenticatedRequest(url: string, token: string) {
    const request = this.httpClient(url)

    request.header('Accept', 'application/json')
    request.header('Authorization', `Bearer ${token}`)
    request.param('format', 'json')
    request.parseAs('json')

    return request
  }

  /**
   * Fetches the user info from the Bitbucket API
   *
   * @link https://developer.atlassian.com/bitbucket/api/2/reference/resource/user
   */
  protected async getUserInfo(
    token: string,
    callback?: (request: ApiRequest) => void
  ): Promise<Omit<AllyUserContract<BitbucketAccessToken>, 'token'>> {
    const request = this.getAuthenticatedRequest(this.config.userInfoUrl || this.userInfoUrl, token)

    if (typeof callback === 'function') {
      callback(request)
    }

    const userResponse = await request.get()
    const emailResponse = await this.getUserEmail(token, callback)

    return {
      id: userResponse.uuid,
      nickName: userResponse.nickname,
      name: userResponse.display_name,
      email: emailResponse.email,
      avatarUrl: userResponse.links?.avatar?.href || null,
      emailVerificationState: emailResponse.is_confirmed ? 'verified' : 'unverified',
      original: userResponse,
    }
  }

  /**
   * Fetches the user email from the Bitbucket API.
   *
   * @link https://developer.atlassian.com/bitbucket/api/2/reference/resource/user/emails
   */
  protected async getUserEmail(token: string, callback?: (request: ApiRequestContract) => void) {
    const request = this.getAuthenticatedRequest(
      this.config.userEmailUrl || this.userEmailUrl,
      token
    )

    if (typeof callback === 'function') {
      callback(request)
    }

    const body = await request.get()
    const primaryEmail = body.values.find((email) => email.is_primary === true)

    return primaryEmail
  }
}
