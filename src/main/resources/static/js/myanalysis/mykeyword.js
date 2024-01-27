let KEYWORD_LIST_MAX_COUNT = 100;

function createKeywordTargetContentFrame(parentEl, title, id) {
    const contEl = createElement(parentEl, 'div', ['cont-division']);
    createElementWithText(contEl, 'h3', ['title'], {}, title);

    const scrollEl = createElementWithText(contEl, 'div', ['scroll'], {'style': 'height: 326px;'});
    createElement(scrollEl, 'ul', ['list-ul'], {'id': id});
}

function createMyKeywordContentFrame(parentEl) {
    let contGroupEl = createElement(parentEl, 'div', ['cont-group', 'brb-line']);

    let col50El = createElement(contGroupEl, 'div', ['col-50', 'left', 'brr-line-inside']);
    createKeywordTargetContentFrame(col50El, TEXT_COMPETITOR, 'keyword-competitor');

    col50El = createElement(contGroupEl, 'div', ['col-50', 'right', 'brr-line-inside']);
    createKeywordTargetContentFrame(col50El, TEXT_CUSTOMER, 'keyword-customer');

    contGroupEl = createElement(parentEl, 'div', ['cont-group']);

    col50El = createElement(contGroupEl, 'div', ['col-50', 'left', 'brr-line-inside']);
    createKeywordTargetContentFrame(col50El, TEXT_NEWS, 'keyword-news');

    col50El = createElement(contGroupEl, 'div', ['col-50', 'right', 'brr-line-inside']);
    createKeywordTargetContentFrame(col50El, TEXT_CLIENT, 'keyword-client');
}

function clickCollapse() {
    setTimeout(() => {
        const expandSideMenuEls = document.querySelectorAll('.sub-menu.collapse.show');
        const expandSideMenuIds = [...expandSideMenuEls].map(el => el.id).join(',');
        localStorage.setItem('expandSideMenu', expandSideMenuIds);
    }, 500);
}

function updateKeywordData(queryType, keywords, id) {
    let ulEl = document.getElementById(id);
    ulEl.innerHTML = '';

    const now = moment();
    const endDate = now.format('YYYY-MM-DD');
    const startDate = now.subtract(1, "years").format("YYYY-MM-DD");

    const searchInfo = new SearchInfo();
    searchInfo.searchStartDate = startDate;
    searchInfo.searchEndDate = endDate;
    searchInfo.searchKeywords = keywords;
    searchInfo.searchFunction = searchData;
    searchInfo.searchSize = KEYWORD_LIST_MAX_COUNT;
    searchInfo.searchAllData = true;
    searchInfo.pageNavItemCountPerPage = KEYWORD_LIST_MAX_COUNT;

    searchInfo.searchFunction(queryType, searchInfo).then(response => {
        const resultList = response.result;
        for (let result of resultList) {
            const liEl = createElement(ulEl, 'li');
            const titleEl = createElement(liEl, 'a', ['ellipsis'], {
                'href': 'javascript:',
                'data-toggle': 'modal',
                'data-target': '#newsModal',
                'data-part-type': QUERY_TYPE_TO_PART_TYPE[queryType] ? QUERY_TYPE_TO_PART_TYPE[queryType] : '',
                'data-query-type': queryType,
                'data-from': 'myanalysis-mykeyword',
                'data-id': result.analysisId,
            }, cleanText(result.title));
            titleEl.addEventListener('click', function (event) {
                KEYWORD_LIST_FOR_MODAL = searchInfo.searchKeywordList;
            });

            createElement(liEl, 'p', ['summary'], {},
                cleanText(result.content.replace(/\\n+/ig, ' ')));

            const articleInfoEl = createElement(liEl, 'div', ['article-info']);
            createElementWithText(articleInfoEl, 'span', ['date_time'], {},
                moment(result.createdAt).format('YYYY.MM.DD h:mm'));
        }
    }).catch(error => {
        console.error(error);
    });
}

function updateContent(item) {
    const contentEl = document.getElementById('content');
    contentEl.innerText = '';
    createMyKeywordContentFrame(contentEl);

    updateKeywordData(QUERY_TYPE_COMPETITOR, item, 'keyword-competitor');
    updateKeywordData(QUERY_TYPE_CUSTOMER, item, 'keyword-customer');
    updateKeywordData(QUERY_TYPE_CLIENT, item, 'keyword-client');
    updateKeywordData(QUERY_TYPE_NEWS, item, 'keyword-news');
}