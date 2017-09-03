---
layout: post
title:  "Restrição de conteúdo e o futuro da internet"
description: "Nacionalistas e alt-right em Charlottesville nos mostraram quem deve ser responsável por restringir conteúdo na internet?"
date:   2017-09-03 15:00:00
tags: [offtopic]
comments: true
share: true
---

Tudo começou depois que um grupo de pessoas de extrema direita nos Estados Unidos marchou em um evento contra negros, imigrantes, gays e judeus. Autoproclamados fascistas, supremacistas, nacionalistas e alt-right pessoas marcharam à luz de tochas, dizendo: "Gays, negros, imigrantes imundos, todos eles se manifestam e recebem apoio por isso. Porque quando homens brancos decidem gritar por seus direitos e sua sobrevivência vocês fazem esse escândalo?" dentre outros discursos de ódio. 

Durante a marcha [um cidadão de carro atropelou quase 40 pessoas, uma mulher foi morta](http://www.em.com.br/app/noticia/internacional/2017/08/12/interna_internacional,891453/eua-manifestacao-da-direita-radical-em-charlottesville-termina-em-vio.shtml). Foi então que o portal de notícias neonazistas [The Daily Stormer](https://en.wikipedia.org/wiki/The_Daily_Stormer) publicou uma coluna tirando sarro do ocorrido com demonstrações de ódio e apoio ao causador do atentado. No texto publicado havia inclusive uma convocação aos leitores para que comparecessem ao funeral e tratassem de forma violenta os familiares e amigos da vítima. A ideia era entrar em conflito com todos os que lamentavam o ocorrido.

Com toda a polêmica em torno das publicações no The Daily Stormer, hashtags surgiram no Twitter em compaixão às vítimas, várias pessoas lamentavam o ocorrido e o mais importante em relação ao título do post: **As pessoas exigiam que sites como o Daily Stormer não tivessem lugar na internet**.

Muita coisa aconteceu desde esse episódio. Grandes empresas responsáveis por fazer da internet o que ela é hoje (Google, Facebook, Cloudflare, GoDaddy e outras), tiveram de se posicionar em relação a tanta pressão feita para que conteúdo pro-nazista fosse removido da internet. Vejamos então o que aconteceu, o que não aconteceu e refletir sobre aspectos importantíssimos, pouco discutidos em relação a neutralidade e a responsabilidade de empresas provedoras da internet.

Onde se regula conteúdo na internet?
-------------

Existem várias organizações que trabalham para que a internet como conhecemos, chegue até nós:

- Criadores de conteúdo (criam o conteúdo disponível online).
- Plataformas (Facebook, Twitter, Wordpress e etc), onde o conteúdo é publicado.
- Hosts (Amazon Web Services, Digital Ocean e etc), que suportam a infraestrutura onde plataformas são executadas.
- Proxies e CDNs (Akamai, Cloudflare e etc), garantem que plataformas sejam disponíveis e o acesso ao conteúdo seja seguro.
- Provedores de DNS (GoDaddy, Tucows e etc), que registram domínios de websites.
- Browsers (Chrome, Firefox e etc), transformam e organizam o conteúdo para que tudo seja "consumível".
- Mecanismos de busca (Google, Bing, DuckDuckGo), ajudam pessoas a descobrir plataformas e serviços da internet.

Qualquer uma das empresas responsáveis por esses serviços, são capazes de regular conteúdo na internet. 

A questão é: **quais deveriam?**

A relativização da neutralidade da internet
-------------

 As leis e responsabilidades para cada uma das empresas capazes de regular conteúdo na internet deveriam, e são diferentes. O que existe em comum a quase todas elas é o princípio da [neutralidade da internet](https://pt.wikipedia.org/wiki/Neutralidade_da_rede) que diz basicamente: todas as informações que trafegam na internet devem ser tratadas da mesma forma, navegando à mesma velocidade, garantindo o livre acesso a **qualquer tipo de informação** na rede. Em alguns países como os Estados Unidos por exemplo, o princípio da neutralidade na rede ainda é um assunto controverso. Por mais que a ideia pareça excelente para quem interpreta o princípio como algo que democratiza o acesso a informações e garante o aspecto imparcial em relação ao que trafega na internet, muitas pessoas tem argumentos contra o princípio da neutralidade. Alguns contrapontos são:

- Restrições à inovação

Há quem acredite que prioridades na rede são necessárias para o surgimento de novas tecnologias e inovações. Vários serviços de comunicação concordam que deve haver tratamento diferenciado para quem exige maior ou menor rapidez de transporte de dados, o que implica em preços diferenciados. Assim afirmam que a neutralidade da rede não oferece incentivos para inovação e competição no mercado, já que os provedores de serviços de internet não ganhariam nada com seus investimentos. 

Um exemplo: sites como o YouTube começaram a oferecer conteúdo livre de vídeo, passaram a usar grande quantidade de banda. Alguns provedores de internet sugerem que tem o direito de cobrar para disponibilizar seus conteúdos. Dessa forma, alegam que serviços de streaming como YouTube, Netlix e etc são colocados em risco pela neutralidade da rede. A neutralidade limitaria a quantidade de banda disponível, colocando em risco a inovação.
 
 - Oposição à Legislação

 Muitos questionam a capacidade do governo de bem regular a Internet de forma a causar avanço e ao invés problemas (eu também). A legislação convencional torna difícil para os provedores de Internet tomar ações como filtrar informações, para prevenir [ataques DDoS](https://pt.wikipedia.org/wiki/Ataque_de_nega%C3%A7%C3%A3o_de_servi%C3%A7o), prevenir disseminação de vírus e filtragem de spams. Alguns pontos da legislação tornam ilegais a priorização dos pacotes baseados em critérios que diferem dos pré-fixados. 

Apesar das preocupações dos opositores ao princípio, a grande maioria das empresas capazes de regular conteúdo na internet defendem a ideia e se posicionam de forma a seguir o princípio à risca. Foi então que uma empresa chamada [CloudFlare](cloudflare.com), responsável por, dentre várias coisas, proteger websites contra ataques DDoS, 
começou a receber mensagens de hackers do mundo inteiro que tentavam derrubar o site Daily Stormer através de ataques desse tipo. O problema que os tais "hackers do bem" diziam nas mensagens, era que a ação estava muito difícil por conta de um proxy cloudflare que o site usava para se proteger. Pediam para que a empresa desabilitasse o funcionamento do serviço para que fosse possível remover o The Daily Stormer da internet sobrecarregando seus servidores.

> Em acontecimentos semelhantes do passado a empresa já havia se posicionado como quem não tomaria nenhuma ação desse tipo em prol da neutralidade da internet, dizendo: ["A website is speech. It is not a bomb"](https://blog.cloudflare.com/cloudflare-and-free-speech/), que significa "um website é um discurso, não uma bomba".

Imediatamente após o recebimento das mensagens a empresa se posicionou como o esperado: [afirmaram não ter responsabilidade sobre o tipo de conteúdo presente no site de seus clientes](https://qz.com/1053689/cloudflare-is-the-one-tech-company-still-sticking-by-neo-nazi-websites-like-daily-stormer/). É importante saber: CloudFlare não é uma empresa host de nenhum website. A empresa possui serviços de proteção de rede e segurança, utilizados em quase 10% de todas as requisições feitas na internet. A empresa desativar um security layer **não faz com que conteúdo algum seja removido**, apenas torna o site mais lento e vulnerável a ataques.

![Twitter Daily Stormer](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/neutrality-daily-storm.png "Twitter Daily Stormer")


Depois de muita pressão a [GoDaddy removeu o serviço de DNS para o site](https://techcrunch.com/2017/08/13/godaddy-tells-white-supremacist-site-daily-stormer-to-find-a-new-domain-provider/) e Zoho cancelou o plano de utilização gratuito dos serviços de email. As duas empresas afirmaram que o portal The Daily Stormer violou os termos de serviço e por isso, estavam removendo acesso aos respectivos serviços. 

![Twitter CloudFlare](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/neutrality-daily-storm-cf.png "Twitter CloudFlare")

Poucos dias depois, finalmente: [CloudFlare desativou o security layer que impedia hackers de derrubarem o site The Daily Stormer](https://techcrunch.com/2017/08/15/after-charlottesville-more-web-service-providers-ditch-the-daily-stormer-for-tos-violations/).

Posso, mas será que devo?
-------------

Das várias empresas capazes de remover conteúdo da internet, algumas deveriam, outras não. Vi algumas pessoas no Twitter mostrando que a [Airbnb desativou contas de pessoas relacionadas a grupos neo-nazistas de Charlottesville](https://techcrunch.com/2017/08/08/airbnb-ban-white-supremacist-rally/), utilizando esse fato como argumento para que empresas como GoDaddy e CloudFlare desabilitassem os serviços para o The Daily Stormer. 

O senso comum diz que assim como a atitude do pessoal da Airbnb, o ato de desativar o security layer por parte da CloudFlare foi igualmente justo. O que vejo como problemático é: depois da decisão tomada em relação ao episódio de Charlottesville, será ainda mais difícil para empresas que prestam serviços de segurança, argumentar com governos de algum lugar que não gostem do conteúdo presente em sites de seus clientes. Imagine se passam a transferir chaves SSL de seus clientes para instituições de segurança de governos para colaborar com investigações de alguma natureza? Não seria loucura já que empresas assim oferecem serviços de SSL também. E se, por pressão, essas mesmas empresas tiverem de fornecer um feed mostrando o conteúdo do tráfego de rede de algum de seus clientes? Essas são ações que, segundo as políticas de privacidade dessas empresas jamais acontecerão. Desativar um serviço de proteção contra ataques DDoS também é um aspecto presente nos termos, e ainda assim, vimos o que aconteceu.

**Repare:** ações como a do Airbnb não abrem precedentes para este tipo de problema, já que a empresa não tem nenhuma relação com serviços determinantes para a **disponibilidade e o bom funcionamento da internet**. Penso que é sensacional que o [Facebook remova eventos criados na plataforma por grupos extremistas](https://www.theguardian.com/technology/2017/aug/16/daily-stormer-forced-dark-web-reddit-facebook-ban-hate-groups) por exemplo. A delicadeza do que fez o CloudFlare está no tipo de serviço que eles oferecem a seus clientes. 

![Free Speech](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/free_speech.png "Free Speech")
 
---------------------

Existe um ditado que diz: **situações difíceis fazem más leis**. É necessário ter cuidado ao analisar situações delicadas que envolvem risco ao principio da neutralidade da internet. Encarar os fatos de diferentes perspectivas é um caminho interessante para a sensatez: um portal com conteúdo ofensivo deve sofrer consequências legais, ter seu conteúdo limitado ou removido, mas, dependendo de quem for responsável por restringir conteúdo, brechas perigosas serão abertas e podemos nos arrepender no futuro.

Você concorda que pode ser perigoso para o futuro da internet ver empresas desse tipo sendo responsáveis por restrições de conteúdo? Não? Acha válida a restrição desse tipo de conteúdo por quem quer que seja? Comente aí embaixo e deixe seu ponto de vista!


Referências e links úteis
-------------
- [The one tech company still sticking by neo-Nazi websites is also one of their chief enablers](https://qz.com/1053689/cloudflare-is-the-one-tech-company-still-sticking-by-neo-nazi-websites-like-daily-stormer/)

- [CloudFlare and Free Speech](https://blog.cloudflare.com/cloudflare-and-free-speech/)

- [After Charlottesville, more web service providers ditch The Daily Stormer for TOS violations](https://techcrunch.com/2017/08/15/after-charlottesville-more-web-service-providers-ditch-the-daily-stormer-for-tos-violations/)
- [Airbnb is banning people trying to attend a white supremacist rally](https://techcrunch.com/2017/08/08/airbnb-ban-white-supremacist-rally/)
- [Daily Stormer jumps to dark web while Reddit and Facebook ban hate groups](https://www.theguardian.com/technology/2017/aug/16/daily-stormer-forced-dark-web-reddit-facebook-ban-hate-groups)