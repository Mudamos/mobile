# Mudamos Mobile

## Instalação


```
$ git submodule update --init
```

Instale o [node](https://nodejs.org) v6.9.1 usando o método de sua preferência.

Instale o package manager [yarn](https://yarnpkg.com/en/docs/install).

Agora instale as dependências do projeto.

```
$ yarn install
```

### Android

#### SDK

Primeiro, certifique-se que a SDK do Android está instalada, e que a env var `ANDROID_HOME` está configurada corretamente:

Exemplo no OSX com Homebrew:
```
$ brew install android-sdk
$ export ANDROID_HOME=/usr/local/opt/android-sdk
```

Agora instale os seguintes pacotes da SDK:

* Android SDK Tools
* Android SDK Platform-tools, revision 23.1
* Android SDK Build-tools, revision 23.0.3
* Android SDK Platform 24
* Android Support Repository, revision 38
* Google Repository, revision 36
* Google Play Services, revision 39

Abaixo está uma forma de instalar as dependências sendo elas algumas mais atuais (não ainda testadas). Lembre-se que vc pode usar manualmente o SD Manager do android.

```
$ android update sdk --all --no-ui --filter tools,platform-tools,build-tools-27.0.3,android-24,extra-android-support,extra-android-m2repository,extra-google-m2repository,extra-google-google_play_services
```

### iOS

Para o desenvolvimento e build das aplicações no iOS, é necessário instalar o [Ruby](https://www.ruby-lang.org) em sua máquina. A versão pode ser vista no `Gemfile`.

Caso não tenha o [bundler](http://bundler.io/) instalado, instale-o:

```
$ gem install bundler
```

Agora instale as dependências Ruby:

```
$ bundle install
```

Vamos instalar agora as dependências de build:

```
$ pod install --project-directory=./ios
```

## Facebook SDK

Para o iOS, dependemos da versão **4.31.1** do sdk que deve estar localizado em `~/Documents/FacebookSDK`.
Android dependemos da versão **4.31.0** que é automaticamente baixada pelo Gradle.

## Desenvolvimento

Primeiramente, crie um arquivo de configuração a partir do sample
```
$ cp .env.sample .env
```

Algumas variáveis de ambiente não estão no projeto *by design*.

### React packager

Rode o servidor de desenvolvimento:

```
$ yarn start
```

### Android

Com algum device ou emulador conectado:
```
$ yarn run android
```

### iOS

Prefira rodar (mesmo em desenvolvimento) no ambiente beta. Neste ambiente todas as configurações, certificados, dependências de plataformas já estão configuradas.

```
$ yarn run ios-4s-beta
```

Obs. Agora que temos uma action extension, o build via command line não funciona. É necessário fazer upgrade do RN, que provavelmente resolva o problema com builds `.appex`. Prefira rodar via Xcode.

## Renomeando um simulador iOS

Abra o Xcode, Window > Devices & Simulators. Clique sobre o nome de um simulator e altere o nome do mesmo.

Para rodar a app neste simulador usando a versão beta.

```
$ node node_modules/react-native/local-cli/cli.js run-ios --simulator='NOME DO SIMULADOR' --scheme MudamosMobileBeta
```

## Testes

```
$ yarn test
```

## Building

As apps de produção usam o `.env.production`.

### Android

Garanta que seu arquivo `.env` esteja configurado com as configurações do ambiente em questão.
No android ainda é possível ter diferentes arquivo de `env` e usálos passando para os comandos de build.

Tenha certeza também que as configurações de assinatura da app estejam presentes caso vá gerar a versão em questão.
Atualmente os seguintes *flavors* precisam das informações de configurações abaixo:

- MudamosBeta
  - configurações em `./android/keystores/mudamos-publishing-qa.properties`
  - keystore em `android/keystores/mudamos-android-publishing.keystore`
- Production
  - configurações em `./android/keystores/mudamos-production.properties`
  - keystore em `android/keystores/mudamos-production.keystore`

#### Firebase config file

Obtenha com um responsável o arquivo `google-services.json` e adicione na pasta do flavor correspondente:

- development
  - adicionar em `android/app/src/development/`
- mudamosBeta
  - adicionar em `android/app/src/mudamosBeta/`
- production
  - adicionar em `android/app/src/production/`

#### Para gerar a apk:

```
$ ENVFILE=.env.somenv android/gradlew -p android assemble{Flavor}{Env}
```

Onde **Flavor** é o flavor em questão e **Env** um entre *Debug* e *Release*

Para gerar a versão de QA portanto:

```
$ ENVFILE=.env.somenv android/gradlew -p android assembleMudamosBetaRelease
```

ou simplesmente,

```
$ yarn run --silent build-android-beta
```

Para gerar a versão de produção:

Tenha certeza de possuir o arquivo `.properties` devidamente configurado, contendo:

```
STORE_FILE=../keystores/mudamos-production.keystore
KEY_ALIAS=placeholder
STORE_PASSWORD=placeholder
KEY_PASSWORD=placeholder
```

e então:


```
$ yarn run --silent build-android-production
```


## Facebook Hash key (somente android)

Para android é necessário configurar o hash key da assinatura da app, que deve ser colocado no portal do Facebook.

Apontando para os mesmos arquivos e configurações do passo de Building execute:

```
$ keytool -exportcert -alias <RELEASE_KEY_ALIAS> -keystore <RELEASE_KEY_PATH> | openssl sha1 -binary | openssl base64
```

Onde `<RELEASE_KEY_ALIAS>` é o alis encontrado no seu arquivo `.properties` e `RELEASE_KEY_PATH` é o caminho para o arquivo `.keystore`.


### iOS

#### Firebase config file

Obtenha com um responsável o arquivo `GoogleService-Info.plist` e adicione na pasta do target correspondente:

- MudamosMobile (development)
  - adicionar em `ios/google/development/`
- MudamosMobileBeta
  - adicionar em `ios/google/mudamos-beta/`
- MudamosMobileProduction
  - adicionar em `ios/google/production/`

#### Para gerar o `.ipa`:

Versão beta:

```
$ yarn run build-ios-beta -- -m <PATH_TO_THE_PROVISION_PROFILE>
```

Para distruibuir, envie o `.ipa` gerado para o storage S3:

```
$ yarn run distribute-ios-beta -- -a <AWS_ACCESS_KEY> -s <AWS_SECRET_ACCESS_KEY>
```

Essas chaves podem ser obtidas com um responsável.

Para a versão de produção use o xcode.

### Gerando o html/js para o ios action extension

Para gerar o html, instale as dependências do mudamos-libcrypto e do sub projeto `./action-sign-generator`.


```
$ yarn run install-action-sign-deps
```

Agora gere o html,

```
$ yarn run generate-ios-action-sign-html
```
