---
layout: post
title:  "Como funciona: Protocolo OAuth 2.0"
description: "Entendendo o protocolo OAUth 2.0 e seus principais aspectos."
tags: [security, APIs]
date:   2017-05-27 16:00:00
categories: security
comments: true
share: true
---

O [OAuth 2.0](https://oauth.net/) é um protocolo que permite a usuários ter acesso limitado a recursos de um website **sem precisar expor suas credenciais**. Uma analogia interessante encontrada na própria especificação do protocolo: 

Alguns carros de luxo vem com uma chave extra chamada *valet key*. Essa chave pode ser utilizada quando queremos que um manobrista estacione o carro. Ao utilizar essa chave para ligar o carro, o manobrista não será capaz de dirigir o carro por mais de 2 km. Independente da restrição que essa chave especial impõe a seus utilizadores, a ideia é clara: você dá a alguém acesso limitado ao seu carro utilizando uma chave especial, e quando quiser acesso ilimitado ao carro, utiliza a chave normal.

Análogo à *valet key*, para obtermos acesso limitado a recursos utilizando o OAuth 2.0 utilizamos um **access token** (token de acesso). Veremos como o OAuth 2.0 disponibiliza mecanismos para utilizarmos recursos de terceiros de forma segura.

OAuth pra que te quero?
-------------

Pesquisando por "OAuth" no google, as fontes dizem todas basicamente: "O protocolo OAuth existe para descrever uma maneira segura de acessar recursos de terceiros". Não parece um problema difícil de se resolver, certo? Temos autenticações com login e senha implementadas por aí e tudo funciona muito bem. Não seria mais fácil que o usuário especificasse em cada aplicação *client* seus dados de acesso (login e senha)? Seria, mas isso tem alguns problemas:

- O primeiro deles é que, as aplicações de terceiros necessariamente deveriam ser capazes de armazenar as credenciais dos usuários solicitantes para uso futuro.

- Os servidores das aplicações a serem consumidas também teriam de suportar autenticação por senha, apesar de existirem [alguns problemas com esse tipo de autenticação](http://searchsecurity.techtarget.com/tip/Problems-with-authentication).

- Aplicações que desejam consumir recursos de terceiros ganhariam um acesso muito amplo aos recursos. Seriam necessárias implementações adicionais para limitar tempo de acesso a recursos, acesso a subgrupos de recursos e etc. A granularidade da concessão de acesso seria de total responsabilidade da aplicação disponibilizadora de recursos.

Por esses e outros problemas listados na [especificação do protocolo](https://tools.ietf.org/html/rfc6749), o OAuth é necessário para fazermos autorização de forma segura e coerente no contexto atual de APIs e integrações.




Os roles no OAuth 2.0
-------------

O OAuth 2.0, sendo uma especificação, descreve alguns papéis envolvidos em uma comunicação que utiliza o protocolo:

- **Resource Owner**: A entidade capaz de controlar o acesso aos recursos protegidos. Como o nome diz, é o "dono do recurso".

- **Resource Server**: Servidor que hospeda os recursos a serem acessados. É quem recebe as requisições. É quem expõe a API que queremos acessar.

- **Client**: A aplicação que solicita acesso aos recursos protegidos do Resource Owner.

- **Authorization Server**: Servidor que gera tokens de acesso, permite que o Client acesse os recursos, que o Resource Owner permitiu, com o nível de acesso que o Resource Owner especificou.


Fluxo de autenticação
-------------

Não se preocupe em entender como cada etapa da autenticação acontece, vamos abordar as etapas em detalhes daqui a pouco. Por hora, vejamos a **sequencia de eventos** para adquirir acesso a recursos utilizando o OAuth 2.0. 

![Fluxo OAuth 2.0](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/oauth2-flow.png "Fluxo OAuth 2.0")

**1.** O Client pede autorização ao Resource Owner para acessar seus recursos.

**2.** Assumindo que o Resource Owner autorize o acesso, o Client recebe um **authorization grant** (garantia de autorização). Essa credencial representa a autorização concedida pelo Resource Owner.

**3.** O Client pede um **access token** ao Authorization Server, enviando o **authorization grant**.

**4.** Assumindo que o Client foi autorizado com sucesso e que o **authorization grant** é válido, o Authorization Server gera um **access token** e o envia ao Client.

**5.** O Client pede acesso a um recurso protegido pelo Resource Server, e se autentica utilizando o **access token**.

**6.** Assumindo que o **access token** seja válido, o Resource Server responde à requisição do Client servindo o recurso solicitado.

Tipos de garantias de autorização
-------------

Na etapa **2** do fluxo de autenticação vimos que o Client recebe um **authorization grant** (garantia de autorização). O Resource Owner devolve diferentes garantias de autorização de acordo com o **grant type** que o Client está utilizando. A especificação do protocolo OAuth 2.0 define 4 fluxos diferentes para obtermos o **access token**, esses fluxos são o que chamamos de **grant types** (tipos de garantia de autorização). 

Definir qual fluxo utilizar depende do contexto em que o Client está inserido. Vejamos os 4 fluxos:

- **Authorization Code:** Utilizados por aplicações web que executam em servidores. Esse **grant type** é o mais comum. Utilizado principalmente quando queremos obter recursos de usuários de aplicações de terceiros, login com Facebook por exemplo.

- **Implicit:** Utilizado por SPAs (single page applications) que executam em browsers.

- **Resource Owner Password Credentials:** Utilizado por trusted apps (aplicativos confiáveis). Aplicativos podem ser considerados trusted apps por quem define as restrições de acesso do Resource Owner.

- **Client Credentials:** Utilizado em comunicações do tipo ["machine-to-machine"](https://auth0.com/docs/api-auth/grant/client-credentials).

A ideia aqui não é falar como cada **grant type** funciona. Veremos a seguir um exemplo prático do grant type **Authorization Code**. Para entender como cada um dos grant types devem ser utilizados em detalhes, veja [essa página com guias excelentes para cada um dos fluxos](https://auth0.com/docs/api-auth). 


Autenticando com Authorization Code
----------

O fluxo de autenticação *Authorization Code* do OAuth 2.0 é o mais popular. Diversas plataformas como Github, Twitter e Google disponibilizam recursos como login, utilizando esse **grant type**. Sendo assim, vejamos na prática os passos necessários para utilizar esse tipo de autenticação.

####  1. Capturar a autorização do usuário ####
Para iniciar a autenticação, sua aplicação (Client) deve enviar os dados do usuário à **authorization url**. Essa URL varia de acordo com a aplicação a ser consumida, e pode ser encontrada na documentação de utilização do OAuth com a aplicação em questão ([exemplo](https://dev.twitter.com/oauth/reference/post/oauth2/token).

<script src="https://gist.github.com/andreybleme/ba5deae2d6dc0bc9740ad187a7f69cd1.js"></script>

Sendo:

- `code`: diz que sua aplicação espera receber um Authorization Code.
- `audience`: o identificador único da API que seu aplicativo deseja acessar. Esse valor geralmente é disponibilizado na documentação do endpoint no qual você quer utilizar.
-  `client_id`: o ID que você recebeu quando criou sua aplicação no domínio requisitado. Seu Twitter App por exemplo.
- `redirect_uri`: a URI para onde o usuário será redirecionado após concluir a autenticação com sucesso.
- `scope`: um ou mais valores de escopo indicando quais recursos do usuário você deseja obter acesso.
- `state`: uma string aleatória gerada pela sua aplicação ou seu registro na API do sistema de terceiro no qual você deseja obter acesso.

Exemplo:
<script src="https://gist.github.com/andreybleme/dbcbfdae93a9af8666e16a002fc71de4.js"></script>

O objetivo da chamada sendo feita no exemplo acima, é obter consentimento de um usuário para invocar uma API (especificada no campo `audience`) e utilizar determinados recursos (especificados no campo `scope`). 

####  2. Trocar o Authorization Code pelo Access Token ####

Agora que temos o **authorization code** precisamos trocá-lo por um **access token**, que será utilizado nas chamadas à API. Utilizando o valor `code` retornado na etapa anterior, devemos fazer uma requisição do tipo `POST`  à **token URL** da aplicação de terceiro que estamos querendo obter acesso. Vejamos um exemplo de requisição com cURL:

<script src="https://gist.github.com/andreybleme/ba1200c2787a4bfb96266a9dc9706748.js"></script>

Onde:

- `grant_type`: Deve ser authorization_code.
- `client_id`: O **client id** da sua aplicação.
- `client_secret`: O **client secret** da sua aplicação.
- `code`: O **authorization code** recebido da chamada de autorização.
- `redirect_uri`: A URL deve ser exatamente igual à URI passada no parâmetro da chamada anterior.


> **Observação:** Essa requisição HTTP poderia ser feita com qualquer HTTP Client. O exemplo acima utiliza o cURL por ser um client comum em sistemas unix based.

Se a requisição for feita com sucesso, a resposta conterá um `access_token`, `id_token`, e um `token_type`.

<script src="https://gist.github.com/andreybleme/f065bf59b5c8cd986a58f740aa7fac97.js"></script>


####  3. Utilizar a API ####
 Com o **access token** em mãos, agora conseguimos fazer chamadas à API utilizando o token no cabeçalho **Authorization** da requisição HTTP:

<script src="https://gist.github.com/andreybleme/956f1ba9d32f8c6c450e124295407b95.js"></script>

> **Observação:** É importante que informações como `client_id`, `client_secret`, `code` e principalmente `access_token` não sejam compartilhadas nem visíveis na sua aplicação. O acesso indevido a essas credenciais podem viabilizar ações maliciosas e comprometer o não repúdio no que diz respeito a identidade da sua aplicação.

OAuth 2.0 no mundo real
----------

Nesse post foram apresentados os principais conceitos do OAuth 2.0, portanto, conhecendo os *roles* e as etapas de autenticação que o protocolo utiliza, fica fácil integrar com quaisquer aplicações que utilizem o OAuth 2.0.

Isso não significa que, não podemos esbarrar com algumas coisas diferentes em aplicações no mundo real. A maioria das grandes plataformas que oferecem integrações via OAuth 2.0, utilizam **access tokens** que expiram após um determinado tempo. Para lidar com cenários onde é necessário utilizar tokens por um tempo maior existem os **refresh tokens**.

####  Obtendo um refresh token ####

Basicamente, um refresh token possui as informações necessárias para que possamos gerar um novo access token. Para obter um refresh token, basta adicionar à requisição que fizemos na etapa 1 da seção "Autenticação com Authorization Code" o parâmetro `offline_access`. A requisição ficará assim:

<script src="https://gist.github.com/andreybleme/1f7b70c202ec08dcb994e596b7bf0db5.js"></script>

Após obter o **authorization code** e trocá-lo pelo **access token** (como descrevemos no passo 2 da seção "Autenticando com Authorization Code"), o refesh token estará na resposta da requisição:

<script src="https://gist.github.com/andreybleme/f065bf59b5c8cd986a58f740aa7fac97.js"></script>

> **Dica:** Refresh tokens devem ser armazenados em um local seguro e não devem ser expostos, já que, obtendo um refresh token seria possível manter um usuário autenticado pra sempre renovando tokens eternamente!

####  Utilizando o refresh token ####

Agora que já obtemos o **refresh token**, precisamos utilizá-lo para renovar nosso access token. Para isso basta fazermos uma requisição `POST` à **token URL** exatamente como fizemos no passo 2 da seção "Autenticando com Authorization Code", com uma simples diferença: No parâmetro **grant type**, colocaremos `grant_type=refresh_token`.

<script src="https://gist.github.com/andreybleme/70d3d55584ea36a2e6b3ff5524c8f934.js"></script>

Como resposta, temos um **novo access token** com um novo período de expiração em milissegundos:

<script src="https://gist.github.com/andreybleme/226f06706647c756baf6898f30ac5a98.js"></script>

> **Importante:** Somente faça requisições para obter um novo access token quando o token expirar. Várias APIs possuem **rate limits** que funcionam como um limite de requisições permitidas por minuto, ou por hora. 
Fazer uma requisição de um novo access token sempre que for utilizar um recurso qualquer da API que exija o access token, é uma **péssima prática**.

That's it!
----------

Exitem ainda mais coisas a serem ditas sobre o OAuth 2.0, mas acredito que até aqui cobrimos as coisas mais importantes. Se quiser ver mais detalhes e exemplos de outros grant types não abordados no post, coloquei aqui em baixo alguns links que podem ser úteis. Se esqueci de alguma coisa durante os exemplos ou algo do tipo, **favor** comentar me avisando.

Pretendo aumentar a frequência dos posts aqui no blog nas próximas semanas, então: sugestões de post são bem vindas (não se acanhe, pode sugerir nos comentários mesmo).

Referências e links úteis
-------------
- [OAuth 2 Simplified](https://aaronparecki.com/oauth-2-simplified/)

- [OAuth official documentation](https://oauth.net/about/introduction/)

- [Which OAuth 2.0 flow should I use?](https://auth0.com/docs/api-auth/which-oauth-flow-to-use)

- [O que é OAuth 2.0 e qual a sua utilidade?](https://pt.stackoverflow.com/questions/123777/oauth-o-que-%C3%A9-qual-sua-finalidade)
