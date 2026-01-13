#!/usr/bin/env ts-node

import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import get from "lodash/get";
import prettier from "prettier";

// Find configuration values from the application code to decrease the chance
// of them going out of sync.
import { API_BASE_URL } from "../src/domain/app/appConstants";
import { SUPPORTED_LANGUAGES } from "../src/domain/i18n/i18nConstants";
import { UnitServices } from "../src/domain/service/serviceConstants";

// Find environment variables from a dotenv if available. Helps in debugging
// locally.
dotenv.config();

const productionAddress = "https://ulkoliikunta.fi";
const LANGUAGES = Object.values(SUPPORTED_LANGUAGES);
const UNITS_PAGE_SIZE = 100;

function getLanguageVariants(path: string) {
  return LANGUAGES.map((language) => `${language}/${path}`);
}

function addDomain(...paths: string[]) {
  return paths.map((path) => `${productionAddress}/${path}`);
}

async function getAllUnits() {
  const parameters = new URLSearchParams({
    service: Object.values(UnitServices).join(","),
    only: "id,name",
    page_size: UNITS_PAGE_SIZE.toString(),
  });

  let url = `${API_BASE_URL}/unit?${parameters.toString()}`;
  let allUnits: any[] = [];

  while (url) {
    const response = await axios.get(url, {
      headers: { "Content-Type": "application/json" },
    });

    const data = response.data;
    allUnits = allUnits.concat(data.results);
    url = data.next; // follow pagination
  }

  return allUnits;
}


async function getUnitPaths() {
  const units = await getAllUnits();

  return units.reduce(
    (acc: [string, string, string][], unit: Record<string, unknown>) => {
      const unitId = unit.id;
      const languageVariants = LANGUAGES.map((language) => {
        const name = get(unit.name, language);
        const encodedUnitName = name ? encodeURIComponent(name) : name;
        const unitParameters = [unitId, encodedUnitName]
          .filter((part) => part)
          .join("-");

        return addDomain(`${language}/unit/${unitParameters}`);
      });

      return [...acc, languageVariants];
    },
    []
  );
}

function buildAlternates(fi: string, sv: string, en: string) {
  return `
    <xhtml:link 
      rel="alternate"
      hreflang="fi"
      href="${fi}" />
    <xhtml:link 
      rel="alternate"
      hreflang="sv"
      href="${sv}" />
    <xhtml:link 
      rel="alternate"
      hreflang="en"
      href="${en}" />
  `;
}

// pages: [
//   [route_fi, route_sv, route_en],
//   [...],
//   [...],
// ]
async function renderSitemap(pages: [string, string, string][]) {
  const prettierConfig = await prettier.resolveConfig("./.prettierrc");
  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${pages
        .map((routes: [string, string, string]) => {
          const [fi, sv, en] = routes;

          return `
            <url>
              <loc>${fi}</loc>
              ${buildAlternates(...routes)}
            </url>
            <url>
              <loc>${sv}</loc>
              ${buildAlternates(...routes)}
            </url>
            <url>
              <loc>${en}</loc>
              ${buildAlternates(...routes)}
            </url>
          `;
        })
        .join("")}
    </urlset>
  `;

  return prettier.format(sitemap, {
    ...prettierConfig,
    parser: "html",
  });
}

async function generateSitemap() {
  const pages = [
    addDomain(...getLanguageVariants("")),
    ...(await getUnitPaths()),
  ];
  const sitemap = await renderSitemap(pages);

  fs.writeFileSync("public/sitemap.xml", sitemap);
}

if (process.env.GENERATE_SITEMAP === "true") {
  console.log("Creating sitemap...");
  generateSitemap()
    .then(() => {
      console.log("Sitemap created to public/sitemap.xml");
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
