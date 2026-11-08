/* OBEN 18.10.2026 (Projektleitung Doldenhorn, wie Ruedihus) · Robert 18:30: «… dass bei solchen Sachen im ganzen Projekt mit allen 4 Hotels die Links oben die Seite zeigen».
   Jede Seite ohne #-Stelle öffnet oben, auch nach Neuladen und bei Zurück: der Browser stellt die alte Scrollstelle nicht mehr her.
   Wird beim Zusammenstellen für online in jede Seite eingehängt (_werkzeuge/online/werkzeuge_online.py, Block OBEN), als erstes Skript im Kopf. */
(function () { try { if (!location.hash && 'scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {} })();
