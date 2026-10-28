# Javerk Mediaplayer

Installasjonsfiler og oppdateringer for Javerk Mediaplayer på Windows.

## Last ned

[Åpne nyeste utgivelse](https://github.com/kronjuvelen/javerk-mediaplayer-releases/releases/latest)

Last ned `Javerk-Mediaplayer-Setup-<versjon>.exe`, lukk spilleren og kjør installasjonen. Eldre PER- og Javerk-utgaver uten oppdateringskilde trenger én manuell oppgradering til 0.3.0 eller nyere.

## Oppdateringer

Spilleren sjekker etter nye versjoner også før innlogging. Nye oppdateringer lastes ned i bakgrunnen; velg **Installer og start på nytt** når avspillingen er stoppet. Musikk og brukeroppsett lagres lokalt på PC-en.

Oppdateringsmetadata signeres med en egen Ed25519-utgivelsesnøkkel. Appen kontrollerer signaturen og installasjonsfilens SHA-512-kontrollsum. Den private nøkkelen ligger ikke i repositoryet.

Windows-utgiversignering er separat. Denne første utgaven kan vise Windows-varsel om ukjent utgiver.

## Publisering

Repositoryet inneholder den pakkede appen og publiseringsverktøy, ikke utviklingsprosjektet. GitHub Actions bygger og tester først en skjult draft. Den blir offentlig først etter lokal signaturgodkjenning og kontroll av installasjonsfilen. En publisert versjon overskrives ikke.
