---
layout: post
title:  "Port Scanner Chatbot - Parte 2: Criando a API e configurando o Slack App"
description: "No segundo e último post da série, criamos uma API para expor nosso serviço de port scan e configuramos o Slack App."
tags: [java, port scanner]
date:   2017-12-08 00:10:00
categories: java
comments: true
share: true
---

No primeiro psot da série vimos como implementar a lógica que realiza o scan em todas as portas de um servidor. Utilizamos as APIs do Java 8 para paralelizar o processamento e ganhar performance. Agora veremos como externalizar essa lógica e, aí sim, finalizarmos o chat criando um slack app.

Links do post anterior: 

- [Port Scanner Chatbot - Parte 1: Construindo um Port Scanner com Java](http://andreybleme.com/2017-06-18/construindo-port-scanner-com-java/)
- [Código fonte Github - Parte 1](https://github.com/andreybleme/portscanner-slackapp/releases/tag/v0.1)

O Slack possui uma [documentação completa e com vários guias](https://api.slack.com/slack-apps) que ajudam bastante na hora construir integrações, apps e bots.

Para criar um chatbot que funcione com o Slack, precisamos expor uma API que será consumida pelo Slack. Cada vez que digitarmos uma mensagem, o Slack funcionará como um client que consome um endpoint específico da nossa API. Focaremos primeiro no código fonte da API e, em seguida, falaremos das ações finais que precisam ser executadas no painel de configurações da conta Slack.


Enviando e recebendo requisições via Slack
-------------

Primeiramente devemos criar [POJOs](https://pt.wikipedia.org/wiki/Plain_Old_Java_Objects) com todos os atributos que o Slack envia em suas requests a serviços externos. Vejamos quais são esses atributos:

<script src="https://gist.github.com/andreybleme/54394e119dfec0989e5cff1d0e17ab77.js"></script>

Para ver mais sobre parâmetros da request: [https://api.slack.com/slash-commands#triggering_a_command](https://api.slack.com/slash-commands#triggering_a_command)

Assim como os parâmetros da request, precisamos lidar com os parâmetros da response. O Slack espera que o response da request possua atributos específicos:

<script src="https://gist.github.com/andreybleme/922491b7869f59679162c49ee0fbf3bf.js"></script>

Para ver mais sobre parâmetros do response: [https://api.slack.com/slash-commands#responding_to_a_command](https://api.slack.com/slash-commands#responding_to_a_command)

Criando a API
-------------
Estrutura do projeto:

![Port Scanner API Estrutura](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/estrutura-portscanner.png "Port Scanner API Estrutura")

Pra quem já trabalha com REST APIs, nada de novo por aqui.

- **business:** neste pacote temos a lógica do port scanner, que procura pelas portas disponíveis. A criação deste serviço foi detalhada no [post anterior](http://andreybleme.com/2017-06-18/construindo-port-scanner-com-java/).
-  **controller**: aqui colocamos o REST controller criado com o Spring. Ele contém o endpoint acessado pela requisição do Slack. Veremos em detalhes sua implementação.
- **dto:** este é o pacote mais simples. Possui os DTOs  	`SlackRequestDTO` e `SlackResponseDTO`, que são utilizados como parâmetros dos endpoints.

### Encapsulando o processamento - pacote business
Para que os endpoints da API acessem a lógica que busca por portas disponíveis, criamos classes *Business*  que encapsulam todo o processamento. Vejamos como ficaram:

<script src="https://gist.github.com/andreybleme/8d38efc2efeb9220ca536e5adcb6db00.js"></script>

A interface mostra o único método que precisamos implementar: `getOpenPorts()`, que aceita como parâmetro um DTO com os atributos enviados pelo Slack e retorna outro DTO com os campos necessários para que a resposta seja corretamente exibida como uma mensagem no chat. Vejamos a implementação deste método:

<script src="https://gist.github.com/andreybleme/bd40cad9d1edd4b34cf91f5d95c30a39.js"></script>

> Para entender os detalhes da lógica de processamento que encontra as portas disponíveis utilizando as APIs de multi-thread Future, [veja o post anterior](http://andreybleme.com/2017-06-18/construindo-port-scanner-com-java/). Aqui vamos falar apenas dos aspectos de implementação que envolvem o Slack App.

A primeira coisa que podemos notar: o IP a ser visitado pelo nosso port scanner está disponível no atributo `text` do DTO da request. Isso porquê a única informação que o usuário precisa enviar via Slack é seu IP, com uma mensagem do tipo: "/scan 192.168.28.14". Fazendo isso, o Slack enviará à API apenas o conteúdo presente após o comando */scan* pelo atributo `text`.

Em seguida, utilizamos o IP para verificar quais portas se encontram disponíveis no endereço, invocando o método privado que criamos `isPortOpen()`. Este método apenas utiliza um Socket para tentar estabelecer uma conexão com determinada porta naquele IP e na sequência, retorna um valor booleano indicando a disponibilidade ou indisponibilidade da porta testada.

Voltando à execução do método `getOpenPorts()`: após termos os resultados de quais são as portas disponíveis na lista de futures `List<Future<Boolean>> futures`, na linha 39 verificamos quais são essas portas, para todas as que foram testadas, afim de armazenar 2 informações importantes para dar um bom feedback ao usuário via chat: 

**1.** A quantidade de portas disponíveis `amountOfOpenPorts++;`.

**2.** Quais são as portas diponíveis, por exemplo: 8080. `openPorts.add(Integer.toString(openPort));`.

Por fim, com essas informações retornamos um `SlackResponseDTO` que construímos usando um método muito simples responsável por formatar uma mensagem amigável ao usuário `buildSlackResponseTextMessage()`.

### Expondo os endpoints - pacote controller
Tendo corretamente encapsulado a lógica responsável por nos entregar a mensagem já formatada em um DTO contendo todos os parâmetros necessários para exibirmos a mensagem no Slack, nos resta criar um ponto de acesso a esses recursos. Faremos isso utilizando o [Spring Rest Service](http://spring.io/guides/gs/rest-service/) que facilita muito a criação de endpoints em aplicações Spring. Vejamos como fica nosso controller:

<script src="https://gist.github.com/andreybleme/b3aba52a012a4a710eea937d04e58583.js"></script>

Aqui definimos que nosso endpoint será disponível via POST através do path `/ports`. 

A primeira ação realizada, logo na linha 28, é verificar se o token recebido é um token válido pertencente a um canal existente do Slack. Não queremos que ninguém mal intencionado seja capaz de utilizar este recurso da API certo? Apenas usuários autorizados do Slack. Fazemos essa verificação utilizando uma classe business extremamente simples [(veja aqui sua implementação)](https://github.com/andreybleme/portscanner-slackapp/blob/master/src/main/java/com/portscanner/business/SlackVerificationTokenBusinessImpl.java), que através do método  `isRequestComingFromSlack()` verifica se o token é conhecido. No nosso método do controller, retornamos um HTTP status 403 Forbidden caso o token recebido seja inválido, junto ao status enviamos a mensagem: "The provided Validation Token is not valid!".

 Não tendo problemas com o token, invocamos nosso método do business `portScannerBusiness.getOpenPorts(slackRequestDTO);` que nos retorna o `SlackResponseDTO` com a mensagem contendo todas as informações sobre as portas encontradas. Se algum erro acontecer durante o processamento, retornamos ainda um HTTP status 500 Internal Server Error. 

O HTTP Status 200 OK com a mensagem de sucesso, só é retornado caso nenhum erro de processamento nem de permição aconteça.

Pronto! Aqui já temos a API 100% pronta para receber as requests do Slack. Faltam apenas alguns detalhes de configuração no próprio Slack para que nosso chat funcione perfeitamente!

Configurando o Slack App
-------------
**1.** Acessando a página [https://api.slack.com/apps](https://api.slack.com/apps) temos acesso aos apps que já criamos. Clique no botão "Create New App".

**2.** Escolha um nome e um "Development Slack Workspace", que é o ambiente Slack onde você pretende instalar o app port scanner.

**3.** Na aba "Add features and functionality" clique na opção "Slash Commands".

![Add features and functionality](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/slack-features-functionality.png "Add features and functionality")

**4.** Nessa tela ficam visíveis todos os comandos que os usuários do seu ambiente podem enviar ao seu app. Como ainda não temos nenhum, vamos criar um novo clicando em "Create New Command".

**5.** Aqui definimos o nome do comando, a URL da nossa API (este é o path onde o Slack fatá a requisição POST quando o usuário utilizar o comando definido) e uma descrição curta da ação a ser executada quando o comando for disparado.

![Slack create command](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/slack-create-command.png "Slack create command")


> A URL precisa usar https. No exemplo da imagem, a API está sendo executada no Beanstalk da AWS com um certificado SSL oferecido gratuitamente pela cloudflare. Veja como fazer deploy da API no Beanstalk [aqui](https://aws.amazon.com/pt/blogs/devops/deploying-a-spring-boot-application-on-aws-using-aws-elastic-beanstalk/) e como habilitar o https na cloudflare [aqui](http://andreybleme.com/2017-02-28/ssl-gratuito-cloudflare/).

**6.** Acesse a aba "Install Your App Into Workspace", e clique no botão "Install App". Nessa etapa serão exibidas várias autorizações que seu app precisa para funcionar no seu ambiente. Permita todas elas.

Tudo pronto! Para testar o funcionamento do bot, acesse seu ambiente slack como um usuário qualquer e mande a mensagem de qualquer janela:
"/scan localhost". Lembrando que o comando "/scan" foi o nome que eu escolhi, use o slack command que você escolheu no passo 5.

Concluindo
-------------
Se você trabalha no Slack diáriamente com uma equipe de desenvolvimento, pode ser bem últil que todos consigam saber o status de utilização de portas de um servidor via Slack. E ah, funciona também em containers!

O código completo da API se encontra no link: [https://github.com/andreybleme/portscanner-slackapp](https://github.com/andreybleme/portscanner-slackapp). 

Qualquer dúvida, problema ou feedbacks, não deixe de me escrever. :)

Referências e links úteis
-------------
- [Building Slack apps](https://api.slack.com/slack-apps)
- [Building great user experiences on Slack](https://api.slack.com/best-practices)
- [Slack Slash Commands](https://api.slack.com/slash-commands)

