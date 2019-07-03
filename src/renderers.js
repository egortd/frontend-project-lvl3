export default (data) => {
  const feedsPart = document.querySelector('#feeds');
  const articlesPart = document.querySelector('#articles');
  const { title, description, items } = data;
  const feedItem = `
        <li class="list-group-item border-0 pl-0">
          <h6 class="mb-1">${title}</h6>
          <p class="small mb-1">${description}</p>
        </li>`;
  feedsPart.insertAdjacentHTML('afterend', feedItem);
  items.forEach((item) => {
    const { itemLink, itemTitle, itemDescription } = item;
    const itemArticle = `<li class="list-group-item list-group-item-action pl-0 border-0">
      <a href="${itemLink}" target="_blank" class="text-decoration-none text-reset">${itemTitle}</a>
      <a href="#" class="badge badge-pill badge-info" data-toggle="modal"
      data-target="#desсriptionModal" data-description="${itemDescription}">description</a></li>`;
    articlesPart.insertAdjacentHTML('afterend', itemArticle);
  });
};
