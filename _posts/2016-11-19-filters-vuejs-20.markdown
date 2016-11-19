---
layout: post
title:  "Vue.js - Novos Filters"
date:   2016-11-19 14:00:00
categories: vuejs javascript
---

Falando de  [Vue 2](https://vuejs.org/v2/guide/), muita coisa mudou em relação à [v1.0](http://v1.vuejs.org/guide/) do framework. É tanta coisa nova, que criaram uma página [Migration](https://vuejs.org/v2/guide/migration.html) com itens que te ajudam a entender as mudanças que aconteceram. 

A página tem inclusive [alguns "extras"](https://vuejs.org/v2/guide/migration.html#FAQ) sobre tempo de migração de uma aplicação que usa a v1 pra v2, e até por onde se começar a migração pra nova versão.
 
 Como muita gente, também usei a versão anterior o suficiente pra ter confusões tentando usar coisas que não estão mais presentes na nova versão. Começando com a mudança nos Filters.


Filters do Vue 1.0
-------------
Com uma sintaxe bem similar aos [Filters do Angular 1.x](https://docs.angularjs.org/api/ng/filter/filter), na primeira versão do Vue.js, algo como isso funcionava:

    <input type="text" v-model="filter">
	<ul>
	    <li v-for="item in items | filterBy filter">
		    {{item}}
		</li>
	</ul>
	
Muito simples e em casos onde queremos filtrar itens sem nenhum tipo de lógica complexa, conseguimos fazer isso bem rápido.

Quem já usou os Filters do Angular (1.x), esse estilo com certeza já é bem familiar.


Filters no Vue 2.0
-------------------

A ideia agora é usar o [método .filter](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/filtro) nativo do Javascript. Assim conseguimos implementar regras adicionais ao filtro facilmente:

    <input type="text" v-model="filter">
		<ul>
		    <li v-for="item in filteredItems">
			    {{ item }}
			</li>
		</ul>
   
.
 

     new Vue({
        el: 'body',
        data: {
            items: [],
            filter: ''
        },
    
        computed: {
            filteredItems() {
                var self = this
                return this.items.filter(function(item) {
                    return item.indexOf(self.filter) > -1
                })
            }
        }
    })

Escrevemos mais código, mas assim escrevemos código reutilizável.

> **Dica:** Partindo desse "novo" princípio, podemos reaproveitar Filters na aplicação inteira, criando métodos genéricos.

    function filterBy(list, value) {
      return list.filter(function(item) {
        return item == value
      });
    }
    

Sentiremos saudades (?)
-------------
 Muita gente desaprovou a mudança nos Filters. O argumento principal é: 

 > Fazer coisas como filtrar coleções em um template de forma simples (sem lógicas adicionais) exige mais esforço no Vue 2.0.
 
 Particularmente acho que o caminho, em termos de **evolução**, é esse mesmo. 

Uma consideração importantíssima de Design é que: Filters são realmente úteis e simples de serem escritos no próprio template (como era feito até a versão 1.x), mas ele simplesmente não tem nenhuma **flexibilidade** de utilização de Javascript.

O Filter agora é simplesmente uma função Javascript, e isso significa:

- Poder importar suas funções e utiliza-las em qualquer lugar que tenha código Javascript no seu projeto.
- Conseguir aproveitar o paradigma funcional do Javascript. [Exemplo aqui](https://gist.github.com/andreybleme/8986b787fe0c8a6067f3ffde40b90bfa).

**Resumindo:** Os aspectos que guiaram a equipe na tomada de decisão no momento de retirar os Filters da versão 2, me convencem.

Referências e links úteis
-------------
- [Bring back filters please](https://github.com/vuejs/vue/issues/2756)

- [I'm going to miss filters in Vue 2.0?](https://forum-archive.vuejs.org/topic/3896/i-m-going-to-miss-filters-in-vue-2-0/2)

- [ Announcing Vue.js 2.0 public preview](https://forum-archive.vuejs.org/topic/3891/announcing-vue-js-2-0-public-preview)