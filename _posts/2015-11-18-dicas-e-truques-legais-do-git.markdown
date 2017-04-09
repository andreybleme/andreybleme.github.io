---
layout: post
title:  "Diquinhas e truques legais pra usar no Git"
description: "Comandos úteis para salvar tempo."
date:   2015-11-18 00:13:52
categories: git
tags: [git]
comments: true
share: true
---
Esse post tem como motivação, uma semana difícil. 

É isso aí, uma semana de desafios relacionados a [scm][scmlink] (o que não é lá a coisa mais relaxante do mundo). Uma semana cheia de tentativas frustradas de [`git cherry-pick`][cherrypick]s e outras coisas do git, que eu provavelmente não precisaria usar se o código estivesse sendo gerenciado "direito". 

Agora, deixando de ser chorão e tentando ver as coisas pelo lado positivo: aprendi umas coisinhas legais, que podem ser úteis pra mim no futuro, e por que não, pra você :)

A ideia aqui não é ensinar git, nem apresentar os comandos básicos ou alguma coisa desse tipo. A ideia é mostrar alguns truques e manhas legais do git, que você vai querer ter conhecido antes. 

Então vamos lá...


### Alias (co > checkout)
Você pode criar [alias][alias] para qualquer comando do git. 
Você só precisa setar o alias ao comando que você quiser, desse jeito: 

```
$ git config --global alias.st status 
```

É só substituir o **alias** pelo apelido que você quiser e colocar o comando na frente. 

É bem melhor digitar *"git co"*, do que *"git checkout"* né?  
É só criar o alias! Já vi gente *(eu)* que usa um alias *g* pro comando *git*. É muita preguiça haha. Isso te daria uma coisa tipo: 

```
$ g co
```

> É, um pouco diferente, mas com o tempo se ganha bastante em produtividade. 


### Autocomplete no shell

Uso o git pela linha de comando, e graças a Deus o autocomplete do git sempre esteve habilitado aqui. Se você usa o git shell pelo ruWindows, o autocomplete já deve estar configurado.

Caso o auto complete não esteja habilitado no seu terminal, você pode baixar o script de autocomplete do git [nesse link](https://github.com/git/git/blob/master/contrib/completion/git-completion.bash).

Depois de baixar, copie o arquivo para o diretório home, e  adicione ao seu arquivo *.bashrc* a linha:

```
source ~/git-completion.bash
```

Pronto. Agora quando você digitar um comando git e apertar *tab*, ele deve exibir pra você os comandos:

```
$ git co<tab>
```

```
commit config
```

### Checkout e reset em arquivos

Você já deve ter usado esses dois comandos:  [checkout][checkout] e *[reset][reset]*, para trabalhar com branches e commits. 

O que talvez você não sabia, é que você também pode usar o *checkout* e o *reset*  em arquivos.

Quando usamos o *git reset* em um arquivo, o git **atualiza** a área de stage (staging area), fazendo com que um determinado arquivo **volte** ao estado em que se encontrava em um commit anterior qualquer.

Isso significa que podemos remover o arquivo *"jedi.js"* da área de stage, e fazer com que ele fique igual à sua versão no *HEAD* com o comando:

```
$ git reset HEAD jedi.js
```

O resultado da operação, é o arquivo fora da área de stage e com conteúdo igual, ao presente no commit mais recente. 

![Reset File](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/resetfile.png "git reset file")

Bem legal!
Agora vamos dar uma olhada no **`checkout`**.

O bom e velho *git checkout* que usamos para alternar entre branches, quando usado com um caminho para um arquivo, faz o git apontar para esse arquivo. Sem atualizar a branch atual.

```
$ git checkout HEAD jedi.js
```

Agora nosso arquivo **"jedi.html"** está igual ao arquivo presente em *HEAD*, e a nova versão do arquivo não está na área de stage.

![Checkout File](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/checkoutfile.png "git checkout file")


> Salve isso em algum lugar, sério. Você vai precisar um dia.     


Dessa forma, você pode só apontar para a versão de um arquivo em outra branch (ou na mesma), e fazer alterações pra logo em seguida adicionar o arquivo modificado a staging area com o `git add .`. 

### Stash, pra ser feliz

O comando `git stash`, pega **toda** sua área de stage e salva em um lugar separado, limpando a sua stage area. 

Isso é muito legal, porque dessa forma você pode guardar um conjunto de alterações que você fez mas não quer commitar ainda por algum motivo. 

```
$ git stash
```

Particularmente, uso mais o [stash][stash] quando preciso fazer *git pull* e não quero que as alterações na minha área de stage gerem conflitos com os arquivos baixados.  

Depois de criar seu stash com o comando `git stash`, você precisa aplicar seu stash. Isso é, adicionar a sua área de stage todas as alterações que você colocou no stash. Para fazer isso, basta usar:

```
$ git stash apply
```

> Você pode ter mais de 1 stash. Eles serão **sempre** aplicados na ordem "first in, last out" caso você não especifique o nome do stash logo depois do *apply*.


### Amend, pra se redimir

Se você fez um commit, e depois lembrou que esqueceu de adicionar uma modificação em um arquivo (acontece), use o `--amend`.

Vejamos:

![Commit amend](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/amend.png "git commit amend")

Aqui o parâmetro *--no-edit* salva sua pele, fazendo com que a mensagem do commit no qual você está fazendo o [*amend*][amend], se mantenha a mesma.

### Diffs entre commits

Para ver as alterações dos últimos commits, podemos usar:
```
$ git log --stat
```
Esse comando vai mostrar os arquivos e a quantidade de linhas adicionadas e removidas por arquivo em cada commit.
Pra ver o que exatamente foi alterado em um commit, use o [comando diff][diff]. 

Para ver a diferença entre 2 commits com os [SHA][sha]s dos commits em mãos (0da94be e  59ff30c), use:

```
$ git diff 0da94be 59ff30c
```

Se você usa o GitHub, talvez seja melhor ver as diferenças por lá. 
[+ veja como][githubdiff]

### É isso aí !

É isso aí amiguinhos (acabei de ver [essa](https://www.facebook.com/BugginhoDeveloper/photos/a.458898330946574.1073741828.458890497614024/504473343055739/?type=3&theater) piadinha do Bugginho e já to falando que nem ele). Existem algumas outras manhas e coisas legais que o git oferece, mas pro post não ficar grande, escolhi as que eu mais gosto.

Se você achou um absurdo o post não ter uma dica legal que você conhece, comenta aí pra gente :) 

Até a próxima **o/**



[scmlink]:      		https://en.wikipedia.org/wiki/Version_control
[cherrypick]: 	 http://imasters.com.br/artigo/24442/desenvolvimento/dica-git-da-semana-cherry-picking/
[alias]: https://git-scm.com/book/tr/v2/Git-Basics-Git-Aliases
[checkout]: https://www.atlassian.com/git/tutorials/undoing-changes/git-checkout
[reset]: https://www.atlassian.com/git/tutorials/undoing-changes/git-checkout
[stash]: https://git-scm.com/book/pt-br/v1/Ferramentas-do-Git-Fazendo-Stash
[amend]: https://git-scm.com/book/pt-br/v1/Git-Essencial-Desfazendo-Coisas
[diff]: https://git-scm.com/docs/git-diff
[sha]: https://git-scm.com/book/en/v2/Git-Internals-Git-Objects
[githubdiff]: https://help.github.com/articles/comparing-commits-across-time/