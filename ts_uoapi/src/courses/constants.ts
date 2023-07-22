import { BasicAcceptedElems, Element } from 'cheerio';

export const creditRegex: RegExp = /(\((?<credits0>[0-9]+) (unit[s]?|crédit[s]?)\))|((?<credits1>[0-9]+) (unit[s]?|crédit[s]?))|(\((?<credits2>[0-9]+) ((unit[s]?|crédit[s]?) \/ (?<credits3>[0-9]+) (crédit[s]?|unit[s]?))\))/;
export const courseBlockSelector: BasicAcceptedElems<Element> = '.courseblock';
export const courseBlockTitleSelector: string = '.courseblocktitle';