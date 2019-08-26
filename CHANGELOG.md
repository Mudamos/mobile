# Next

* [PR #483] Fix select on code input
* [PR #481] Fix code input on forgot password
* [PR #479] Fix checkbox layout
* [PR #477] Upgrade RN to 0.59

## [2.0.4] 17/06/2019

* [PR #474] Fix CPF entry bug after signup

## [2.0.3] 10/04/2019

* [PR #472] Update sdk target version to 26

## [2.0.2] 09/04/2019

* [PR #470] Update NSLocation permissions

## [2.0.1] 09/04/2019

* [PR #468] Remove email validation for facebook users on sign up
* [PR #465] Upgrade facebook sdk
* [PR #463] Fix uncommitted lock file

## [2.0.0] 09/01/2019

* [PR #459] Bump app version
* [PR #457] Improve interface following ITS recommendations
* [PR #453] Update profile endpoint from v1 to v3
* [PR #449] Add "This PR is from another region" page
* [PR #451] Update texts
* [PR #447] Update app following the ITS suggestions
* [PR #443] Add signing validation pages
* [PR #441] Add static pages
* [PR #445] Update splash screen
* [PR #440] Update app following the ITS suggestions
* [PR #432] Add search functionality
* [PR #437] Update edit profile layout
* [PR #438] Update app icons
* [PR #430] Add favorite functionality
* [PR #429] Update app to paginate plips from mobile api
* [PR #426] Fix OneSignal crash
* [PR #423] Adjust new layout following guidelines passed by ITS
* [PR #421] New layout at sign in and sign up
* [PR #419] Add new layout at plip details
* [PR #418] Add new layout at plips view with tabs
* [PR #455] Update how display errors

## [1.11.0] 10/09/2018

* [PR #436] Update integration to the TSE system
* [PR #417] Update to RN 0.55.4

## [1.10.0] 25/05/2018

* [PR #413] Improve performance at app link
* [PR #411] Fix app hanging on loading screen
* [PR #409] Use share link if available
* [PR #402] Redirect to a plip page when receive a link

## [1.9.0] 10/05/2018

* [ISSUE #404] Change default remote config values
* [PR #401] Plips virtual pagination
* [PR #398] Add dynamic link module

## [1.8.1] 13/04/2018

* [PR #393] Pod Firebase Crash deprecation
* [PR #390] Upgrade React Native and dependencies
* [PR #396] Add new permission description keys in Info.plist

## [1.8.0] 09/03/2018

* [PR #388] Use string value tags for onesignal
* [PR #386] Tag user signed plips
* [PR #384] Validate the message payload size
* [PR #382] Properly return the signature
* [PR #378] Add prod app group
* [PR #376] Validate profile
* [PR #374] Add Action sign feature
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
