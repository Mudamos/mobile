const translations = {
  addressConfirmHeader: "Confirme sua localização",
  addressSearchHeader: "Informe seu CEP",
  alreadyHavePasswordCode: "Já possuo um código",
  back: "voltar",
  birthdate: "Data de nascimento",
  birthdayHeaderTitle: "Informe sua data de nascimento",
  cancel: "Cancelar",
  cantRememberVoteCard: "Não lembra do seu título?",
  change: "Alterar",
  changeForgotPasswordTitle: "Alterar senha",
  changePasswordTitle: "Alterar senha",
  close: "Fechar",
  codeHasBeenSentToPhone: "Um código foi enviado para seu celular",
  codeSent: "Código enviado",
  confirm: "Confirmar",
  confirmInformation: "Confirme suas informações",
  congratulations: "Parabéns!",
  cpf: "cpf",
  currentPassword: "Senha atual",
  documentsHeaderTitle: "Informe seus documentos",
  documentsReasonExplained: "Para garantir que sua assinatura tenha validade legal. A câmara e assembléias de deputados estabelecem que o nome, data de nascimento, cidade e um identificador único (título eleitoral ou CPF) são os dos para verificar uma assinatura. Diferente de outros sites de assinaturas de petições, onde apenas seu nome e email são suficientes para manifestar seu interesse, nós queremos ir além e apresentar um projeto de lei com assinaturas legais!",
  dontRememberZipCode: "Não lembra do seu CEP?",
  downloadPDF: "Baixe o PDF da proposta",
  doYouWantToSign: "Deseja assinar o projeto de lei",
  email: "E-mail",
  enroll: "Cadastrar",
  enterNewPassword: "Agora a nova senha",
  facebookLogin: "Entrar com Facebook",
  forgotPassword: "Esqueceu a senha?",
  forgotPasswordTitle: "Esqueci minha senha",
  forward: "Avançar",
  getIn: "Entrar",
  gotIt: "entendi",
  hasAnAccountAlready: "Já tem uma conta?",
  loading: "Carregando...",
  logout: "Sair",
  mobile: "Celular",
  menu: {
    about: "Sobre",
    changePassword: "Alterar senha",
    editProfile: "Editar perfil",
  },
  name: "Nome completo",
  newPassword: "Nova senha",
  next: "Próximo",
  ok: "Ok",
  okIGotIt: "Ok, entendi",
  password: "Senha",
  passwordChangedSuccessfully: "Senha alterada com sucesso!",
  performLogin: "Faça o login",
  petitionEnded: "Encerrado",
  phoneHeaderTitle: "Informe seu celular",
  phoneSubtitle: "Um código de confirmação será enviado via SMS",
  profileUpdated: "Perfil atualizado!",
  profileUpdateTitle: "Editar perfil",
  projectSigned: "Projeto Assinado",
  projectSignedCongratulations: "Parabéns, você assinou o projeto de lei",
  projectSignedYeah: "Projeto assinado!",
  readFullText: "Leia o texto\ncompleto",
  resendCode: "Reenviar código",
  retry: "Tentar novamente",
  revalidation: "Revalidação",
  revalidationExplanation: "Desculpe, mas parece que alguma coisa no ato da sua assinatura não funcionou como o esperado. Por isso, precisamos revalidar o seu cadastro.",
  save: "Salvar",
  search: "buscar",
  sendCode: "Enviar código",
  sendSMSCode: "Enviar código via SMS",
  share: "Compartilhar",
  shareMessage: ({description, name, hashtag}) => `${description}! vote no ${name} e construa um Brasil melhor. ${hashtag}`,
  signatures: "Assinaturas",
  signupSuccessModalText: "Seu celular foi validado e agora você já pode assinar projetos de lei de iniciativa popular.",
  signersTitle: "Assinantes",
  signInTitle: "Login",
  signUpTitle: "Ajude a construir soluções para desafios públicos de maneira aberta e participativa",
  skip: "Pular",
  tseNotRobot: "Não sou um robô",
  tseSubmit: "Consultar",
  tseTutorial1: "Você será redirecionado para o site do Tribunal Superior Eleitoral (TSE).",
  tseTutorial2: "Uma vez no site, poderá buscar por seu título de eleitor.",
  tseTutorial3: "Preencha ambos os campos",
  tseTutorial4: "Preencha seu nome completo, exatamente igual ao título de eleitor.",
  tseTutorial5: "Agora, clique em",
  tseTutorial6: "Este passo ajuda o Tribunal Superior Eleitoral a evitar o acesso por programas automáticos.",
  tseTutorial7: "Responda todas as perguntas, como selecionar placas de rua, fachada de lojas, etc.",
  tseTutorial8: "Uma vez completada essa etapa clique em",
  tseTutorial9: "O seu título de eleitor será preenchido automaticamente em seu cadastro!",
  typeCode: "Informe o código",
  verify: "Verificar",
  voteCard: "Título de Eleitor",
  voterBirthDay: "Data de nascimento",
  voterName: "Nome do eleitor",
  whyRequestDocuments: "Por que pedimos estes dados?",
  whyRequestDocumentsAlternative: "Por que pedimos seus documentos?",
  yes: "Sim",
  zipCode: "CEP",
  zipCodeReason: "Não precisamos saber o seu endereço específico, apenas uma localização aproximada de onde você mora",
  errors: {
    facebookLoginError: "Não foi possível conectar-se ao facebook.",
    genericError: "Algo deu errado, tente novamente em alguns segundos.",
    loginError: "Não foi possível realizar o login.",
    openURLError: "Não foi possível recuperar o endereço solicitado.",
    passwordRetrieveError: "Houve um erro ao tentar enviar o código. Tente novamente.",
    shareLinkError: "Não foi possível compartilhar o conteúdo.",
    signPlipError: "Por algum motivo não conseguimos completar sua assinatura.",
    walletCreationError: "Houve um erro ao preparar algumas informações para suas assinaturas.",
  },
};

