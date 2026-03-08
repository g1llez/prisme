# Embed URLs for widgets (iframe)

The dashboard displays widgets via **iframes**: each widget needs a **direct URL** (e.g. `https://...`) set in `config.json` → `widgets[].url`.

## TradingView

TradingView **does not provide** a simple URL to paste in an iframe. They give a **code snippet** (script + config) that injects the widget.

**Options:**

1. **“Share chart” link**  
   On a TradingView chart: **Share** (icon) → enable sharing → copy the URL (e.g. `https://www.tradingview.com/chart/xxxxx/`).  
   You can put this URL in `config.json`. Some sites block iframe embedding (X-Frame-Options); if the frame stays empty, TradingView is blocking the embed.

2. **Widget with direct URL**  
   For a Bitcoin price/chart without TradingView you can use e.g.:
   - **Bitcoin.com**: `https://charts.bitcoin.com/widgets/live-price.html` (blocks embedding; use a local page instead, see Prisme `pages/`).
   - **CoinGecko**: go to [coingecko.com/widgets](https://www.coingecko.com/en/widgets), pick a widget and use the embed URL if provided.

3. **Official TradingView integration**  
   Their docs use a **script** that creates the iframe: [TradingView Widget Docs](https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/).  
   For Prisme this would require a special widget type (e.g. “TradingView”) that loads that script instead of a plain `iframe src="..."`. Not in config for now.

## Other widgets

- **Google Doc**: Open the doc → File → Share → Publish to the web → Embed. Copy the URL `https://docs.google.com/document/d/ID/preview` → set as `url`.
- **Google Sheets (Drive)**: In the sheet → **File → Share → Publish to the web** → **Embed** tab → Publish. Either copy the iframe URL (format `d/e/.../pubhtml`), or use:  
  `https://docs.google.com/spreadsheets/d/SHEET_ID/pubhtml?gid=0&single=true&widget=false&headers=false`  
  (replace `SHEET_ID`). If it doesn’t load, use the URL from Google’s embed dialog.
- **Google Calendar**: see section below.
- **Grafana**: see section below.
- **Mempool.space**: `https://mempool.space` blocks iframe embedding; use a local page that calls their API (e.g. `pages/mempool-fees.html`).

## Google Calendar (iframe embed)

1. Open [Google Calendar](https://calendar.google.com).
2. Next to the calendar to embed, click the **three dots** → **Settings and sharing**.
3. Scroll to **Integrate calendar** (or **Embed calendar**).
4. Copy the URL from the **Embed code** section: it’s in the iframe `src="..."`, e.g.  
   `https://calendar.google.com/calendar/embed?src=XXXXX%40group.calendar.google.com&ctz=America%2FMontreal`
5. In `data/config.json`, for the `google_calendar` widget, set `url` to that URL (or at least replace `...` in `src=...` with your **calendar ID**).  
   Manual format:  
   `https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_ID&ctz=Europe/Paris`  
   (replace `YOUR_CALENDAR_ID`, e.g. `abc123@group.calendar.google.com`; for your main calendar it’s often your Gmail address. `ctz` = timezone.)

## Grafana (iframe embed)

1. **Grafana server**: embedding must be allowed or the browser will block the iframe (X-Frame-Options).  
   - Config file: `grafana.ini` → section `[security]` → `allow_embedding = true`  
   - Or with Docker: environment variable `GF_SECURITY_ALLOW_EMBEDDING=true`  
   Then restart Grafana.

2. **Get the dashboard URL**:  
   - Open the dashboard in Grafana.  
   - **Share** (icon) → **Embed** (or **Integrate**).  
   - Copy the iframe `src` URL. It looks like:  
     `https://YOUR-GRAFANA/d/DASHBOARD_UID/dashboard-name?orgId=1&...`  
   - Replace `YOUR-GRAFANA` with the real URL (e.g. `grafana.sarius.ca`, `mon.sarius.ca`, or internal IP).  
   - In Prisme, the URL must be reachable from the **browser** that opens Prisme. If Grafana is internal (`grafana.internal`), it only works if that hostname resolves (DNS/hosts) on the machine showing the dashboard.

3. **Typical format**:  
   `https://grafana.example.com/d/abc123/bitcoin-dashboard?orgId=1&theme=dark`  
   (`abc123` = dashboard UID, visible in the URL when you open the dashboard in Grafana).

4. **Proxy / nginx**: If Grafana is behind nginx, do not add an `X-Frame-Options` header (or set it to `SAMEORIGIN` / allow your Prisme domain), or the iframe will stay blocked.

## Editing the config

- **With volume**: edit the mounted file (e.g. `data/config.json`) then reload the page (no rebuild).
- **Without volume**: edit `public/config.json` (or the file that gets copied into the image), then rebuild the Docker image and restart the container.
