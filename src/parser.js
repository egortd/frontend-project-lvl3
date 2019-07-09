export default (feed) => {
  const data = new DOMParser().parseFromString(feed, 'application/xml');
  if (!data.querySelector('rss')) {
    throw new Error('Source is not contains RSS feeds');
  }
  const title = data.querySelector('title').textContent;
  const description = data.querySelector('description').textContent;
  const items = [...data.querySelectorAll('item')].reduce((acc, item) => {
    const itemLink = item.querySelector('link').textContent;
    const itemTitle = item.querySelector('title').textContent;
    const itemDescription = item.querySelector('description').textContent;
    return [{ itemLink, itemTitle, itemDescription }, ...acc];
  }, []);
  return { title, description, items };
};
