# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [2.4.0] - 2024-11-20

### Added

-   [#261](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/261) Heightprofile support for 3D-units

## [2.3.0] - 2024-06-14

### Added

-   [#252](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/252) Add possibility to hide/show home-container
-   [#253](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/253) Select route on map line geometry click

### Changed

-   [#251](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/251) Update Matomo-tracking to use DigiaIiris-service
-   [#254](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/254) Update map zooming
-   [#255](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/255) Update packages, use NodeJS v22 and Nginx v1.2.6

### Fixed

-   [#250](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/250) Fix address location

## [2.2.2] - 2024-01-09

### Added

-   [#238](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/238) Add HDS CookieConsent modal

### Changed

-   [#221](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/221) Use Platta / OpenShift and Azure DevOps pipelines
-   [#232](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/232) Use master as default Git-branch with builds

## [2.2.1] - 2023-05-29

### Changed

-   [#214](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/214) Update accessibility statements
-   Update feedback service code value
-   Update to use GitHub actions checkout V3

### Fixed

-   [#216](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/216) Fix info icon styles

## [2.2.0] - 2023-04-13

### Added

-   [#193](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/193) Add ice swimming places to map
-   [#194](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/194) Add water quality information to swimming places
-   [#197](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/197) Add parking information
-   [#201](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/201) Add outdoor services to map
-   [#202](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/202) Add unit additional information
-   [#205](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/205) Add default observation for ice swimming places and outdoor services
-   [#207](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/207) Zoom to unit when it is selected

### Changed

-   [#195](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/195) Update service info text
-   [#200](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/200) Display only season sports
-   [#204](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/204) Utilize Digitransit API Key

## [2.1.0] - 2023-01-10

### Changed

-   [#185](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/185) Add sport specification filtering and visualize different skiing styles in detail view
-   [#186](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/186) Automatic satisfactory/unknown observation status

## [2.0.1] - 2022-12-20

### Fixed

-   [#181](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/181) Fix missing notice text by updating allowedElements in ReactMarkdown

## [2.0.0] - 2022-12-15

### Changed

-   [#170](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/170) Upgrade React to 17.x with related application packages and move to using Node 18 LTS

### Fixed

-   [#172](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/172) Missing www value in connections causes the frontend to fail
-   [#173](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/173) Application throws error to browsers console when ski map route is clicked
-   [#176](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/176) Freetext-search gives JS-error occasionally
-   [#178](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/178) Search suggestions give JS-error occasionally
-   [#179](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/179) Duplicate keys in search suggestions

## [1.6.1] - 2022-10-21

### Changed

-   Use only season specific sport services to improve service performance

## [1.6.0] - 2022-09-14

### Added

-   [#140](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/140) Show controlled information for beaches/swimming places
-   [#141](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/141) Show heating information
-   [#142](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/142) Show lighting information
-   [#143](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/143) Show dressing room information
-   [#145](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/145) Accessible colors for unusable units
-   [#146](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/146) Expandable unit details on mobile devices
-   [#147](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/147) Dynamic App wide notifications


### Changed

-   Bump terser to 4.8.1
-   Bump moment to 2.29.4
-   Bump shell-quote to 1.7.3

### Fixed

-   Filter out empty unit suggestions

## [1.5.2] - 2022-06-03

### Changed

-   Increase Kubernetes CPU limit
-   Replace node-sass with sass
-   Minor-package updates

## [1.5.1] - 2022-06-01

### Fixed

-   Notification language support for Microsoft Edge- and Safari-browsers

## [1.5.0] - 2022-05-30

### Added

-   Notification title that can be configured with environment
-   Add extra url support for unit details

### Changed

-   Update Servicemap link texts

## [1.4.1] - 2022-05-17

### Changed

-   Kubernetes CPU limit

## [1.4.0] - 2022-02-10

### Added

-   Ski track related additional information from new extra field
-   Notification that can be configured with environment

### Changed

-   Update about dialog text

## [1.3.0] - 2021-11-10

### Added

-   Accessibility statements

## [1.2.1] - 2021-06-23

### Fixed

-   [#99](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/99) Feedback form always failing to send feedback

## [1.2.0] - 2021-06-22

### Added

-   [#80](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/80) Robots.txt file
-   [#83](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/83) Language in url
-   [#91](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/91) Unit names as slugs to unit urls
-   [#93](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/93) Sitemap generation for production build

### Changed

-   Upgrade React and its related dependencies from 15.x to 16.x
-   [#84](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/84) Use create-react-app tool chain
-   [#87](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/87) Meta tags to be more descriptive
-   [#88](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/88) From flow to typescript
-   [#89](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/89) [Accessibility] Make map contents easier to skip for screen reader and keyboard users
-   [#90](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/90) [Accessibility] Change implementation of about and feedback modals to be inline with accessibility standards

### Fixed

-   [#78](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/78) [Accessibility] Capturing focus to the middle of the page when opening the details of an unit
-   [#82](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/82) [Accessibility] Language controls being hard to reach with keyboard and screen readers
-   [#92](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/92) Base map not respecting application language

## [1.1.6] - 2021-02-16

### Changed

-   [#73](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/73) Preserve zoom level when opening unit on mobile (@vaahtokarkki)

### Fixed

-   [#73](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/73) Mobile unit focus hiding point of interest under unit modal (@vaahtokarkki)
-   [#28](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/28) Fix links to repo (@hugovk)

## [1.1.5] - 2021-02-08

### Added

-   [#67](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/67) Link to palvelukartta in unit details view

### Fixed

-   [#49](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/49) [Accessibility] Fix insufficient labels on sub menus
-   [#51](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/51) [Accessibility] Fix unreachable show more link
-   [#52](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/52) [Accessibility] Add unique titles to pages
-   [#53](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/53) [Accessibility] Fix insufficient contrast in primary color
-   [#54](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/54) [Accessibility] Fix current address not read by screen readers
-   [#56](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/56) [Accessibility] Fix sub menu options not being usable with screen reader or keyboard
-   [#55](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/55) [Accessibility] Fix search returning nothing with an empty search
-   [#58](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/58) [Accessibility] Add missing search landmark
-   [#58](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/58) [Accessibility] Fix service info button for keyboard and screen reader users
-   [#59](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/59) [Accessibility] Add contentinfo landmark
-   [#61](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/61) [Accessibility] Hide map markers from some screen reader navigation approaches so that the application is easier to browse through

## [1.1.4] - 2021-01-28

Nothing changed. Release was made to move the service onto new infrastructure.

## [1.1.3] - 2021-01-05

### Changed

-   [#34](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/34) Run tests in GitHub
-   [#37](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/34) Use prettier to format project
-   [#45](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/45) Show all opening hours
-   [#47](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/47) Use icon instead of tooltip for outbound link

### Fixed

-   [#36](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/36) [Accessibility] HTML document language is now synced with application language
-   [#36](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/36) [Accessibility] Language toggles now have the correct lang attribute
-   [#38](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/38) [Accessibility] Make unit modal closable with keyboard
-   [#39](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/39) [Accessibility] Add text label to unit modal close link
-   [#40](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/40) [Accessibility] Info button not reachable with keyboard
-   [#41](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/41) [Accessibility] Make search button accessible with keyboard and move it after the search field
-   [#43](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/43) [Accessibility] Add accessible names to map and list buttons
-   [#44](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/44) [Accessibility] Warn when links open a new window
-   [#42](https://github.com/City-of-Helsinki/outdoors-sports-map/pull/42) [Accessibility] Add jump link
