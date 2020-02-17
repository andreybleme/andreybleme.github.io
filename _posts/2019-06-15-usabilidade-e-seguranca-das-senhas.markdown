---
layout: post
title:  "A usabilidade e segurança das senhas"
description: "Senhas seguras não precisam ser altamente complexas e difíceis de memorizar."
date:   2019-06-15 17:00:00
tags: [security]
comments: true
share: true
---

Recentemente muito tem se falado sobre segurança e ataques de hackers. Com Apple anunciando o [Sign in with Apple](https://techcrunch.com/2019/06/03/apple-sign-in-privacy/) e Microsoft anunciando que a [expiração de senhas não faz mais parte dos padrões de segurança do Windows 10](https://techcrunch.com/2019/06/02/password-expiration-is-dead-long-live-your-passwords/), há uma certa confusão no que diz respeito a criação e utilização de senhas. O que faz uma senha ser segura? Foi então que encontrei o artigo [The Usability of Passwords](https://www.baekdal.com/trends/password-security-usability) de 2007 de um escritor chamado Thomas Baekdal. Achei muito interessante a perspectiva do usuário final que o autor apresenta ao invés de focar em aspectos técnicos como criptografia e tratamento de senhas do lado do servidor. Não encontrei conteúdo em português sobre este assunto, então achei que valia a pena traduzir.

A partir seguem as palavras de Thomas:

Empresas de segurança e profissionais da área de TI estão sempre dizendo que pessoas devem criar senhas complexas e difíceis. Este é um mau conselho, já que na verdade podemos criar senhas fáceis de lembrar e altamente seguras. Inclusive, senhas amigaveis são quase sempre melhores que senhas super complexas.

Vejamos então o que faz com que uma senha seja realmente segura.

Como hackear uma senha
----
 Hackear senhas é um trabalho possível, e existem 5 formas de fazer isso:
 
1. **Perguntando:** Surpreendentemente a forma mais comum de descobrir a senha de alguém é simplesmente perguntar por ela. Não raramente as pessoas contam suas senhas para pessoas próximas como amigos e familiares. Ter uma senha complexa e difícil não ajuda a mudar isso de nenhuma forma.

2. **Advinhando:** As pessoas tendem a escolher senhas fáceis de lembrar, e as mais fáceis são aquelas que de alguma forma se relacionam com a pessoa. Senhas como o último nome, nome da esposa, nome do gato, data de nascimento, banda favorita e etc, são escolhas muito comuns. Este problema só pode ser resolvido escolhendo uma senha que não tenha nenhuma relação com você como pessoa.

3. **Ataque de força bruta:** Muito simples de se executar. Um hacker tenta se autenticar usando diferentes combinações de senhas. Se sua senha é "sol", ele tentará se autenticar utilizando "aaa, aab, aac, aad, ..., som, **sol (ENCONTRADA)**". A única coisa capaz de impedir um ataque de força bruta é ter senhas complexas e longas (por isso profissionais de TI querem que você crie senhas assim).

4. **Ataque de palavras comuns:** Esta é uma das formas de ataque usando força bruta, onde o hacker tenta se autenticar utilizando uma lista de palavras comuns. Ao invés de tentar diferentes combinações de letras, o hacker tenta diferentes palavras "sola, solar, soleira, solo, **sol (ENCONTRADA)**".

5. **Ataque de dicionário:** Mesma ideia do ataque de palavras comuns, a única diferença é que o hacker agora usa um dicionário completo de palavras (existem cerca de 500 mil palavras no idioma inglês e 300 mil no português).

Quando uma senha é segura?
----
Não podemos nos proteger contra "pergunta" e "advinhação" de senhas, mas podemos nos proteger das outras formas de ataque. Um hacker normalmente cria um script para automatizar as diversas tentativas de autenticação que quer fazer. Ninguém senta na frente de um computador e tenta 500 mil palavras diferentes para possíveis combinações de senhas.

Medir segurança em senhas então tem a ver com "quantas tentativas de autenticação podem ser feitas por um programa forma automatizada". O número atual de tentativas possíveis varia, mas é comum termos aplicações que aceitam sem restrições mais de 100 tentativas de login por segundo.

Isso significa que o tempo para uma senha como **"sol"** ser descoberta seria de:

- Por Força Bruta: **3 minutos**.
- Por Palavras Comuns: **3 minutos**.
- Por Dicionário: **1 hora e 20 minutos**.

Veja: "sol" possui 17.576 combinações possíveis de caracteres. 3 letras usando o alfabeto de letras minúsculas = 26³.

Esta é óbviamente uma senha altamente insegura, mas qual o tempo de descoberta necessário para dizermos que uma senha é segura?

- Uma senha que pode ser descoberta em **1 minuto** é muito arriscado.
- **10 minutos** - ainda muito arriscado.
- **1 hora** - ainda não é boa o suficiente.
- **1 dia** - agora estamos chegando em algum lugar. A probabilidade de uma pessoa deixar um programa executando por um dia para hackear sua conta é pequena. Mas ainda assim, é plausível.
- **1 mês** - esse é um tempo que apennas um atacante muito dedicado estaria disposto a gastar.
- **1 ano** - agora estamos indo de um risco prático para um risco apenas teórico. Se você é a NASA ou a CIA esse tempo ainda seria inaceitável. Para o resto de nós, não temos tantos inimigos então tudo bem desde que você não esteja protegendo dados da sua empresa.
- **10 anos** - este é um risco puramente teórico.
- **Uma vida: 100 anos** - este é o limite para quase todo mundo. Quem se importa de ter sua senha hackeada depois de ter morrido? E é legal saber que vc usa uma senha "segura pra vida toda".

Criando senhas seguras e amigáveis
----
Vejamos exemplos reais de como podemos criar senhas amigáveis e "seguras pra vida toda". Entenda por "amigáveis" senhas fáceis de digitar e memorizar.

**Importante:** Os exemplos abaixo se baseiam nas 100 requisições de tentativa por segundo.

Primeiro vamos analisar a clássica senha de 6 dígitos - utilizando diferentes métodos de ataque:

![Tabela 1](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/tabela-1.png "Tabela 1")

Neste exemplo a complexidade vence. Usar senhas que misturam caracteres maiúsculos e minúsculos com números e símbolos é a opção mais segura. Usar apenas um palavra simples como senha é inútil. Isso significa que profissionais de TI e as empresas de segurança estavam certas sobre como devemos criar nossas senhas? Não. Isso significa apenas que criar senhas com 6 caracteres não é uma boa ideia. Ninguém vai se lembrar de uma senha como "J4fS<2", e inevitávelmente vamos acabar anotndo isso em algum post-it.

Para criar senhas amigáveis, precisamos pensar sob uma perspectiva diferente. Primeiramente precisamos usar palavras que possamos nos lembrar, algo simples que pode ser digitado rápidamente. Por exemplo:

![Tabela 2](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/tabela-2.png "Tabela 2")

Usar mais de uma palavra como senha aumenta a segurança de forma significante (de 3 minutos para 2 meses). Mas usar 3 palavras ao invés de apenas 2 torna nossas senhas extremamente seguras. Uma senha assim levaria para ser descoberta:

- 1.163.859 anos usando força bruta.
- 2.537 anos usando um ataque de palavras comuns.
- 39.637.240 anos usando um ataque de dicionário.

**É 10 vezes mais seguro criar uma senha como "isto e divertido" do que "J4fS<2".**

Se quiser ser uma senha insanamente segura utilize palavras incomuns, como:

![Tabela 3](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/tabela-3.png "Tabela 3")

Uma senha utilizável e segura não precisa ser complexa. Escolha uma senha que você seja capaz de lembrar e utilize 3 palavras simples e incomuns.

Mas nem tudo é sobre possui senhas seguras. Uma coisa é saber escolher uma senha, outra é prevenir ataques de hackers quando projetando sistemas. Para prevenir que pessoas mal intencionadas executem scripts para descobrir senhas **adicione uma penalidade de tempo**: se uma pessoa digitou uma senha incorretamente mais de 10 vezes por exemplo, terá de esperar 1 hora para tentar novamente.

Um hacker pode descobrir a senha "montanha divertida" em apenas 2 meses se ele conseguir enviar ao seu servidor 100 tentativas por segundo. Mas com a penalidade de tempo levaria 1.889 anos:

![Tabela 4](https://raw.githubusercontent.com/andreybleme/andreybleme.github.io/master/assets/img/tabela-4.png "Tabela 4")

Lembre-se disso na próxima vez que for criar aplicações web ou discutir políticas de senhas. **Senhas podem ser altamente seguras e amigáveis**.

