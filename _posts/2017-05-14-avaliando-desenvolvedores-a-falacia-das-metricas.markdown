---
layout: post
title:  "Avaliando desenvolvedores: a falácia das métricas"
description: "Como saber se um desenvolvedor está fazendo um bom trabalho?"
date:   2017-05-14 12:00:00
tags: [offtopic]
comments: true
share: true
---

Avaliação de um desenvolvedor é um tópico complicado. Quais parâmetros indicam que uma pessoa desenvolvedora de software deve receber um aumento de salário ou uma promoção? Ainda no mesmo contexto, o que está sendo avaliado quando dizemos que um desenvolvedor "vale mais" que outro?

Gerentes, donos e etc, precisam ser capazes de justificar aumentos e promoções. Idealmente desenvolvedores são recompensados pelo valor que agregam ao negócio com base em uma ideia simples: você faz a empresa ganhar mais dinheiro, a empresa te dá mais dinheiro.

O problema dessa abordagem é que, os argumentos dados pelo dono do dinheiro (representante do dono do dinheiro, no caso do gerente), podem ser vagos no ponto de vista do desenvolvedor. Imagine que você seja um desenvolvedor trabalhando pra [Atlassian](https://atlassian.com) (cool!). No ano passado, a Atlassian faturou com um produto que tem centenas de features, [$127.6 milhões de dólares](https://investors.atlassian.com/financials-and-filings/news/news-details/2016/Atlassian-Announces-Fourth-Quarter-and-Fiscal-Year-2016-Results/default.aspx). Como alguém pode saber o quanto desse valor se deve à existência de uma única feature? Mesmo que seja possível chegar a esse valor, essa feature provavelmente foi construída por várias pessoas. Como atribuir aos profissionais, individualmente, um valor relativo à receita gerada? Não existem boas respostas pra essas perguntas.

Por mais correta que a ideia possa parecer, ela não é prática.


Métricas quantitativas
-------------
Uma forma atrativa de resolver esse problema, é criar métricas quantitativas. Já que não podemos medir quanto um developer gera de valor para a empresa, vamos achar alguma coisa que podemos medir com facilidade. [Nada pode dar errado](https://www.youtube.com/watch?v=z7k4-e5jwsY), certo? 

![Code code code](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/todo-poderoso.png "Code code code")

Uma métrica comumente sugerida por pessoas que não tem conhecimento de programação é a **quantidade de linhas de código** por desenvolvedor. Essa métrica é doentia e burra porque a realidade é: código de alta qualidade geralmente possui poucas linhas. Vejamos um exemplo simples. Você quer exibir 5 produtos no seu e-commerce, então você escreveria algo como:

<script src="https://gist.github.com/andreybleme/642ed57afb9d7aac793fc70b751d65fb.js"></script>

Nenhum profissional decente escreveria um código assim. Ao invés disso, o que seria feito é algo parecido com:

<script src="https://gist.github.com/andreybleme/be9f5ce0a5ced31ec1b8be9ed3304bf9.js"></script>

Fazendo uma analogia, não avaliamos a qualidade do trabalho de um escritor pela quantidade de palavras em um livro. A conclusão lógica é que pagando developers por quantidade de linhas de código escritas, você estaria os recompensando de forma **absolutamente ineficiente**.

Alguns podem argumentar que medir a **quantidade de branches** é uma métrica eficiente. Mesmo que no contexto sejam utilizadas [feature branches](https://martinfowler.com/bliki/FeatureBranch.html), pessoas criariam muitas branches para esconder o fato de que não são tão produtivas assim.

Ah, e se a gente medisse a **quantidade de commits**? Péssima ideia. É fácil criar commits muito pequenos e isso não significa absolutamente nada em termos de valor agregado ao negócio, muito menos de qualidade de código. Isso sem falar de merges, reverts, resets e outros commits sem valor que surgiriam com maior frequência.

Seria a **quantidade de bug fixes** a resposta para uma métrica coerente? Isso pode ser complicado também, e particularmente, acho que essa métrica pode trazer sérios danos a médio e longo prazo. Recompensar por quantidade de bugs resolvidos pode incentivar desenvolvedores a resolverem problemas aparentemente do tipo bug sem se preocupar com a causa raiz desses problemas. No pior dos casos, você recompensaria profissionais por não se preocuparem com possíveis bugs surgidos de implementações deles mesmos! Cilada.

O problema de métricas quantitativas como essas, é que todas elas mudam o incentivo do desenvolvedor, que deveria ser gerar valor para o negócio, não criar muitas branches, commits ou corrigir uma grande quantidade de bugs.

Como saber se desenvolvedores estão fazendo um bom trabalho?
-------------
Na minha opinião: as melhores métricas são todas subjetivas.

Perguntas determinantes e que realmente ajudam a saber se estamos lidando com um bom desenvolvedor:

- Essa pessoa resolve problemas?
- Essa pessoa escreve código limpo?
- Essa pessoa é capaz de aprender rapidamente?
- **Você pode confiar nessa pessoa?**

Um bom desenvolvedor deve ser confiável. Parece óbvio, mas a quantidade de profissionais que realmente transmitem confiança quando estão resolvendo problemas é incrivelmente pequena. 

Destaque para essas 4 questões, mas é claro que outros tópicos também podem ser importantes. O ponto aqui é que respondendo essas perguntas a coisa fica mais prática e mais próxima de um cenário coerente.

Para responder essas perguntas é necessário que exista uma comunicação frequente com os desenvolvedores. Métricas quantitativas são convidativas porque são simples, fáceis de medir e geralmente baratas, portanto, fuja delas! Um processo decente de avaliação é trabalhoso e exige sensibilidade de quem avalia. 

Se você conhece outras formas de avaliar desenvolvedores, eu gostaria de conhecer! Coloque nos comentários e trocaremos ideias.

----------


Referências e links úteis
-------------
- [Developer Hegemony: The Crazy Idea that Software Developers Should Run Software Development](http://www.daedtech.com/developer-hegemony-the-crazy-idea-that-software-developers-should-run-software-development/)

- [Software Craftsmanship is Good Business](http://www.daedtech.com/software-craftsmanship-is-good-business/)