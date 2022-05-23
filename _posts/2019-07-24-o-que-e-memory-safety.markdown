---
layout: post
title:  "O que é Memory Safety"
description: "Entendendo o significado de Memory Safety em linguagens e programas, com exemplos em C."
date:   2019-07-24 22:00:00
tags: [security]
comments: true
share: true
---

Recentemente tenho estudado com maior profundidade fundamentos de computação e algumas vulnerabilidades de baixo nível, mais específicamente [buffer overflows](http://andreybleme.com/2019-07-06/etendendo-explorando-buffer-overflow/) e [format string attacks](https://www.geeksforgeeks.org/format-string-vulnerability-and-prevention-with-example/). Foi então que reparei: o que todos esses erros de baixo nível e suas variações tem em comum, é o acesso indevido a regiões de memória. Pois bem, encontrei por todo lado artigos sempre destacando que estes erros não ocorrem em linguagens **memory safe** e/ou as que possuem gerenciamento automático de memória com garbage collector. Tendo um garbage collector isso é bem simples de ser compreendido: se uma linguagem possui um mecanismo que aloca e libera memória de forma automática e inteligente, não faz sentido dar ao programador a opção de gerenciar memória manualmente e criar possibilidades de violação de memória. Mas sabemos que existem linguagens focadas em alta performance que não podem se dar ao luxo de possuir um garbage collector: Rust e C por exemplo. Ainda assim, podemos escrever programas seguros (memory safe) utilizando estas linguagens (apesar de ser altamente trabalhoso e complexo). Existem então programas que são memory safe mesmo tendo sido escritos em linguagens que não garantem memory safety por padrão.

![Meme spider man memory safety](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/memory-safety-spiderman-meme.jpg "Meme spider man memory safety")

A questão então que pra mim ficou difícil responder é: **o que é memory safety**?

Inspirado [neste blog post de Michael Hicks](http://www.pl-enthusiast.net/2014/07/21/memory-safety/), aqui vou tentar chegar a uma definição compreensível do que é memory safety, afim de encontrar clareza e organizar ideias que podem ser de grande valor quando estivermos pensando em projetar linguagens de programação seguras ou simplesmente quando quisermos escrever programas seguros utilizando linguagem C.

Buscando a definição
----

Um pensamento comum que pode servir como ponto de partida para chegarmos à nossa definição de memory safety pode ser: **um programa é considerado memory safe se os seguintes erros de acesso a memória NÃO ocorrem**: 

**1.** Buffer overflow.

**2.** Null pointer dereference. 

"Dereference" é termo utilizado para se referir a remoção de referencia para um ponteiro. É importante que você entenda como isso funciona para compreender os exemplos que veremos mais a frente neste post. Veja [neste link](https://stackoverflow.com/questions/4955198/what-does-dereferencing-a-pointer-mean) uma excelente explicação sobre pointer dereference.

**3.** Uso após liberado (ponteiro continuar sendo utilizado após ter tido sua região de memória liberada através da função `free`).

**4.** Uso de memória não alocada ou inicializada.

**5.** Liberação ilegal (ponteiro ser liberado após já ter sido liberado anteriormente ou liberar ponteiro criado apontando para uma região de memória não reservada pela função `malloc`).

Se procurarmos na wikipedia "memory safety" encontraremos uma definição parecida, com uma lista destes mesmos erros de acesso a memória. Entender que estes erros não podem ocorrer para que um programa possa ser considerado memory safe é interessante, mas esta lista de erros surge mais como uma consequência da definição de memory safety do que é capaz de nos trazer uma boa definição de fato.

### A ideia que unifica os erros de acesso à memória

Um erro de acesso à memória ocorre quando um programa acessa regiões indefinidas de memória, isto é, regiões de memória que o programa não alocou no heap explicitamente através da função `malloc`, ou no stack através de declarações de variáveis locais ou funções. Por tanto, um programa memory safe nunca acessa memória indefinida. Podemos assumir que a memória é conceitualmente infinita, e que endereços de memória nunca são reutilizados. Dessa forma, memória que é desalocada (por exemplo através da chamada da função `free`) nunca é realocada novamente e permanecerá para sempre indefinida (entenda "pra sempre" como sendo o tempo de execução de um mesmo programa).

Esta definição já elimina a possibilidade de que ocorram os erros 2, 3 e 4. O erro 5 que fala sobre liberação ilegal de ponteiros também pode ser eliminado extendendo nossa definição, adicionando que: a função `free` só pode ser invocada passando como parâmetro ponteiros que apontam para um endereço de memória **definido**, isto é, alocado pelo nosso programa.

Infelizmente essa definição não é capaz de cobrir um buffer overflow, que ainda seria possível na prática. Para entender veja o programa abaixo que seria considerado memory safe pela nossa definição: 

<script src="https://gist.github.com/andreybleme/7ddb868afebbe8475e403d944a4a04bd.js"></script>


A definição que construímos até agora permite que este programa seja considerado memory safe porque o programa escreve em um espaço de memória alocado, que ainda por cima espera o tipo correto que estamos escrevendo (int). O problema é que o programa está escrevendo na variável **x** realizando um overflow em **buf** e intuitivamente entendemos que isso é uma violação de Memory Safety. Nossa definição ainda está ruim e possui "furos".

### Considerando espaços

Vamos enriquecer nossa definição. Vamos assumir agora que regiões de memória são alocados de forma infinita e separada. Assumindo esse espaçamento infinito entre regiões alocadas de memória, colocamos o programa acima fora da nossa definição de Memory Safe. Para fins de definiçao, agora vemos **buf** e **x** como sendo variáveis alocadas em **regiões distintas** (separadas e distantes) em memória, o que faz nos faz considerar **buf[5]** um acesso a uma região diferente da alocada para **buf**, ou seja, região de memória indefinida.

Estamos chegando mais perto de uma definição que cubra todos os cenários possíveis, mas ainda não chegamos lá. Nossa definição por hora permite o buffer overflow presente no programa abaixo (uma variação do programa 1):

<script src="https://gist.github.com/andreybleme/5c8bc43adbd32105c162129af9fc2dd7.js"></script>

Aqui o buffer overflow ocorre dentro do objeto "person". Poderíamos eliminar este programa da nossa definição se assumirmos que o espaçamento infinito também existe entre atributos de uma mesma struct. Por mais que a linguagem C sugere que uma struct é um objeto único (um único ponteiro é returnado da função `malloc`), é intuitivo pensar que diferentes atributos de um registro único ocupam regiões separadas de memória.


### Considerando possibilidades com ponteiros

Como já era de se imaginar, algumas operações com ponteiros também precisam ser consideradas na nossa definição de memory safety. Veja o exemplo abaixo de um programa que cria um ponteiro **px** a partir do atributo **x** de uma struct:

<script src="https://gist.github.com/andreybleme/b0442c8ca5b013c1afad942631c4cb12.js"></script>

Nas últimas duas linhas do programa 3 (linhas 13 e 15) temos algo interessante acontecendo: após incrementarmos o atributo **pc** da struct, criamos um ponteiro a partir do atributo **x** que possui valor 5. 

Podemos pensar em ponteiros como sendo "guardiões" de algumas capacidades, isto é, ponteiros nos dão a capacidade de acessar certas regiões de memória. Dessa forma, ponteiros possuem três elementos lógicos que chamaremos de **p**, **b** e **e** onde: **p** é o ponteiro própriamente dito, enquanto **b** é o início do limite de acesso a memória que o ponteiro concede e este limite se extende até **e**, sendo então **e** o fim desta região de memória definida pelo ponteiro. 

Para entender melhor estes três elementos lógicos do ponteiro, observe abaixo a imagem que representa os resultados da execução do nosso programa 3:

![Memory Safety Ponteiros e capacidade](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/memory-safety-ponteiros.jpg "Memory Safety Ponteiros e capacidade")

O programa manipula apenas o elemento **p**, enquanto **b** e **e** estão representados apenas para identificarmos os limites acessados e verificar se a execução do programa é memory safe ou não. 

Se considerarmos nossa definição até aqui, quando criamos um novo ponteiro na linha 12 não estamos violando o conceito de memory safety. O ponteiro criado está apontando para uma região de memória alocada por nós (veja a imagem novamente). 

Mas se ao invés de incrementarmos em 3 o valor de **pc** (**pf->pc += 3**), incrementarmos 10 (**pf->pc += 10**)? Se fizermos isso, quando um novo ponteiro é criado utilizando este atributo como refência estamos violando nosso conceito de memory safety. Isto porque estariamos criando um ponteiro que aponta para uma região de memória alocada por outro objeto qualquer que não é o nosso. Esse tipo de operação pode causar overflows como o que mostramos no programa 2.

Capacidades concedidas por ponteiros devem ser confiáveis. Um programa não deve ser capaz de "forjar" ponteiros, os criando a partir de conversões de valores inteiros fazendo operações como **p = (int *)5** por exemplo. Somente ponteiros considerados legais devem ser criados, onde ser "legal" aqui significa estar apontando para regiões de memória alocadas para ele mesmo, não para outras variáveis ou para memória não alocada. 

Por tanto, uma região de memória contendo valores inteiros pode ser modificada para armazenar um ponteiro, e ponteiros podem ser tratados como valores inteiros, mas não o contrário: valores inteiros não devem ser tratados como ponteiros.

De certa forma, esta maneira de pensar em ponteiros como sendo "guardiões" de capacidades é uma forma de [type safety](http://www.pl-enthusiast.net/2014/08/05/type-safety/) onde existem apenas dois tipos: tipo ponteiro e tipo não ponteiro (qualquer outro tipo). Esta definição garante que:

- Ponteiros só serão criados de forma segura, definindo suas regiões de memória de forma legal (dentro dos limites **b** e **e**).
- Ponteiros só serão [criados via dereference](https://en.wikipedia.org/wiki/Dereference_operator) se apontarem para regiões de memória contidas em seus próprios limites **b** e **e**.
- Regiões de memória utilizadas para criar ponteiros via dereference sempre serão regiões de memória definidas e inicializadas.

-----

Ufa, este foi um post com uma cara meio "acadêmica". Mas qual é o valor de se entender tudo isso? 

Pessoalmente acredito que compreender bem conceitos fundamentais é o que traz progresso no processo de aprendizagem. Vez ou outra vemos novas linguagens surgindo e se dizendo "memory safe" mas nem entendemos direito o que isso quer dizer. Quando Rust começou a ganhar fama aqui no Brasil por exemplo, em meados de 2017, tive muita dificuldade pra entender porque chamava tanta atenção. Lia pra todo lado na internet que Rust era tão performática quanto C++, com a vantagem de ser uma linguagem memory safe. Óbviamente não entendi nada. Foi depois de ler um bocado que entendi: Rust não é uma linguagem garbage collected mas consegue garantir memory safety aplicando uma série de técnicas: [affine types, weakening, contraction e outras](https://gankro.github.io/blah/linear-rust/). 

Existem projetos interessantes que buscam garantir memory safety em programas escritos em C e C++ como: [CCured](https://github.com/CTSRD-CHERI/ccured), [Splint](http://splint.org/) e [Valgrin](http://valgrind.org/). Estes programas são básicamente analisadores estáticos que fazem verificação simbólica afim de encontrar possíveis bugs de segurança. A maioria deles causa degradação de performance e nenhum foi amplamente adotado pelo mercado, mas vale a pena conhecer de qualquer forma.


Referências e links úteis
---

- [Fearless Security: Memory Safety - Blog post from Diane Hosfelt](https://hacks.mozilla.org/2019/01/fearless-security-memory-safety/)
- [Eternal War in Memory - Paper from László Szekeres, Mathias Payer, Tao Wei, Dawn Song](https://ieeexplore.ieee.org/document/6547101?arnumber=6547101)
- [The Meaning of Memory Safety - Paper from Arthur Azevedo de Amorim, C ̆at ̆alin Hritcu, and Benjamin C. Pierce](https://arxiv.org/pdf/1705.07354.pdf)
- [What is memory safety - Blog post from Michael Hicks](http://www.pl-enthusiast.net/2014/07/21/memory-safety/)
- [What is type safety - Blog post from Michael Hicks](http://www.pl-enthusiast.net/2014/08/05/type-safety/)
- [Memory Safety in Rust: A Case Study with C - Blog post from Will Crichton](http://willcrichton.net/notes/rust-memory-safety/)
- [The Pain Of Real Linear Types in Rust - Blog post from Alexis Beingessner](https://gankro.github.io/blah/linear-rust/)
