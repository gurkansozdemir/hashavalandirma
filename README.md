# Has Havalandırma

Bağımlılık gerektirmeyen, statik HTML/CSS/JavaScript ürün kataloğu. Üretim alan adı: `https://hashavalandirma.com.tr`.

## Yerel kullanım

Node.js 20 veya üzeri gerekir. Paket kurulumu gerekmez.

```sh
npm run build
npm run verify
npm run preview
```

Önizleme: `http://127.0.0.1:4173`. Durdurmak için `Ctrl+C` kullanın. Üretimde Node.js sunucusu gerekmez; HTML dosyaları, `css/site.css`, etkin JavaScript dosyaları ve görseller statik olarak sunulur.

## İçerik düzenleme

- `content/catalog.json`: ürün aileleri, ürün/model adları, açıklamalar, özellikler ve yerel görsel yolları.
- `content/catalog-sources.json`: referans ürün adresleri, kategori kapsamı ve kaynak notları. Tanıtım metinleri Has kimliği için yeniden yazılmıştır; ürün fotoğrafları kaynak katalogdan alınmıştır.
- `scripts/build-site.mjs`: ortak sayfa yapısı, hizmetler, iletişim bilgileri ve SEO etiketleri.
- `css/site.css`: masaüstü ve mobil tasarım.
- `images/brand/`: açık zemin logosu, koyu zemin logosu ve amblem.
- `js/catalog-filter.js`: Türkçe/ASCII uyumlu arama ve kategori eşleştirme.
- `js/catalog.js`: filtrelerin, aramanın ve URL parametrelerinin arayüz bağlantısı.

İçerik değişikliklerinden sonra `npm run build` çalıştırın. HTML dosyaları ile `js/catalog-data.js`, site haritası ve robots dosyası bu komutla yeniden üretilir. Ürün kimliğini değiştirmek URL'yi de değiştirir; eski bağlantılar için ayrıca yönlendirme ekleyin. Ürün kaldırıldığında eski `urunler/` dosyasını da kaldırın.

Katalogda 11 aile ve 88 benzersiz ürün/model vardır. Genel **Fanlar** filtresi dört fan alt ailesini birleştirir; kategori adetleri bu nedenle toplanmamalıdır. BVN, AFS, Daikin, Gree ve HTK ürün markaları olarak gösterilir. Resmî bayilik, müşteri referansı veya doğrulanmamış başarı istatistiği kullanılmaz.

WhatsApp bağlantıları `905322638003` numarasına ve ilgili ürünün adını içeren hazır mesaja gider. Mesajı kullanıcı gönderir. İletişim formu veya sunucu tarafı e-posta gönderimi yoktur.

## URL ve yönlendirmeler

Ana sayfalar: `index.html`, `products.html`, `services.html`, `projects.html` (Uygulama Alanları), `about.html`, `contact.html`. Ürünler `urunler/<kimlik>.html` adresindedir.

- `installation.html` → `services.html#havalandirma`
- `repair.html`, `maintenance.html` → `services.html#bakim-onarim`
- `service-area.html` → `projects.html`

Eski sayfalar statik HTML yönlendirmesi, hedef canonical ve tıklanabilir yedek bağlantı içerir. Bunlar HTTP 301 yanıtı değildir. Sunucu düzeyinde 301 ve özel 404 yanıtı, kullanılan barındırma ortamında ayrıca yapılandırılabilir. Site haritasında yalnızca 94 güncel, indekslenebilir adres bulunur.

## Kontroller

`npm run verify`; kaynak kapsamını, 11 aile/88 ürün kaydını, arama ve filtre sonuçlarını, yerel dosya/bağlantı/çapa hedeflerini, WhatsApp numarasını ve ürün mesajlarını, JSON-LD, canonical, site haritası ve eski URL yönlendirmelerini denetler.

Görsel ve etkileşim kontrolleri ayrıca tarayıcıda yapılmalıdır: masaüstü/mobil düzen, menü ve Escape davranışı, klavye odağı, mobil kategori seçimi, sonuç bulunamaması ve filtre temizleme.
