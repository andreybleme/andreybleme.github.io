---
layout: post
title:  "Entendendo e explorando Buffer Overflow"
description: "Como explorar e como funcionam vulnerabilidades Buffer Overflow em programas C e C++."
date:   2019-07-06 17:00:00
tags: [security]
comments: true
share: true
---
Uma das vunerabilidades mais conhecidas, o Buffer Overflow é um bug simples porém perigoso. Este bug é resultado de uma prática também muito simples que ocorre até hoje: programas reservam blocos de espaço pré-definido e limitado de memória - chamados buffers - para armazenar e ler dados. Um Buffer Overflow ocorre quando esse espaço reservado de memória recebe como entrada mais dados do que é capaz de comportar, ou recebe uma solicitação de leitura além da sua capacidade. 

O famoso [Heartbleed de 2014](https://www.csoonline.com/article/3223203/what-is-the-heartbleed-bug-how-does-it-work-and-how-was-it-fixed.html), bug que comprometeu credenciais de acesso no OpenSSL foi causado por um tipo de buffer overflow, que pode ser explorado graças a uma simples linha de código C:

> `memcpy(bp, pl, payload);`

`memcpy` é uma função C que copia dados. Aqui o que o código faz é copiar o valor da variável `pl` para `bp`. O problema é que não há nenhuma garantia de que o espaço alocado para `bp` comporta os dados de `pl`. Pode até parecer exagero pensar que algo assim viabiliza um ataque hacker real, mas como veremos em breve, falhas desse tipo podem permitir leitura de dados sensíveis, ou manipular o fluxo de execução do programa para executar código de forma arbitrária.

É importante mencionar que linguagens modernas orientadas a objetos como Java, Python, Ruby e C# não são vulneráveis a este tipo de falha. Isso porque estas linguagens são **Memory Safe**, ou seja, não permitem que variáveis acessem a regiões de memória não alocados ou alocadas por ponteiros/variáveis diferentes. Mesmo para linguagens não seguras (C e C++) existem contramedidas para proteger softwares de explorações de Buffer Overflow: Address space-layout randomization (ASLR), stack canaries (e variações) e control flow integrity (CFI). 

Para entender melhor como um buffer oerflow pode ser explorado, vamos primeiro entender como variáveis são armazenadas em memória e como o compilador lida com chamadas a funções locais em um programa.



A anatomia da memória RAM
----

A imagem mostra o layout básico de uma memória e suas divisões lógicas:

![Layout de memória](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/buffer-overflow-memory-layout.jpg "Layout de memória")

- text segment: região read-only que que armazena textos como códigos e comandos utilizados por outros programas. O texto correspondente ao nosso código fonte por exemplo fica armazenado aqui. 
- data (initialized/unitialized): aqui ficam as variáveis inicializadas e não inicializadas do nosso programa.
- heap: região destinada ao armazenamento de grandes informações, gerenciada pelas funções `malloc`, `realloc` e `free`. O que estará armazenado aqui depende da estrutura do programa sendo executado.
- **stack:**  aqui ficam armazenadas as variáveis e funções locais do nosso programas. Esta é uma pilha que funciona no esquema LIFO (last in first out), contendo endereços de funções que devem ser invocadas e parâmetros/variáveis a serem utilizadas.

Como mostra a imagem, os primeiros endereços de memória (números em hexadecimal) ficam em baixo (0x00000000) e os últimos endereços ficam no topo (fxffffffff). Conforme o stack vai utilizando mais memória, são utilizados os endereços de baixo, ou seja, o stack cresce na direção do heap (de cima pra baixo), enquanto o heap cresce na direção do stack (de baixo pra cima).

Buffer overflows geralmente acontecem no stack (apesar de ser pouco comum, é possível que overflows também ocorram em outras regiões de memória como o heap), portanto focaremos em entender como funciona o stack de memória.

![Stack horizontal](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/buffer-overflow-stack-horizontal.png "Stack horizontal")

Esta é a imagem de um stack em memória, contendo dois parâmetros a e b de uma função `func`. Quando o programa é executado, uma instrução assembly `jump` é invocada apontando para o endereço de retorno desta função `return`, é assim que a função `main` sabe o que deve ser executado após executar nossa função `func`, ela executará o que estiver em `return`. 

Explorando a vulnerabilidade
---

Sabendo disso, suponha que tenhamos um simples programa que aloca em memória um buffer de caracteres de tamanho 5 e copie o valor do input do usuário para este buffer. 

<script src="https://gist.github.com/andreybleme/65dda9a264709ee83554d3e70f43767e.js"></script>

O stack para um programa deste tipo fica assim:

![Stack horizontal](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/buffer-overflow-stack-horizontal-buffer.png "Stack horizontal")

Temos a mesma estrutura anterior porém com um espaço reservado para 5 caracteres. Para compilar nosso programa, vamos utilizar o gcc, executando:

`$> gcc -fno-stack-protector -ggdb -m32 vulnerable.c -o vulnerable`.

Agora podemos executar o programa com o comando: `./vulnerable`.

Utilizando o gdb, uma ferramenta debugger para código C e C++, queremos ver os endereços de memória correspondentes as chamadas do nosso programa. Primeiro vamos pegar o PID do programa em execução:

`$> pgrep vulnerable`

Em seguida podemos depurar o programa utilizando o PID encontrado:

`$> gdb -p 21533 'pgrep vulnerable'`


Quando executamos o programa com uma quantidade de caracteres menor que o tamanho do nosso buffer, por exemplo, um nome "Jon" nada acontece.

![Execução normal](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/buffer-overflow-normal-exec.png "Execução normal")


Mas o que acontece então se ocuparmos nosso buffer com mais de 5 caracteres? Vamos enviar 6 letras "A" e vejamos como fica o valor armazenado no `$esp` (ponteiro no topo do stack que contém local de retorno da função):

![Execução buffer overflow](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/buffer-overflow-smashed-41.png "Execução buffer overflow")

`\x41` é o número hexadecimal correspondente a letra "A" na tabela ASCII. Estamos enviando código neste formato hexadecimal com `\x` porquê precisamos enviar código de máquina, já que este é carregado em tempo de compilação na memória. Repare que o valor do ponteiro `$esp` foi sobrescrito um `\x41` no final do endereço `0xbfff0041` e o programa retornou uma mensagem: "segmentation fault", indicando que um espaço de memória foi acessado de forma indevida comprometendo o funcionamento correto do programa.

Vimos que quando uma função termina seu fluxo de execução, o sistema operacional executa o conteúdo presente em `$esp` para saber pra onde retornar. Agora que temos um valor inválido (com final "41" ou "letra A") e temos um erro "segmentation fault", podemos ser criativos e injetar código executável neste espaço de memória. Assim, quando nossa função finalizar sua execução o programa irá executar o valor presente em `$esp` e encontrará algo inesperado.

### Injetando código malicioso

Vamos injetar no stack o código de máquina responsável por executar o `bash` em sistemas operacionais UNIX. O código correspondente a execução do bash em arquiteturas de 32-bits é:

```
\x31\xc0\x89\xc3\xb0\x17\xcd\x80\x31\xd2\x52\x68\x6e\x2f\x73\x68\x68\x2f\x2f\x62\x69\x89\xe3\x52\x53\x89\xe1\x8d\x42\x0b\xcd\x80
```

Antes de injetarmos este código, é importante saber que algumas variáveis de ambiente podem mudar um pouco o lugar das coisas no stack quando executando nosso programa em uma distribuição Linux normal, fora do debugger gdb como estamos fazendo. Para que nosso ataque funcione e o bash seja injetado no lugar que queremos do stack, vamos utilizar NOP sleds. NOP sleds são instruções de máquina que quando executadas não fazem nada além de mandar executar a próxima instrução disponível, são representados com `\x90`. Vamos injetar 8 bytes de NOP sleds antes de injetar nosso código bash para que, caso o frame aponte para um endereço que não seja o bash, os NOP sleds façam com que o ponteiro caminhe até executar o bash. Assim, a entrada para nosso programa ficaria assim:

```
\x90\x90\x90\x90\x90\x90\x90\x90 -- NOP sleds
\x41\x41\x41\x41\x41\x41\x41 -- AAAAAAA
\x31\xc0\x89\xc3\xb0\x17\xcd\x80\x31\xd2\x52\x68\x6e\x2f\x73\x68\x68\x2f\x2f\x62\x69\x89
\xe3\x52\x53\x89\xe1\x8d\x42\x0b\xcd\x80 -- /bin/bash
\x01\x02\x03\x04 -- 1234
```

Temos então:

- 8 bytes de NOP sleds, para forçar a execução do código bash.
- 7 bytes de letras A para sobrescrever o buffer.
- instruções para executar o bash.
- números 1234 que servirão para marcarmos o último endereço de memória, correspondente ao `return`.

### Executando o código injetado

Depois de enviar como input o código acima, nosso stack contém tudo que precisamos. Agora vamos escolher um endereço de memória qualquer que contenha um NOP sled para ser executado ao fim do programa. Para visualizar os endereços de memória do stack execute no gdb: `x/40x $esp`. Este comando pode ser entendido como  "eXamine 40 instruções heXadecimais presentes na memória, começando em `$esp` (topo do stack)".

Se pegarmos por exemplo o endereço `0xbffff360`, para o incluirmos no fim do stack afim de executar o NOP sled que nos levará ao bash, vamos incluir este endereço no nosso input, que ficará assim:

```
\x90\x90\x90\x90\x90\x90\x90\x90 -- NOP sleds
\x41\x41\x41\x41\x41\x41\x41 -- AAAAAAA
\x31\xc0\x89\xc3\xb0\x17\xcd\x80\x31\xd2\x52\x68\x6e\x2f\x73\x68\x68\x2f\x2f\x62\x69\x89
\xe3\x52\x53\x89\xe1\x8d\x42\x0b\xcd\x80 -- /bin/bash
\x01\x02\x03\x04 -- 1234
\x60\xf3\xff\xbf -- 0xbffff360
```

Perceba que o endereço foi descrito do bit menos significativo para o mais significativo. Isto porque arquiteturas x86 (32 bits) armazenam instruções no [formato Little Endian](https://web.archive.org/web/20180107141940/http://www.cs.umd.edu/class/sum2003/cmsc311/Notes/Data/endian.html).

Agora sim podemos executar o programa e ver que ao fim um bash será aberto.

![Execução com bash](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/buffer-overflow-bash.png "Execução com bash")


Buffer overflow no mundo real
---

### Desabilitando ASLR

Sistemas operacionais modernos possuem um mecanismo de randomização de endereços de memória (Address space layout randomization - ASLR), que dificulta bastante a exploração de ataques de baixo nível em memória. Veja este script que retorna o endereço do início do stack, `$esp` (extended stack pointer):

<script src="https://gist.github.com/andreybleme/25d554864e8d7d180172fb7d56522220.js"></script>

Se seu sistema operacional possui ASLR ativado, a cada execução deste programa você terá como output um endereço de memória difrente. Para desativar este recurso em distribuições Linux baseadas em Ubuntu, basta executar o comando: 

`echo 0 | sudo tee /proc/sys/kernel/randomize_va_space`

E para reativar:

`echo 2 | sudo tee /proc/sys/kernel/randomize_va_space`

Por tanto antes de começar a exploração, verifique sempre se o ASLR está habilitado.

### Black-box

No exemplo que demonstrei neste post temos acesso total ao código fonte alvo do nosso ataque, portanto sabemos exatamente qual é o buffer a ser sobrescrito e sua capacidade. A verdade é que a maioria das vezes não temos acesso ao código fonte do programa que estamos tentando explorar. Nesse caso, precisamos experimentar, testar entradas com tamanhos variados até que um segmentation fault ocorra e, quando ocorrer, teremos de verificar os valores no fim do stack. 

Para isso utilize scripts python para gerar valores de entrada. No nosso exemplo, um simples script para facilitar nossa vida ficaria assim:

<script src="https://gist.github.com/andreybleme/44fbe0ca4bf8e4079e529c4d3280c379.js"></script>


### Kali linux

O Kali é uma distribuição linux muito conhecida por pesquisadores da área de sgurança da informação e hackers. O que faz dela uma mão na roda em cenários de exploração de vulnerabilidades é a facilidade que oferece para habilitarmos e desabilitarmos opçoes de segurança, utilizar payloads maliciosas pré-configurados como input de programas e executar programas de automação de testes de invasão.

Se pretende avançar nos estudos nesta área com certeza vale a pena conhecer as [ferramentas que essa distro oferece](https://e-tinet.com/linux/27-ferramentas-hackers-kali-linux-parte-1/).


-----

Qualquer um que se interesse por arquitetura de computadores ou programação em baixo nível provavelmente já ouviu falar de buffer overlows, mas é interessante conhecer o que realmente acontece por baixo dos panos. Mesmo sendo uma vulnerabilidade conhecida há muito tempo e com métodos de prevenção amplamente divulgados, buffer overflows são encontrados com certa frequência em softwares escritos em C e C++ por aí como [VLC](https://github.com/videolan/vlc), [OpenSSH](https://github.com/OpenVPN/openvpn), [ImageMagic](https://github.com/ImageMagick/ImageMagick) e outros. 

Métodos de prevenção a buffer overflows não são foco deste post, mas como você pode deduzir, quase tudo se resume a validação de input de usuários, randomização de endereços de memória e principalmente [manter seu código Memory Safe](http://andreybleme.com/2019-07-24/o-que-e-memory-safety/).


Referências e links úteis
---

- [Memory layout - Geeks for geeks](https://www.geeksforgeeks.org/memory-layout-of-c-program/)
- [Buffer Overflow Attack with Example - Geeks for geeks](https://www.geeksforgeeks.org/buffer-overflow-attack-with-example/)
- [How security flaws work: The buffer overflow - ars technica](https://arstechnica.com/information-technology/2015/08/how-security-flaws-work-the-buffer-overflow/)
- [Buffer Overflow Attack - Computerphile](https://www.youtube.com/watch?v=1S0aBV-Waeo)
- [Smashing the Stack for Fun and Profit - Aleph One](https://insecure.org/stf/smashstack.html). Este é o artigo original publicado em 1996.
