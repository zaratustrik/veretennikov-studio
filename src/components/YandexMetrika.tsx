/**
 * Yandex.Metrika counter — loaded only when YANDEX_METRIKA_ID env var is set.
 * Uses next/script with afterInteractive to not block initial render.
 *
 * To enable: set YANDEX_METRIKA_ID in Vercel env vars (e.g. "12345678").
 * Get the ID at https://metrika.yandex.ru after creating a counter.
 */

import Script from "next/script"

export default function YandexMetrika() {
  const id = process.env.YANDEX_METRIKA_ID
  if (!id) return null

  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=${id}", "ym");
            ym(${id}, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true,
              defer:true
            });
          `,
        }}
      />
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${id}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}
