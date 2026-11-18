# Fineli – täydellisen lähdeaineistotuonnin tarkistuslista ja testisopimus

**Tila:** toteutusta ohjaava Draft-dokumentti, ei suoritetun tuonnin raportti  
**Päiväys:** 18.11.2026  
**Arkkitehtuurisuunnitelma:** [Ravinto tietopankiksi](ravintotietopankki-fineli-arkkitehtuuri.md)

Tämän dokumentin tarkoitus on estää houkutteleva mutta väärä oikotie: **ladataan Fineli, poimitaan vain kcal/proteiini/hiilihydraatti/rasva, ja sanotaan tuonnin onnistuneen**.

Käyttäjän vaatimus on päinvastainen: kaikki **virallisesti avoimessa latauspaketissa todella olevat** ravintotekijät ja niiden tietueet talteen — mukaan lukien vitamiinit, kivennäis- ja hivenaineet, rasvahappotekijät, annos- ja lähdetiedot. Tuonnin kattavuus on todistettava riveittäin ja kentittäin.

## A. Ensimmäinen vaihe: virallinen lataus ja alkuperän todentaminen

### A1. Oikea lähde

Käytä ensisijaisesti THL:n virallista Fineli Open Data -jakelua:
- [Finelin avoimen datan sivu](https://fineli.fi/fineli/fi/avoin-data)
- [THL:n CSV-lukuohje](https://fineli.fi/fineli/content/file/7)
- [Englanninkielinen THL:n lukuohje](https://fineli.fi/fineli/content/file/8)
- [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.fi)

Finelin internetsivun avaaminen voi estyä automaattiselta työkalulta. **Älä korvaa virallista latausta vahvistamattomalla kolmannen osapuolen GitHub-CSV:llä** ja kutsu sitä uudeksi julkaisuversioksi. Jos suora lataus ei onnistu, pysäytä tämä hyväksyntäkohta ja pyydä aineisto virallista latausta tukevan selaimen kautta. Voit käyttää muista lähteistä saatuja CSV-esimerkkejä skeeman suunnitteluun **selvästi testiaineistona**, et lopullisena lähteenä.

### A2. Pakettivalinta

Tarkista viralliset tarjolla olevat paketit, ainakin:
- tavallinen julkinen peruspaketti;
- mahdollinen laajempi ravintotekijäpaketti (historiallisissa lähteissä mainitaan 74 ravintotekijää);
- mahdollinen ainesosapaketti / erilliset kielipaketit;
- mahdolliset päivitetyt koodisto-, annos- tai metatietopaketit.

**Valitse laajin virallisesti avoin ajantasainen yhdistelmä**, mutta jos eri paketit sisältävät toisistaan poikkeavat tunnisteet tai julkaisuversiot, **älä yhdistä niitä hiljaa**. Käsittele eri pakettiversiot erillisinä lähdejulkaisuina ja näytä niiden keskinäinen vastaavuus vain varmennettuna.

Arvot kuten “yli 4 000”, “55” tai “74” ovat **tutkittavia väitteitä**, eivät hyväksyntään kelpaavia todennettuja nykyisiä rivimääriä. Ratkaise luvut avaamalla paketti.

### A3. Ota lähteen inventaarioraporttiin

| Kenttä | Todennettavaksi kirjattava arvo |
| --- | --- |
| `origin` | THL:n tarkka tiedosto-URL tai virallinen latausnäkymä |
| `dataset_name` | Lähteen virallinen aineistonimi |
| `license` | CC BY 4.0 tai paketissa todettu tarkka lisenssi |
| `dataset_release` | Virallinen julkaisutunnus/versio, jos saatavilla |
| `downloaded_at` | ISO 8601, aikavyöhykkeen kanssa |
| `archive_file` | Alkuperäisen ZIP-/pakettitiedoston nimi ja SHA-256 |
| `files` | Täydellinen tiedostoluettelo: koko, rivimäärä, SHA-256, koodaus, erotin, otsakkeet |
| `foods_count` | Todelliset food-ID:t ja luokkien jakaumat |
| `components_count` | Todelliset ravintotekijäkoodit / yksiköt / ryhmät |
| `component_values_count` | Kaikki komponenttiarvorivit ja niiden tilojen jakaumat |
| `languages` | Todelliset mukana olevat nimikielet ja koodistot |
| `other_tables` | Annokset, reseptit, luokittelut, menetelmät, lähteet, kaikki muut |
| `warnings` | Puuttuvat viitteet, epäselvät nollat, duplikaatit, koodaus, tuntemattomat sarakkeet |
| `operator_decisions` | Mahdolliset manuaalisesti hyväksytyt tulkinnat |

Inventoi **myös tiedostot, joita nykyinen importer ei vielä osaa normalisoida**. “Tiedosto nähty mutta ei käsitelty” on eri tulos kuin “tiedostoa ei löydy paketista”.

## B. Tiedostot, joiden rivit eivät saa kadota

Tarkista aluksi THL:n lukuohjeesta näiden todellinen merkitys ja vertaa paketin sisältöön:

| Tyyppi | Varmistettava |
| --- | --- |
| `food.csv` | elintarviketunnisteet, valmistustapa, tyyppi, nimet, kaikki luokitusviitteet |
| `component.csv` | jokainen ravintotekijäkoodi, nimi, yksikkö ja luokka |
| `component_value.csv` | jokainen arvorivi, alkuperäiset numeeriset merkkijonot, 100 g -peruste, lähde ja menetelmä |
| `contribfood.csv` | reseptien raaka-aineet ja massat (raaka/kypsä), jos paketissa |
| `foodaddunit.csv` | annoskokojen massat/yksiköt ja viitteet, jos paketissa |
| `igclass.csv` ja `fuclass.csv` | luokkahierarkiat ja koodien selitykset |
| Julkaisun muut *.csv ja *.txt | kaikki kielitaulut, nimi- ja luokituskuvaukset, menetelmä-/alkuperäkoodistot ja muu metadata |

Jos release käyttää muita tiedostonimiä, rakenne kirjataan oikeasta paketista ennen importer-koodin lukitsemista. Tarkistuksessa ei saa pakottaa havaintoa sopimaan tähän dokumentin esimerkkitiedostonimeen.

## C. Vitamiinit ja hivenaineet: suoraan komponenttikatalogista

Importissa ei tehdä kovakoodattua listaa aineista, jotka “yleensä kuuluvat ravitsemukseen”.

Sen sijaan:
1. Lue kaikki `component.csv`-rivit.
2. Lue jokaisen ravintotekijän **virallinen** `id/code`, nimi, yksikkö, luokitus ja saatavilla olevat kielimuodot.
3. Ota kaikki `component_value.csv`-rivit alkuperäisillä koodeilla.
4. Muodosta raportti komponenteista, niiden havaintomääristä ja arvojen statuksista.
5. Tarkista, että elintarvike–ravintotekijäparit viittaavat olemassa oleviin tunnisteisiin; erottele hylätyt/virheelliset ja poikkeavat rivit.
6. Ilmoita rehellisesti, mitkä ihmiselle tärkeät vitamiini-/hivenainekoodit **puuttuvat** tästä julkaisusta.

### Tarkistettavat ravintotekijäryhmät

- **Energia:** lähteen kJ ja erillinen siitä laskettu kcal tarvittaessa.
- **Proteiini ja sen lähteestä saatavat alatekijät.**
- **Hiilihydraatit:** imeytyvät, muut hiilihydraattitekijät, sokerit, yksittäiset sokerit, tärkkelys ja ravintokuidut vain lähteen tarjoamin koodein.
- **Rasvat:** kokonaisrasva, tyydyttyneet, kerta- ja monityydyttymättömät, transrasva, omega-3/omega-6, yksittäiset rasvahapot (esim. EPA/DHA) vain todellisten komponenttikoodien perusteella.
- **Rasvaliukoiset vitamiinit:** A, D, E, K ja niiden lähteen erottelemat muodot/ekvivalentit.
- **Vesiliukoiset vitamiinit:** C, B1, B2, B3/niasiinimuodot, B6, B9/folaatti, B12 sekä mahdollinen B5/pantoteenihappo ja B7/biotiini, **vain jos paketin komponenttitaulussa**.
- **Kivennäiset:** kalsium, magnesium, kalium, fosfori, natrium jne. todellisine yksikköineen.
- **Hivenaineet:** rauta, sinkki, jodi, seleeni, kupari, mangaani sekä mahdollinen kromi, molybdeeni, fluoridi ym. vain lähteessä.
- **Muut:** vesi, kolesteroli, alkoholi, orgaaniset hapot tai muut komponentit, jos lähde tarjoaa niitä.

**Raportoi erikseen:** a) lähteessä oikeasti olevat komponentit; b) raportoitavaksi halutut mutta lähteestä puuttuvat komponentit; c) lähteen mahdolliset käsitteelliset päällekkäisyydet/erilaiset yksikkötavat. Älä lisää tuntemattomaan arvoon “0 µg”.

