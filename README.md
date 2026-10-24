# Ravinto

Monikielinen Jekyll-sivusto, joka julkaistaan GitHub Pagesissa osoitteessa
`https://ozirix-dev.github.io/Ravinto/`.

## Paikallinen kehitys

Tarvitset Ruby 3.3:n ja Node.js 20:n tai uudemman. Asenna riippuvuudet ja
tuota sivusto näin:

```sh
bundle install
npm ci
bundle exec jekyll build
npm test
```

For a production-mode build, set `JEKYLL_ENV=production` before running
`bundle exec jekyll build` (in PowerShell: `$env:JEKYLL_ENV = "production"`).

Sivuston paikalliseen esikatseluun ja selain-/saavutettavuustesteihin:

```sh
npm run test:install-browsers
npm run test:e2e
```

Testipalvelin palvelee rakennettua sivustoa paikallisesti `/Ravinto/`-polun
kautta. Testit tarkistavat pää- ja artikkelisivut kaikilla kolmella kielellä,
sivustokartan, keskeiset selainvirheet ja WCAG 2.2 AA -automaattitarkistukset.
GitHub Actions ajaa tuotantorakennuksen ja testit pull requesteissa ja
`main`-haaraan tehdyissä muutoksissa; se ei julkaise sivustoa.

Uuden artikkelin luontiohje on tiedostossa
[`docs/creating-articles.md`](docs/creating-articles.md).
