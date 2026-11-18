# Ravinto tietopankiksi: Fineli kokonaisena, lähteistetty tietomalli ja AI/MCP-rajapinta

**Tila:** suunnitelmaluonnos (Draft PR), ei toteutettu eikä julkaistu
**Päiväys:** 18.11.2026
**Päämäärä:** Ravinto on eri asiakkaiden yhteinen *ravintokoostumustiedon lähde*, ei vain uusi ravintoaiheinen sivusto.
**Aiheeseen liittyvä tarkistuslista:** [Fineli-tuonnin lähdeinventaario ja hyväksyntä](fineli-tuonti-ja-hyvaksynta.md)

## 1. Päätöksen tausta

Ravinto alkoi monikielisenä Jekyll-sivustona (FI, EN, TH), jossa julkaistaan tutkimus- ja lähdepohjaisia tekstejä. Repossa on nyt esimerkiksi laaja amarantin ravintoa, terveysnäyttöä ja viljelyä käsittelevä kolmikielinen artikkeli, GitHub Pages -rakenne ja sivuston testit. **Siellä ei tällä hetkellä ole varsinaista Fineli-CSV-tuontia, ravintotietokantapalvelua eikä MCP-palvelinta.**

Uusi käyttötarkoitus: Ravinto on keskitetty, versionoitu ja jäljitettävä elintarvikkeiden ravintosisältötietopankki. Sen tietoja saavat käyttää mm. Recipavo, ravintotietoon liittyvät kirjoitustyöt sekä valtuutetut ChatGPT- ja Codex-asiakkaat.

Valmis Jekyll-sivusto **säilytetään**, eikä ravintotietokantaa rakenneta satoina käsin kirjoitettuina Markdown-taulukoina. Julkaisusivuston sisältö voi myöhemmin hyödyntää tietopankkia erikseen sovitulla tavalla.

**Käyttäjän toimeksianto:** Tuo Finelistä mahdollisimman **kaikki virallisessa avoimessa julkaisuversiossa saatavat ravintotekijät ja elintarvike-/lähdetiedot** – mukaan lukien vitamiinit, kivennäis- ja hivenaineet, rasvahapot, hiilihydraattitekijät, luokitukset, annoskoot, valmistustiedot ja reseptirakenteet. Älä tyydy tavallisiin seitsemään pakkausmerkintäravintotekijään.

### Ei tarkoita

- Ei väitetä, että jokainen kuviteltavissa oleva ravintotekijä olisi Finelin julkisessa datassa.
- Ei väitetä, että jokaiselle elintarvikkeelle on jokainen ravintotekijä mitattu.
- Ei luoda automaattisesti GI/GK-arvoja Finelin koostumustiedoista.
- Ei muuteta Recipavon jo julkaistuja ravinto- tai GK-laskelmia eikä niiden historiallisia lähdevalintoja.
- Ei oteta Cloudflare-tuotantoresursseja käyttöön, tehdä domain-muutoksia tai julkaista käyttäjän puolesta tässä suunnittelu-PR:ssä.

## 2. Ensin lähdeinventaario, vasta sitten tietomalli lukkoon

Finelin avoimen datan tarkka pakettisisältö, tiedostojen määrä, sarakeotsikot, saatavilla olevat ravintotekijät ja julkaisutunnus pitää **lukea todellisesta virallisesta ladatusta aineistosta**. Ne ovat tuonnin lähtöarvoja, eivät oletuksia.

Eri lähteissä mainitaan esimerkiksi 55 ravintotekijän verkkopalvelu/peruspaketti ja laajempi 74 ravintotekijän paketti. Nämä eivät vielä todista, että 18.11.2026 saatavilla olevan latauksen rakenne ja rivimäärät olisivat täsmälleen samat. Todellinen tiedosto ratkaisee, eikä “74” ole tähän speciin kovakoodattava invariantti.

Finelin THL:n **virallinen tiedostojen lukuohje** tunnistaa ainakin seuraavat aineistot:

