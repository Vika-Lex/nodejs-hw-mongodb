import { CONTACT_TYPE } from '../constants/index.js';

const parseContactType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;

  const isContactType = (type) => [
    CONTACT_TYPE.HOME, CONTACT_TYPE.WORK, CONTACT_TYPE.PERSONAL,
  ].includes(type);
  if (isContactType(type)) return type;
};

const parseIsFavourite = (isFavourite) => {
  if (isFavourite === undefined) return undefined;
  return Boolean(isFavourite === 'true');
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedContactType = parseContactType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  const filter = {};
  if (parsedContactType !== undefined) filter.contactType = parsedContactType;
  if (parsedIsFavourite !== undefined) filter.isFavourite = parsedIsFavourite;

  return filter;
};


