/*
 * Finds library entry in library and returns the entry object
 */
const getLibraryEntryLocal = (media_id, media_type, library) => {
  if (library?.length === undefined) {
    return undefined;
  }
  const is_tv = (media_type === "tv") ? true : false;
  const matchingEntry = library?.filter(libraryEntry => libraryEntry.media_id == media_id && libraryEntry.is_tv === is_tv);
  return matchingEntry === undefined ? undefined : matchingEntry[0];
};

export default getLibraryEntryLocal;