const markdown = {
  aboutBody: `# Aplicativo Mudamos permite assinatura de projetos de lei de iniciativa popular, pelo celular
## O que é um projeto de lei de iniciativa popular?
Os projetos de lei de iniciativa popular estão previstos na Constituição brasileira e são a forma direta da população participar na construção de leis. Qualquer cidadão pode propor leis de iniciativa popular, desde que consiga um número mínimo de assinaturas apoiando o projeto. Em cidades pequenas, 1.500 assinaturas coletadas já são suficientes para promover mudanças, como alterar a remuneração de vereadores, ou modificar como o lixo da cidade é tratado, por exemplo.

## Por que um aplicativo para propor leis de iniciativa popular?
Desde quando a iniciativa popular foi prevista na Constituição de 1988, somente quatro projetos foram propostos usando este instrumento. Nós da Mudamos achamos que isso acontece porque coletar assinaturas em papel é difícil, por isso, criamos o aplicativo para tornar a coleta de assinaturas fácil e aproximá-las das pessoas. Com o aplicativo, qualquer cidadão em qualquer lugar munido de um smartphone pode declarar o seu apoio a um projeto de lei de iniciativa popular e ainda garantimos mais transparência a este processo.

## Eu só posso assinar um projeto de lei usando o aplicativo?
Acreditamos que o smartphone é a melhor forma de garantir a individualidade da assinatura e evitar fraudes. Você não compartilha seu telefone com ninguém, assim como você não emprestaria sua identidade para outra pessoa. O smartphone é o dispositivo mais pessoal e popular, por isso resolvemos transformá-lo na sua caneta virtual em que só você assinará com ela.

## Por que pedimos seu CPF e Título de Eleitor?
Para garantir que sua assinatura tenha validade legal. A câmara e assembléias de deputados estabelecem que o nome, data de nascimento, cidade e um identificador único (título eleitoral ou CPF) são os dos para verificar uma assinatura. Diferente de outros sites de assinaturas de petições, onde apenas seu nome e email são suficientes para manifestar seu interesse, nós queremos ir além e apresentar um projeto de lei com assinaturas legais!

## Quem vai ter acesso aos meus dados?
Tratamos todos os dados que recebemos de você com sigilo. Contudo, alguns dados precisam ser publicados na Internet, para que todos possam verificar a transparência do processo. Seu nome, sua data de aniversário, sua cidade e seu CPF/Título eleitoral precisam, de acordo com as regras das casas legislativas, serem públicos. Isso sempre foi assim. O que faremos é publicar esses dados com responsabilidade, usando regras de semi-anonimização quando possível para garantir que governo e sociedade civil possam verificar os dados, mas aumentando sua privacidade online.`,
};

translations.markdown = markdown;

export default translations;