| Tiedosto | Merkitys | Säilytettävä sisältö |
| --- | --- | --- |
| `food.csv` | Elintarvikkeiden tunnistetiedot | Alkuperäinen tunniste, nimi, valmistustapa, tyyppi ja luokitustunnukset |
| `component.csv` | Ravintotekijöiden sanasto | Alkuperäinen ravintotekijäkoodi, nimi, yksikkö ja ryhmät |
| `component_value.csv` | Ravintoarvot | Elintarvikkeen ja ravintotekijän liittymä, arvo sekä kaikki saatavilla olevat lähde- ja menetelmäkentät |
| `contribfood.csv` | Finelin ruokien/reseptien osarakenne | Raaka-aineosat, massat ja kypsennyksen/saannon tulkintaan tarvittava tieto |
| `foodaddunit.csv` | Annosmitat | Annoskoot ja niiden alkuperäiset yksiköt/massakytkennät |
| `igclass.csv` | Raaka-aineluokat | Koodit, luokitussuhteet ja nimet |
| `fuclass.csv` | Ruoankäyttöluokat | Koodit, luokitussuhteet ja nimet |
| Muut virallisen paketin CSV-/tekstitiedostot | mm. kieliversiot ja koodien selitykset | Inventoi **kaikki** tiedostot; älä jätä tuntemattomia pois huomaamatta |

**Tärkeä rajaus:** lähdedokumentin käyttämät nimet ja koodistot ovat lähtökohta, mutta nykyisen release-paketin jokaisen tiedoston toteutunut nimi ja skeema tarkistetaan. Säilytä myös paketin mukana tullut alkuperäinen lukuohje ja lisenssitieto.

