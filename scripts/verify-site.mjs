import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { filterProducts } from '../js/catalog-filter.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const {categories,products}=JSON.parse(await fs.readFile(path.join(root,'content/catalog.json'),'utf8'));
const sources=JSON.parse(await fs.readFile(path.join(root,'content/catalog-sources.json'),'utf8'));
assert.equal(categories.length,10);
assert.equal(products.length,81);
assert.ok(!categories.some(c=>c.id==='davlumbazlar'));
assert.ok(!products.some(p=>p.category==='davlumbazlar'));
assert.equal(new Set(products.map(p=>p.id)).size,products.length);
assert.deepEqual(new Set(products.map(p=>p.id)),new Set(sources.categories.flatMap(c=>c.products.map(u=>u.split('/').at(-1)))),'All source category pages must be represented');
for(const category of categories){assert.ok(filterProducts(products,categories,category.id).length>0,category.id);}
assert.equal(filterProducts(products,categories,'fanlar').length,17);
assert.equal(filterProducts(products,categories,'menfezler').length,42);
assert.equal(filterProducts(products,categories,'all','RESPİRO').length,1);
assert.equal(filterProducts(products,categories,'all','respiro')[0].id,'konut-tip-isi-geri-kazanim-cihazlari-respiro');
assert.equal(filterProducts(products,categories,'all','ısı geri kazanım').length,5);
assert.equal(filterProducts(products,categories,'all','isi geri kazanim').length,5);
assert.equal(filterProducts(products,categories,'all','td silent')[0].id,'yuvarlak-kanal-tipi-fanlar-td-silent');
assert.equal(filterProducts(products,categories,'davlumbazlar','silent').length,0);
assert.equal(filterProducts(products,categories,'all','__olmayan_model_90127').length,0);
assert.equal(filterProducts(products,categories).length,81);
const sitemap=await fs.readFile(path.join(root,'sitemap.xml'),'utf8');
const files=(await fs.readdir(root)).filter(f=>f.endsWith('.html')).concat((await fs.readdir(path.join(root,'urunler'))).filter(f=>f.endsWith('.html')).map(f=>'urunler/'+f));
let localLinks=0,waLinks=0;
for(const file of files){
 const html=await fs.readFile(path.join(root,file),'utf8');
 assert.ok(html.includes('<html lang="tr">'),file+' language');
 assert.ok(html.includes('name="viewport"'),file+' viewport');
 assert.match(html,/<link rel="canonical" href="https:\/\/hashavalandirma\.com\.tr\/[^\"]*"/,file+' canonical');
 const redirect=/http-equiv="refresh"/.test(html);
 if(!redirect){
  assert.ok(!/905322638003|0532 263 80 03|No:15,/.test(html),file+' outdated contact details');
  for(const number of ['+902124930611','+902124930612','+905402175858'])assert.ok(html.includes('tel:'+number),file+' missing phone '+number);
  for(const account of ['https://www.facebook.com/havalandirmaveklima','https://www.instagram.com/hashavalandirma/'])assert.ok(html.includes(`href="${account}" target="_blank" rel="noopener"><svg class="social-icon"`),file+' social logo link');
 }
 if(!redirect){assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,file+' must have one h1');assert.ok(!/designesia|metalishavalandirma|contact\.php|handler\.php/.test(html),file+' old template content');assert.doesNotMatch(html,/restoran|mutfak|davlumbaz|gıda|pişirme|lokanta|yemek|\bkafe\b/i,file+' food-sector content');}
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const link=match[1].replaceAll('&amp;','&');
  if(link.startsWith('https://wa.me')){const url=new URL(link);assert.equal(url.pathname,'/905402175858');assert.ok(url.searchParams.get('text')?.includes('teklif'));waLinks++;}
  if(/^(https?:|tel:|mailto:|data:)/.test(link))continue;
  const [pathname,hash]=link.split('#');
  const clean=decodeURIComponent(pathname.split('?')[0]);
  const target=clean?path.resolve(root,path.dirname(file),clean):path.join(root,file);
  assert.ok(target.startsWith(root+path.sep),file+' path containment '+link);
  await fs.access(target).catch(()=>assert.fail(file+' missing '+link));localLinks++;
  if(hash&&target.endsWith('.html')){const targetHtml=await fs.readFile(target,'utf8');assert.ok(targetHtml.includes(`id="${hash}"`),file+' missing anchor '+link);}
 }
 if(redirect)assert.ok(!sitemap.includes('/'+file+'</loc>'),file+' redirect in sitemap');
 for(const match of html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g))JSON.parse(match[1]);
}
for(const p of products){
 assert.ok(p.description&&p.features.length&&p.image,p.id+' complete data');
 const file='urunler/'+p.id+'.html';const html=await fs.readFile(path.join(root,file),'utf8');
 assert.ok(sitemap.includes('/'+file+'</loc>'),p.id+' sitemap');
 assert.ok(html.includes(encodeURIComponent(p.name)),p.id+' WhatsApp product context');
 assert.ok((await fs.stat(path.join(root,p.image))).size>0,p.id+' image');
}
const expected=6+products.length;assert.equal((sitemap.match(/<loc>/g)||[]).length,expected);
const contact=await fs.readFile(path.join(root,'contact.html'),'utf8');
assert.ok(contact.includes('Osmangazi Mahallesi, Mareşal Fevzi Çakmak Cd. No:15/4, 34522 Kıraç / İstanbul'));
assert.match(contact,/<iframe src="https:\/\/www\.google\.com\/maps\/embed\?pb=[^"]*0x14caba5e29a18865%3A0x14817f0ef9ad74ed[^"]*" title="[^"]+"/);
console.log(`PASS: ${products.length} models, ${categories.length} categories, ${files.length} HTML files, ${localLinks} local links, ${waLinks} WhatsApp links.`);
console.log('PASS: Turkish/ASCII search, combined filters, empty/reset results, product context, canonical URLs, sitemap and legacy anchors.');
