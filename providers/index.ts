import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class BitbucketProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const Ally = this.app.container.resolveBinding('Adonis/Addons/Ally')
    const { BitbucketDriver } = await import('../src/Bitbucket')

    Ally.extend('bitbucket', (_, __, config, ctx) => {
      return new BitbucketDriver(ctx, config)
    })
  }
}
