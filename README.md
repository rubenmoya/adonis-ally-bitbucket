# Adonis Ally Bitbucket Driver

[![NPM version](https://img.shields.io/npm/v/adonis-ally-bitbucket.svg)](https://www.npmjs.com/package/adonis-ally-bitbucket)

A [Bitbucket](https://bitbucket.org/product) driver for [AdonisJS Ally](https://docs.adonisjs.com/guides/auth/social)

## Getting started

### 1. Install the package

Install the package from your command line.

```bash
npm install --save adonis-ally-bitbucket
```

or

```bash
yarn add adonis-ally-bitbucket
```

### 2. Configure the package

```bash
node ace configure adonis-ally-bitbucket
```

### 3. Validate environment variables

```ts
BITBUCKET_CLIENT_ID: Env.schema.string(),
BITBUCKET_CLIENT_SECRET: Env.schema.string(),
```

### 4. Add variables to your ally configuration

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

## Scopes

You can pass an array of scopes in your configuration, for example `['account', 'email', 'repository']`. You have a full list of scopes in the [Bitbucket Oauth documentation](https://support.atlassian.com/bitbucket-cloud/docs/use-oauth-on-bitbucket-cloud/#Scopes)

## How it works

You can learn more about [AdonisJS Ally](https://docs.adonisjs.com/guides/auth/social) in the documentation. And learn about the implementation in the [ally-driver-boilerplate](https://github.com/adonisjs-community/ally-driver-boilerplate) repository.

## Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'feat: Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[MIT](LICENSE)
