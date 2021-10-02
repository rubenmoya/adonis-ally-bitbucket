The package has been configured successfully.

Make sure to first define the mapping inside the `contracts/ally.ts` file as follows.

```ts
declare module '@ioc:Adonis/Addons/Ally' {
  import { BitbucketDriver, BitbucketDriverConfig } from 'adonis-ally-bitbucket/build/standalone'

  interface SocialProviders {
    // ... other mappings
    bitbucket: {
      config: BitbucketDriverConfig
      implementation: BitbucketDriver
    }
  }
}
```

Ally config relies on environment variables for the client id and secret. We recommend you to validate environment variables inside the `env.ts` file.

## Variables for Bitbucket driver

```ts
BITBUCKET_CLIENT_ID: Env.schema.string(),
BITBUCKET_CLIENT_SECRET: Env.schema.string(),
```

## Ally config for Bitbucket driver

```ts
const allyConfig: AllyConfig = {
  // ... other drivers
  bitbucket: {
    driver: 'bitbucket',
    clientId: Env.get('BITBUCKET_CLIENT_ID'),
    clientSecret: Env.get('BITBUCKET_CLIENT_SECRET'),
    callbackUrl: 'http://localhost:3333/bitbucket/callback',
  },
}
```
