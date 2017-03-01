---
layout: post
title:  "SSL gratuito com Cloudflare"
date:   2017-02-28 23:00:00
categories: security
---

O [SSL](https://pt.wikipedia.org/wiki/Transport_Layer_Security) é um protocolo de segurança comumente utilizado por desenvolvedores para garantir que o conteúdo trafegado entre servidores e clientes (browsers) seja criptografado realizando uma autenticação entre as 2 partes envolvidas na comunicação baseando-se em certificados [digitais](https://pt.wikipedia.org/wiki/Certificado_digital).

Cada vez mais somos incentivados a utilizar SSL/HTTPS na internet. O Google por exemplo, já afirmou que [sites que não possuem um certificado SSL serão impactados negativamente pelo seu algoritmo de ranqueamento](https://www.relevanceadvisors.com/blog/https-ssl-now-ranking-signal/). Implementar funcionalidades que exigem processamento no browser em background com [Service Workers](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers) por exemplo, também só é possível se  você tiver um certificado SSL e por aí vai. Existem [várias razões pra se usar um certificado SSL](https://www.sslshopper.com/why-ssl-the-purpose-of-using-ssl-certificates.html) e aqui não falaremos delas.

Até pouco tempo, quem quisesse usar SSL precisava comprar um certificado e pagar por ele algo em torno de R$ 300,00 por ano. Hoje existem provedores de serviços cloud que nos oferecem um [SSL compartilhado](https://blog.cloudflare.com/introducing-universal-ssl/) de GRAÇA. Um deles é o Cloudflare.


Habilitanto SSL com o Cloudflare
-------------
Cloudflare é um provedor de serviços de segurança para DNS, CDN, e DDoS.

Depois de criar sua conta gratuitamente, o primeiro passo é garantir que todo tráfego do seu site passará pelo cloudflare fazendo um scan no seu DNS.

![Scan](https://github.com/andreybleme/andreybleme.github.io/tree/master/assets/img/cf-scan.png "Scan DNS information")

O Cloudflare vai mostrar todas as informações do seu DNS, caso esteja tudo certinho continue e em seguida escolha o plano gratuito.

![Transfer DNS](https://github.com/andreybleme/andreybleme.github.io/tree/master/assets/img/cf-transfer-dns.png "Transfering DNS")

Copie os novos Nameservers do Cloudflare, vá até o seu provedor de DNS atual e substitua sues Nameservers atuais pelos novos conforme as instruções.

![Change DNS](https://github.com/andreybleme/andreybleme.github.io/tree/master/assets/img/cf-change-dns.png "Changing DNS")

Agora sim, pra ativar o SSL compartilhado vá na sessão "crypto" e marque a opção de SSL certificate como "Full".

![SSL](https://github.com/andreybleme/andreybleme.github.io/tree/master/assets/img/cf-ssl-full.png "SSL Full")

All done. O Cloudflare demora em torno de 24 horas pra gerar o certificado e tudo estar funcionando perfeitamente. Aqui nosso site já deve ser capaz de responder a chamadas com HTTPS!.


> É possível hospedar sites estáticos com SSL de forma inteiramente gratuita. Aqui vimos como usar o SSL gratuitamente com o Cloudflare e [neste post](http://andreybleme.com/jekyll/2015/01/27/conheca-o-jekyll.html) mostro como hospedar conteúdo estático gratuitamente (pra sempre) com Github Pages. 

Referências e links úteis
-------------
- [Introducing Universal SSL](https://blog.cloudflare.com/introducing-universal-ssl/)

- [Unlimited Scale and Free Web Hosting with GitHub Pages and Cloudflare](https://www.toptal.com/github/unlimited-scale-web-hosting-github-pages-cloudflare)

- [Why SSL? The Purpose of using SSL Certificates
](https://www.sslshopper.com/why-ssl-the-purpose-of-using-ssl-certificates.html)

