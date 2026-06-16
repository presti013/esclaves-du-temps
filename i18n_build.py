# -*- coding: utf-8 -*-
"""
Outillage i18n pour « Esclaves du Temps ».
- inject() : pose/rafraîchit (idempotent, via sentinelles) le sélecteur de
  langue, les liens hreflang, le <style> du sélecteur, l'include JS, et met à
  jour canonical/og:url pour la langue — SANS toucher au corps ni au reste du SEO.
- scaffold() : crée en/<page> ou it/<page> depuis la version FR (réécriture des
  chemins d'assets), UNIQUEMENT si le fichier n'existe pas encore (préserve les
  traductions déjà faites). Le sélecteur y est ensuite rafraîchi par inject().

Re-exécutable sans risque : régénère les sélecteurs partout, ne réécrit jamais
un corps traduit.
"""
import io, os, re

BASE = "https://presti013.github.io/esclaves-du-temps/"

# Pages disposant (ou destinées à disposer) d'une traduction. Mettre à jour au
# fur et à mesure puis relancer le script pour rafraîchir les sélecteurs.
AVAIL = {
    "en": set(),
    "it": set(),
}

LANG_LABEL = {"fr": "Français", "en": "English", "it": "Italiano"}
LANG_FLAG  = {"fr": "\U0001F1EB\U0001F1F7", "en": "\U0001F1EC\U0001F1E7", "it": "\U0001F1EE\U0001F1F9"}
LANG_CODE  = {"fr": "FR", "en": "EN", "it": "IT"}
SWITCH_ARIA = "Language · Langue · Lingua"

def url_for(target, cur, page):
    """URL relative de `page` dans la langue `target`, vue depuis `cur`."""
    if target == cur:
        return page
    rootprefix = "" if cur == "fr" else "../"
    subdir = "" if target == "fr" else (target + "/")
    return rootprefix + subdir + page

def abs_url(lang, page):
    return BASE + ("" if lang == "fr" else lang + "/") + page

def available(lang, page):
    return lang == "fr" or page in AVAIL.get(lang, set())

def build_switch(cur, page):
    items = []
    for lang in ("fr", "en", "it"):
        avail = available(lang, page) or lang == cur
        flag = '<span class="i18n-flag" aria-hidden="true">%s</span>' % LANG_FLAG[lang]
        code = LANG_CODE[lang]
        if lang == cur:
            items.append(
                '<a href="%s" hreflang="%s" lang="%s" class="is-active" aria-current="page" '
                'aria-label="%s" data-i18n-lang="%s" data-i18n-avail="1">%s %s</a>'
                % (url_for(lang, cur, page), lang, lang, LANG_LABEL[lang], lang, flag, code))
        elif avail:
            items.append(
                '<a href="%s" hreflang="%s" lang="%s" aria-label="%s" '
                'data-i18n-lang="%s" data-i18n-avail="1">%s %s</a>'
                % (url_for(lang, cur, page), lang, lang, LANG_LABEL[lang], lang, flag, code))
        else:
            items.append(
                '<span class="is-disabled" aria-disabled="true" lang="%s" '
                'title="%s — bientôt / soon / presto">%s %s</span>'
                % (lang, LANG_LABEL[lang], flag, code))
    return ('<!--i18n:switch-->\n<nav class="i18n-switch" aria-label="%s">%s</nav>\n<!--/i18n:switch-->'
            % (SWITCH_ARIA, "".join(items)))

def build_hreflang(page):
    out = ['<!--i18n:hreflang-->']
    for lang in ("fr", "en", "it"):
        if available(lang, page):
            out.append('<link rel="alternate" hreflang="%s" href="%s">' % (lang, abs_url(lang, page)))
    out.append('<link rel="alternate" hreflang="x-default" href="%s">' % abs_url("fr", page))
    out.append('<!--/i18n:hreflang-->')
    return "\n".join(out)

