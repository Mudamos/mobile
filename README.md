# Mudamos Mobile

## Instalação

Instale o [node](https://nodejs.org) v6.9.1 usando o método de sua preferência.

Instale o package manager [yarn](https://yarnpkg.com/en/docs/install).

Agora instale as dependências do projeto.

```
yarn install
```

### Android

#### SDK

Primeiro, certifique-se que a SDK do Android está instalada, e que a env var `ANDROID_HOME` está configurada corretamente:

Exemplo no OSX com Homebrew:
```
brew install android-sdk
export ANDROID_HOME=/usr/local/opt/android-sdk
```

Agora instale os seguintes pacotes da SDK:

* Android SDK Tools
* Android SDK Platform-tools, revision 23.1
* Android SDK Build-tools, revision 23.0.1
* Android SDK Platform 23
* Android Support Repository, revision 38
* Google Repository, revision 36

Abaixo está uma forma de instalar as dependências sendo elas algumas mais atuais (não ainda testadas). Lembre-se que vc pode usar manualmente o SD Manager do android.

```
$ android update sdk --all --no-ui --filter tools,platform-tools,build-tools-23.0.1,android-23,extra-android-support,extra-android-m2repository,extra-google-m2repository
```

### iOS

Para o desenvolvimento e build das aplicações no iOS, é necessário instalar o [Ruby](https://www.ruby-lang.org) em sua máquina. A versão pode ser vista no `Gemfile`.

Caso não tenha o [bundler](http://bundler.io/) instalado, instale-o:

```
gem install bundler
```

Agora instale as dependências Ruby:

```
bundle install
```

Vamos instalar agora as dependências de build:

```
pod install --project-directory=./ios
```

## Desenvolvimento

Primeiramente, crie um arquivo de configuração a partir do sample
```
cp .env.sample .env
```

### React packager

Rode o servidor de desenvolvimento:

```
npm start
```

### Android

Com algum device ou emulador conectado:
```
npm run android
```

### iOS

```
npm run ios
```

## Testes

```
npm test
```