Lähteet:
- [THL Fineli – tiedostojen lukuohje](https://fineli.fi/fineli/content/file/7)
- [THL Fineli – avoimen datan sivusto](https://fineli.fi/fineli/fi/avoin-data) (latauksen saatavuus tarkistetaan erikseen oikeassa ympäristössä)
- [Helsingin yliopiston selostus Finelistä ja CC BY 4.0 -ehdoista](https://www.helsinki.fi/en/infrastructures/climate-smart-food-and-nutrition/services/food-consumption-and-nutrient-intake)
- [Suomi.fi: Finelin nimi, tavaramerkki ja palvelun alkuperän erottaminen](https://www.suomi.fi/palvelut/fineli-kansallinen-elintarvikkeiden-koostumustietokanta-terveyden-ja-hyvinvoinnin-laitos-thl/cbc1b926-a496-42b9-8a66-5e3e9ef638e4)

## 3. Ei hukata yhtään alkuperäistä kenttää

**Pakollinen periaate:** jokainen ladatun avoimen julkaisun elintarvike, ravintotekijä ja arvotietue säilyy joko normalisoidussa tietokannassa tai sellaisenaan alkuperäisessä raakadatassa. Huomaamaton kenttien tiputtaminen on virhe. Importteri saa tuottaa johdettuja hakunäkymiä, mutta ei saa korvata ainoaa alkuperäisen datan kopiota.

Määritä dataan:
- `dataset_source`: organisaatio, aineisto, alkuperäinen URL ja lisenssi;
- `dataset_release`: alkuperäinen julkaisun versionumero/tunnus, julkaisuaika jos lähteestä saatavilla, noutoaika, kieli/pakettityyppi, tiedostot ja SHA-256:t;
- `raw_files`: alkuperäiset tavut muuttumattomina (versioitu erillinen artefakti, esimerkiksi R2:ssa);
- `foods`: alkuperäiset Fineli-ID:t nimialueella `fineli:<release>/<food_id>`, nimet, ruoankäyttö- ja valmistusluokitukset;
- `nutrient_components`: kaikki releasen ravintotekijäkoodit, alkuperäiset nimet, yksiköt ja ryhmät;
- `food_nutrient_values`: kaikki viralliset ravintoarvot, yksikkö, arvo/100 g, tietolähde- ja menetelmäkentät sekä paketin alkuperäinen rivi-identiteetti;
- `portions`: annoskokomääritelmät;
- `food_classifications`: raaka-aine- ja käyttötapaluokat, hierarkia;
- `food_recipes` ja `recipe_ingredients`: Finelin valmiiden ruokien raaka-ainetiedot, massat ja saantotiedot;
- `source_codes`: paketin muut koodistot/sanastot;
- `food_names`: kieliversiot, jos virallinen paketti ne tarjoaa;
- `import_runs`: valmistelun, virheiden, hyväksynnän ja julkaisuun vaihdon auditointijälki.

Yllä olevat ovat **loogisia entiteettejä**, eivät vielä päätös SQL-taulujen lopullisista nimistä. Lopullinen skeema perustellaan virallisten CSV-avainten, relaatiotyyppien ja todellisen datan perusteella.

### 3.1 Rinnakkaiset lähteet eivät sekoitu

Tulevaisuuden USDA FoodData Central, muu kansallinen tietokanta tai itse laskettu resepti ei saa kirjoittaa Fineli-riviä päälle. Lähde-ID + release + elintarvikekoodi + ravintotekijäkoodi muodostavat yksilöinnin perustan; saman komponentin rinnakkaiset arvot/lähdetyypit säilyvät, jos lähde todella tarjoaa useita.

Finelin elintarvike-ID `1234` ja USDA:n `1234` eivät saa tarkoittaa samaa entiteettiä. Vastaavuudet mallinnetaan erillisenä, hyväksyttynä suhteena (`food_mapping`), jossa on menetelmä, luottamus, lähde ja hyväksyntä. Samannimisyys ei ole riittävä todiste vastaavuudesta.

### 3.2 Tietojen tulkintaa ei saa “korjata” hiljaa

- **Puuttuva ≠ nolla.** Finelin ohje varoittaa myös historiallisesta puuttuvien arvojen nollamerkinnästä. Merkitse `missing`, `zero`, `not_measured`, `estimated` jne. vain, kun lähdesarakkeet antavat siihen perusteen; muuten `unknown` tai `ambiguous_zero`.
- **Yksiköt talteen sellaisinaan.** Milligramma, mikrogramma, gramma, kJ jne. säilyvät alkuperäisinä. Yksikkömuunnos kirjataan erikseen.
- **KJ ja kcal.** THL:n lukuohje ilmoittaa energian lähtökohtaisesti kilojouleina; 1 kcal = 4,184 kJ. Jos sovellus näyttää kcal-arvon, se on johdettu esitysarvo, ei lähdeaineiston muutos.
- **100 g:n perusta.** Arvot yleensä 100 grammaa syötävää osaa kohti; kuorineen hankittujen tuotteiden ja annoskoon erityistapauksia ei saa sekoittaa. Säilytä alkuperäinen `basis` ja sen tulkinta.
- **Ravitsemuksen erikoisnimikkeet.** A-vitamiinin erilaiset ekvivalentit, folaatin yksiköt/ekvivalentit, niasiinin ekvivalentit, transrasvat, EPA/DHA, erilaiset kuitumääritelmät ja muut yhdisteet erotetaan lähteen **oikealla koodilla**, ei yhdistämällä nimen samankaltaisuuden perusteella.
- **Natrium vs. suola, imeytyvä hiilihydraatti vs. kaikki hiilihydraatit, sokerit vs. yksittäiset sokerit.** Älä laske tai täydennä oletusarvoja ilman nimenomaista laskentasääntöä ja `derived`-lippua.
- **Elintarvikkeen tila.** Raaka, kypsä, kuivattu, liotettu, kuorittu tai keskiarvotuote eivät ole automaattisesti sama rivi.
- **Lähdetieto.** Analysoitu, laskettu, lainattu, arvioitu, alkuperäinen menetelmäluokka, mittauksen epävarmuus/huomautus ja havaintoajankohta säilyvät siinä määrin kuin paketti ne antaa. Älä keksi analyysi- tai laatuluokitusta, jota lähde ei sisällä.
- **Tietokannan julkaisupäivä ≠ yksittäisen analyysin ajankohta.** Älä päättele toista toisesta.

### 3.3 “Kaikki vitamiinit ja hivenaineet” tarkoittaa tiedoston kaikki koodit

Importterin on luettava **kaikki** `component.csv`-koodit sekä niihin liittyvät arvorivit. Raportoi erikseen ravintotekijät ryhmittäin: energia, proteiinit, hiilihydraatit, sokerit, kuidut, rasvat ja rasvahapporyhmät, vitamiinit, kivennäis- ja hivenaineet, vesi, kolesteroli, muut yhdisteet.

Älä nimeä B5-vitamiinia, biotiinia, kromia, molybdeeniä, yksittäisiä rasvahappoja tms. “tuoduksi”, ellei kyseinen koodi oikeasti esiinny ladatussa virallisessa paketissa. Puuttuvat koodit raportoidaan erikseen.

## 4. Arkkitehtuurivalinta: mitä Ravinto tarvitsee?

Nykyinen sivusto on julkinen Jekyll/GitHub Pages. Sen ei pidä muuttua epähuomiossa dynaamiseksi monimutkaiseksi pilvipalveluksi. Vertaile ensin seuraavat vaihtoehdot rajatulla kokeella:

| Vaihtoehto | Etu | Haitta |
| --- | --- | --- |
| **A – Erillinen Cloudflare Worker + D1 + R2-snapshotit**, samassa kehitysrepossa | Luonnollinen HTTP API ja etä-MCP, helppo liittää Recipavoon ja eri tekoälyihin; ei omaa VPS:ää | Uudet konfiguraatiot, migraatiot, tunnukset ja ylläpito |
| B – Valmis SQLite-snapshot + pieni etäpalvelu | Selkeä, helposti palautettava ja testattava tietokanta | Vaatii yhä etäpalvelun yhteiskäyttöön |
| C – Staattinen versionoitu JSON/SQLite-jakelu + erillinen MCP-adapteri | Pienempi runtime, hyvä luettava jakelu | Haku ja monipuolinen kysely voivat olla jäykempiä; koko aineiston jakelun hallinta |

**Alustava suositus A**, jos todellinen datakoko ja kyselytarpeet sen puoltavat: yksi pieni read-only Worker, D1-katalogi ja muuttumattomat raakadatapaketit R2:ssa. Käytä erillistä deploymentia, tunnuksia ja ympäristöä; **älä kopioi TietoÄmpärin yksityisiä resursseja tai avaimia tähän**. Yhteisen tilin laskutus ja kulurajat arvioidaan ennen tuotantoa.

Myös A:n valinta on **päätösehdotus**, ei toteutuslupa. Ensimmäisen data-auditin jälkeen voi valita myös helpomman vaihtoehdon.

Pidä Jekyll-sivuston nykyinen `/Ravinto/`-reititys, kolmella kielellä olevat amaranttiartikkelit, SEO, audio ja CI muuttumattomina. Data-API ei saa rikkoa nykyistä julkaisua.

## 5. Tiedon julkaisutapa ja versiointi

Importti ei saa suoraan kirjoittaa nykyisen julkaistun datan päälle.

1. **Inventoi lähde**: alkuperäinen URL, pakettiversio, lisenssi, SHA-256, kaikki tiedostot, rivimäärät, koodit ja yksiköt.
2. **Valmistele uusi julkaisu** erilliseen staging-tietokantaan tai versionoituun työalueeseen.
3. **Validoi** kaikki ravintoarvojen viiteavaimet, tyypit, yksikkömuodot, duplikaatit, rivi- ja koodimäärät. Tee poikkeusraportti, älä arvaa korjausta.
4. **Näytä diff** aiempaan hyväksyttyyn julkaisuun: elintarvikkeet lisätty/poistettu/muokattu, komponentit lisätty/poistettu, arvomuutokset, uusi lähde.
5. **Hyväksy julkaisu** erillisellä portilla.
6. **Vaihda aktiivinen release atomisesti** versionoituun julkaisuun tai pointeriin siten, että vanha on edelleen palautettavissa.
7. **Tee rollback-kokeilu**. API-käyttäjät voivat pyytää lukittua releasetunnistetta; tulos ilmoittaa mistä versiosta se on peräisin.

Mikään Finelin päivitys ei saa itsestään muuttaa Recipavon julkaistua reseptiä, ravintolaskelmaa tai GK-arvoa. Kuluttajalle annetaan muutosraportti ja mahdollisuus suunniteltuun uudelleenlaskentaan.

### Datan sijoitus GitHubiin

Ravinto on **julkinen repo**. Sinne laitetaan: lähdekoodi, skeemat, testifixturet pienellä synteettisellä aineistolla, lisenssiviittaukset, datan manifestit ilman salaisuuksia ja laadun raportit.

Älä commitoi koko vaihtuvaa monimegatavuista Fineli-datasettiä Git-historian jokaiseen versioon ilman nimenomaista perustelua. Pidä alkuperäiset julkaisut erillisessä versioidussa datavarastossa tai ladattavana toistettavana lähdepakkauksena, jonka SHA-256 näkyy manifestissa. Avoin lisenssi ei poista Git-repon ylläpitokustannuksia.

## 6. Rajapinta muille järjestelmille

### HTTP API, ensin vain luku

Suunnittele versionoitu `/api/v1` tai selkeästi vastaava rajapinta.

| Toiminto | Sisältö |
| --- | --- |
| `GET /sources` | lähdeluettelo, lisenssit, julkaisuversiot ja päivitysaika |
| `GET /components` | kaikki todelliset ravintotekijät, koodit, yksiköt ja ryhmät |
| `GET /foods?query=...` | hakutulokset alkuperäisillä ID:illä, nimillä, valmistustavoilla ja release-tunnisteilla |
| `GET /foods/{id}` | elintarvikkeen metatiedot, lähdekoodit ja versio |
| `GET /foods/{id}/nutrients` | kaikki elintarvikkeen ravintotekijät tai suodatettu koodijoukko, yksiköineen ja lähdetietoineen |
| `GET /foods/{id}/portions` | annoskoot ja massat |
| `GET /foods/{id}/composition` | jos kyse Finelin valmiista ruoasta, viralliset raaka-ainetiedot |
| `POST /compare` | vain luku: usean elintarvikkeen valittujen komponenttien vertailu |

Nämä ovat ehdotettuja reittejä, **eivät nykyisiä reittejä**. Ei yleistä SQL-kyselyn etäajoa eikä julkaisu- tai muokkaustyökaluja ensimmäiseen vaiheeseen.

**Vastaus sisältää aina** `source=fineli`, `release_id`, alkuperäisen `food_id` ja `component_id`, arvon alkuperäisyksikön, perusteen `per_100g_edible` tai lähteen oikean vaihtoehdon, arvon tilan (`present/missing/unknown/ambiguous`) ja saatavilla olevan mittausmenetelmä-/alkuperäkoodin. Näytä käyttäjälle laskettu kcal-arvo vain johdettuna kenttänä.

### MCP – tekoälyille yhteinen lukupistoke

Rakennetaan yllä olevan sovelluslogiikan päälle erillinen MCP-portti. Ehdotetut toiminnot:

- `get_ravinto_sources` – data ja lisenssit
- `search_foods` – elintarvikehaku
- `get_food_nutrients` – kaikki tai valitut ravintotekijät
- `get_nutrient_catalog` – esim. ”mitä vitamiineja aineistossa todella on?”
- `compare_foods` – lähteistetty vertailu
- `get_food_portions` – annokset
- `get_import_provenance` – mistä julkaisuversiosta arvo on ja millä alkuperäiskoodilla
- `get_data_health` – viimeisin hyväksytty julkaisu ja validoinnin tila

**Älä anna tekoälylle pääsyä ylläpitäjän import-/purge-toimintoihin.** Luettavat ravintoarvot voivat olla julkista dataa, mutta julkaisu- ja ylläpito-oikeudet ovat erillisiä. Selvitä valittu autentikointi, luku- ja kustannusrajat ennen avaamista.

MCP-sopimuksen pitää toimia myös muiden valmistajien asiakkailla. Älä kytke tiedonsiirtoa yhden ChatGPT-spesifin liite-API:n varaan.

### Esimerkki halutusta käyttäytymisestä

> ”Hae Ravinnosta kaurahiutaleiden kaikki saatavilla olevat vitamiinit ja hivenaineet. Näytä myös puuttuvat kentät äläkä muuta niitä nolliksi. Kerro Finelin julkaisuversion tunniste.”

> ”Vertaa kolmea oliiviöljyä kuvaavaa elintarvikeriviä. Kerro, mitkä vastaavat eri valmistus- tai käsittelyluokkia. Älä valitse väärää vastaavuutta vain saman nimen perusteella.”

> ”Etsi Recipavon valitun reseptin raaka-aineille Fineli-ehdokkaat. Älä korvaa olemassa olevia raaka-ainelähteitä ennen hyväksyntää.”

## 7. Erottelut, joita ei saa rikkoa

1. **Ravintosisältö ≠ terveysväite.** Koostumustieto ei yksin todista ravintoaineen terveysvaikutusta tai kliinistä vaikutusta.
2. **GI ≠ Finelin ravintoarvo.** GI on erillisiin mittaus- ja tutkimuslähteisiin perustuva suure. GK riippuu annoksesta, käyttökelpoisista hiilihydraateista ja valitusta GI-menettelystä. Älä generoi GI/GK-arvoja pelkistä Finelin komponenteista.
3. **Reseptin laskennallinen arvo ≠ mittaustulos.** Erilliselle Recipavo-laskelmalle kirjataan käytettyjen lähdejulkaisujen ja komponenttien ID:t, massat, kypsennyshävikit ja laskentasäännöt.
4. **Fineli-keskiarvo ≠ tietty tuotemerkki.** Sama tuoteryhmä voi poiketa olennaisesti tuotteittain.
5. **Vahvistettu lähderivi ≠ tekoälyn tekemä elintarvikemätsäys.** AI:n ehdotus vaatii hyväksytyn vastaavuuden ennen julkaistua laskentaa.
6. **Puuttuva arvo ≠ nolla ≠ “ei sisällä”.** Kolmea merkitystä ei saa sekoittaa esityksessä eikä tietokannassa.
7. **THL ei ole Ravinto-palvelun toimittaja.** Näytä CC BY 4.0:n mukainen attribuutio ja aineiston muokkaustieto, älä väitä THL:n hyväksyneen tai tuottaneen omaa sovellusta.

## 8. Rinnakkaislähteet myöhemmin

**Tulevaisuuden lisäykset**, eivät tämän ensimmäisen Fineli-PR:n toteutusvaatimuksia:
- USDA FoodData Central (oma lisenssi ja aineistomalli tarkistetaan erikseen).
- Muut kansalliset koostumustietokannat ja ravintosisältöjen tutkimusaineistot.
- Erillinen GI/GK-tutkimus- ja arviointikerros, jossa lähteiden luotettavuus ja laskentamenetelmät ovat auditoitavia.
- Ravitsemussuositukset, saantisuositukset (DRV) ja terveysväitteet **omissa entiteeteissään**, eivät koostumusarvoina.
- Recipavon validoidut ainesosavastaavuudet ja reseptilaskelmien valitut lähdeviitteet.

Pidä pääsy lähdedataan malliriippumattomana. TietoÄmpäri voi säilyttää tutkimusmuistioita; Ravinto säilyttää rakenteiset elintarviketiedot; Recipavo on reseptien alkuperäinen lähde. Älä tee tarpeetonta kopiointia tai korvaa muita lähdejärjestelmiä.

## 9. Ehdotettu PR-työjono Codexille (toteutus erikseen)

**Tämä Draft-PR on ylärajaus ja päätösesitys.** Älä yhdistä kaikkia seuraavia työvaiheita yhteen giganttiseen koodimuutokseen.

| Vaihe | Oma PR | Valmis, kun |
| --- | --- | --- |
| **A: Lähdeinventaario** | Finelin virallinen aineisto, SHA-256, lisenssi, kaikki tiedostot ja todellinen komponenttiluettelo; koneellinen inventaarioraportti | Kaikki paketit/kieliversiot tiedossa; luvut perustuvat oikeisiin tiedostoihin, epävarmuudet dokumentoitu |
| **B: Tuonti ja tietomalli** | Deterministinen, no-loss CSV-tuonti, alkuperäisten talletus, tietokantamigraatiot ja synteettiset fixturet | kaikki rivit säilyvät tai poikkeus raportoitu; muunnokset auditoitavia; sama tuonti kahdesti antaa saman tuloksen |
| **C: Luku-API ja versiohallinta** | Rajattu haku, kaikki ravintotekijät, lähde-ID, versiot, unit/missing/zero-erottelu ja julkaisu/rollback | testit osoittavat, ettei “puuttuva” muutu nollaksi; vanha julkaisuversion kysely toimii |
| **D: MCP-read only** | AI-asiakkaiden yhteinen työkalusopimus, käyttöoikeudet ja kytkentätestit | kaksi erillistä MCP-asiakasta saa samat lähteistetyt luvut; luvaton kirjoitus estyy |
| **E: Kuluttajaintegraatiot** | Recipavo-/Ravintotuote-käyttötestit vain luku- tai suunnittelutilassa | ei hiljaisia laskelma- tai julkaisumuutoksia; lähdevastaavuudet näkyvät ja hyväksytään erikseen |

**Järjestys:** A → B → C → D → E. Ei rinnakkaisia muutoksia samaan tietomalliin, ellei yhteensopivuus ole dokumentoitu. Käytä olemassa olevia työtapoja, CI:tä ja Repo Guardia. Kunkin PR:n saa viedä Readyksi/mergeen vasta omien hyväksyntäehtojen jälkeen.

### Ennen pilvijulkaisua hyväksytettävät asiat

- Onko aktiivinen tuotantokohde erillinen Cloudflare Worker/D1/R2 vai kevyempi vaihtoehto?
- Mitkä Finelin pakettiversiot ja kieliversiot ovat saatavissa oikeasti?
- Julkaistaanko kaikki Finelin rivit julkiseen luku-API:in vai vaaditaanko lukuvaltuutus (huomioi käytön mittakaava ja hinnoittelu)?
- Miten release- ja palautusketju varmistetaan, ja mikä on vastuu erillisistä uusista Cloudflare-resursseista?
- Miten Recipavon nykyiset ravintoarvolaskelmat ja GK-tietokanta pysyvät ennallaan?

## 10. Hyväksyntäkriteerit koko kokonaisuudelle

Finelin ensimmäinen tuotava julkaisu on hyväksyttävissä vasta, kun:
- [ ] Alkuperäisen jakelupaketin URL, lisenssi, julkaisutunniste ja jokaisen tiedoston SHA-256 on kirjattu.
- [ ] Virallisen aineiston **kaikki** ravintotekijäkoodit, nimet, yksiköt ja saatavilla olevat arvot on inventoitu.
- [ ] Elintarvikkeet, luokitukset, annoskoot, resepti-/ainesosatiedot sekä menetelmä- ja lähdekoodistot on tuotu tai raportoitu eksplisiittisesti “ei julkisessa paketissa”.
- [ ] Kaikkien taulujen rivimäärät, viiteavaimet ja poikkeukset on koneellisesti todennettu; lukumääriä ei arvattu aiemmasta verkkosivusta.
- [ ] Tunnistamattomat sarakkeet on säilytetty alkuperäisessä datassa, ja tuonti ilmoittaa niistä. Mitään ei pudoteta hiljaa.
- [ ] Puuttuvat, epäselvät nollat, todelliset nollat ja yksikkömuunnokset on testattu erikseen.
- [ ] Vitamiinit sekä kivennäis- ja hivenaineet ovat saatavissa samoilla ehdoilla kuin makrot – **sikäli kuin virallinen paketti ne sisältää**.
- [ ] Tuonnin toisto on idempotentti; epäonnistunut ajo ei vaihda aktiivista releasea.
- [ ] Testeillä on osoitettu snapshotin palautuminen ja vanhan julkaisun kyseltävyys.
- [ ] API/MCP vastaa todellisilla yksiköillä, lähteillä ja julkaisuversion tunnisteella; ei keksittyjä arvoja.
- [ ] Sivuston nykyinen FI/EN/TH-julkaisu ja GitHub Pagesin polut pysyvät toimivina.
- [ ] CC BY 4.0 -attribuutio, muokkausten ilmoittaminen ja THL:n erillisyys ovat oikein.
- [ ] Uusia resursseja/kuluja tai tuotantointegraatioita ei ole otettu käyttöön ilman hyväksyntää.

## 11. Tarkistukset ja rajat

Tämä suunnitelma perustuu 18.11.2026 luettuun Ravinto-repoon ja THL:n viralliseen Finelin tiedostojen lukuohjeeseen. **Varsinaista Finelin julkaisu-ZIP:iä/CSV-pakettia ei tässä PR:ssä ladattu tai laskettu**, joten todellinen kenttä- ja komponenttiluettelo on ensimmäisen toteutusvaiheen tehtävä. Julkiset luonnehdinnat elintarvikkeiden/ravintotekijöiden määristä ovat suuntaa antavia.

Ei tässä vaiheessa:
- uuden datan massatuontia mainiin;
- omaa ravintoainelaskenta-UI:ta;
- automaattisesti kirjoittavia AI-työkaluja;
- Recipavon reseptien, ravintoarvojen tai GK:n muuttamista;
- lisämaksullista palveluympäristöä ilman erillistä päätöstä;
- oletusta siitä, että kaikki Finelin analyysissä mitatut harvinaiset ravintotekijät olisivat julkisesti ladattavissa.

**Ohjenuora:** Ravinto pitää rakentaa tietopankiksi, jonka numerot ovat jäljitettävissä *lähteen täsmälliseen aineistoversioon ja ravintotekijäkoodiin* myös vuosien kuluttua. Tämä on olennaisempaa kuin uuden käyttöliittymän näyttävyys.
