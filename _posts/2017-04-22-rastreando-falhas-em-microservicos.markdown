---
layout: post
title:  "Dicas para rastrear falhas em microserviços"
description: "Dicas para evitar o caos na identificação de falhas em microserviços."
date:   2017-04-22 16:00:00
tags: [microservices]
comments: true
share: true
---

Lidando com software monolítico, sempre temos acesso ao stack trace da execução de todo o programa, podendo investigar falhas de forma centralizada e não distribuída. A identificação do problema em projetos de [arquitetura monolítica](http://microservices.io/patterns/monolithic.html) geralmente consiste em: usar logs para ver o que precisa para investigar uma falha, ler os resultados e procurar pelo que deu errado.

Com o advento da computação em nuvem, passamos a ter aplicações sendo executadas em instancias efêmeras, ambientes virtualizados baseados em containers ([docker](http://www.mundodocker.com.br/o-que-e-docker/), [kubernetes](https://kubernetes.io/) e etc), em fim, sistemas distribuídos com [arquiteturas de microserviços](http://microservices.io/). Nesse cenário fica difícil confiar que logs de máquinas estarão lá quando for necessário analisá-los. Cuidados especiais são necessários.

Pensando nisso, algumas coisas podem ser feitas para aumentar o grau de rastreabilidade em microserviços.




Externalize o armazenamento de logs
-------------
A **integridade dos dados de log** é importante. Não se pode acreditar que logs estarão disponíveis em datas futuras quando você precisar, pelo menos não no mesmo ambiente onde sua aplicação é executada. Imagine ter que analisar logs em instancias de um ambiente auto-escalável. Não funciona.

A questão aqui é garantir **disponibilidade e durabilidade** dos logs. Seja armazenando logs em um bucket do S3 na amazon ou em um diretório local, eles tem de estar lá, organizados, acessíveis e se possível em uma estrutura pesquisável (falaremos disso daqui a pouco). Pra quem já está na AWS, o [CloudWatch Logs](http://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) é uma solução interessante. Além de armazenar e organizar os logs das instancias do EC2, o CloudWatch disponibiliza informações sumarizadas sobre o número de ocorrências de determinada falha nos logs, conseguimos ver quantos "NullReferenceException" existem ou erros do tipo "404" foram logados.

![Externalizando logs](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/mcs-logs.png "Externalizando logs")

Existem tutoriais muito bons pra quem quer implementar na prática esse tipo de storage para logs:

- [Exportando dados de log para o Amazon S3](http://docs.aws.amazon.com/pt_br/AmazonCloudWatch/latest/logs/S3ExportTasksConsole.html)
- [Usando o AWS CLI para exportar logs para o S3](http://docs.aws.amazon.com/pt_br/AmazonCloudWatch/latest/logs/S3ExportTasks.html)
- [Utilizando CloudTrail para monitorar Logs do CloudWatch](http://docs.aws.amazon.com/pt_br/awscloudtrail/latest/userguide/send-cloudtrail-events-to-cloudwatch-logs.html) 

Torne logs pesquisáveis
-------------
Armazenar logs de forma estruturada é um bom começo, mas de pouco adianta se você não for capaz de pesquisar neles. Mesmo que você não tenha logs armazenados em cloud é possível filtrar dados de logs utilizando ferramentas como [Logstash](https://www.elastic.co/products/logstash).

- [Guia: Iniciando com Logstash](https://www.elastic.co/guide/en/logstash/current/getting-started-with-logstash.html)

Para ajudar na visualização dos filtros de logs, existe o [Kibana](https://www.elastic.co/products/kibana), que em conjunto com o Logstash é uma mão na roda.

- [Logstash e Kibana para centralizar Logs no Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-use-logstash-and-kibana-to-centralize-and-visualize-logs-on-ubuntu-14-04)

Crie identificadores de correlação para requisições
-------------
Ao receber uma requisição, pode ser útil gravar um identificador para rastrear o histórico de requisições subsequentes. Após o armazenamento, esse identificador sendo enviado junto às requisições feitas a outros componentes/microserviços ajuda bastante na rastreabilidade porque torna possível a **investigação de um processo inteiro, mesmo que envolva múltiplos componentes do software**.


Retorne identificadores para o cliente
-------------
Tendo o identificador de requisições, por que não retornar esse ID pro client quando ele fizer uma requisição? Imagine em uma API por exemplo: o client faz uma requisição e algo dá errado. Com um ID da requisição em mãos fica fácil investigar apenas os aspectos relevantes da transação e entender o que causou o problema.

Em casos onde existe algum tipo de suporte à clientes, se o client sempre recebe o identificador da transação, alguém do time de OPS pode pesquisar o identificador nos logs e rapidamente descobrir o que deu errado sem a necessidade de uma investigação profunda da equipe de desenvolvimento por exemplo.

-------------------------

Rastrear falhas em instâncias que nascem e morrem todo o tempo é uma tarefa árdua. Utilizar boas práticas no tratamento de logs nos ajuda bastante a economizar tempo. Conhecer ferramentas adequadas e saber quando utilizá-las pode ser determinante para uma estratégia de sucesso de rastreamento de falhas em microserviços. 
 

----------


Referências e links úteis
-------------
- [Debugging Microservices in Production](https://www.infoq.com/presentations/debugging-microservices-production)

- [Pattern: Microservice Architecture](http://microservices.io/patterns/microservices.html)

- [Chris Richardson: A Pattern Language for Microservices](https://www.youtube.com/watch?v=bzXhs5NBscs)

- [Como monitorar e armazenar logs usando AWS](https://imasters.com.br/infra/cloud/como-monitorar-e-armazenar-logs-usando-aws/?trace=1519021197&source=single)