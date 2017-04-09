---
layout: post
title:  "Melhores partes do TDD"
description: "Mais que apenas uma estratégia de testes, TDD é uma ferramenta de design!"
date:   2016-12-19 22:00:00
tags: [test driven development]
comments: true
share: true
---


TDD (test driven development) não é um prática recente, e ao contrário do que muita gente já interpretou por aí depois da [palestra polêmica do DHH](https://www.youtube.com/watch?v=9LfmrkyP81M), o TDD não está morto. Assunto relativamente antigo esse do "TDD está morto" (2014) e a ideia aqui não é falar sobre isso. Muito já foi dito a respeito, então pra quem tiver interesse vou deixar os links de um debate **FODA** onde Kent Back, Martin Fowler, e o próprio David (DHH) falam sobre o assunto:

- [Is TDD Dead? (parte 1)](https://www.youtube.com/watch?v=z9quxZsLcfo)
- [Is TDD Dead? (parte 2)](https://www.youtube.com/watch?v=JoTB2mcjU7w) 
- [Is TDD Dead? (parte 3)](https://www.youtube.com/watch?v=YNw4baDz6WA)
- [Is TDD Dead? (parte 4)](https://www.youtube.com/watch?v=dGtasFJnUxI)
- [Is TDD Dead? (parte 5)](https://www.youtube.com/watch?v=gWD6REVeKW4)


Tenho passado por dificuldades em lidar com testes mal escritos. O problema não é o teste em si, mas o que sua qualidade diz sobre a implementação das classes testadas.

Escrever código que já nasce testado, é uma péssima justificativa pra se praticar TDD. Os maiores benefícios da prática não tem nada a ver com o aumento de cobertura. Utilizar TDD é contar com uma **ferramenta de design**, que te ajuda a enxergar problemas de acoplamento, encapsulamento, coesão entre classes e te ajuda a ficar bem próximo da solução menos complexa possível.

Sendo assim, achei relevante compartilhar pontos importantes a serem observados durante a prática do TDD. Pontos de atenção que podem até te fazer perder em "linhas de código por hora" (se é que isso é relevante), mas te fazem ganhar horas, ou dias quando pensamos na propensão ao surgimento de novos erros no código.

Encapsulamento
-------------
É importante perceber quando testes estão lidando excessivamente com objetos não testados, ao invés de lidar **apenas** com o objeto a ser testado. Isso geralmente, é um aviso ao desenvolvedor: encapsule melhor!

Testes de uma classe que fazem asserções **somente** em outras classes é um exemplo claro de regras mal encapsuladas. Classes devem ser responsáveis pelo seu próprio comportamento. Vide
[Tell, Don’t Ask](http://martinfowler.com/bliki/TellDontAsk.html)  e [Lei de Demeter](http://joleques.blogspot.com.br/2013/08/law-of-demeterlei-de-demeter.html).

Durante a escrita dos testes, se pergunte: Por que os testes dessa classe fazem asserts somente em outras classes?

Coesão
----
Classes não coesas fazem **muita coisa**. Escrever testes pra esse monte de coisas não é fácil. Então, here is the point: Testar deve ser fácil.

Métodos que precisam de vários cenários de teste para serem testados por completo, provavelmente possuem muitos comportamentos, o que pode indicar um probelma de coesão. Há quem diga que "se é necessário **mais de um** cenário de teste para  testar um método, ele ter ser refatorado". Sinceramente, não sei o quanto se ganha sendo pragmático a esse nível. 

Classes também não deveriam precisar de dezenas de testes para serem testadas por completo. Isso pode ser sinal de que elas estão expondo muitos métodos e, dessa forma, tendem a possuir muitas responsabilidades. Bad smell no quesito [SRP (Single responsibility principle)](https://en.wikipedia.org/wiki/Single_responsibility_principle).

Durante a implementação de novos métodos, algumas classes de teste parecem **não parar de crescer** nunca. Aqui vale uma atenção pra elas também: Essa classe realmente deve ser responsável por expor todos esses comportamentos? É uma deficiência de coesão que seu teste evidencia de forma clara.

Acoplamento
----
Vez ou outra precisamos criar objetos fake durante o teste para testar o comportamento de alguns métodos. São os **[mock objects](https://pt.wikipedia.org/wiki/Objeto_Mock)**, geralmente criados em Test Data Builders (e não copiados e colados repetidos em todos os métodos da classe de teste).

O uso excessivo de mocks, pode indicar problemas de acoplamento na classe sob teste. Isso porque uma classe que utiliza muitos objetos mocks, depende de muitas classes. 

A criação de mocks não utilizados em métodos de testes, também é um ponto de atenção. Isso geralmente acontece quando a classe é altamente acoplada, e o resultado da ação de uma dependência não interfere na outra. Quando isso acontece acabamos escrevendo conjuntos de testes, sendo que alguns deles lidam com um conjunto dos mocks, enquanto outros testes lidam com o outro conjunto de objetos mocks.

Por último, mas não menos comum: quando alteramos alguma regra de negócio em um método ou 2, e vários testes não passam, podemos estar lidando com um problema de acoplamento. Claro que, se você escreve vários testes pra testar um mesmo comportamento, todos eles vão quebrar ao alterar um comportamento isolado. Mais um sinal de que você pode não precisar de tantos cenários de teste para testar o mesmo comportamento.

Tudo resolvido então?
----
Refatorar o código toda vez que um desses pontos de atenção lhe aparecer, não vai resolver sua vida.

[Maurício Aniche](https://twitter.com/mauricioaniche), ao final de um dos capítulos de seu excelente livro [Teste e Design no Mundo Real](https://www.casadocodigo.com.br/products/livro-tdd), deixa um recado que cai bem aqui: "Lembre-se que esses pontos de atenção **não dão nenhuma certeza** sobre a existência de problemas. Eles são **apenas indícios**. O programador ao encontrar um deles, deve revisar o próprio trabalho e efetivamente comprovar que existe um problema, seja ele de encapsulamento, coesão ou acoplamento."


A quem interessar, criei um repositório no Github com vários exemplos pra cada um dos tópicos citados no post: [http://bit.ly/2hQQmOZ](http://bit.ly/2hQQmOZ)



Referências e links úteis
-------------
- [Livro - Test-Driven Development: Teste e Design no Mundo Real](https://www.casadocodigo.com.br/products/livro-tdd)

- [TellDontAsk](http://martinfowler.com/bliki/TellDontAsk.html)

- [Lei de Demeter](https://weblogs.asp.net/andrenobre/princ-237-pios-de-oop-a-lei-de-demeter-lod)

- [Objeto Mock](https://pt.wikipedia.org/wiki/Objeto_Mock)

- [Single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)