## D. Tyypilliset data-ansat ja niiden testit

| Ansa | Pakollinen käyttäytyminen |
| --- | --- |
| Nolla ja puuttuva sekoittuvat | Koodaa erillinen raw-merkintä ja tulkintastatus, ei oletusnollaa |
| Vanha Fineli-nolla voi tarkoittaa puuttuvaa | Säilytä epävarmuus ja raportoi, älä väitä todellista nollaa |
| kJ muutetaan kcal:ksi | Säilytä alkuperäinen kJ; merkitse kcal johdetuksi, suhde 4,184 kJ/kcal |
| mg, µg ja g menevät sekaisin | Säilytä yksikkö, testaudu erityisesti mikrogramman kanssa |
| Natrium muutetaan suolaksi | Pidä eri suureina; johdettu lasku vain nimetyn säännön kautta |
| Imeytyvät hiilihydraatit + ravintokuitu | Älä yhdistä lähdekomponentteja ilman eksplisiittistä esitystavan sopimusta |
| Energia 100 g syötävää osaa vs kauppapaino | Säilytä perusta, käsittele kuorimattomien poikkeus |
| Sama Fineli-ID eri versioissa | ID:n lisäksi release; vertaa muutosta, älä kirjoita vanhaa yli |
| Sama ID muussa tietokannassa | Käytä `source_id`-nimiavaruutta |
| Raaka vs kypsä / kuivattu / valmistettu | Säilytä tilat erillisinä elintarvikeriveinä |
| Elintarvikkeen suomalainen nimi muuttuu | ID pysyy, nimeen liittyvä muutosversio kirjataan |
| Virheellinen rivin avain tai orpo arvorivi | Fail-closed hyväksynnässä; raportoi poikkeama |
| Päivitetty CSV:ssä uusi sarake | Säilytä alkuperäinen; importer varoittaa skeeman laajentumisesta |
| Uusi komponentti | Tuodaan, raporttiin, ei vaadi uuden SQL-sarakkeen lisäämistä |
| Poistettu komponentti myöhemmässä releasessa | Vanha release jää haettavaksi; muutos näkyy diffissä |
| Kymmennäppäin/CSV-koodaus | Valitse erotin, desimaalimuoto, lainaukset, rivinpäät ja UTF-8/CSV-koodaus **tiedoston todellisen muodon** perusteella |
| Kaksoiskappaleet | Älä arvaa; raportoi duplikaatti sekä sen mahdollinen lähteen sallima moniavaimisuus |
| THL:n aitoa komponenttia ei tuoda API-näkymään | Hyväksyntä hylätään, vaikka raw-paketti olisi tallessa |
| Ohjelma sekoittaa lasketun ravintolaskelman mittaukseen | Palauta eksplisiittinen `calculated/derived/source`-provenienssi |
| GI tai GK keksitään koostumustiedoista | Ei tueta; GI/GK erillisen todennetun tutkimus- ja laskentalähteen perusteella |

