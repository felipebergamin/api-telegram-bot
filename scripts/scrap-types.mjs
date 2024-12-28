import axios from 'axios';
import * as cheerio from 'cheerio';

import { Project, SyntaxKind } from 'ts-morph';
import camelcase from 'camelcase';
import { ESLint } from 'eslint';

// URL of the Telegram Bot API documentation
const TELEGRAM_API_URL = 'https://core.telegram.org/bots/api';

// Fetch the HTML content of the Telegram API page
async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return data;
}

const isUpperCase = (char) => char === char.toUpperCase();

const lintFilesAndFix = async (filePaths) => {
  const linter = new ESLint({ fix: true });
  const results = await linter.lintFiles(filePaths);
  await ESLint.outputFixes(results);
};

// Parse the HTML to extract available types and their fields
function parseTypes(html) {
  const $ = cheerio.load(html);
  const types = [];

  // Locate available types section
  $('h4').each((_, element) => {
    const typeName = $(element).text().trim();
    const typeDefinition = [];

    if (typeName.includes(' ')) {
      return;
    }

    // Extract the nearest table, even if there are intermediate elements
    let nextElement = $(element).next();
    while (nextElement.length && nextElement[0].tagName !== 'table') {
      nextElement = nextElement.next();
    }

    const table = nextElement;
    const isMethod = !isUpperCase(typeName[0]);
    if (table) {
      table.find('tr').each((__, row) => {
        const cells = $(row).find('td');
        if (cells.length >= 2) {
          const fieldName = $(cells[0]).text().trim();
          const fieldType = $(cells[1]).text().trim();
          const description = $(cells[isMethod ? 3 : 2])
            .text()
            .trim();
          const isOptional = isMethod
            ? $(cells[2]).text().trim().toLowerCase() !== 'yes'
            : description.includes('Optional.');
          typeDefinition.push({
            fieldName,
            fieldType,
            description,
            isOptional,
          });
        }
      });
    }

    if (typeDefinition.length) {
      types.push({ typeName, fields: typeDefinition });
    }
  });

  return types;
}

/**
 * @typedef InterfacePropertyDescriptor
 * @type {Object}
 * @property {string} name
 * @property {string} type
 * @property {string} description
 * @property {boolean} isOptional
 */
/**
 * @typedef {Object} InterfaceDeclarationDescriptor
 * @property {string} name - O nome da interface.
 * @property {InterfacePropertyDescriptor[]} properties - As propriedades da interface.
 */

/**
 * Convert Telegram types to TypeScript types
 * @returns {InterfaceDeclarationDescriptor[]}
 */
function extractTypeDefinitions(types) {
  /** @type {InterfaceDeclarationDescriptor[]} */
  const interfaces = [];
  types.forEach(({ typeName, fields }) => {
    /** @type {InterfaceDeclarationDescriptor} */
    const interfaceDescriptor = {
      name: typeName,
      properties: [],
    };
    fields.forEach(({ fieldName, fieldType, description, isOptional }) => {
      const tsType = fieldType
        .replace(/Integer/g, 'number')
        .replace(/Float/g, 'number')
        .replace(/String/g, 'string')
        .replace(/Boolean/g, 'boolean')
        .replace(/Array of (.+)/g, 'Array<$1>')
        .replace(/Array of (.+)/g, 'Array<$1>')
        .replace(/True/g, 'true')
        .replace(/False/g, 'false')
        .replace(/ (or|and) /g, ' | ')
        .replace(/,/g, ' | ')
        .replace(/Optional/g, 'null | undefined');

      interfaceDescriptor.properties.push({
        description,
        name: fieldName,
        type: tsType,
        isOptional,
      });
    });
    interfaces.push(interfaceDescriptor);
  });

  return interfaces;
}

/**
 * Save TypeScript definitions to a file
 * @param {InterfaceDeclarationDescriptor[]} definitions
 * @param {string} fileName
 */
function saveTypeScriptToFile(definitions, fileName) {
  const project = new Project();
  const sourceFile = project.createSourceFile(fileName, '', {
    overwrite: true,
  });
  const methodNames = [];
  definitions.forEach((interfaceDeclaration) => {
    const interfaceName = isUpperCase(interfaceDeclaration.name[0])
      ? interfaceDeclaration.name
      : camelcase(interfaceDeclaration.name, {
          pascalCase: true,
        });
    if (interfaceName !== interfaceDeclaration.name) {
      methodNames.push(interfaceDeclaration.name);
    }
    sourceFile.addInterface({
      name: interfaceName,
      properties: interfaceDeclaration.properties.map((prop) => ({
        name: prop.name,
        type: prop.type,
        docs: [{ description: prop.description }],
        hasQuestionToken: prop.isOptional,
      })),
      isExported: true,
    });
  });

  const file = project.addSourceFileAtPath('./src/@types/index.ts');
  const typeAlias = file.getTypeAliasOrThrow('ApiMethods');
  const type = typeAlias.getType();
  const typeNode = typeAlias.getTypeNodeOrThrow();
  const objectType = typeNode.asKindOrThrow(SyntaxKind.TypeLiteral);
  methodNames.forEach((methodName) => {
    if (!type.getProperty(methodName)) {
      console.log(`${methodName} not found in ApiMethods`);
      const argsInterfaceName = camelcase(methodName, {
        pascalCase: true,
      });
      objectType.addProperty({
        name: methodName,
        type: `[${argsInterfaceName}, unknown]`,
      });
      file.addImportDeclaration({
        moduleSpecifier: './generated',
        isTypeOnly: true,
        namedImports: [
          {
            name: argsInterfaceName,
          },
        ],
      });
    }
  });

  project.saveSync();
  const filePaths = project.getSourceFiles().map((f) => f.getFilePath());
  lintFilesAndFix(filePaths);
  console.log(`TypeScript definitions saved to ${fileName}`);
}

// Main function
(async function main() {
  try {
    const html = await fetchHTML(TELEGRAM_API_URL);
    const types = parseTypes(html);
    const typesDescriptors = extractTypeDefinitions(types);
    saveTypeScriptToFile(typesDescriptors, './src/@types/generated.ts');
  } catch (error) {
    console.error('Error fetching or processing types:', error);
  }
})();
