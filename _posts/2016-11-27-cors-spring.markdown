---
layout: post
title:  "Lidando com CORS no Spring"
description: "Habilitando Cross-Origin Resource Sharing em aplicações Spring boot."
date:   2016-11-27 22:00:00
tags: [java, spring]
comments: true
share: true
---

Quando projetamos APIs e queremos que todos seus recursos sejam disponíveis a qualquer cliente HTTP, o que vem na cabeça é [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) (Cross-Origin Resource Sharing).

Existem formas diferentes de tornar recursos do servidor disponíveis para vários clientes (browsers, apps e http clients em geral). A maneira de habilitar CORS varia de acordo com o framework utilizado para disponibilizar os recursos.

É bem importante entender o que é exatamente CORS. Como a ideia aqui é mostrar a implementação e alguns detalhes do CORS no Spring, deixo este link com [quase tudo que vc precisa saber sobre CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).

Em aplicações Spring, podemos habilitar o acesso aos recursos de duas maneiras diferentes.

Habilitando endpoints
-------------

A primeira é a disponibilização de um **endpoint específico.**

Por exemplo: Queremos fazer com que apenas o serviço *GET* *http://myapp.com/api/account/1* possa ser acessado de qualquer origem.

Pra isso basta incluirmos a anotação **@CrossOrigin** no método que representa o recurso:

    @RestController
    @RequestMapping("/account")
    public class AccountController {
    
    	@CrossOrigin
    	@RequestMapping("/{id}")
    	public Account retrieve(@PathVariable Long id) {
    		// ...
    	}
    	
    }

Quando requisições do tipo GET, de **qualquer origem**, forem enviadas à esse endereço o servidor vai aceitar a requisição e fazer o processamento normalmente.

Requisições a qualquer outro recurso (mesmo desse mesmo controller), terão como resultado o famoso erro HTTP:

    No 'Access-Control-Allow-Origin' header is present on the requested resource.

Para habilitar **todos** o recursos de um controller basta colocar a anotação no próprio REST controller, ao invés de colocar apenas no método.
 
---


Aplicando CORS Globalmente
-------------

A outra forma de habilitar acesso aos recursos, é criando uma classe de configuração para habilitar o CORS **globalmente** na aplicação.

    @Configuration
    @EnableWebMvc
    public class WebConfig extends WebMvcConfigurerAdapter {
    
    	@Override
    	public void addCorsMappings(CorsRegistry registry) {
    		registry.addMapping("/**");
    	}
    }

Assim **todos** os recursos se tornam disponíveis a qualquer origem.

> Funciona para os métodos GET, POST, PUT e DELETE 


Problemas com OPTIONS
-------------------
Alguns clientes HTTP enviam uma requisição do tipo [OPTIONS](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html) antes de fazer requisições a um servidor. O módulo *$http* do Angular 1 por exemplo, utiliza essa abordagem. 

A justificativa pra que isso aconteça está na [declaração do padrão de acesso cross-origin via browser](http://stackoverflow.com/questions/12111936/angularjs-performs-an-options-http-request-for-a-cross-origin-resource).

Quando habilitamos CORS em aplicações Spring, por padrão não é permitido acesso à recursos via método OPTIONS. Isso pode causar problemas à aplicações consumidoras desses recursos, que continuarão a ter problemas com respostas "No 'Access-Control-Allow-Origin' header is present on the requested resource".

Para habilitar todos os métodos HTTP, precisamos fazê-lo explicitamente na classe de configuração. 

    @Configuration
    @EnableWebMvc
    public class WebConfig extends WebMvcConfigurerAdapter {
    
    	@Override
    	public void addCorsMappings(CorsRegistry registry) {
    		registry.addMapping("/**")
    			.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT");
    	}
    }

Só assim, todos os métodos HTTP são habilitados a acessar os recursos da aplicação de qualquer origem. 

Nas versões mais novas do Spring Boot, não é necessário declarar todos os métodos HTTP de forma explicita.

Se quiser aprender mais sobre Spring Framework, recomendo os livros [Spring in Action](https://amzn.to/2SC0nlU) da editora Manning, e [Vire o jogo com Spring](https://amzn.to/2vmRYKP) do Henrique Lobo, publicado pela Casa do Código.

Referências e links úteis
-------------
- [CORS support in Spring Framework](https://spring.io/blog/2015/06/08/cors-support-in-spring-framework)

- [Enabling Cross Origin Requests for a RESTful Web Service](https://spring.io/guides/gs/rest-service-cors/)

- [AngularJS performs an OPTIONS HTTP request for a cross-origin resource](http://stackoverflow.com/questions/12111936/angularjs-performs-an-options-http-request-for-a-cross-origin-resource)

- [CORS with spring-boot and angularjs not working](http://stackoverflow.com/questions/32319396/cors-with-spring-boot-and-angularjs-not-working)