## E. Tuontiraportin vähimmäismalli

Importtiputken olisi hyvä tuottaa esim. `reports/fineli/<release>/inventory.json` sekä lyhyt ihmisluettava Markdown-tiivistelmä.

**Esimerkkimuoto – ei todellisia Fineli-lukuja:**

```json
{
  "dataset": "fineli",
  "release_id": "<tiedostosta varmennettu versio>",
  "source_url": "<virallinen lähde>",
  "license": "CC BY 4.0",
  "files": [
    {"name": "food.csv", "sha256": "<64 hex>", "raw_rows": 0, "accepted_rows": 0, "rejected_rows": 0},
    {"name": "component.csv", "sha256": "<64 hex>", "raw_rows": 0, "accepted_rows": 0, "rejected_rows": 0},
    {"name": "component_value.csv", "sha256": "<64 hex>", "raw_rows": 0, "accepted_rows": 0, "rejected_rows": 0}
  ],
  "foods": 0,
  "components": 0,
  "component_values": 0,
  "unknown_columns": [],
  "missing_value_cases": 0,
  "ambiguous_zero_cases": 0,
  "invalid_references": 0,
  "published": false,
  "status": "fixture_example_not_real"
}
```

Älä käytä esimerkin nollia todellisen aineiston tuloksina. Raportin todellinen rakenne voi olla erilainen, mutta kaikkien tarkastusten pitää olla koneellisesti jäljitettävissä.

