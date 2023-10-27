/* eslint-disable */

import { parse } from 'node-html-parser';
import { Project, StructureKind } from 'ts-morph';

const fetchTable = async (url: string, methodName: string): Promise<string> => {
  const response = await fetch(url);
  const text = await response.text();
  const table = text.split(methodName)[1].split('<table class="table">')[1].split("</table>")[0];
  return table;
}

const mapTelegramTypeToTypeScriptType = (telegramType: string): string => {
  const typeMappers: Record<string, string | undefined> = {
    "Integer": "number",
    "Float": "number",
    "String": "string",
    "Boolean": "boolean",
    "InputFile": "ReadStream",
  }
  return typeMappers[telegramType] ?? telegramType;
}

const typeTransformer = (value: string): string => {
  const acceptedValues = value.split(' or ').map(telegramType => {
    const match = /^Array of (?<typeName>\w*)$/.exec(telegramType);

    if (match?.groups) {
      return `Array<${mapTelegramTypeToTypeScriptType(match.groups.typeName)}>`;
    }
    return mapTelegramTypeToTypeScriptType(telegramType);
  });
  return acceptedValues.join(' | ');
}

const parseTBody = (table: string): string[][] => {
  const parsedTable = parse(`<table>${table}</table>`);
  const tbody = parsedTable.querySelector("tbody");
  const tbodyValues = tbody?.querySelectorAll("tr").map(tr => tr.querySelectorAll("td").map(td => td.text)) ?? [];
  return tbodyValues;
}

(
  async () => {
    const project = new Project();

    const methodName = 'sendPhoto';
    const result = await fetchTable("https://core.telegram.org/bots/api#sendmessage", methodName);
    const [, ...tableBody] = parseTBody(result);

    const sourceFile = project.createSourceFile(
      `./${methodName}.ts`,
      '',
      { overwrite: true },
    );
    const interfaceDec = sourceFile.addInterface({ name: methodName, isDefaultExport: true });
    tableBody.forEach(([name, type, required, description]) => {
      interfaceDec.addProperties([
        {
          name,
          type: typeTransformer(type),
          hasQuestionToken: required.toLowerCase() !== 'yes',
          kind: StructureKind.PropertySignature,
          docs: [{ description }]
        }
      ])
    });
    await sourceFile.save();
  }
)()
