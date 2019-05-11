---
layout: post
title:  "Sistemas de mensageria"
description: "Conhecendo conceitos básicos, pontos fortes e fracos, variações, alternativas e suas motivações."
date:   2019-05-11 17:00:00
tags: [microservices]
comments: true
share: true
---

Nos últimos 4 anos muito tem se falado a respeito de microservices e sistemas distribuídos em geral. Na busca por robustez, resiliência e alta disponibilidade, novas tecnologias parecem surgir todos os dias para nos ajudar a alcançar o tal "estado da arte". Netflix, SoundCloud, Airbnb e aqui no Brasil, Nubank, tem apresentado [cases de sucesso](https://www.infoq.com/br/presentations/construindo-a-nuconta-do-zero-a-milhoes-de-clientes) utilizando diferentes técnicas e ferramentas. Dentre os diversos conceitos, talvez o mais fácilmente encontrado em arquiteturas compostas por microserviços sejam os sistemas de mensageria (message brokers). 

Se você assistiu a alguma palestra do InfoQ de 2016 pra cá, ou conhece por dentro algum desses sistemas distribuidos altamente escaláveis, provavelmente já ouviu falar de Apache Kafka, RabbitMQ, Amazon SQS, ActiveMQ, Amazon SNS ou Event Sourcing. Todas estas são tecnologias (uma técnica no caso do event sourcing) presentes em sistemas intermediários que atuam no processo de comunicação entre sistemas. Essa comunicação entre serviços acontece através da troca de mensagens.

Em meio a tantas buzzwords, ficam perdidas as motivações que levaram à utilização de cada uma dessas tecnologias. Pessoas desenvolvendo software em alto nível procuram cada vez mais entender como utilizar todas essas ferramentas, na esperança de que ao utilizar "a mesma ferramenta que o Netflix usa", terão habilitados requisitos de resiliência e escalabilidade no software em que trabalham. 

O que muitas pessoas não percebem é que o processo de aprendizado funciona de "baixo pra cima", isto é: primeiro aprendemos a base, o conceito por trás da técnica, a motivação que causou o movimento. Só depois faz sentido aprender a forma como estes mesmos conceitos funcionam em um contexto específico, como funciona na prática utilizar uma ferramenta que surgiu com a proposta de resolver um problema. Como toda tecnologia, estas tem também sua motivação e compartilham entre si um aspecto comum: a troca de mensagens. Neste post veremos o que motivou a adoção em massa dos sistemas de mensageria, como funcionam, suas fraquezas e seus principais conceitos, para que você saiba o mínimo necessário para começar a trabalhar com qualquer um dos tão falados sistemas de mensageria modernos.


Um pouco de história
----

Olhando para o passado, vemos que aos poucos empresas passaram a possuir diversos sistemas, cada um atuando em uma diferente aŕea de negócio. Sejam sistemas comprados de terceiros ou desenvolvidos "in-house" (como são chamados sistemas desenvolvidos pela própria empresa que a utiliza), hoje em dia é comum encontrarmos empresas com 20, 40 sistemas diferentes. 

É verdade que fornecedores de sistemas ERP tiveram algum sucesso criando sistemas enormes, com a promessa de atender às demandas de todos (ou quase todos) os setores de uma empresa no mundo corporativo. Mas o fato é que mesmo módulos enormes de bons sistemas ERP como SAP, Totvs e Oracle, cobrem apenas uma fração das diversas operações de negócio existentes em uma empresa. Prova disso é a constante crescente no mercado de integrações com sistemas desse tipo. 

Infelizmente (ou felizmente) integrar sistemas não é uma tarefa simples. Temos que lidar com múltiplas aplicações executando em diferentes ambientes de execução, escritos em várias linguagens e não raramente são sistemas restritos, caixas fechadas que não permitem a desenlvolvedores ter acesso ao códido fonte, que raramente é projetado para integrar com sistemas externos. Isso sem falar nos desafios de negócio envolvidos em fazer aplicações conversarem entre si: políticas de segurança, reorganização de equipes inteiras que até então, foram criadas para trabalharem em uma área específica de negócio e, agora com sistemas integrados, tem de entender sobre diferentes departamentos que trabalham de forma integrada. Aqui caberia fácilmente um outro post falando de todas as dificuldades quando pensamos em fazer diferentes serviços trabalharem em conjunto. Por hora basta compreender as dificuldades mais perceptíveis para avançarmos um pouco no tempo e conhecer as propostas que surgiram ao longo do tempo para resolver estes problemas.

### File Transfer

> Aplicações escrevem dados em arquivos para que outras aplicações possam ler.

Um arquivo é um mecanismo universal disponível em qualquer sistema operacional que se preze. Sabendo disso, a abordagem mais simples possível de se compartilhar dados entre aplicações seria através arquivos. Cada aplicação produz um arquivo contendo informações que outras precisam consumir.

![File Transfer](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/file-transfer.gif "File Transfer")

A grande vantagem aqui é que os sistemas não precisam conhecer a implementação um do outro, basta usarem um formato de arquivo comum. Cabe aos desenvolvedores de cada aplicação envolvida na comunicação lidar com as transformações de dados que precisam acontecer de acordo com seu contexto de negócio individual. Como resuldado temos um estilo de comunicação desacoplado, onde mudanças podem ser feitas internamente em uma aplicação sem que outras sejam afetadas, desde que o formato dos arquivos gerados seja respeitado.

**Problemas:** 

Parte do que faz a transferência de arquivos um padrão de comunicação interessante, é ausência da necessidade de ferramentas adicionais, mas isso também significa que desenvolvedores tem de fazer muita coisa sozinhos. Não há convenção de nomes ou formatos, a aplicação escrevendo dados em um arquivo deve conter alguma estratégia implementada para manter únicos os nomes de cada arquivo, bem como controlar seus diretórios. Aplicações devem concordar em qual delas será responsável por deletar arquivos após a leitura, ou se devem mesmo ser deletados e quando isso deve ocorrer. Ter vários sistemas lendo e escrevendo em arquivos compartilhados também pode causar problemas de concorrência, o que vai exigir mais um trabalho para os desenvolvedores: ter de criar uma mecanismo de lock para que aplicações não tentem ler um arquivo que ainda está sendo escrito por outra aplicação.

Além de todas estas questões, talvez o problema mais grave do modelo de transferência de arquivos seja a falta de sincronização. Imagineo cenário: um cliente atualiza seu endereço em dois sistemas diferentes da empresa. Em um dos sistemas houve um erro no momento da escrita dos dados no arquivo. Agora temos dois endereços diferentes para o mesmo cliente. Quanto maior for o tempo de transferência dos arquivos entre os sistemas, maiores as chances de termos problemas desse tipo. Um pesadelo que nos deixa de mãos atadas.


### Shared Database

> Aplicações armazenam dados em um repositório compartilhado entre aplicações interessadas.

Com os problemas de sincronia do modelo de Transferência de Arquivos, surge a ideia de termos um banco de dados armazenando dados compartilhados por diferentes aplicações. Agora temos dados sincronizados, estruturados em formato comum bem definido e sempre consistente.

![Shared Database](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/shared-database.gif "Shared Database")

Os dados estão submetidos a um processo de escrita e leitura transacional, tratar erros aqui ficou mais bem simples e assim como os arquivos, bancos de dados relacionais são amplamente suportados por qualquer plataforma de desenvolvimento decente.

**Problemas:**

Chegar a um design consistente para o esquema da base de dados única atendendo a múltiplos sistemas é muito difícil. Imagine contextos de negócio diferentes onde em um departamento da empresa o que se conhece por "produto" é um item qualquer em estoque, no outro, somente itens com um registro específico e um número SKU. Conciliar diferentes interpretações de negócio neste repositório de dados único compartilhado pode (e vai) gerar conflitos.

Ter diferentes aplicações lendo e escrevento em um mesmo banco de dados pode criar um gargálo de performance. Quando temos aplicações em locais diferentes do mundo, lendo e escrevendo no mesmo banco de dados, provavelmente também enfrentaremos problemas de lentidão nas operações. É possível se implementar uma estratégia de bancos de dados distribuídos, onde tenhamos cada aplicação escrevendo e lendo de um banco de dados local não compartilhado e sincronizar os dados através de um processamento tardio. Mas estratégias nesse sentido nos levam de volta a problemas de sincronização e consistência dos dados, como era a vida com a transferência de arquivos. 


### Remote Procedure Invocation

> Aplicações expõem funções para que outras aplicações possam invocá-las remotamente.

Sabemos que é possível, apesar de tantos problemas, compartilhar dados entre sistemas utilizando transferência de arquivos (File Transfer) ou um banco de dados compartilhado (Shared Database). Mas muitas vezes a atualização de um dado deve disparar uma ação em um sistema. Por exemplo, mudar um endereço pode ser simplesmente uma alteração de informação, ou pode gerar uma ação que valida as informações através de uma consulta na base de dados de endereços para verificar se o endereço não está fora da área de atendimento. Fazer com que um sistema invoque uma ação presente em outro requer uma abordagem diferente.

![Remote Procedure Invocation](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/rpc.gif "Remote Procedure Invocation")

Remote Procedure Invocation (também conhecido como RPC, Remote Procedure Call) é o estilo de comunicação que utiliza o princípio do encapsulamento para compartilhar ações com outros sistemas. A ideia é que sempre que uma aplicação precise de informação disponível em outra ela faça essa solicitação diretamente. Essa solicitação é feita através da invocação de uma função, como fazemos internamente em um software composto por funções e métodos. Cada aplicação continua tendo sua lógica de implemetação interna, seu próprio modelo de dados com seus formatos e particularidades. 

**Problemas:**

Desenvolvedores já estão acostumados a executar chamadas a funções locais, o que torna natural a utilização do RPC com suas chamadas a funções remotas. Por que estou falando disso na parte onde explicamos os problemas então? Porque apesar de parecer uma coisa boa, esse é um aspecto bem perigoso. Existe uma enorme diferença entre executar uma chamada a uma função local e chamar uma função remotamente. Quando aspectos de rede, latência e sincronismo não são levados em consideração no momento do desenvolvimento, o resultado é um sistema não confiável, cheio de problemas de performance e é questão de tempo até que se torne inoperante. 

A ideia do encapsulamento no RPC reduz o acoplamento entre sistemas removendo a base de dados única e compartilhada, mas cria outro acoplamento entre seus comportamentos definidos em interfaces. Desenvolvedores agora precisam se preocupar em escrever funções que atendem chamadas locais e chamadas remotas, que podem exigir particularidades de implementação que só fazem sentido para um sistema ou outro. A complexidade de se desenvolver funções sabendo se serão ou não utilizadas remotamente por um sistema ou outro, é mais uma armadilha que pode (e provavelmente vai) trazer problemas de manutenção.

### Messaging

> Aplicações criam pequenos pacotes de dados que são enviados a canais, responsáveis pela entrega dos pacotes a sistemas interessados.

A transferência de arquivos (File Transfer) ou um banco de dados compartilhado (Shared Database) permite a aplicações compartilharem seus dados, mas não suas funções. Invocar funções remotamente (Remote Procedure Incovation) nos permite compartilhar comportamentos, mas cria um alto acoplamento indesejado. Quando integrando sistemas procuramos uma solução colaborativa, que não cause dessincronização de dados nem crie um acoplamento desnecessário entre aplicações que servem a propósitos distintos a ponto de tornar inviável a comunicação, seja em termos de execução ou desenvolvimento. Mesmo a última solução proposta, o modelo RPC, infelizmente nos obriga a extender o design de uma aplicação ao domínio de integração.

Precisamos de algo parecido com o modelo de transferência de arquivos (File Transfer), onde possamos produzir pequenos pacotes de dados com frequência e os transferir com facilidade, tendo todos os sistemas interessados sendo automáticamente notificados em caso de termos um novo pacote disponível para processamento. A transferência deve contar com um mecanismo de retentativa de entrega em caso de falha. Os detalhes do modelo de dados de cada aplicação deve ser indiferente, o oposto do que é um banco de dados compartilhado (Shared Database). A transferência dos também dados deve acontecer de forma assíncrona, para que o sistema produtor do pacote não tenha que esperar que o recebedor processe para continuar sua execução, principalmente em caso de falha.

![Messaging](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/messaging.gif "Messaging")

Sistemas assíncronos de mensageria surgem como reação aos problemas que vimos nos modelos anteriores de integração. Postando mensagens em um canal (Message Channel), sistemas enviam mensagens que podem ser recebidas por um ou mais sistemas interessados (broadcasting). Este canal de mensagens (explicarei melhor mais tarde) é o que cria o limite entre aplicação e integração, diminuindo bastante o acoplamento entre os sistemas que trocam mensagens.

Enviando mensagens frequentemente podemos ter aplicações compartilhando não somente dados, mas também comportamento. Se uma ação no sistema A deve gerar um processamento no sistema B podemos enviar uma pequena mensagem avisando ao sistema B que esse processamento deve acontecer. Claro, esse processo não é tão rápido quando seria uma chamada RPC, mas utilizando sistemas de mensageria temos a vantagem da assincronia. O sistema A não precisa esperar a resposta do sistema B para continuar seu processamento. Maravilha! Temos o melhor de todos os outros estilos de integração. 

**Problemas:**

Não pense que sistemas trabalhando com mensageria são livres problemas. Pensar de forma assíncrona pode ser uma mudança brusca de paradigma, podendo fácilmente nos levar a criar problemas de sincronização de dados, já que temos processos distintos acontecendo em diferentes aplicações e, talvez, ao mesmo tempo. Com tanto processamento assíncrono e distribuído debugar e investigar erros também passa a ser uma tarefa bem mais complicada, exigindo a utilização de ferramentas de monitoramento capazes de analisar múltiplos componentes conectados em rede. 

A nova camada de integração que desacopla os sistemas conectados também carrega consigo uma série de novos conceitos bem particulares que precisam ser compreendidos para bem projetarmos sistemas de mensageria, vejamos:

\- Como um sistema envia um pacote de dados para outro?
O sender (sistema criando a mensagem) envia a mensagem a um canal (**Message Channel**) para que outro sistema se conecte ao canal e receba a mensagem.

\- Como um sistema sabe para onde deve enviar a mensagem?
Se o sistema não sabe para onde a mensagem deve ser enviada, ele pode enviar os dados a um roteador (**Message Router**) que irá direcionar a mensagem ao devido recebedor.

\- Como um sistema sabe qual deve ser o formado dos dados?
 Quando o sender e o receiver não trabalham com um formato de dados comum, o sender deve enviar a mensagem a um tradutor (**Message Translator**) que irá converter os dados recebidos em um formato que o receiver compreenda.

\- Como conectar minha aplicação a um sistema de mensageria?
Você precisa implementar um endpoint para enviar ou receber mensagens. Não um endpoint como o de uma API REST, um tipo mais abstrado que chamamos de **Message Endpoint**.

Muitos novos conceitos. São estes nomes em negrito os componentes básicos de qualquer aplicação que funcione com sistemas de mensageria. Se você entender cada um deles de forma agnóstica a tecnologias específicas, será capaz de trabalhar com qualquer sistema de mensageria moderno: Apache Kafka, RabbitMQ, Amazon SQS, ActiveMQ, Amazon SNS e outros.

Componentes básicos de um sistema de mensageria
----

## Channel

Uma aplicação não envia uma nova mensagem de forma aleatória a um sistema de mensageria esperando que ela mágicamente seja entregue ao sistema de destino. Como vimos, a aplicação envia os dados a um canal de mensagens, este canal de mensagens tem um nome, e o sistema que deseja receber uma mensagem deve conhecer o nome que identifica este canal. Imagine um sistema A que receba os dados de compra de um cliente e deve enviar estes dados ao sistema B para que este, envie um email notificando o cliente que a compra foi recebida e está sendo processada. O sistema A deve criar uma mensagem contendo os dados da compra, e enviar a mensagem ao canal "email.selling". O sistema B deve escutar mensagens disponíveis no canal "email.selling" e assim que encontrar, realizar o processamento (no caso, enviar o email contendo os dados presentes na mensagem).

Portanto, canais são endereços lógicos presentes em um sistema de mensageria. Cada sistema de mensageria implementa seus canais de uma forma, alguns podem garantir que mensagens postadas em um canal sejam entregues ao destino em ordem de chegada (FIFO), outros podem por exemplo priorizar o tamanho das mensagens enviando primeiro a de menor tamanho. Canais de mensagens podem ser criados e configurados via interface gráfica administrativa (a maioria dos sistemas de mensageria oferecem essa opção: SQS, RabbitMQ, ActiveMQ e outros), ou programáticamente utilizando APIs fornecidas pelo fornecedor do sistema de mensageria utilizado. Sistemas de mensageria não vem com canais pré-configurados. Precisamos manualmente criar os canais que precisamos com seus nomes de identificação e suas configurações específicas, como política de envio, protocolo, políticas de retentativa de envio em caso de falha e etc.

Canais são baratos (em termos de consumo de recursos computacionais) mas não são gratuítos. Cada canal precisa de um espaço em memória para armazenar mensagens e é claro, precisam de rede para transmitir dados. Em casos onde é necessário se ter milhares de canais transmitindo mensagens a diferentes aplicações, fique alerta: sistemas de mensageria limitam a utilização de recursos computacionais. Portanto se este for seu caso, certifique-se de estar utilizando um sistema de mensageria altamente escalável e flexível. 

Por último, os canais de mensagem podem ser básicamente de dois tipos: **Point-to-Point Channels** ou **Publish-Subscribe Channels**. Talvez em outro post podemos discutir seus detalhes e casos de utilização, mas de forma resumida: um canal Point-to-Point garante que uma mensagem recebida é entregue a um único sistema consumidor. Por outro lado, um canal do tipo Publish-Subscribe possui um único ponto de entrada por onde recebe mensagens e entrega a mesma mensagem a vários sistemas interessados. Canais Publish-Subscribe são comumente utilizados para enviar notificações push a apps instalados em diferentes celulares por exemplo.


## Message

Entendemos que um canal de mensagens é como um cano por onde trafégam os dados. Diferente de um cano no mundo real por onde a água passa de forma contínua, um canal de mensagem transmite unidades de dados em forma de registros, objetos e etc. A cada uma destas unidades trafegando por um canal damos o nome de mensagem.

Mensagens são enviadas a um canal através de um processo de *marshaling* na aplicação sender, e é recebida em uma aplicação receiver através de um processo de *unmarshaling*. Antes de enviar dados a um canal a aplicação sender deve transformar seus dados em uma mensagem. Após receber uma mensagem de um canal, uma aplicação deve transformar a mensagem em dados que possa compreender e processar. Esses processos são conhecidos como processos de *marshaling* e *unmarshaling*.

Uma mensagem consiste em duas estruturas básicas:

**Header:** Um cabeçalho contendo informações utilizadas pelo sistema de mensageria, que descrevem os dados sendo transmitidos, sua origem, destino, tamanho e etc. 

**Body:** Os dados própriamente ditos. Esta parte geralmente é ignorada pelo sistema de mensageria, que apenas transmite o conteúdo de uma mensagem sem qualquer verificação.

Esta estrutura não é única a mensagens. Pacotes transmitidos em uma rede Ethernet possuem básicamente a mesma estrutura geral, assim como mensagens de e-mail enviadas via SMTP.

Para sistemas de mensageria todas as mensagens são iguais: um cabeçalho e um corpo contendo dados que devem ser entres a seu destino. No entanto, para nós desenvolvedores existem de forma geral três tipos de mensagem. **Command Message**: utilizada para invocar funções em outros sistemas. Lembra do RPC? Sistemas de mensageria modernos utilizam Command Messages para simular uma chamada remota, [o RabbitMQ por exemplo funciona assim](https://www.rabbitmq.com/tutorials/tutorial-six-python.html). **Document Message**: tipo mais comum, utilizado quando queremos simplesmente enviar um dado de um sistema pra outro. **Event Message**: mensagens desse tipo são utilizadas para notificar outras aplicações de uma mudança. Lembra do famigerado [Event Sourcing](https://eventuate.io/whyeventsourcing.html)? Utiliza mensagens desse tipo, sem mistério.

## Endpoint

A aplicação que envia mensagens e o sistema de mensageria são componentes separados. Um sistema de mensageria é um tipo de servidor que recebe e responde a requests, tem seus próprios recursos e é executado em um ambiente isolado. Um sistema que utiliza mensagens por outro lado pode ser considerado um cliente deste servidor. Clientes precisam de uma forma de se conectar a seu servidor, para isso sistemas de mensageria fornecem APIs específicas.

Chamamos de **Message Endpoint** a parte de uma aplicação que encapsula a implementação da comunicação com o sistema de mensageria. Dessa forma temos um componente específico responsável por conhecer aspectos relacionados ao sistema de mensageria, como o formato das mensagens e os endereços dos canais, enquanto todo restante do sistema só precisa conhecer suas regras de negócio. Baixo acoplamento.

Este conceito básico utilizado por qualquer aplicação que troque mensagens com outros sistemas, nos permite ter a flexibilidade de alterar o sistema de mensageria a qualquer momento sem que toda implementação de uma aplicação seja afetada. Um Message Endpoint bem projetado possibilita a utilização de padrões de consumo seletivo de mensagens, onde podemos processar ou descartar determinadas mensagens de acordo com seus dados por exemplo (este padrão é conhecido como Selective Consumer). Este é apenas um exemplo do que podemos fazer de forma independente quando criamos Message Endpoints para operarem como *gateways*. Existem muitos outros padrões de consumo de mensagens que geralmente são implementados em um Message Endpoint. Alguns dos exemplos de padrões mais comuns implementados neste componente: Polling Consumer, Event-Driven Consumer, Indempotent Receiver e Message Dispatcher.

---

Pessoalmente vejo esses três componentes como sendo os essenciais que compõem sistemas de mensageria. Isso não significa que não existem outros. Como citado, existem também Routers, Translators, Pipes/Filters, mas preferi deixá-los de fora para não sobrecarregar o leitor que está tendo seu primeiro contato com os conceitos básicos. Talvez estes sejam incluídos em um outro post.

Se você chegou até aqui, parabéns, você provavelmente já é capaz de **compreender** a maioria dos sistemas de mensageria e pode começar a trabalhar com algum deles. Muitas coisas não foram ditas (propositalmente, afinal este é um post, não um livro) e nenhuma implementação prática de comunicação utilizando troca de mensagens foi demonstrada. Isso significa que você agora **deve experimentar sozinho, na prática,** algum sistema de mensageria e ver como os conceitos são aplicados por ferramentas de mercado. 


Referências e links úteis
-------------

- [Enterprise Integration Patterns: Designing, Building, and Deploying Messaging Solutions](https://www.amazon.com.br/Enterprise-Integration-Patterns-Designing-Addison-Wesley-ebook/dp/B007MQLL4E?tag=goog0ef-20&smid=A18CNA8NWQSYHH&ascsubtag=go_1366271959_58245915327_265589414315_pla-610113708225_c_)

- [Understanding Message Broker](https://www.3pillarglobal.com/insights/rabbitmq-understanding-message-broker)

- [Introduction to Message Brokers](https://hackernoon.com/introduction-to-message-brokers-part-1-apache-kafka-vs-rabbitmq-8fd67bf68566)

- [RabbitMQ Remote Procedure Calls (RPC)](https://www.rabbitmq.com/tutorials/tutorial-six-python.html)

- [Event Sourcing](https://eventuate.io/whyeventsourcing.html)
