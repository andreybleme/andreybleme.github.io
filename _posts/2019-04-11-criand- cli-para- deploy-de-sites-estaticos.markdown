---
layout: post
title:  "Criando uma CLI para deploy de sites estáticos"
description: "Usando Nodejs para criar uma interface de linha de comando para facilitar o processo de deploy de sites estáticos no S3."
date:   2019-04-11 22:00:00
tags: [javascript, nodejs]
comments: true
share: true

---
 
Usar a [hospedagem de conteúdo estático do S3](https://docs.aws.amazon.com/pt_br/AmazonS3/latest/dev/WebsiteHosting.html) é sem dúvida uma das formas mais baratas e simples de hospedar sites simples e estáticos na internet. Tenho 5 sites desse tipo hospedados em buckets diferentes, pago uma média de 1 real por mês (nada mal). O problema é toda vez ter que manualmente criar um bucket usando o console da AWS, definir as políticas de hospedagem de site estático, fazer upload dos arquivos e finalmente, torná-los públicos. Esse processo repetitivo fica ainda mais chato quando precisamos fazer upload apenas de alguns arquivos específicos de um site, ao invés de todos.

Pensando nisso, pesquisei algumas ferramentas que se propoem a resolver alguns destes problemas. Encontrei algumas, mas nenhuma delas simples o suficiente focando nas tarefas importantes: criação do bucket com as políticas de hospedagem estática, e o upload dos arquivos. Foi então que tive a ideia de criar uma command line interface simples, leve e fácil de ser instalada, para gerenciar o deploy de sites desse tipo no S3.

Neste post veremos o passo a passo para criar uma ferramenta simples que nos ajude com deploy de sites estáticos no S3, utilizando somente Nodejs. Caso queira apenas utilizar o app, execute no terminal: 

> npm install -g theros

Visite [https://www.npmjs.com/package/theros](https://www.npmjs.com/package/theros) para ver a documentação completa.

Aqui está o [link com o código completo](https://github.com/andreybleme/theros) no Github para acompanhar.

## Estruturando os comandos

A ideia é podermos fazer tudo que precisamos via terminal utilizando comandos simples. 

Para criar um bucket por exemplo:

> theros create --bucket <nome_do_bucket>

Para fazer deploy dos arquivos:

> theros deploy --bucket <nome_do_bucket>

**theros** é o nome do nosso npm package, que criaremos ao final para que qualquer pessoa possa instalar e usar nossa CLI. Mais tarde vamos adicionar alguns parâmetros a cada um desses comandos pra nos permitir criar o bucket em regiões diferentes, fazer deploy de arquivos específicos ao invés de todos e etc. 
 
A biblioteca que vamos utilizar para estruturar os comandos é a [commander.js](https://github.com/tj/commander.js). 

Tendo iniciado um novo projeto Nodejs (npm init), basta executar `npm install -s commander` para instalar a biblioteca. Vejamos a estrutura inicial dos 2 comandos (criar bucket, realizar deploy):

<script src="https://gist.github.com/andreybleme/ec293e7d4cd2c40791f263ad99c171ac.js"></script>


Vamos começar entendendo a primeira linha: `#!/usr/bin/env node`. Esta linha é quem diz a sistemas unix-like que o arquivo em questão deve ser executado via linha de comando. Sempre que ver este `#!` ([hashbang ou shebang](https://en.wikipedia.org/wiki/Shebang_(Unix))), saiba que se trata de um arquivo executável. Já que nosso arquivo `cli.js`será executado sempre que um usuário digitar `theros` na linha de comando, precisamos que esta linha esteja no início do arquivo.

A função `.command('create')` é quem cria o comando "create" para digitarmos no terminal quando usando a aplicação. Já a função `.option('-b, --bucket <s>', 'Bucket name', setBucket)` especifica um parâmetro que podemos utilizar junto ao comando "create". Este parâmetro pode ser utilizado como "--bucket" ou apenas "-b". O último parâmetro da função `.option()` aceita uma outra função, que no nosso caso será executada para capturar o valor do parâmetro digitado pelo usuário: `setBucket(val)`. 

O comando "deploy" segue exatamente a mesma estrutura.

Lógicamentge, o usuário terá que utilizar seu Access Key e Client Secret para autorizar nossa aplicação a criar/modificar buckets e fazer upload de arquivos em sua conta. Você [encontra essas credenciais](https://aws.amazon.com/pt/blogs/security/wheres-my-secret-access-key/) no console da AWS.

Aqui já conseguimos capturar o input do usuário para ambos os comandos. Para testar basta executar no terminal:

> node cli.js create --bucket meu_bucket --key minha_key --secret meu_secret

## Criando o bucket

Agora precisamos efetivamente utilizar a AWS SDK para realizar as operações na conta do usuário. Para isso, primeiramente vamos instalar a SDK (`npm install --save aws-sdk`), e na sequencia, criar um novo arquivo `s3Services.js` contendo as ações de autenticação, criar bucket e logo mais, upload:

<script src="https://gist.github.com/andreybleme/7f88229382a6270ee62e94adbb923172.js"></script>

A função `setAwsCredentials()` atualiza as credenciais do objeto `AWS` que utilizaremos para criar o bucket e setar as políticas de hospedagem. A função `createBucket()` cria o bucket com o nome especificado e, caso a operação ocorra com sucesso, invoca a função `setPoliciesForWebSiteHosting()` que atualiza as políticas do bucket existente, configurando o bucket para hospedar sites estáticos.

Vejamos nosso arquivo `cli.js` após implementar a chamada de cada funcão de criação do bucket:

<script src="https://gist.github.com/andreybleme/9ab361cdbda4d5c30f72198fa6d2a5d4.js"></script>

## Executando o deploy

Realizar o upload dos arquivos envolve duas etapas distintas: primeiro temos que ler todos os arquivos do diretório para somente depois, realizar o upload utilizando o SDK. 

#### Interagindo com o sistema de arquivos

Vamos utilizar a biblioteca nativa do Node, [FS](https://nodejs.org/api/fs.html), para ler recursivamente e de forma síncrona todos os arquivos do diretório corrente e seus subdiretórios. Precisamos também capturar o [MIME type](https://pt.stackoverflow.com/questions/98031/o-que-s%C3%A3o-mime-types) de cada um dos arquivos lidos, para que ao realizarmos o upload, o campo "content type" do registro de metadados do arquivo seja preenchido corretamente. Quando fizermos o upload do arquivo `index.html` por exemplo, o "content-type" correto deve ser "html". Para isso vamos utilizar a biblioteca [node-mime](https://github.com/broofa/node-mime), portanto, instale-a executando :`npm install --save mime`.

Assim como fizemos com as interações com o S3, vamos criar um novo arquivo contendo as operações de leitura de arquivos e descoberta de MIME type, desta vez chamaremos o arquivo de `filesystem.js`:

<script src="https://gist.github.com/andreybleme/6e25ad8c2b10595022f7492ba6999771.js"></script>

A função `getAllFilesFrom()` retorna via callback todos os arquivos encontrados no diretório especificado no parâmetro `currentDirPath` bem como seus sub diretórios. Esta função verifica se o arquivo verificado é realmente um arquivo `if (stat.isFile())`, caso verdadeiro, retorna via callback o conteúdo caminho completo do arquivo e seu conteúdo: `callback(filePath, data)`. Caso o "arquivo" buscado seja na verdade um diretório `else if (stat.isDirectory())`, a função `getAllFilesFrom()` é chamada recursivamente para que os arquivos desse subdiretório sejam também lidos e retornados.

Já a função `getMimeType()` tem o simples objetivo de retornar o MIME type correspondente ao file path.


#### Realizando upload dos arquivos

Agora que já temos como ler os arquivos de um diretório e obter seus caminhos (nomes) e tipos (mime types), podemos implementar no nosso arquivo `s3Services.js` a função que realiza o upload:

<script src="https://gist.github.com/andreybleme/7de5ef9c150e59fc3b98081d036c4a3f.js"></script>

A função `uploadObject()` também é bastante simples. Invocamos o método `s3.putObject` contendo o nome do bucket, o nome do arquivo (no caso, é o caminho), body (conteúdo em bytes do arquivo), ACL (permissão de acesso) e finalmente o ContentType. Caso o upload falhe por algum motivo simplesmente retornamos uma mensagem de erro para o usuário.

#### Juntando as operações

Agora que temos de forma encapsulada a lógica de leitura de arquivos e a de upload, podemos realizar as chamadas:

<script src="https://gist.github.com/andreybleme/195ab8db57761631e2ccd82e669176d9.js"></script>

Para cada arquivo lido pela função `filesystem.getAllFilesFrom()`, realizamos o upload utilizando nossa função `s3Services.uploadObject()`.

Para testar o comando deploy, basta executar:

> node cli.js deploy --bucket meu_bucket --key minha_key --secret meu_secret

## Disponibilizando o pacote no node package manager (npm)

Agora que temos as duas funcionalidades básicas prontas, queremos disponibilizar para o mundo. Faremos isso disponibilizando nosso app CLI como um node package no npm: [https://www.npmjs.com/package/theros](https://www.npmjs.com/package/theros).

**1.** O primeiro passo é criar uma conta no [https://www.npmjs.com/](https://www.npmjs.com/).

**2.** Tendo criado sua conta, precisamos agora adicionar a conta criada no npm instalado na máquina que estamos utilizando. Seu email e senha serão solicitados quando o comando abaixo for executado no terminal:

> npm adduser

**3.** Para que o sistema operacional reconheça nosso pacote como uma aplicação a ser executada no terminal, precisamos incluir o seguinte trecho no arquivo `package.json` (este é o arquivo que contém todas as informações sobre nosso pacote):

```javascript
"bin": {
  "theros": "cli.js"
}
```
 O nome do comando que executará nossa aplicação pode ser qualquer um, aqui escolhi `theros`, apontando para o arquivo `cli.js` contendo a estrutura de comandos que criamos. 
 
**4.** Agora só precisamos publicar o pacote na nossa conta executando o comando:

> npm publish --access=public

Se tiver algum erro ao tentar publicar, verifique se o nome que escolheu para o pacote já não existe no gerenciador: https://www.npmjs.com/search?q=seu_pacote. Caso exista, será necessário escolher outro. 

Se persistirem os erros, [veja aqui](https://github.com/andreybleme/theros/blob/master/package.json) como ficou meu arquivo package.json e verifique se não fez nada de errado.



## Extra features

Separar minimamente as responsabilidades no código nos dá flexibilidade para implementarmos parâmetros adicionais com facilidade. 

#### Ignorando arquivos

O parâmetro `--ignore` aceita uma lista de nomes de arquivos, separados por vírgula, que serão ignorados no momento do deploy:

<script src="https://gist.github.com/andreybleme/fad17189e1843aee05e873e014717cfe.js"></script>

#### Apontando para outro diretório
 
 O parâmetro `--root` aceita um nome de diretório onde a aplicação deve buscar os arquivos a serem carregados par ao bucket do S3.

<script src="https://gist.github.com/andreybleme/9a858ea2b2abf82628878e98830a15ec.js"></script>

#### Usando configurações de arquivo

Esta feature ainda [não foi implementada](https://github.com/andreybleme/theros/issues/3), mas é interessante que seja possível colocar as configurações em um arquivo como `theros.yaml` por exemplo, para evitar a repetição na digitação de chaves de autenticação, nomes de buckets, diretórios de origem e etc:

```yaml
default:
  root: 'build/'

production:
  key: 'XXX'
  secret: 'XXX'
  bucket: 'theros.io'

development:
  key: 'XXX'
  secret: 'XXX'
  bucket: 'theros-dev.io'
```

#### Criando distribuição CloudFront

Mais uma feature que ainda [não foi implementada](https://github.com/andreybleme/theros/issues/4). Quando criando um novo bucket usando o comando `create`, seria interessante poder especificar uma distribuição do cloudfront associada ao bucket. É uma prática comum criarmos distribuições CloudFront para otimizar a entrega de conteúdo estático a clientes acessando sites de diferentes lugares. Fazer várias vezes essa configuração manualmente pelo console pode ser bem chato.

------

A maior dificuldade quando criando esta aplicação simples, foi lidar com arquivos usando a API de filesystem (FS). As funções não são nada intuitivas e a documentação desta API não é lá essas coisas. Não posso culpar a ferramenta, já que o Node não foi originalmente pensado para aplicações desta natureza. 

O principal benchmark que usei foi [esta aplicação](https://github.com/cloudflare/Stout) chamada Stout, feita pelo pessoal da Cloudflare. Eles optaram por fazer uma CLI usando Go lang, o que me pareceu inteligente já que a linguagem oferece um ferramental para manipulação de arquivos infinitamente mais rico do que parece possuir o Javascript. Pessoalmente tenho pouca experiencia com a linguagem, portanto, não deixe de comentar se tem alguma sugestão de melhoria no código ou ideia para alguma feature nova.


Referências e links úteis
-------------

- [Criar e usar buckets do Amazon S3](https://docs.aws.amazon.com/pt_br/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html)
- [Using AWS S3 Buckets in a NodeJS App](https://medium.com/codebase/using-aws-s3-buckets-in-a-nodejs-app-74da2fc547a6)
- [S3 files metadata](https://acloud.guru/forums/serverless-portfolio-with-react/discussion/-KyHqzSIDNFvxfb1Yz1D/S3%20is%20serving%20a%20download%20of%20my%20index.html%20instead%20of%20displaying%20it%20in%20the%20browser)
- [How to make a beautiful, tiny npm package and publish it](https://medium.freecodecamp.org/how-to-make-a-beautiful-tiny-npm-package-and-publish-it-2881d4307f78)