## F. Hyväksyntätestipaketti

### F1. Deterministinen importer

- Sama lähdepaketti, samat asetukset → samat rivit, komponentit ja lähdetunnisteet riippumatta ajokerrasta.
- Sama julkaisu ajetaan uudelleen → ei kaksoisrivejä.
- Puolivälissä epäonnistuva tuonti → nykyinen tuotannon active release ei muutu.
- Uusi virallinen release → uusi versio, ei vanhan päällesyntetisointia.

### F2. Kattavuus

- `food.csv` rivejä on yhtä paljon rawissa kuin hyväksytyssä elintarviketaulussa, ellei poikkeama ole nimetty ja hyväksytty.
- `component.csv`:ssä jokainen yksilöllinen ravintotekijäkoodi löytyy API:n komponenttiluettelosta.
- `component_value.csv`:ssä jokainen hyväksyttävä arvorivi löytyy tarkalla lähdeviitteellä.
- Virallisen paketin **kaikki** taulut on inventoitu; niiden käsittely- tai säilytystila näkyy.
- Jos “all components” -kysely näyttää 20 komponenttia mutta lähde sisältää enemmän, testi kaatuu.

### F3. Rajalliset, syntetisoidut testit

Luo **synteettinen** 8–12 elintarvikkeen ja usean komponentin fixture, jossa:
- kaksi eri lähdettä käyttää samaa numero-ID:tä;
- yksi tuote on raaka, toinen keitetty ja kolmas kuorittu;
- mukana ovat yksi arvo g-, yksi mg- ja yksi µg-yksikössä;
- mukana ovat todellinen nolla, puuttuva, epäselvä historiallinen nolla ja negatiivinen/kelvoton testiarvo;
- yksi osan raaka-ainemassa ja kypsennyksen vaikutus, ilman automaattista terveystulkintaa;
- yksi tuntematon lisäsarake ja yksi orpo viite;
- kaksi eri releasea, jossa yhden ravintotekijän arvo muuttuu;
- viittaus Fineli-keskiarvotuotteeseen eikä oikeaan tuotemerkkiväitteeseen.

Korjaa vain syntetisoidun fixture-testin epäonnistunut käsittely; älä muuta virallista dataa keinotekoisesti saadaksesi testit vihreiksi.

### F4. Luku-API

Vastauksen pitää kyetä ilmoittamaan esim.:

```json
{
  "source": "fineli",
  "release_id": "<release>",
  "food_id": "<virallinen id>",
  "component_id": "<virallinen koodi>",
  "value": null,
  "unit": "ug",
  "value_status": "missing",
  "basis": "per_100g_edible",
  "method_code": null,
  "derived": false
}
```

