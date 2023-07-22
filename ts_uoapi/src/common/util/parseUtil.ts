import { AnyNode, Cheerio, Element } from 'cheerio';
import { ALT, ELEMENT_TYPE_TEXT, HREF, IMG } from '../httpConstants';

export const getHrefAttribute = (element: Element): string => element.attribs[HREF];

export const getImgAltAttribute = (element: Cheerio<Element>): string =>
  element.find(IMG).attr(ALT) ?? '';

export const mapAnyNodeToStringArray = (any_nodes: Cheerio<AnyNode>): string[] => {
  return any_nodes
    .contents()
    .map((_i: number, el: AnyNode): string | undefined =>
      el.type === 'text' ? el.data : undefined,
    )
    .toArray();
};

export const getTextElementData = (node: AnyNode): string =>
  node.type === ELEMENT_TYPE_TEXT ? node.data : ''; // TODO

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
