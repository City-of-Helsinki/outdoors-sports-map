# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [1.2.0] - 2021-06-23

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
