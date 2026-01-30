# Dokumentacija toka rada: AI Course Generator (n8n)

Ovaj workflow predstavlja automatizovani cevovod koji pretvara sirove obrazovne materijale (PDF ili TXT) u strukturirani kurs sa lekcijama, testovima i modulima, koristeći mogućnosti LLM-a.

Pregled procesa

1. Ulazni podaci: Datoteka (PDF/TXT) i metapodaci (naziv kursa, jezik) preko Webhook-a.
2. Obrada: Ekstrakcija teksta i proračun strategije učenja (broj lekcija i modula).
3. Arhitektura: Generisanje strukture kursa pomoću veštačke inteligencije.
4. Popunjavanje: Ciklično generisanje detaljnog sadržaja za svaku lekciju i kreiranje provera znanja.
5. Izlaz: Sklapanje finalnog JSON objekta i slanje u mobilnu aplikaciju putem API-ja.

Arhitektura čvorova

1. Prijem i obrada datoteka

• Webhook (Upload material): Ulazna tačka za mobilnu aplikaciju. Prima binarnu datoteku i JSON sa parametrima.
• Type File & If PDF: Logički blok koji određuje MIME tip datoteke radi izbora odgovarajućeg parsera.
• Extract From File: Pretvaranje binarnih podataka u čisti tekst. 2. Analitika i strategija

• Structuring fields: Čišćenje teksta od nepotrebnih karaktera i priprema varijabli.
• Strategy Calculator (JS Code): Čvor sa ugrađenom logikom. Izračunava optimalan broj lekcija na osnovu obima teksta i grupiše ih u module. 3. Generisanje strukture (LLM Layer)

• Course Review (HTTP Request): Upit modelu glm-4.7 za kreiranje sadržaja kursa. Izlaz je strogi JSON sa listom tema i teza.
• Parse JSON (JS Code): Napredni parser koji ispravlja eventualne greške u odgovoru mreže, zatvara nezavršene zagrade i normalizuje strukturu podataka. 4. Generisanje sadržaja (Petlja)

• Loop Over Items: Iterator koji prolazi kroz svaku planiranu lekciju.
• Create Lesson: Generisanje teksta lekcije u akademskom stilu i kreiranje kviza od 5 pitanja.
• Wait: Tehnička pauza (3 sekunde) radi poštovanja ograničenja API-ja (Rate Limits). 5. Finalno sklapanje i eksport

• Aggregate & Final: Skuplja sve generisane lekcije u jedinstveni hijerarhijski niz, sortira ih po ID-u i dodaje metapodatke (vreme ažuriranja, broj modula).
• HTTP Request (PATCH): Šalje gotov objekat kursa nazad u bazu podataka aplikacije.

Tehnološki stek

• Platforma: n8n
• AI Model: GLM-4.7
• Formati: PDF, TXT, JSON, Markdown (za tekstove lekcija)
• Jezik logike: JavaScript (Node.js)
Ključne karakteristike

• Automatska skalabilnost: Sistem sam odlučuje koliko će kreirati lekcija na osnovu obima učitane datoteke.
• Otpornost na greške: Čvor Parse JSON sadrži regularne izraze za čišćenje ASCII karaktera koji često kvare standardni JSON.parse.
• Adaptivnost: Podrška za više jezika kroz sve čvorove generisanja.
