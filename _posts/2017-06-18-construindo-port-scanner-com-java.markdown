---
layout: post
title:  "Port Scanner Chatbot - Parte 1: Construindo um Port Scanner com Java"
description: "No primeiro post da série, veremos a construção do serviço que escanea portas de um servidor utilizando APIs de concorrência do Java."
tags: [java, port scanner]
date:   2017-06-18 16:00:00
categories: java
comments: true
share: true
---

Um [Port Scanner](https://en.wikipedia.org/wiki/Port_scanner) é um software que detecta portas disponíveis em um servidor ou em um host. O software mais famoso com essa finalidade é o [nmap](https://nmap.org/), que dentre várias coisas, também possui uma funcionalidade de port scan. Para utilizar essa função do nmap, basta especificar o IP da máquina a ser escaneada. No exemplo abaixo, utilizamos localhost `127.0.0.1`.

![Port Scanner nmap](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/port-scanner-nmap.png "Port Scanner nmap")

Esse tipo de software é útil quando precisamos ver quais são as portas disponíveis em um servidor. Apenas a título de curiosidade, port scanners também são muito utilizados em [ataques DoS](https://pt.wikipedia.org/wiki/Ataque_de_nega%C3%A7%C3%A3o_de_servi%C3%A7o). Durante esse tipo de ataque é importante saber quais são as portas disponíveis no servidor sob ataque, já que, para que o servidor seja sobrecarregado por excesso de requisições, essas requisições devem ser feitas a portas disponíveis.

Nesse post vamos nos concentrar nos aspectos de performance do software, para que futuramente, possamos aplicar esse scanner em um slackbot, que irá responder a perguntas sobre a disponibilidade de portas em um servidor.

Vejamos então, como funciona um port scanner e algumas alternativas de implementação usando Java.

Como funciona um port scanner?
-------------

A lógica por traz de um software desse tipo é bem simples: executamos um ping em todas as portas possivelmente disponíveis em um IP, especificando um tempo máximo de espera de resposta (timeout). Caso exista uma resposta dentro do período de tempo esperado, sabemos que a porta está disponível e atende a requisições, se não houver resposta, sabemos que essa é uma porta inacessível.

Para testar a conexão com as portas vamos utilizar um [socket](https://pt.wikipedia.org/wiki/Soquete_de_rede) que vai tentar estabelecer um elo bidirecional de comunicação entre nosso host e um servidor qualquer. Vejamos a implementação do método que testa a conexão com uma porta:

<script src="https://gist.github.com/andreybleme/d777854c2b6a54a0d9f0622c051dde2c.js"></script>

Se o socket conseguir estabelecer a comunicação com o endereço que fornecermos, temos uma porta acessível. Agora basta invocarmos nosso método para todas as [65535 portas](https://pt.wikipedia.org/wiki/Lista_de_portas_de_protocolos) possivelmente disponíveis:

<script src="https://gist.github.com/andreybleme/3b47df18ca3439bf17fd749a6be41b94.js"></script>


#### Problema à vista
Com essa implementação, precisamos de 200ms (valor que atribuimos à variável timeout) para cada uma das 65535 portas. Suponhamos que no pior dos casos, um firewall bloqueie o acesso a todas as portas. Nesse caso nosso port scanner é obrigado a esperar o timeout para todas elas! Assim, seriam necessários **13 mil segundos** até que o port scanner leia todas as portas, algo em torno de **3 horas**, nada bom.

Para resolver esse problema temos duas alternativas:

- Diminuir o valor do timeout.
- Paralelizar o trabalho com várias threads.

Somente diminuir o timeout não resolve de fato nosso problema. Pode ser que isso nos prejudique tento em vista que algumas portas podem demorar pouco mais de 100ms para responder por exemplo. Por esse motivo, a melhor alternativa é paralelizar o processamento.



Paralelizando o processamento
-------------

Vamos utilizar 20 threads para conseguirmos um tempo máximo de **10 minutos** de processamento. O tempo de processamento era de 13000 segundos, dividindo esse valor por 20 (quantidade de threads), temos 650 segundos, o equivalente a 10 minutos.

Vejamos a nova implementação do método `portaEstaAberta()` utilizando processamento assíncrono:

<script src="https://gist.github.com/andreybleme/ec8641ceb9ee0a2f0d6f437ffe604873.js"></script>

O [ExecutorService](http://tutorials.jenkov.com/java-util-concurrent/executorservice.html) que utilizamos como parâmetro, nos permite trabalhar com tasks assíncronas sem termos que criar threads manualmente como faríamos tradicionalmente: `Thread thread = new Thread(runnable);`. Este executor service é quem vai gerenciar o pool com as 20 threads que criaremos quando formos invocar o método `portaEstaAberta()`. 

No método `submit()` do executor service, usamos um [Callable](http://winterbe.com/posts/2015/04/07/java8-concurrency-tutorial-thread-executor-examples/) que é uma interface funcional. O Callable funciona exatamente como um [Runnable](https://stackoverflow.com/questions/13327571/in-a-simple-to-understand-explanation-what-is-runnable-in-java) passado ao construtor de threads, a diferença é que Callables não são do tipo `void`, eles retornam valores. No nosso caso, retornamos `true`caso o Socket estabeleça comunicação com a porta em questão no momento da execução da thread.

Callables podem ser submetidos a executor services, assim como runnables. Mas e o resultado do do callabe? Sabendo que o método `submit()` não espera o fim da execução de uma task para iniciar o processamento de uma nova, o executor service não pode retornar o resultado do callable diretamente. Em vez disso, o executor service retorna um resultado especial do tipo [Future](http://www.journaldev.com/1650/java-futuretask-example-program) que é usado para recuperar o resultado atual em um momento posterior. Por isso nosso método tem o retorno do tipo `Future<Boolean>`.

Vejamos a implementação completa com a chamada do nosso novo método:

<script src="https://gist.github.com/andreybleme/f548b5f62d558c300cbad002baace11b.js"></script>

**1.** Primeiramente criamos o executor service com as 20 threads e instanciamos uma lista de Futures do tipo Boolean, que receberão os valores `true`e `false` após a execução de todas as threads.

**2.** Passamos por todas as portas exatamente como era feito anteriormente. A diferença é que aqui armazenamos os resultados na lista de Futures.

**3.** Executor services precisam ser parados explicitamente, caso contrário nunca serão parados! Por esse motivo, invocamos o método `executorService.shutdown()`. Este método espera o fim da execução das tasks e para a execução do executor service logo em seguida.

**4.** Passamos por todos os itens da lista de Futures verificando a existência de valores verdadeiros. Quando encontramos, incrementamos a variável `portasAbertas` para contarmos quantas portas estão abertas no dado endereço.

> **Observação sobre o passo 4:** O método `future.get()` bloqueia a thread em execução e espera até que o callable complete a execução da task corrente. Isso garante que o retorno do processamento atual já esteja presente no Future retornado pelo método `portaEstaAberta()`.

**5.** Por fim, apenas imprimimos a quantidade de portas abertas no endereço especificado.

A estrutura do método `main()` pode ser alterada para exibirmos quais são as portas abertas, como fizemos na primeira versão do Port Scanner.

---------------------

Esse foi o primeiro post da construção do nosso Port Scanner. Nos próximos posts vamos adicionar mais valor ao scanner até que possamos perguntar a um bot do slack, quais são as portas disponíveis em um servidor e quais serviços estão sendo expostos nelas!

[Link pro repositório no Github.](https://github.com/andreybleme/portscanner-slackapp)

Na sequencia iremos:

- Expor um endpoint com Spring, para ser consumido pelo slack bot.
- Criar o bot para consumir o endpoint e responder a solicitações.

Referências e links úteis
-------------
- [Concorrência de Threads com Java: Tutorial e exemplos](http://winterbe.com/posts/2015/04/07/java8-concurrency-tutorial-thread-executor-examples/)

- [Java Concurrency: Basics](https://dzone.com/articles/javautilconcurrentfuture)

- [Java Executor Services](http://tutorials.jenkov.com/java-util-concurrent/executorservice.html)

- [Fastest way to scan ports with Java](https://stackoverflow.com/questions/11547082/fastest-way-to-scan-ports-with-java)

