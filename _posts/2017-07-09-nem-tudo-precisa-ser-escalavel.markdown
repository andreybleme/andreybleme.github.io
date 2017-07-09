---
layout: post
title:  "Nem tudo precisa ser Escalável"
description: "Reflexões sobre o preço de features que realmente escalam. Spoiler: Custam caro."
date:   2017-07-09 16:00:00
tags: [offtopic]
comments: true
share: true
---

Nem toda funcionalidade precisa ser escalável. Eis uma linha de pensamento ingenua que segui durante muito tempo: "Sem escalar a aplicação vai cair! Todo dinheiro gasto na aquisição de usuários não pode ser desperdiçado! Esse mecanismo tem que ser escalável!". 

**Features populares** precisam suportar acessos de milhares, talvez milhões de usuários. **Features populares** devem escalar. Essas são afirmações simples, e corretas. E como todas as respostas simples pra questões complexas, também não bastam.

Algumas (poucas) funcionalidades tem alta probabilidade de sucesso. Boas pesquisas com usuários podem ajudar a revelar problemas que pessoas estão realmente desesperadas para resolver. Consequentemente features que resolvem esses problemas tendem a ser muito utilizadas. Isso também é bem simples, certo? O que traz um aspecto complexo à coisa, é o fato de que algumas das soluções em software mais utilizadas no mundo, resolvem problemas que usuários nunca sequer perceberam que tinham. 


![Escalabilidade](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/escalabilidade.jpg "Escalabilidade")


Essas são soluções cheias de features com **alta probabilidade** de fracasso. Isso não significa que não valem a pena, mas que seu desenvolvimento deve ser tratado de forma diferente.



Quanto custa desenvolver sua feature escalável?
-------------
Por experiências próprias, penso que **a diferença entre garantir que uma feature é escalável e apenas garantir que uma feature funciona, é um grande investimento em tempo.**

Não é exagero dizer que pode-se gastar 10x mais tempo para construir algo escalável. Um projeto de 1 mês pode se transformar em um projeto de 10 meses se precisar ser escalável.

Isso é muito tempo sendo gasto em algo que usuários podem simplesmente não gostar.

Trazendo pro mundo real, imagine que você precise construir duas features onde cada uma delas tenha mais ou menos 50% de chance de ter sucesso. Vamos pensar que basta 1 semana para que cada uma delas seja desenvolvida rapidamente, e que, para que sejam escaláveis, são necessárias 10 semanas. Se for necessário fazer as duas funcionalidades escalarem, então serão gastas 20 semanas.

Se pensarmos em desenvolver as duas sem pensar em escalabilidade, temos 2 semanas de desenvolvimento. Reconstruir a feature que obteve sucesso leva +10 semanas. Considerando que uma das duas não foi de grande sucesso, não precisamos pensar em seu aspecto escalável. Com isso, economizamos 8 semanas de trabalho!

Tudo bem que 50% é uma probabilidade até alta de sucesso pra uma feature, vamos diminuir essa probabilidade de sucesso para apenas 25%, mas agora pensando em desenvolver 4 features. Construir rapidamente as 4 leva 4 semanas. Se refizermos somente a feature que obteve sucesso, pensando em escalabilidade e tudo mais, teremos 14 semanas de desenvolvimento. Economizamos 24 semanas.

Esses números só servem pra ilustrar um ponto de vista. No mundo real, não se lida com probabilidades de sucesso de uma feature de maneira tão simples e objetiva... Ainda assim, é relevante de discussões sobre essa perspectiva aconteçam em situações onde é necessário tomar uma decisão enter criar funcionalidades escaláveis ou apenas criar funcionalidades que funcionem. Principalmente em startups e empresas que criam novos produtos onde algumas tarefas são quase como apostas.


Refatore o que for durar
-------------
Em desenvolvimento de software não usamos medidas em percentuais como 50% ou 25%. As coisas costumam ser medidas em ordem de magnitude: 10x, 100x. No exemplo dissemos que uma feature demoraria 10x mais para ser desenvolvida caso precisasse ser escalável. 

No ano passado (2016) trabalhei em um projeto onde o desenvolvimento de 3 features se tornaram inviáveis por requisitos de escalabilidade. Tentamos não apenas desenvolver as features e simplesmente faze-las funcionar, mas estávamos o tempo todo pensando na escalabilidade dessas 3 features que trabalhavam em conjunto. O tempo passou, quase **4 meses de trabalho**, 2 desenvolvedores atuando em conjunto e avanço quase zero em todas as três.

O tempo de desenvolvimento não foi apenas 10x maior, mas 30x. No nosso planejamento, o custo de tempo estimado para garantir que as features escalassem não incluíam pequenas melhorias incluídas durante o desenvolvimento, nem **desgastes absurdos** com o corpo operacional e executivo que aguardavam ansiosamente a finalização do desenvolvimento para tracionar as vendas. Resultado: O time morreu. Assumi compromissos que não conseguia cumprir e, naturalmente, desentendimentos aconteceram até que as pessoas envolvidas no desenvolvimento fossem embora.

Começar se preocupando apenas em fazer funcionar não é uma regra, mas pode te ajudar a sair do lugar, a experimentar, colocar coisas em produção rapidamente e avaliar onde é necessário se preocupar com aspectos de escalabilidade. **Não pense nem por um segundo que isso anula sua responsabilidade de ter que refatorar essas features depois.** Se forem muito utilizadas vão precisar de atenção, análise, reconstrução, em fim, todo trabalho de fazer uma funcionalidade se comportar bem quando for usada por milhares ou milhões de usuários. Até lá tudo que você sabe é que sua funcionalidade será utilizada, então ela deve funcionar. Ponto. Se você não sabe se está construindo algo que vai durar, não invista muito do seu tempo, esforço e dinheiro.

Obviamente existem cenários onde deve-se pensar em escalabilidade desde o início. Soluções para grandes empresas, que resolvem problemas de um grande grupo de pessoas geralmente possuem requisitos não funcionais relacionados a escalabilidade. Nesse caso é necessário deixar claro os riscos envolvidos na entrega desse tipo de solução, principalmente em relação a prazos que costumam ser extremamente agressivos.

---------------------

Se puder, comece pensando apenas em fazer funcionar. Por mais convidativo que seja sonhar com aquela sua feature sendo usada por milhões de pessoas, não seja irresponsável (como eu fui). Não assuma compromissos sem ter ideia do quanto vai lhe custar fazer algo realmente escalável.

Nem sempre podemos começar pensando apenas em fazer funcionar, então em cenários onde seu software realmente precisa escalar, estude, procure por [bons livros sobre escalabilidade de software](https://www.quora.com/What-are-the-best-books-to-learn-how-to-build-scalable-web-applications), converse com pessoas que já enfrentaram problemas parecidos com o seu, procure por quem já colocou software escalável em produção antes de dizer que consegue entregar, que "dá pra fazer em 3 meses".  Analise as possibilidades, seja aberto com as pessoas em relação ao que pode ser feito rapidamente e o que não pode, e lembre-se: escalabilidade não é um atributo que surge "por osmose" em um projeto de software.


Referências e links úteis
-------------
- [Grande O](https://pt.wikipedia.org/wiki/Grande-O)

- [O que significa escalabilidade de software?](https://pt.stackoverflow.com/questions/90297/o-que-significa-escalabilidade-de-software)

- [Princípios para alcançar Desempenho e Escalabilidade em Aplicações](https://msdn.microsoft.com/pt-br/library/cc518051.aspx)