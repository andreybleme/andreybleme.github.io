---
layout: post
title:  "Qualidade de código e o developer Chaplin"
date:   2017-03-11 19:00:00
categories: offtopic business developers
---

Como desenvolvedores de software, estamos na maior parte do tempo preocupados em estudar técnicas de refatoração, modelos de escalabilidade, padrões de implementação (design patterns) e coisas relacionadas a qualidade de código. 

Todo business hoje em dia tem a tecnologia como um aspecto chave. Sendo assim, muito se investe em equipes de desenvolvimento de software, especialistas, infraestrutura e etc. No fim das contas, o que justifica todo essa gasto com tecnologia? Ferramentas de integração continua, code linters, horas/dias de refatoração, o que toda essa preocupação com a **qualidade do código** tem a ver com a evolução de um negócio?


Qualidade de Código e Objetivos de Negócio
-------------
Muitas empresas hoje resignificam o papel do developer, enxergando developers como o que chamam de [Software Craftsman](https://en.wikipedia.org/wiki/Software_craftsmanship). A abordagem basicamente dá mais relevância ao ponto de vista da equipe de desenvolvimento em relação a aspectos de negócio, logicamente isso vem com uma maior responsabilidade.

É responsabilidade do time de desenvolvimento informar ao business sobre os benefícios de se manter a qualidade do código, bem como justificar investimentos em "Engineering Resources", saber negociar novos prazos, necessidades de novas contratações e etc. 

Toda decisão do time técnico deve ser justificada com um **business output** (resultado de negócio tangível). Manter uma codebase de qualidade por exemplo, te permite **principalmente**:

- Adicionar novas features rapidamente

- Remover features existentes, já que deve ser fácil identificar quais componentes de software são relacionados a uma feature ou outra

- Evoluir features, pelas mesmas razões mencionadas acima

- Realizar deploys facilmente, sabendo que poucos ou nenhum dos aspectos de configuração deverão ser definidos manualmente

- Entregar software com maior frequência, já que o deploy se tornou algo simples

Repare: todos os itens mencionados acima são **benefícios de negócio**. Desenvolvedores já sabem que torná-los realidade é possível, ás vezes não sabem é associá-los ao contexto de negócio em que estão inseridos (problema grave).

Como bem diz [Victor Wu](https://twitter.com/victorwu416) Product Manager do Gitlab, "Engineering Goals Are Business Goals". Particularmente, concordo 100%. Empresas investem em tecnologia para tornar negócios economicamente viáveis, qualquer esforço por parte da equipe de desenvolvimento que não leve à melhores resultados de negócio, é essencialmente perda de tempo.


Negligência pela Sobrevivência
-------------

Falando de empresas maturas entregando produtos bem estabelecidos, é bem improvável que o mercado receba de bom grado grandes mudanças em seus produtos, principalmente se forem mudanças que afetam core features. O caso é que em empresas desse tipo, há uma maior exigência pela preocupação com performance, segurança e privacidade, o que torna praticamente impossível abrir mão de esforços para manter a qualidade do código.

Sendo assim, faz sentido **abrir mão da qualidade do código**? Ás vezes sim.

Em pequenas startups ou grandes empresas lançando produtos rapidamente para competir, eu diria que essas não só podem negligenciar a qualidade do código, como na maioria dos casos devem. Desenvolvedores podem não gostar de ler isso, mas é o retrato do conceito de [Débito Técnico](https://martinfowler.com/bliki/TechnicalDebt.html). Em momentos específicos faz sentido pra uma startup estrategicamente assumir uma série de débitos técnicos, a fim de lançar um produto ou uma nova feature rapidamente para ganhar em timing.

Se ao invés disso você escolhe ter 100% de cobertura em testes unitários e refatorar seu código toda vez que encontrar um code smell, provavelmente perderá boas oportunidades e em 3 meses ainda não terá um negócio com seu produto rodando, experiência própria. Como qualquer negócio saudável que no futuro atinge seu payback e paga suas dívidas, haverá tempo para colocar os débitos técnicos em dia, a fim de não ter uma codebase de má qualidade desacelerando o negócio. 

![Problemas imaginários](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/problemas-imaginarios.jpg "Problemas imaginários")

Defendo que **manter a qualidade do código é regra**, com exceções. O ponto aqui é que há muito o que fazer para aumentar as chances de sobrevivência de um negócio para se preocupar com a qualidade do código em cenários early stage. Então seja numa nova empresa ou novo produto, a **negligência ponderada** aqui não faz mal, se faz necessária. 


Developers developers, negócios à parte?
-------------
Ainda existem desenvolvedores que se incomodam em participar ativamente de decisões de negócio. Pra muita gente, é confortável simplesmente "apertar parafusos" (exatamente como em Tempos Modernos, filme de Chaplin) e seguir com a mentalidade de que desenvolvedor não tem nada a ver com business.

É necessário articular com o business, negociar, defender pontos de vista sob uma perspectiva técnica para que decisões de negócio sejam bem tomadas. A balança do que pode ou não virar um débito técnico é delicada e possui nuances técnicas que o time (obviamente) deve apresentar, sugerir opções e fazer recomendações.

 

----------


Referências e links úteis
-------------
- [TechnicalDebt](https://martinfowler.com/bliki/TechnicalDebt.html)

- [Software craftsmanship](https://en.wikipedia.org/wiki/Software_craftsmanship)

- [Code Review: A Business Imperative](http://get.gitlab.com/code-review-webinar/)