---
layout: post
title:  "Projeto e Análise de Algoritmos, minha experiência"
description: "Compartilhando minha experiência cursando a disciplina Projeto e Análise de Algoritmos (PAA) durante o programa de mestrado em Ciência da Computação (DCC/UFMG)."
date:   2023-06-28 11:00:00
tags: [offtopic]
comments: true
share: true
---

Projeto e Análise de Algoritmos, também conhecida como PAA, é a única disciplina obrigatória do programa de Mestrado em Ciência da Computação na UFMG. Isto significa que qualquer aluno que deseja obter o título de Mestre em Ciência da Computação, independente da sua área de pesquisa (IA, redes, sistemas distribuídos, engenharia de software, etc) precisa cursar esta disciplina.

A disciplina tem fama no departamento pela sua densidade e complexidade, unindo conceitos de álgebra e estrutura de dados. Na minha experiência em 2023/01 essa foi de longe a disciplina mais desafiadora que já cursei. Assim a ideia neste post é compartilhar como foi minha experiência, dando uma visão geral do conteúdo na esperança de que seja útil para outras pessoas também.

Não pretendo falar sobre o programa de mestrado neste post, apenas da minha experiência pessoal com a matéria. Talvez no futuro eu escreva sobre o programa, mas se estiver aqui e quiser ler sobre o mestrado de forma geral, recomendo [este post](https://brito.com.br/posts/mestrado-ciencia-computacao/) do grande Rodrigo Brito.

![Cormen book cover](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/paa-cover.jpeg "Cormen book cover")

Figura 1. "Big Red" por Alexander Calder


## PAA é difícil?

O que muita gente quer saber antes de ingressar no programa, ou antes de se matricular em PAA, é se esta é uma disciplina tão difícil quanto dizem. A resposta que normalmente ouvimos quando fazemos essa pergunta a professores ou ex-alunos é: “depende”. Eu também acho que depende.

Se você se formou na graduação em uma boa universidade em um curso de computação, a ideia é que parte do conteúdo apresentado não seja novidade, principalmente a parte do conteúdo sobre algoritmos e estrutura de dados. Na minha turma muitos alunos graduados em Ciência da Computação no DCC da UFMG por exemplo não tiveram grandes dificuldades nas provas e trabalhos.

Esta é uma disciplina muito densa, muito conteúdo é apresentado em um período curto de tempo. Por isso, o nível de dedicação exigido fora do horário de aula é bem alto. Esse ritmo intenso não é novidade pra alunos de universidades públicas em geral, então se esse for seu caso, nada de muito novo por aqui. É impossível ir bem nas provas sem fazer muitos exercícios, e como o ritmo é acelerado, pra conseguir acompanhar você precisa manter regularidade nos exercícios.

Se você tem formação em outras áreas, ou veio de uma universidade que te permite graduar sem uma dedicação extra classe muito intensa, esta disciplina pode ser mais complicada. Isso não significa que é impossível ser aprovado em PAA vindo de uma área fora da computação. Muitos dos meus colegas de turma tinham formação em cursos de Economia, Física e Biologia por exemplo, e foram aprovados. O que quero dizer é que a disciplina se torna bem mais desafiadora quando você não sabe por exemplo o que é um grafo, uma fila de prioridades, ou se você não está familiarizado com algoritmos básicos de ordenação como insertion sort e merge sort. 

Muitos alunos optam por cursar exclusivamente esta disciplina durante o semestre, e pessoalmente, acho uma boa ideia evitar a sobrecarga de estudos tentando conciliar PAA com outras matérias. Isso também não é uma regra, conheço pessoas que cursaram PAA junto com outras disciplinas e foram aprovadas sem problemas. Na minha experiência como estudante em dedicação parcial, conciliar o trabalho de 8h fora da universidade com os estudos já é bem complicado. Conciliar PAA com outra disciplina seria, pra mim, uma missão impossível. Só consegui ser aprovado me dedicando exclusivamente a PAA durante o semestre.

A matéria exige muito tempo para estudo. Se você se formou em uma universidade particular como eu e era um aluno com notas boas, aqui você provavelmente vai descobrir que precisa estudar bem mais para manter as notas dentro da média. Este é, na minha opinião, o grande desafio da disciplina. A dificuldade do conteúdo em si varia durante o semestre a depender do seu *background*. Então em alguns módulos você pode se dar bem se tiver facilidade com manipulações algébricas, estatística, e lembrar de propriedades de logaritmos, por exemplo. Mas manter o ritmo intenso de estudos, fazer todos os exercícios com diferentes níveis de dificuldade, reler trechos de capítulos do livro depois da aula pra conseguir fazer exercícios, e manter essa mentalidade durante o semestre inteiro, este é o grande desafio.


## Conteúdo

A disciplina cobre tópicos necessários para que o aluno seja capaz de analisar e projetar algoritmos. Entendo que a ideia geral de PAA é estabelecer um vocabulário comum, e formalizar ideias que nos tornam capazes de comparar algoritmos, provar corretude, analisar sua complexidade, projetar novos algoritmos, e classificar problemas.

O livro base utilizado foi o famoso [“Introduction to Algorithms”. T. Cormen, C. Leiserson, R. Rivest e C. Stein](https://a.co/d/detvZi2). Em alguns tópicos sobre paradigmas de algoritmos, e NP-completude , outro livro bastante utilizado foi o [“Algorithm Design”. Jon Kleinberg e Eva Tardos](https://a.co/d/91yxARI).

### Analisando algoritmos

No módulo 01 são apresentados alguns algoritmos simples de ordenação e seleção, e o foco está no estudo de técnicas para analisar estes algoritmos.

- Provas de corretude com loop invariantes
- Notação assintótica (funções little/big O, little/big Omega e Theta)
- Recursividade e equações de recorrência
- Análise probabilística e algoritmos aleatorizados 
- Análise amortizada

Neste primeiro módulo usamos muitas notações matemáticas e manipulações algébricas. Se você saiu da graduação há muito tempo e não se lembra de propriedades básicas de funções, polinômios, indução matemática, teoria de conjuntos, e propriedades de logaritmos, recomendo fortemente que faça antes uma revisão com exercícios focados nas suas dificuldades.

Pessoalmente achei este o módulo mais difícil da disciplina. A combinação de Algebrismo com Estrutura de dados foi bem desafiadora, mas com muito estudo é possível ter boas notas. Um livro recomendado pelos professores que me ajudou bastante é o [“Matemática Discreta e Suas Aplicações”. Kenneth H. Rosen](https://a.co/d/0vC7wD9), especialmente o capítulo 04 sobre indução matemática, indução completa e boa ordenação.

### Algoritmos em grafos

O segundo módulo é dedicado ao estudo de algoritmos em grafos. São apresentados algoritmos para percorrer grafos de diferentes maneiras, encontrar caminhos mínimos, árvore geradora mínima (MST), fluxo máximo e corte mínimo em uma rede. 

Além de entender como estes algoritmos funcionam, é importante saber utilizar as técnicas de análise apresentadas no módulo 01 para analisar e comparar estes algoritmos. Como podemos demonstrar a corretude de um algoritmo que encontra caminho mínimo em um grafo? Este é um exemplo de pergunta que estamos interessados em responder no módulo 02. São estudados neste módulo:

- Algoritmos elementares [BFS](https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/) e [DFS](https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/), [ordenação topológica](https://www.geeksforgeeks.org/topological-sorting/?ref=lbp)
- Árvore geradora mínima (MST) com os algoritmos gulosos de [Prim](https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/) e [Kruskal](https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/?ref=lbp)
- Caminhos mínimos 1 to all com os algoritmos de [Bellman Ford](https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/) e [Dijkstra](https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/)
- Caminhos mínimos all pairs com os algoritmos de [Floyd Warshall](https://www.geeksforgeeks.org/floyd-warshall-algorithm-dp-16/) e [Johnson](https://www.geeksforgeeks.org/johnsons-algorithm/?ref=lbp)
- Fluxo máximo e corte mínimo com os algoritmos de [Ford Fulkerson](https://www.geeksforgeeks.org/ford-fulkerson-algorithm-for-maximum-flow-problem/) e [Edmonds Karp](https://www.geeksforgeeks.org/ford-fulkerson-algorithm-for-maximum-flow-problem/)

Aqui é apresentada uma grande variedade de algoritmos, e pode parecer desesperador ter que entender o funcionamento de todos com suas respectivas complexidades em apenas um módulo (1 mês). Mas quase todos estes algoritmos compartilham características fundamentais que, uma vez identificadas, podem ajudar muito na compreensão do funcionamento básico boa parte deles.

Os algoritmos de Bellman Ford e Dijkstra que encontram caminhos mínimos, por exemplo, ambos se valem do mecanismo nomeado [*relaxation*](https://www.geeksforgeeks.org/edge-relaxation-property-for-dijkstras-algorithm-and-bellman-fords-algorithm/) que compara o custo atual com o novo custo obtido ao utilizar uma nova aresta descoberta do grafo. Compreender estes princípios que fundamentam os algoritmos ajudam a construir a intuição que nos permite identificar como estes algoritmos se comportam com diferentes entradas. 

Neste módulo é importante completar uma boa variedade de exercícios para se familiarizar com as muitas implicações de alguns teoremas.

### Paradigmas de programação

O módulo 03 apresenta diferentes paradigmas que utilizamos para projetar algoritmos. Aqui rapidamente revisamos alguns paradigmas utilizados nos algoritmos que já foram apresentados, e logo começamos a ver implementações para novos problemas que utilizam destes mesmo paradigmas: guloso, divisão e conquista, e programação dinâmica.

Aqui desenvolvemos a intuição para projetar novos algoritmos a partir de ideias que já conhecemos e vimos aplicadas em exemplos clássicos. Estudamos algoritmos famosos que usam divisão e conquista, como: [3-way partitioning](https://www.geeksforgeeks.org/three-way-partitioning-of-an-array-around-a-given-range/), [randomized quicksort](https://www.geeksforgeeks.org/quicksort-using-random-pivoting/), [closest pair of points](https://www.geeksforgeeks.org/closest-pair-of-points-using-divide-and-conquer-algorithm/) e [multiplicação de matrizes](https://www.geeksforgeeks.org/c-program-multiply-two-matrices/). 

O mesmo acontece quando conhecemos algoritmos de programação dinâmica. A ideia de reutilizar valores previamente computados é apresentada e exemplificada em diversos problemas. Assim espera-se que sejamos capazes de aplicar esta ideia de memoização a novos problemas. Os algoritmos estudados incluem: [interval scheduling](https://www.geeksforgeeks.org/scheduling-in-greedy-algorithms/), [knapsack problem](https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/) (também conhecido como “problema da mochila”), [maximum subarray sum](https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/), e detecção de [ciclos negativos em um grafo](https://www.geeksforgeeks.org/detect-negative-cycle-graph-bellman-ford/).

Neste módulo é esperado que sejamos capazes de utilizar estes paradigmas para implementar novos algoritmos, então a criatividade também é importante. Fazer muitos exercícios é o que te coloca em contato com problemas de diferentes tipos e te prepara para as avaliações.

### NP-completude e intratabilidade computacional

A última parte da disciplina apresenta o conceito de tratabilidade computacional. Este módulo é mais focado em problemas do que em algoritmos, e a ideia é discutir como podemos classificar diferentes problemas de acordo com sua dificuldade relativa. 

São apresentadas reduções polinomiais de Cook e estabelecidos conceitos de equivalência entre problemas. As categorias de problemas P e NP são introduzidas, bem como os conjuntos NP-completo, NP-difícil e CO-NP. Aprendemos reduções entre problemas de satisfabilidade como SAT/3-SAT, vertex-cover, independent set e set cover, e também problemas de sequenciamento como ciclo-hamiltoniano e clique em grafos.

O assunto [P vs NP](https://pt.wikipedia.org/wiki/P_versus_NP) é um velho conhecido da comunidade científica. É um problema em aberto da Ciência da Computação, e tem também relevância em outras áreas de conhecimento. Trata-se basicamente de problemas matemáticos cuja resposta pode ser verificada em tempo polinomial, mas não podem ser resolvidos em tempo polinomial. Pode ser bem confuso entender a diferença entre verificar instâncias de um problema e efetivamente resolver o problema, por isso essa última parte pode ser um pouco confusa.

Muitos colegas acreditam que seria melhor se esse módulo sobre intratabilidade fosse parte de outra disciplina. É um assunto denso e complexo por si só, encaixar este conteúdo em PAA torna a experiência geral da disciplina ainda mais complicada. Minha dica é: não deixe pra levar a disciplina a sério só no final.


## Vale a pena?

Se esforçar pra cursar essa disciplina com qualidade é um investimento que pode sim valer muito a pena. Os conhecimentos adquiridos aqui certamente ficarão comigo por toda minha jornada profissional e acadêmica. Independente da área de pesquisa ou atuação na indústria fora da universidade, algoritmos estão sempre presentes e desempenham papel fundamental em diversas áreas. 

O conteúdo é muito denso, e apesar de ter acabado de concluir a disciplina, já não me lembro de todos os algoritmos e teoremas. Mas acredito que este não é o ponto e nem o objetivo do curso. A intuição que construímos com o tempo transforma nosso processo de raciocínio ao encontrarmos um novo problema. Esta intuição é o que acredito ter maior valor, e sempre estará à disposição na minha “caixa de ferramentas”.

Quando estamos no meio do curso, a rotina é muito corrida e às vezes fica difícil valorizar a oportunidade de estar no DCC da UFMG. O departamento possui excelentes professores, muitos são destaque em suas respectivas áreas na comunidade internacional, e estão todos ali acessíveis (bom, quase todos). Os professores de PAA por exemplo são todos muito bons, e recomendo a todos interessados em um mestrado em Ciência da Computação que tenham a experiência de cursar essa disciplina.

![Graduation](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/paa-graduation.jpeg "Graduation")

Figura 2. Álbum Graduation, Ye

Cursar PAA foi certamente uma experiência desafiadora, mas bastante enriquecedora. O sentimento de orgulho no fim é recompensador.

Se tiver alguma dúvida fique à vontade para me escrever, terei prazer em ajudar.
Bons estudos!