STYLE = """<!--i18n:style-->
<style>
.i18n-switch{position:fixed;top:10px;right:10px;z-index:99999;display:flex;gap:2px;
  font-family:'Orbitron',monospace,sans-serif;font-size:11px;letter-spacing:.06em;
  background:rgba(2,6,8,.72);border:1px solid rgba(201,148,58,.3);border-radius:3px;
  padding:3px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);}
.i18n-switch a,.i18n-switch span{display:inline-flex;align-items:center;gap:5px;
  padding:5px 8px;text-decoration:none;color:#9a8f7a;border-radius:2px;line-height:1;
  white-space:nowrap;transition:background .2s,color .2s;}
.i18n-switch a:hover,.i18n-switch a:focus-visible{color:#E8B84B;background:rgba(201,148,58,.14);}
.i18n-switch .is-active{color:#020608;background:#C9943A;font-weight:700;}
.i18n-switch .is-active:hover{color:#020608;background:#C9943A;}
.i18n-switch .is-disabled{opacity:.35;cursor:not-allowed;}
.i18n-switch a:focus-visible{outline:2px solid #E8B84B;outline-offset:2px;}
.i18n-flag{font-size:13px;line-height:1;}
@media (max-width:480px){.i18n-switch{font-size:10px;padding:2px;top:6px;right:6px;}
  .i18n-switch a,.i18n-switch span{padding:4px 6px;gap:3px;}.i18n-flag{font-size:12px;}}
@media (prefers-reduced-motion:reduce){.i18n-switch a{transition:none;}}
</style>
<!--/i18n:style-->"""

def js_tag(cur):
    prefix = "" if cur == "fr" else "../"
    return ('<!--i18n:js-->\n<script src="%sassets/js/lang-switch.js" defer></script>\n<!--/i18n:js-->'
            % prefix)

def _replace_block(html, name, newblock, anchor, after=False):
    pat = re.compile(r'<!--i18n:%s-->.*?<!--/i18n:%s-->' % (name, name), re.S)
    if pat.search(html):
        return pat.sub(lambda m: newblock, html, count=1)
    # insérer
    if after:  # insérer juste après l'ancre (regex)
        m = re.search(anchor, html)
        idx = m.end()
        return html[:idx] + "\n" + newblock + html[idx:]
    else:      # insérer juste avant l'ancre (texte littéral)
        idx = html.index(anchor)
        return html[:idx] + newblock + "\n" + html[idx:]

def _update_meta_url(html, lang, page):
    target = abs_url(lang, page)
    html = re.sub(r'(<link rel="canonical" href=")[^"]*(">)', lambda m: m.group(1)+target+m.group(2), html, count=1)
    html = re.sub(r'(<meta property="og:url" content=")[^"]*(">)', lambda m: m.group(1)+target+m.group(2), html, count=1)
    return html

def inject(path, lang, page):
    html = io.open(path, encoding="utf-8").read()
    html = _replace_block(html, "style", STYLE, "</head>", after=False)
    html = _replace_block(html, "hreflang", build_hreflang(page), "</head>", after=False)
    html = _replace_block(html, "switch", build_switch(lang, page), r"<body[^>]*>", after=True)
    html = _replace_block(html, "js", js_tag(lang), "</body>", after=False)
    html = _update_meta_url(html, lang, page)
    # <html lang="..">
    html = re.sub(r'<html[^>]*\blang="[^"]*"', '<html lang="%s"' % lang, html, count=1)
    io.open(path, "w", encoding="utf-8").write(html)

def rewrite_asset_paths(html):
    # 'assets/...' -> '../assets/...' quand précédé d'un guillemet ou d'une parenthèse
    return re.sub(r'(["\'(])assets/', r'\1../assets/', html)

def scaffold(page, lang):
    out_dir = lang
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, page)
    if os.path.exists(out_path):
        return out_path, False
    html = io.open(page, encoding="utf-8").read()
    html = rewrite_asset_paths(html)
    io.open(out_path, "w", encoding="utf-8").write(html)
    return out_path, True

def _is_full_doc(f):
    try:
        h = io.open(f, encoding="utf-8").read()
        return "</head>" in h and "</body>" in h
    except Exception:
        return False

PAGES_FR = [f for f in sorted(os.listdir(".")) if f.endswith(".html") and _is_full_doc(f)]

if __name__ == "__main__":
    import sys
    # 1) FR : injecter/rafraîchir le sélecteur sur toutes les pages racine.
    for page in PAGES_FR:
        inject(page, "fr", page)
    print("FR : sélecteur injecté sur %d pages." % len(PAGES_FR))
    # 2) EN/IT : scaffold (si absent) + rafraîchir sélecteur.
    for lang in ("en", "it"):
        for page in sorted(AVAIL[lang]):
            p, created = scaffold(page, lang)
            inject(p, lang, page)
            print("  %s/%s %s" % (lang, page, "(créé)" if created else "(rafraîchi)"))
