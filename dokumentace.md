# Dokumentace - hub

## Stav (2026-09-02)

Statická stránka, hotová a pushnutá na GitHub. **Zatím není nasazená na Vercel** - import projektu z GitHubu je krok, který jde udělat jen přes přihlášený browser (stejné omezení jako u watchlistu/gamelistu), takže čeká na uživatele.

- **Repo**: https://github.com/qves34/hub
- **Produkce**: zatím žádná - po importu do Vercelu (tým "Bombo") dostane `*.vercel.app` doménu
- **Deploy**: čistě statický web, žádný build krok - stačí ve Vercelu zvolit framework preset "Other"/žádný a importovat repo, auto-deploy při `git push` na `master` pak jede sám
- **Supabase/backend**: žádný - stránka nemá žádný stav, formulář ani API

## Co je hotové

- **Hero sekce**: nadpis + podtitulek, scroll cue dolů k projektům
- **Aurora/glass vizuál**: animované rozostřené barevné koule na pozadí (`.aurora`/`.orb`, CSS keyframes + jemný mousemove parallax), skleněné karty s `backdrop-filter`, grain textura přes celou stránku, Fraunces (nadpisy) + Inter (text) z Google Fonts
- **3 karty projektů** (Watchlist, Gamelist, Mercenary) - `<button>`, ne přímý odkaz (viz "Rozhodnutí" níž)
- **Detail projektu na celou obrazovku** (`<dialog class="modal">`, `showModal()`): dvousloupcové rozložení - vlevo název/delší popis/tlačítka (Otevřít appku + GitHub, u Mercenary jen GitHub protože nemá live build), vpravo seznam "co umí" a "poslední updaty" (3 nejnovější změny s datem). Na úzkých obrazovkách se sloupce zalomí pod sebe. Zavírání: X, klik mimo panel, Esc (zdarma díky nativnímu `<dialog>`)
- **Scroll-reveal animace**: `IntersectionObserver` přidává třídu `.in` prvkům s `.reveal`, `prefers-reduced-motion` animace vypíná

## Rozhodnutí a poznámky

- **Čisté HTML/CSS/JS, žádný framework** - rozcestník je pár statických sekcí bez stavu na server, React/Vite by tu byl zbytečný overhead
- **Karty neodkazují přímo ven** - první verze byla `<a href>` rovnou na živou appku. Uživatel chtěl mezikrok s víc informacemi: nejdřív malý centrovaný modal, pak (na výslovnou žádost - "spíš lišta přes celou obrazovku") přepsáno na fullscreen panel, aby byl prostor i na feature list a poslední updaty
- **"Poslední updaty" jsou psané ručně** v `PROJECTS` objektu (`script.js`), ne generované automaticky z `git log` sesterských repozitářů - při psaní byly ověřené proti reálné historii (`git log` ve `watchlist`, `gamelist`, `C:\Dev\MercGame`), ale je potřeba je při dalších větších updatech projektů ručně dohledat a přepsat, jinak zastarají
- **Odkazy na projekty**: Watchlist/Gamelist míří na jejich produkční Vercel URL, Mercenary (nemá live build) míří jen na GitHub repo - karta i modal to odlišují štítkem "živě"/"ve vývoji"

## Struktura souborů

```
index.html   - obsah stránky (hero, karty, modal markup)
style.css    - veškerý styl (proměnné v :root, aurora pozadí, karty, modal, responsive)
script.js    - scroll-reveal, cursor-glow na kartách, PROJECTS data + logika modalu
```

Žádný build krok, žádné závislosti - `index.html` jde otevřít přímo v prohlížeči nebo servírovat čímkoliv statickým (`python3 -m http.server`, Vercel, apod.).

## Jak přidat další projekt do rozcestníku

1. `index.html` - zkopírovat jeden `<button class="card reveal" data-project="...">` blok, změnit `data-project` na nové klíčové slovo
2. `script.js` - přidat záznam do `PROJECTS` se stejným klíčem: `index`, `tag`/`tagClass` (`tag-live` nebo `tag-dev`), `stack`, `title`, `desc`, `features` (pole vlastností), `updates` (pole `{date, text}`, 3 nejnovější), `live` (URL nebo `null`), `github`
3. Nic dalšího - CSS a modal logika jsou generické, žádnou další úpravu nepotřebují
