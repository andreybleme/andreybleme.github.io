---
layout: post
title:  "Autenticação com JWT no Spring Boot"
description: "Autenticação em aplicações stateless com JSON Web Tokens."
date:   2017-04-01 12:00:00
tags: [java, spring, security]
comments: true
share: true
---

[JSON Web Token](https://jwt.io/) (JWT), é um padrão que define uma forma segura de transmitir mensagens utilizando um token **compacto** e **self-contained** no formato de um objeto JSON.

É compacto porque além de leve, pode ser enviado através de um HTTP header, via URL, ou como parâmetro no corpo de uma requisição HTTP. Dizemos que um JWT é *self-contained* porque seu [payload](http://stackoverflow.com/questions/23118249/whats-the-difference-between-request-payload-vs-form-data-as-seen-in-chrome) possui toda informação necessária para autenticar um usuário, assim, não é necessário fazer mais que uma única consulta na base de dados.

JSON Web Tokens são comumente utilizados quando precisamos de autenticação em aplicações com arquiteturas stateless (REST por exemplo). JWTs nos permitem autenticar um usuário e garantir que as demais requisições serão feitas de forma autenticada, sendo possível restringir acessos a recursos e serviços com diferentes níveis de permissões. 

**O código fonte completo do exemplo apresentado neste post pode ser encontrado neste repositório do Github: [https://github.com/andreybleme/jwt-me](https://github.com/andreybleme/jwt-me)**


Estrutura do JSON Web Token
-------------
Um JWT é composto por três partes separadas por ponto.

`hhh.ppp.sss` 

- **H** eader
- **P** ayload
- **S** ignature

O **header** consiste em duas partes diferentes: o tipo do token (no caso JWT), e o nome do algorítimo responsável pelo hashing, [HMAC SHA256](https://pt.wikipedia.org/wiki/HMAC) ou [RSA](https://pt.wikipedia.org/wiki/RSA).

<script src="https://gist.github.com/andreybleme/6e1a4685b30d2bb6abf34e0adab5407c.js"></script>

Esse JSON será *encoded* via Base64Url e irá compor a primeira parte do token.

O **payload** contém o que chamamos de *claims*. *Claims* são atributos da entidade (no caso usuário) e metadados. Um exemplo de payload:

<script src="https://gist.github.com/andreybleme/b65d23c5c4d498af4bc4f707e2f4e9fc.js"></script>

Essse JSON será *encoded* via Base64Url e irá compor a segunda parte do token.

A **signature** verifica que o remetente do JWT é quem diz ser para garantir que a mensagem não foi alterada durante o tráfego. Para criar a assinatura (signature), utiliza-se o header Base64 *encoded*, o payload também Base64 *encoded*, e o algorítimo especificado no header. Utilizando o algorítimo HMAC SHA256, a signature ficaria assim:

<script src="https://gist.github.com/andreybleme/cf63573ef6e2107ecb85f3b6aad97a2b.js"></script> 

Por fim teremos uma String em Base64 separada por pontos, compondo o JSON Web Token.

`eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTQ5MTUyMjg2NH0.OZQPWEgs-JaABOCEodulSiN-yd-T1gmZzrswY4kaNKNI_FyOVFJPaBsAqkcD3SgN010Y4VSFSNh6DXNqHwNMIw`

Para testar esses conceitos e montar um JWT, você pode usar o [JWT Debugger](https://jwt.io/) e ver o token sendo formado na prática.


Criando o projeto Spring boot
-------------

A ideia é implementar autenticação para uma aplicação Springboot. Para criar um novo projeto spring boot basta acessar [https://start.spring.io/](https://start.spring.io/) e no campo "dependencies", adicionar apenas "Web". Fazendo isso, um novo projeto pronto para ser executado será criado já com todas as dependências que precisamos para executar a aplicação.

Feito isso, criaremos uma rota `/home` para verificarmos o funcionamento correto da nossa aplicação, mais tarde criaremos outras rotas. Quando queremos criar métodos que representem endpoints no Spring, precisamos criar um `RestController`. Por hora, vamos adicionar o endpoint na única classe que temos no projeto, a classe principal.

<script src="https://gist.github.com/andreybleme/666dd65233111c24b3d6bc6fe9c7a993.js"></script>

Executando o método main, acessando o endereço `localhost:8080/home` devemos ver a mensagem ""Hello buddy!".

Agora vamos extender um pouco mais, criando a classe `UserController`. Essa classe também será anotada com `@RestController`, vamos mapear a URL `/users` retornando um JSON simples quando ela for acessada.

<script src="https://gist.github.com/andreybleme/ca5031efe11f30bdc11fde80ac0b818d.js"></script>

Como fizemos na nossa classe principal, aqui também criamos um endpoint. A diferença é que nosso método retorna um JSON. Por essa razão adicionamos a anotação `@ResponseBody`. Com essa anotação, quando uma requisição especificar em seu header que aceita `application/json` , os dados serão retornados para o client em formato JSON. 

<script src="https://gist.github.com/andreybleme/7eab61427b3b3030967ecc548e99168e.js"></script>


Adicionando segurança às rotas
-------------
Até esse momento, os recursos da nossa aplicação estão expostos para todos. Qualquer pessoa pode acessar a lista de usuários do nosso servidor. Para que esse recurso seja restrito apenas a usuários autenticados, vamos adicionar segurança à nossa aplicação com JSON Web Tokens!

Nesse exemplo, vamos expor publicamente apenas os recursos disponíveis em `/home` e `/login`. Para acessar `/users` será necessário que o usuário envie ao nosso servidor um token JWT válido. Para isso, vamos adicionar duas dependências ao `pom.xml`. A primeira é  `spring-boot-starter-security` que nos permite trabalhar com autenticação no Spring, e a segunda, é `jjwt` que vai gerenciar nossos JWTs.

<script src="https://gist.github.com/andreybleme/1a12be46452eb9170c30b2cbc2d1c9dd.js"></script>
 
 Adicionadas as dependências, a primeira coisa que queremos fazer é deixar de expor os recursos de `/users` publicamente. Por tanto, vamos criar uma configuração que restrinja esse acesso criando uma nova classe chamada `WebSecurityConfig`. Essa nova classe vai ser uma classe filha da classe `WebSecurityConfigurerAdapter` do [Spring security](https://projects.spring.io/spring-security/). Nesse exemplo, vamos cria-la em um novo pacote `com.jwtme.security`.

<script src="https://gist.github.com/andreybleme/cd4abdaa3736d43d22f4897d411c265f.js"></script>

Aqui estamos usando anotações do Spring Security e do próprio Spring Boot. Se quiser aprender mais sobre estas anotações e outras features interessantes do Spring, recomendo este livro do [Henrique Lobo: Vire o jogo com Spring](https://amzn.to/2vmRYKP) e [Spring in Action](https://amzn.to/2SC0nlU).

Nessa classe definimos que todos podem acessar `/home`, e que o endpoint `/login` está disponível apenas via requisições do tipo POST. Para todas as demais rotas a autenticação é necessária. Não se preocupe com erros de compilação, já que ainda não criamos as classes `JWTLoginFilter` e `JWTAuthenticationFilter`. Vamos cria-las em breve. Elas serão as classes responsáveis por filtrar as requisições feitas em `/login` e em todas as outras rotas, para decidir como essas requisições deverão ser tratadas. Repare que também adicionamos uma conta default aqui, para testarmos o funcionamento da autenticação. 

Uma grande vantagem de estarmos utilizando o Spring boot aqui, é que em momento algum foi necessário mudar o código já existente das rotas, nem adicionar arquivos .xml de configuração! Tudo foi feito pragmaticamente com uma classe de configuração anotada com `@Configuration`.

As classes `JWTLoginFilter` e `JWTAuthenticationFilter` serão responsáveis por lidar com login e validação da autenticação dos usuários quando acessarem outras rotas. Por tanto, antes nos preocuparmos com elas, vamos ter que criar as classes que irão lidar com os JWTs.


Criando os JWT Services no Spring boot
----------
Nossos JWT services serão responsáveis por gerara e validar nossos JWT tokens. Nesse exemplo vamos criar um token baseado em `username` e um `expiration_time`, em seguida iremos assiná-lo com uma palavra chave `secret`.

Para criar e verificar nossos tokens, vamos criar a classe `TokenAuthenticationService` dentro do mesmo pacote `com.jwtme.security`.  Nela vamos utilizar a classe que incluímos como dependência `io.jsonwebtoken.Jwts` para validar os tokens.

<script src="https://gist.github.com/andreybleme/036ce00169c70e12d3032d45390705dc.js"></script>

Recomendo o livro [Spring in Action](https://amzn.to/2SC0nlU) para mais detalhes sobre as classes do Spring Security.


Autenticando os JWTs
-----------
Já temos tudo que precisamos para usar os JWTs no processo de autenticação. Agora vamos criar a classe `JWTLoginFilter` para interceptar as requisições do tipo POST feitas em `/login` e tentar autenticar o usuário. Quando o usuário for autenticado com sucesso, um método irá retornar um JWT com a autorização `Authorization` no cabeçalho da resposta.

<script src="https://gist.github.com/andreybleme/df031ab9c0fdc6034a03bb75b9553e34.js"></script>

Aqui o método `attemptAuthentication` é quem lida com a tentativa de autenticação. Pegamos o `username`e `password` da requisição, e utilizamos o `AuthenticationManager` para verificar se os dados são correspondentes aos dados do nosso usuário existente. Caso os dados estejam corretos, invocamos o método `successfulAuthentication` para enviar ao service `TokenAuthenticationService` o username do usuário para que este service adicione um JWT à nossa resposta (response).

Agora sim, criaremos a classe `JWTAuthenticationFilter`.

<script src="https://gist.github.com/andreybleme/a9ca172117dd6f4adfcf7ff0f61fe83c.js"></script>

Nessa classe validamos a existência de um JWT nas requisições, com ajuda do service `TokenAuthenticationService`.

Agora só falta criarmos a classe `AccountCredentials`, que será utilizada para enviarmos as credenciais da conta a ser validada quando fizermos requisições do tipo POST à URL `/login`. Requests de login portanto, devem ser feitas com um objeto do tipo `AccountCredentials` em seu body.

<script src="https://gist.github.com/andreybleme/b4b1878015c4551d153d987aec023071.js"></script>

Executando a autenticação
-------------
Nossa aplicação agora está segura e podemos realizar autenticações com JWT! Após reiniciar a aplicação vamos tentar acessar o endereço `http://localhost:8080/users`. Se tudo estiver funcionando corretamente, a resposta deve ser `Access Denied`.

Para nos autenticarmos corretamente, vamos enviar uma requisição do tipo POST para o endereço `http://localhost:8080/login` com as credencias do nosso usuário default no body. Usando o [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop) a requisição feita com sucesso deve se parecer com isso:

![Login JWT](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/jwt-login.png "JWT Login Request")

No header da resposta dessa requisição temos nosso token com o prefixo `Bearer`. Para buscar os usuários, agora precisamos enviar no header da requisição nosso token incluindo o cabeçalho `Authorization` com o JWT que recebemos quando realizamos a autenticação com sucesso.

![Users JWT](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/jwt-users.png "JWT User Access")

E é isso! Se quiser ir além e aprender mais sobre Spring Framework, indico a leitura dos livros:

<a target="_blank"  href="https://www.amazon.com.br/gp/product/1617294942/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1617294942&linkCode=as2&tag=andreybleme-20&linkId=f79acef1aceb814981c20b4a9ec713c9"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=BR&ASIN=1617294942&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=andreybleme-20" ></a><img src="//ir-br.amazon-adsystem.com/e/ir?t=andreybleme-20&l=am2&o=33&a=1617294942" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

<a target="_blank"  href="https://www.amazon.com.br/gp/product/B00VRS7X3Q/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00VRS7X3Q&linkCode=as2&tag=andreybleme-20&linkId=910c1ec0986f1389aaad506e4258d548"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=BR&ASIN=B00VRS7X3Q&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=andreybleme-20" ></a><img src="//ir-br.amazon-adsystem.com/e/ir?t=andreybleme-20&l=am2&o=33&a=B00VRS7X3Q" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

-------------


Referências e links úteis
-------------
- [JSON Web Tokens](https://jwt.io/)

- [REST Security with JWT](https://www.toptal.com/java/rest-security-with-jwt-spring-security-and-java)

- [What's the difference between “Request Payload” vs “Form Data”](http://stackoverflow.com/questions/23118249/whats-the-difference-between-request-payload-vs-form-data-as-seen-in-chrome)

- [Spring Initializr](https://start.spring.io/)