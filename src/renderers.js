export default (feeds) => {
  const feedsPart = document.querySelector('#feeds');
  const articlesPart = document.querySelector('#articles');
  feedsPart.innerHTML = '';
  articlesPart.innerHTML = '';
  feeds.forEach((feed) => {
    const { title, description, items } = feed;
    const feedItem = `
        <li class="list-group-item border-0 pl-0 ">
          <h6 class="mb-1">${title}</h6>
          <p class="small mb-1 d-flex justify-content-between align-items-center">${description}</p>
          <hr>
        </li>`;
    feedsPart.insertAdjacentHTML('afterbegin', feedItem);
    items.forEach((item) => {
      const { itemLink, itemTitle, itemDescription } = item;
      const itemArticle = `<li class="list-group-item list-group-item-action pl-0 border-0 d-flex justify-content-between align-items-center">
      <a href="${itemLink}" target="_blank" class="text-decoration-none text-reset">${itemTitle}</a>
      <a href="#" class="badge badge-pill badge-info" data-toggle="modal"
      data-target="#desсriptionModal" data-description="${itemDescription}">description</a></li>`;
      articlesPart.insertAdjacentHTML('afterbegin', itemArticle);
    });
  });
};
