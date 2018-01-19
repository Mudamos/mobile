# Next

* Add new iOS app icon size requirement

## [1.7.0] 12/01/2018

* [PR #371] Change signature count message
* [PR #368] Remove onesignal tag info upon logout
* [PR #366] National cause
* [PR #363] Tagging user location

## [1.6.0] 21/07/2017

* [PR #357] Add “Proponha um PL” menu item
* [PR #353] Add new action button with authenticated singers link
  - Confgure Firebase Remote Config
    - `authenticated_signers_button_title` to `Lista de assinantes e outras informações`
* [PR #351] Add scope coverage info to the plip card
* [PR #350] Validate user address when signing plips
  - Confgure Firebase Remote Config
    - `ineligible_to_sign_citywide_plip_reason` to `Obrigado por seu apoio, mas você só pode assinar esse projeto de lei sendo eleitor do município para o qual a lei se destina.`
    - `ineligible_to_sign_statewide_plip_reason` to `Obrigado por seu apoio, mas você só pode assinar esse projeto de lei sendo eleitor do estado para o qual a lei se destina.`

## [1.5.0] 21/06/2017

* [PR #342] Pin gms and firebase android dependencies
* [PR #340] Track user interaction using Firebase Analytics
* [PR #339] Remote config app links
  - Confgure Firebase Remote Config
    - `link_why_projects` to `https://www.mudamos.org/institucional/projetos-de-lei-de-iniciativa-popular`
    - `link_get_to_know_mudamos` to `https://www.mudamos.org`
    - `link_help` to `https://www.mudamos.org/ajuda`
    - `link_send_your_idea` to `https://www.mudamos.org/envie-sua-ideia`
* [PR #338] Remote config remaining days
  - Confgure Firebase Remote Config
    - `plip_remaining_days_enabled` to `true`
* [PR #337] Add the final goal info as a metric

## [1.4.0] 08/05/2017

* [PR #324] Change menu text items
* [PR #321] Add “help” menu option
* [PR #320] Add “tell a friend” menu share option
* [PR #319] Add firebase crash library
  - Follow the readme info on this PR. Google services json/plist config
* [PR #317] Add gradient to the plip show and improve share message
* [PR #316] New plips design
* [PR #311] Fix side menu overflow when the user has a long name or email
* [PR #310] Persist the plips filters
* [PR #307] Add plip metrics info to the plips scene
* [PR #304] Add plips scope filter

## [1.3.1] 13/04/2017

* [PR #298] Fix incompatibility one signal vs maps

## [1.3.0] 13/04/2017

* [PR #294] Add links to the plips list
* [PR #292] Use the phase final date to compute the remaining days
* [PR #290] Push message
* [PR #287] Handle empty reverse zip code search result
* [PR #286] Add wrong zip code text

## [1.2.0] 07/04/2017

* [PR #282] Change some app texts
* [PR #278] Change activity launch mode to singleTask

## [1.1.0] 24/03/2017

* [PR #273] Add new plip progress layout
* [PR #272] Add proof of work before some apis
* [PR #271] Add plip video

## [1.0.0] 10/03/2017