Tämä on **esimerkkisopimus**, ei Finelistä lainattu tietue. Jos lähde ilmoittaa mikrogramman eri kirjoitusasulla, säilytä alkuperäinen raaka-asussa ja käytä normalisoitua yksikköä vain eksplisiittisesti johdetussa kentässä.

### F5. MCP

- Kaksi erillistä MCP-asiakasta kysyy samalla `release_id`:llä saman ravintotekijän → sama arvo, yksikkö, status ja lähde.
- Käyttöoikeudeton ei voi ajaa importtia tai julkaista releasea.
- MCP ei tarjoa arvoriveihin kirjoittavaa työkalua ensimmäisessä vaiheessa.
- Epäselvään hakuun palautetaan vaihtoehdot; ei arvata yhtä väärää elintarviketta.
- Kysymys “näytä kaikki vitamiinit” lukee komponenttikatalogia, ei mallin sisäistä muistia.

### F6. Jekyll- ja käyttöympäristön regressiot

- Ravinnon nykyinen Jekyll-käännös toimii.
- Suomen, englannin ja thain amaranttireitit, SEO, sitemap, audio ja linkit eivät muutu.
- GitHub Pagesiin ei julkaista API-tunnuksia tai mahdollisia Cloudflare-salaisuuksia.
- Vanhat artikkelit säilyvät tietoaineiston tuonnista riippumattomina.

## G. Julkaisua ja rollbackia edeltävä käsiteltävä raportti

Hyväksymisraportti näyttää vähintään:

1. Käytetty virallinen Fineli-paketti, versionumero, SHA-256, lisenssi ja noutoaika.
2. Raakafileiden täydellinen luettelo ja niiden schema/encoding/row-count.
3. Todellinen elintarvikkeiden lukumäärä.
4. Todellinen ravintotekijöiden lukumäärä ja täydellinen koodilista (myös vitamiinit ja hivenaineet).
5. Todellinen `component_value`-arvorivien määrä ja puuttuvan tiedon tilasto.
6. Taulut, jotka jäivät vain raw-säilytykseen (ja miksi); jos yksikään kriittinen taulu puuttuu, julkaisu estyy.
7. Muutokset edelliseen julkaisuun, jos sellainen on.
8. Kaikkien integraatio- ja hyväksyntätestien tulokset.
9. Näytekyselyjä, joilla hyväksyjä varmistaa alkuperäiset koodit ja yksiköt.
10. Miten julkaisu perutaan koskematta Recipavon tuotantolaskelmiin.

## H. Käytettävät lähteet ja lisenssinmukainen esitys

Finelin avoin data: Terveyden ja hyvinvoinnin laitos (THL), Fineli, julkaisuversio [varmennettu], lisenssi CC BY 4.0.

Näytä tämä attribuutio palvelun dokumentaatiossa ja datarajapinnan metadataosassa sekä ilmoita muutokset (esim. yksikkömuunnos kcal:ksi, nimet/kielimuunnokset). Suomi.fi:n mukaan Fineli on THL:n rekisteröity tavaramerkki eikä Ravinto-sivusto saa antaa vaikutelmaa, että se olisi THL:n tuottama tai hyväksymä.

**Älä tee terveysväitteitä automaattisesti ravintoainekoostumuksen perusteella.** Kliininen tutkimusnäyttö ja ravintoaineiden koostumustieto ovat erillisiä tietolähteitä.

## I. Tämän Draftin rajaus

Tämä dokumentti **ei vahvista** tietyn Fineli-releasen lopullista aineistokokoa, ravintotekijöiden lukumäärää, julkaisupäivää tai myöhemmin toteutettavan API:n tämänhetkistä olemassaoloa.

Ensimmäisen varsinaisen data-PR:n onnistuminen on osoitettu vasta, kun virallinen aineisto on aidosti ladattu ja inventoitu edellä kuvatulla tavalla.

**Mittari:** julkaisuun tulevien ravintoarvojen lähdeaineistosta säilyneiden rivien osuus, tavoite 100 % hyväksytyistä virallisista riveistä, ei 100 % kaikista mahdollisista ravintoaineista.
