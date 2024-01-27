let SITE_INFO_MAP = {}
let STOCK_NEWS_PANEL_DATE = '';
let NEWS_KEYWORD = '';
let COMPANY_SECTORS = '';
let KEYWORD_LIST_MAX_COUNT = 100;
let STOCK_CHART;
let CURRENT_SITE_ITEMS = [];
const NEWS_SIZE_PER_PAGE = 200;

const QUERY_TYPE_TO_API_URL = {
    [QUERY_TYPE_COMPETITOR]: '/api/site/user/competitor',
    [QUERY_TYPE_CUSTOMER]: '/api/site/user/customer',
    [QUERY_TYPE_CLIENT]: '/api/site/user/client',
    [QUERY_TYPE_MY_COMPANY]: '/api/site/user/mycompany',
    [QUERY_TYPE_CLIENT]: '/api/keyword',
    [QUERY_TYPE_INTEREST]: '/api/site/user/interest',
    [QUERY_TYPE_NEWS]: '/api/keyword',
    [QUERY_TYPE_VOC]: '/api/dashboard/voc/list/voc',
};

const ITEM_TYPE_STOCK_NEWS = 'STOCK_NEWS';
const ITEM_TYPE_DISC_INFO = 'DISC_INFO';
const ITEM_TYPE_COMP_NEWS = 'COMP_NEWS';

function isEnableContentPart(type, contentPart) {
    if (type in IS_ENABLE_CONTENT_PARTS) {
        if (IS_ENABLE_CONTENT_PARTS[type].find(enableContentPart => enableContentPart === contentPart)) {
            return true;
        }
    }
    return false;
}

function loadSideMenu() {
    SITE_INFO_MAP = {};

    const expandSideMenuItem = localStorage.getItem('expandSideMenu');
    const expandSideMenuIds = expandSideMenuItem ? expandSideMenuItem.split(',') : [];
    [
        QUERY_TYPE_MY_COMPANY,
        QUERY_TYPE_COMPETITOR,
        QUERY_TYPE_CUSTOMER,
        QUERY_TYPE_INTEREST,
        QUERY_TYPE_CLIENT
    ].map(queryType => {
        const isExpand = expandSideMenuIds.includes(`${queryType.toLowerCase()}-side-menu`);
        updateSideTree(queryType, isExpand);
    })

    // 선택된 서브 메뉴가 없을때 맨 처음 서브 메뉴 아이템 선택
    setTimeout(() => {
        const activeSubMenuEl = document.querySelector('.nav-side-menu .sub-menu .active');
        if (!activeSubMenuEl) {
            const targetSubMenuItemEl = document.querySelector('.nav-side-menu .menu-item');
            if (targetSubMenuItemEl) {
                const collapseEl = targetSubMenuItemEl.querySelector('div.collapsed');
                if (collapseEl && (collapseEl.getAttribute('aria-expanded') === 'false')) {
                    const collapseLinkEl = collapseEl.querySelector('a');
                    collapseLinkEl && collapseLinkEl.click();
                }

                const targetSubMenuLinkEl = document.querySelector('.sub-menu a');
                targetSubMenuLinkEl && targetSubMenuLinkEl.click();
            }
        }
    }, 300);
}

function createKeywordTargetContentFrame(parentEl, title, id) {
    const contEl = createElement(parentEl, 'div', ['cont-division']);
    createElementWithText(contEl, 'h3', ['title'], {}, title);

    const scrollEl = createElementWithText(contEl, 'div', ['scroll'], {'style': 'height: 326px;'});
    createElement(scrollEl, 'ul', ['list-ul'], {'id': id});
}

function createCompanyContentFrame(queryType, parentEl) {
    let colEl;
    let contGroupEl;

    const companyInfoContGroupEl = createElement(parentEl, 'div', ['cont-group']);

    colEl = createElement(companyInfoContGroupEl, 'div', ['col-100']);
    if (isEnableContentPart(queryType, PART_TYPE_COMPANY_INFO)) {
        createCompanyInfoFrame(colEl);
    }

    const companyStockContGroupEl = createElement(parentEl, 'div', ['cont-group']);

    colEl = createElement(companyStockContGroupEl, 'div', ['col-50', 'left', 'brr-line-inside']);
    if (isEnableContentPart(queryType, PART_TYPE_COMPANY_STOCK)) {
        companyInfoContGroupEl.classList.add('brb-line');
        createCompanyStockFrame(colEl);
    }
    if (isEnableContentPart(queryType, PART_TYPE_NEWS_HOMEPAGE)) {
        createHomepageNews2Frame(colEl);
    }

    colEl = createElement(companyStockContGroupEl, 'div', ['col-50', 'right', 'brl-line-inside']);
    if (isEnableContentPart(queryType, PART_TYPE_NEWS_STOCK_DISCLOSURE)) {
        createStockNewsAndDisClosureFrame(colEl);
    }

    if (isEnableContentPart(queryType, PART_TYPE_VOC)) {
        companyStockContGroupEl.classList.add('brb-line');
        const anchorEl = createElement(parentEl, 'div', [], {'id': 'voc-list-anchor'});
        anchorEl.style.visibility = 'hidden';
        anchorEl.style.position = 'relative';
        anchorEl.style.top = '-40px';

        contGroupEl = createElement(parentEl, 'div', ['cont-group']);
        colEl = createElement(contGroupEl, 'div', ['col-100']);
        createVocFrame(colEl);
    }

    if (isEnableContentPart(queryType, PART_TYPE_NEWS_POWER_ADMIN)) {
        contGroupEl.classList.add('brb-line');

        contGroupEl = createElement(parentEl, 'div', ['cont-group']);

        colEl = createElement(contGroupEl, 'div', ['col-100']);
        createPowerAdminNewsFrame(colEl);
    }

    const panelWrapEl = createElement(parentEl, 'div', ['panel-stock-wrap'], {'id': 'stock_001'});
    createPanelWarpFrame(panelWrapEl);
}

function createNewsAndInterestContentHeaderFrame(parentEl, title) {
    addClassList(parentEl, ['section', 'right', 'brl-line']);

    const contGroupEl = createElement(parentEl, 'div', ['cont-group']);
    const col100El = createElement(contGroupEl, 'div', ['col-100']);
    const listTopEl = createElement(col100El, 'div', ['list-top']);
    const h3El = createElementWithText(listTopEl, 'h3', ['title', 'mb-0', 'pt-0', 'pb-0'], {}, title);
    createElement(h3El, 'span', ['result'], {}, '결과 <em>0</em>개');
    const formRowEl = createElement(listTopEl, 'div', ['form-row', 'ab-right']);
    const colEl = createElement(formRowEl, 'div', ['col']);
    const selectEl = createElement(colEl, 'select', ['form-control-sm']);

    ['20', '40', '60', '80', '100'].forEach(option => {
        createElementWithText(selectEl, 'option', [], {}, option);
    });

    createElementWithText(formRowEl, 'span', ['txt'], {}, '개 보기');
    return col100El;
}

function createNewsAndInterestContentFrame(parentEl, title) {
    const col100El = createNewsAndInterestContentHeaderFrame(parentEl, title);
    const noResultEl = createElement(col100El, 'div', ['no-result'], {'style': 'display: none;'});
    const pEl = createElement(noResultEl, 'p');
    createElement(pEl, 'span', ['ico-no']);
    createElementWithText(noResultEl, 'strong', ['ico-no'], {}, '데이터가 존재하지 않습니다.');
    createElementWithText(col100El, 'ul', ['list-ul']);

    const pageNaviEl = createElementWithText(col100El, 'nav', [], {'aria-label': 'Page navigation'});
    createElement(pageNaviEl, 'ul', ['pagination']);
}

function createContentFrame(queryType) {
    SELECTED_QUERY_TYPE = queryType;

    const contentEl = document.getElementById('content');
    contentEl.innerText = '';
    if (queryType === QUERY_TYPE_NEWS) {
        createNewsAndInterestContentFrame(contentEl, '뉴스');
    } else if (queryType === QUERY_TYPE_CLIENT) {
        // TODO client 화면 추가 필요
    } else if (queryType === QUERY_TYPE_INTEREST) {
        createNewsAndInterestContentFrame(contentEl, '정보');
    } else {
        createCompanyContentFrame(queryType, contentEl);
    }
}

function updateSiteAllData(queryType, siteId, isForeign) {
    ALL_NEWS_LIST = [];
    createContentFrame(queryType);
    const keywordList = SITE_INFO_MAP[siteId] ? SITE_INFO_MAP[siteId].hostName.split(' ') : '';

    CURRENT_SITE_ITEMS = [];
    getApiService(`/api/site/${siteId}/items`).then(response => {
        STOCK_CHART.showLoading();

        CURRENT_SITE_ITEMS = response;
        Promise.all([
            updateCompanyInfo(queryType, siteId, CURRENT_SITE_ITEMS),
            updateStockNews(queryType, siteId, keywordList, CURRENT_SITE_ITEMS),
            updateHomepageNews(queryType, siteId, keywordList, CURRENT_SITE_ITEMS),
            updatePowerAdministrationNews(queryType, siteId, CURRENT_SITE_ITEMS),
            updateStockDisclosure(queryType, siteId, keywordList, CURRENT_SITE_ITEMS),
            updateVocList(queryType, siteId, keywordList)
        ]).then(() => {
            ALL_NEWS_LIST.sort(compareNewsCreateAt);
            updateCompanyStock(queryType, siteId);
        }).catch(err => {
            console.error(err);
        });
    }).catch(err => {
        console.error(err);
    });
}

function updateNewsAllData(queryType, keyword) {
    NEWS_KEYWORD = keyword;

    createContentFrame(queryType);
    updateNewsKeywordData(keyword);
}

function updateInterestAllData(queryType, siteId) {
    createContentFrame(queryType);
    updateInterestData(queryType, siteId);
}

function clickCollapse() {
    setTimeout(() => {
        const expandSideMenuEls = document.querySelectorAll('.sub-menu.collapse.show');
        const expandSideMenuIds = [...expandSideMenuEls].map(el => el.id).join(',');
        localStorage.setItem('expandSideMenu', expandSideMenuIds);
    }, 500);
}

function updateClientAllData(keywords) {
    const contentEl = document.getElementById('content');

    const searchInfo = new SearchInfo();
    searchInfo.searchAlgorithm = SEARCH_ALGORITHM_ALL_ORDER;
    searchInfo.searchPage = KEYWORD_LIST_MAX_COUNT;
    searchInfo.searchKeywords = keywords;
    searchInfo.searchFunction = searchData;
    searchInfo.pageNavItemCountPerPage = KEYWORD_LIST_MAX_COUNT;
    searchInfo.searchFunction(QUERY_TYPE_CLIENT, searchInfo).then(response => {
        let jsonData = JSON.parse(response);
        const resultList = jsonData.result;

        const reqId = Number(resultList[0].crawlingReqId);
        const template = loadTemplate(reqId);
        let div_html = json2html.render([1], template.detail);
        contentEl.innerHTML = div_html;
    }).catch(error => {
        console.error(error);
    });
}

function createTableRowsFrame(parentEl, ids, texts) {
    const trEl = createElement(parentEl, 'tr');

    let tdEls = [];
    for (let i = 0; i < ids.length; i++) {
        const thEl = createElementWithText(trEl, 'th');
        if (texts[i] !== '') {
            thEl.innerText = texts[i];
        }

        const tdEl = createElement(trEl, 'td', [], {'id': ids[i]});
        tdEls.push(tdEl);
    }

    return tdEls;
}

function createCompanyInfoFrame(parentEl) {
    const h3El = createElementWithText(parentEl, 'h3', ['title'], {}, TEXT_COMPANY_INFO);
    createSyncNotification(h3El, 'sync-company-info-datetime');

    const tableEl = createElement(parentEl, 'table', ['table', 'table-data']);
    const colGroupEl = createElement(tableEl, 'colgroup');

    for (let attribute of ['150', '*', '150', '*']) {
        createElement(colGroupEl, 'col', [], {'width': attribute});
    }

    const tbodyEl = createElement(tableEl, 'tbody');

    let tdEls = createTableRowsFrame(tbodyEl, ['company-name'], [TEXT_COMPANY_NAME]);
    tdEls[0].setAttribute('colspan', '3');

    tdEls = createTableRowsFrame(tbodyEl, ['', 'company-phonenumber'], [TEXT_HOMEPAGE, TEXT_MAIN_PHONE]);
    createElement(tdEls[0], 'a', [],{
        'href': '',
        'target': '_blank',
        'id': 'company-homepageurl'
    });

    createTableRowsFrame(tbodyEl, ['company-establishment-date', 'company-ceo'], [TEXT_FOUNDING_DATE, TEXT_CEO]);
    createTableRowsFrame(tbodyEl, ['company-address', 'company-sectors'], [TEXT_ADDRESS, TEXT_SECTOR]);
}

function createCompanyStockFrame(parentEl) {
    const contDivEl = createElement(parentEl, 'div', ['cont-division']);

    const h3El = createElementWithText(contDivEl, 'h3', ['title'], {}, TEXT_STOCK_INFO);
    createSyncNotification(h3El, 'sync-company-stock-datetime', false);

    createElement(contDivEl, 'div', [], {
        'id': 'stock-chart',
        'style': 'height: 433px'
    });

    createStockChart();
}

function createPanelWarpFrame(parentEl) {
    const buttonEl = createElement(parentEl, 'button', ['btn', 'btn-close-black-sm'], {
        'type': 'button',
        'data-dismiss': '#stock_001',
        'aria-label': 'Close'
    });
    buttonEl.addEventListener('click', function (event) {
        event.target.parentElement.classList.toggle('active');
    });

    const panelContEl = createElement(parentEl, 'div', ['panel-cont']);
    const h3El = createElementWithText(panelContEl, 'h3', ['title'], {}, '주가정보 관련 뉴스');

    const scrollEl = createElement(panelContEl, 'div', ['scroll'], {
        'id': 'relatedNewsStock'
    });
    createSpinner(scrollEl);
    createElement(scrollEl, 'ul', ['list-ul']);
    // TODO : 주가정보 연동 개선 시 More 버튼 반영 필요
    // createMoreButton(panelContEl, '#relatedNewsStock');
}

function createHomepageNews2Frame(parentEl) {
    const contDivEl = createElement(parentEl, 'div', ['cont-division', 'home-news2']);

    const h3El = createElementWithText(contDivEl, 'h3', ['title'], {}, TEXT_HOMEPAGE_NEWS);
    createSyncNotification(h3El, 'sync-homepage-news-second-datetime');

    const homeNewsEl = createElement(contDivEl, 'div', ['scroll'], {
        'id': 'homeNews2',
        'style': 'height: 322px;'
    });
    createSpinner(homeNewsEl);
    createElement(homeNewsEl, 'ul', ['list-ul'], {
        'id': 'homepage-news-list',
        'data-page-number': 0
    });
    createMoreButton(contDivEl, '#homeNews2', () => {
        updateHomepageNews(QUERY_TYPE_MY_COMPANY, SELECTED_SITE_IDS, [], CURRENT_SITE_ITEMS);
    });
}

function createVocFrame(parentEl) {
    const h3El = createElementWithText(parentEl, 'h3', ['title'], {}, 'VOC');
    createSyncNotification(h3El, 'sync-voc-datetime');
    createSpinner(parentEl);
    createElement(parentEl, 'ul', ['list-ul'], {
        'id': 'voc-list'
    });

    const navEl = createElement(parentEl, 'nav', [], {
        'aria-label': 'Page navigation'
    });
    createElement(navEl, 'ul', ['pagination']);
}

function createPowerAdminNewsFrame(parentEl) {
    const h3El = createElementWithText(parentEl, 'h3', ['title'], {}, '전력청 뉴스');
    createSyncNotification(h3El, 'sync-power-admin-news-datetime');
    createSpinner(parentEl);
    createElement(parentEl, 'ul', ['list-ul'], {
        'id': 'power-administration-news-list'
    });
}

function createStockNewsAndDisClosureFrame(parentEl) {
    const contDivEl = createElement(parentEl, 'div', ['cont-division', 'brb-line-inside']);

    const navEl = createElement(contDivEl, 'div', ['nav', 'nav-tabs'], {
        'id': 'nav-tab',
        'role': 'tablist'
    });
    createElementWithText(navEl, 'a', ['nav-link', 'active'], {
        'id': 'nav-tab1',
        'data-toggle': 'tab',
        'href': '#navTab1',
        'role': 'tab',
        'aria-controls': 'navTab1',
        'aria-selected': 'true'
    }, TEXT_STOCK_NEWS);
    createElementWithText(navEl, 'a', ['nav-link'], {
        'id': 'nav-tab2',
        'data-toggle': 'tab',
        'href': '#navTab2',
        'role': 'tab',
        'aria-controls': 'navTab2',
        'aria-selected': 'false'
    }, TEXT_DISCLOSURE_INFO);
    createSyncNotification(navEl, 'sync-stock-news-disclosure-datetime');

    const tabContentEl = createElement(contDivEl, 'div',
        ['tab-content'], {'id': 'nav-tabContent'});
    createStockNewsFrame(tabContentEl);
    createDisClosureFrame(tabContentEl);
    createElement(contDivEl, 'div', ['space-h35']);
}

function createStockNewsFrame(parentEl) {
    const tabPaneEl = createElement(parentEl, 'div', ['tab-pane', 'fade', 'show', 'active'], {
        'id': 'navTab1',
        'role': 'tabpanel',
        'aria-labelledby': 'nav-tab1'
    });

    const stockNewsEl = createElement(tabPaneEl, 'div', ['scroll', 'oversea'], {
        'id': 'stockNews',
        'style': 'height: 439px;'
    });
    createSpinner(stockNewsEl);
    createElement(stockNewsEl, 'ul', ['list-ul'], {
        'id': 'stock-newslist',
        'data-page-number': '0'
    });
    createMoreButton(tabPaneEl, '#stockNews', () => {
        updateStockNews(QUERY_TYPE_MY_COMPANY, SELECTED_SITE_IDS, [], CURRENT_SITE_ITEMS);
    });
}

function createDisClosureFrame(parentEl) {
    const tabPaneEl = createElement(parentEl, 'div', ['tab-pane', 'fade'], {
        'id': 'navTab2',
        'role': 'tabpanel',
        'aria-labelledby': 'nav-tab2'
    });

    const disClosureEl = createElement(tabPaneEl, 'div', ['scroll'], {
        'id': 'disClosure',
        'style': 'height: 439px;'
    });
    createSpinner(disClosureEl);
    createElement(disClosureEl, 'ul', ['list-ul'], {
        'id': 'stock-disclosure-list',
        'data-page-number': '0'
    });

    createMoreButton(tabPaneEl, '#disClosure', () => {
        updateStockDisclosure(QUERY_TYPE_MY_COMPANY, SELECTED_SITE_IDS, [], CURRENT_SITE_ITEMS);
    });
}

function updateNewsListTag(analysisType, parentEl, partType, newsList, abstractionMap, fileResultMap) {
    newsList.forEach(item => {
        const news = item;

        let newsEl = createElement(parentEl, 'li');

        let title = cleanText(news.title);
        const titleEl = createElement(newsEl, 'a', ['ellipsis'], {
            'href': 'javascript:',
            'data-part-type': partType,
            'data-analysis-type': analysisType,
            'data-query-type': PART_TYPE_TO_QUERY_TYPE[partType] ? PART_TYPE_TO_QUERY_TYPE[partType] : '',
            'data-id': item.analysisId,
            'data-from': 'myanalysis',
            'data-toggle': 'modal',
            'data-target': '#newsModal'
        }, title);
        titleEl.addEventListener('click', function (event) {
            KEYWORD_LIST_FOR_MODAL = [];
        });

        const content = [PART_TYPE_NEWS_POWER_ADMIN, PART_TYPE_VOC].includes(partType) ?
            item.content: cleanText(JSON.parse(item.content).content);
        let [article, isAbstraction] = abstractionMap[item.analysisId] ?
            [abstractionMap[item.analysisId], true] : [content, false];
        let isFile = typeof fileResultMap !== 'undefined' && !!fileResultMap[item.analysisId]
        createElement(newsEl, 'p', ['summary'], {}, article);
        generateArticleInfoTag(newsEl, '', news.source, convertDateTime(news.publishedAt), isAbstraction,
            null, null, null, null, isFile, news.sourceLink);
    });
}

function updateNewsList(newsList) {
    const analysisIds = newsList.map(news => news.analysisId).join(',');
    return getApiService(`/api/analysis/abstraction?analysisIds=${analysisIds}`);
}
function updateNewsFileList(newsList) {
    const analysisIds = newsList.map(news => news.analysisId).join(',');
    return getApiService(`/api/analysis/files?analysisIds=${analysisIds}`);
}

function updateHomepageNewsContents(newsList, homepageNewsListId, isFirst, isLast, pageNumber) {
    const el = document.getElementById(homepageNewsListId);
    if (isFirst) {
        el.innerHTML = '';
    }
    const moreBtnEl = el.parentElement.parentElement.querySelector('.btn-list-more');
    if (isLast) {
        moreBtnEl.classList.add('disabled');
    } else {
        el.dataset.pageNumber = pageNumber + 1;
    }

    const analysisIds = newsList.map(news => news.analysisId).join(',');
    return getApiService(`/api/analysis/abstraction?analysisIds=${analysisIds}`);
}

function updateNewsKeywordData(keyword) {
    const now = moment();
    const endDate = now.format('YYYY.MM.DD');
    const startDate = now.subtract(1, "years").format("YYYY-MM-DD");
    const listCountEl = document.querySelector('.form-control-sm');
    listCountEl.addEventListener("change", function(event) {
        updateNewsKeywordData(NEWS_KEYWORD);
    });

    const itemCountPerPage = Number(listCountEl.value);
    const searchInfo = new SearchInfo();
    searchInfo.searchFunction = searchData;
    searchInfo.searchFunctionCallback = updateResultsContext;
    searchInfo.searchStartDate = startDate;
    searchInfo.searchEndDate = endDate;
    searchInfo.searchKeywords = keyword;
    searchInfo.searchSize = itemCountPerPage;
    searchInfo.pageNavItemCountPerPage = itemCountPerPage;

    searchData(QUERY_TYPE_NEWS, searchInfo).then(response => {
        let jsonData = JSON.parse(response);
        updateResultsContext(queryType, searchInfo, jsonData.result, {}, jsonData.totalCount);
    }).catch(error => {
        console.error(error);
    });
}

const queryInterestData = (queryType, searchInfo) => {
    const page = searchInfo.searchPage;
    const size = searchInfo.searchSize;
    const crawlingKeys = searchInfo.searchCrawlingKeys;

    return getApiService(`/api/info/analysis?crawlingIds=${crawlingKeys}&size=${size}&page=${page}`);
}

function updateInterestDataContext(queryType, searchInfo, results, totalCount) {
    results = results.map(result => ({
        ...result,
        dataId: String(result.analysisId)
    }));
    const dataIds = results.map(result => result.dataId).join(',');
    Promise.all([
        getApiService(`/api/analysis/abstraction?analysisIds=${dataIds}`),
        getApiService(`/api/recommend/count/analysis?dataIds=${dataIds}`),
        getApiService(`/api/recommend/analysis?dataIds=${dataIds}`),
        getApiService(`/api/user/clipped/analysis?dataIds=${dataIds}`),
        getApiService(`/api/user/lead/analysis?dataIds=${dataIds}`),
        getApiService(`/api/analysis/files?analysisIds=${dataIds}`)
    ]).then(responseList => {
        const resultExtraDataMapList = {
            [RESULT_EXTRA_DATA.ABSTRACTION]: responseList[0],
            [RESULT_EXTRA_DATA.ALL_RECOMMEND]: responseList[1],
            [RESULT_EXTRA_DATA.MY_RECOMMEND]: responseList[2],
            [RESULT_EXTRA_DATA.MY_CLIPPING_ANALYSIS]: responseList[3],
            [RESULT_EXTRA_DATA.MY_LEAD]: responseList[4],
            [RESULT_EXTRA_DATA.FILE]: responseList[5]
        };

        updateResultsContext(
            queryType,
            searchInfo,
            results,
            resultExtraDataMapList,
            totalCount
        );
    })
}

function updateInterestData(queryType, siteId) {
    const listCountEl = document.querySelector('.form-control-sm');
    listCountEl.addEventListener('change', () => {
        updateInterestData(queryType, siteId);
    });

    let searchInfo = new SearchInfo();
    searchInfo.searchFunction = queryInterestData;
    searchInfo.searchFunctionCallback = updateInterestDataContext;
    searchInfo.pageNavIsUpdate = true;
    searchInfo.pageNavItemCountPerPage = Number(listCountEl.value);

    getApiService(`/api/site/${siteId}/items`).then(response => {
        const crawlingKeyList = response.reduce((acc, cur) => {
            acc.push(cur.crawlingKey);
            return acc;
        }, []);

        if (crawlingKeyList.length) {
            searchInfo.searchCrawlingKeys = crawlingKeyList.join(',');
            queryInterestData(queryType, searchInfo).then(response => {
                updateInterestDataContext(queryType, searchInfo, response.content, response.totalElements);
            }).catch(error => {
                console.error(error);
            });
        }
    }).catch(error => {
        console.error(error);
    });
}

function updateNewsSpinner(elementId, isStart) {
    const el = document.getElementById(elementId);
    const spinnerEl = el.parentElement.querySelector('.spinner-wrap');

    if (isStart) {
        el.setAttribute('style', 'overflow-y: hidden;');
        spinnerEl.setAttribute('style', 'display: block;');
    } else {
        el.setAttribute('style', 'overflow-y: auto;');
        spinnerEl.setAttribute('style', 'display: none;');
    }
}

function setUpdateResult(listEl, moreBtnEl, text) {
    listEl.innerHTML = ''
    let newsEl = createElement(listEl, 'li');
    createElement(newsEl, 'p', ['ellipsis'], {}, text);

    moreBtnEl && moreBtnEl.classList.add('disabled');
}

function updateCompanyInfo(type, siteId, siteItemList) {
    return new Promise(function (resolve, reject) {
        if (!siteId) {
            reject(new Error('Failed to update company info'));
        }

        if (isEnableContentPart(type, PART_TYPE_COMPANY_INFO) === false) {
            resolve();
        }

        const companyNameEl = document.getElementById('company-name');
        const siteItem = siteItemList.find(siteItem => siteItem.itemType === "COMP_INFO");
        if (!siteItem) {
            companyNameEl.innerText = TEXT_NO_DATA_COLLECTED;
            console.error('failed to get company info');
            resolve();
        }

        getApiService(`/api/info/analysis?crawlingIds=${siteItem.crawlingKey}`).then(response => {
            if (response && response.content.length) {
                const companyInfo = JSON.parse(response.content[0].content);

                companyNameEl.innerText = companyInfo.corp_name ? companyInfo.corp_name : '';

                let el = document.getElementById('company-homepageurl');
                const homepageUrl = companyInfo.hm_url ?
                    companyInfo.hm_url.replace(/^(http:\/\/|https:\/\/)/, '') : '';
                el.innerText = homepageUrl;
                el.setAttribute('href', `http://${homepageUrl}`);

                el = document.getElementById('company-phonenumber');
                el.innerText = companyInfo.phn_no ? companyInfo.phn_no : '';

                el = document.getElementById('company-establishment-date');
                el.innerText = companyInfo.est_dt ? moment(companyInfo.est_dt).format('YYYY-MM-DD') : '';

                el = document.getElementById('company-address');
                el.innerText = companyInfo.adres ? companyInfo.adres : '';

                el = document.getElementById('company-ceo');
                el.innerText = companyInfo.ceo_nm ? companyInfo.ceo_nm : '';

                el = document.getElementById('company-sectors');
                el.innerText = companyInfo.induty ? companyInfo.induty : '';
                COMPANY_SECTORS = companyInfo.induty ? companyInfo.induty : '';
            } else {
                companyNameEl.innerText = TEXT_NO_DATA_COLLECTED;
                console.log('Failed to get company info');
            }

            let syncDateTimeEl = document.getElementById('sync-company-info-datetime');
            syncDateTimeEl.dataset.syncDatetime = moment().format();
            syncDateTimeEl.innerText = TEXT_JUST_BEFORE;
            resolve();
        }).catch(error => {
            companyNameEl.innerText = '정보 조회가 실패했습니다.';

            console.error(error);
            reject(new Error('Failed to update company info'));
        });
    });
}

function updateCompanyStock(queryType, siteId) {
    return new Promise(function (resolve, reject) {
        if (!siteId) {
            reject(new Error('Failed to update company stock'));
            return;
        }

        if (isEnableContentPart(queryType, PART_TYPE_COMPANY_STOCK) === false) {
            resolve();
            return;
        }

        if (STOCK_CHART !== undefined) {
            if (SITE_INFO_MAP[siteId] === undefined){
                reject(new Error('Failed to update company stock'));
                return;
            }

            let stockData = [];
            let stockDataList = [];
            let stockEventList = [];
            STOCK_CHART.series[0].setData(stockDataList);
            STOCK_CHART.series[1].setData(stockEventList);

            const stockCode = SITE_INFO_MAP[siteId].stockCode;
            if (stockCode === '') {
                STOCK_CHART.showLoading('주가 코드 설정 오류가 발생했습니다.');
                return;
            }
            getApiService(`/api/info/stock/${stockCode}`).then(response => {
                if (response === '[]') {
                    STOCK_CHART.showLoading('주가 정보 조회가 실패했습니다.');
                    resolve();
                    return;
                }

                let startDate = null;
                const stockList = JSON.parse(response);
                for(const stock of stockList) {
                    if (!startDate) {
                        startDate = moment(stock.datetime).format('YYYY-MM-DD');
                    }

                    stockData = [];
                    stockData.push(moment(stock.datetime).valueOf());
                    stockData.push(stock.close);
                    stockDataList.push(stockData);
                }

                const checkStockNews = ALL_NEWS_LIST.filter(news => {
                    const date = convertDateTime(news.publishedAt, false);
                    return date >= startDate;
                }).reduce((total, news) => {
                    const date = convertDateTime(news.publishedAt, false);
                    total[date] = (total[date] || 0) + 1;
                    return total;
                }, {});

                stockEventList = stockDataList.map(stockData => {
                    const checkDate = moment(stockData[0]).format('YYYY-MM-DD');
                    const newsCount = checkStockNews[checkDate] ? checkStockNews[checkDate] : 0;
                    return [stockData[0], newsCount];
                });

                STOCK_CHART.series[0].setData(stockDataList);
                STOCK_CHART.series[1].setData(stockEventList);

                STOCK_CHART.hideLoading();

                let syncDateTimeEl = document.getElementById('sync-company-stock-datetime');
                syncDateTimeEl.dataset.syncDatetime = moment().format();
                syncDateTimeEl.innerText = TEXT_JUST_BEFORE;
                resolve()
            }).catch(error => {
                STOCK_CHART.showLoading('주가 정보 조회가 실패했습니다.');
                reject(error);
            });
        }
    });
}

function updateAnalysisNews(queryType, partType, siteId, siteItemList, listId, itemType, page = 0) {
    return new Promise(function (resolve, reject) {
        if (!siteId) {
            reject(new Error('Failed to get site items'));
            return;
        }
        if (isEnableContentPart(queryType, partType) === false) {
            resolve();
            return;
        }

        updateNewsSpinner(listId, true);
        const crawlingKeyList = siteItemList.reduce((acc, cur) => {
            (cur.itemType === itemType) && acc.push(cur.crawlingKey);
            return acc;
        }, []);

        if (crawlingKeyList.length) {
            getApiService(`/api/info/analysis?crawlingIds=${crawlingKeyList.join(',')}&page=${page}&size=${NEWS_SIZE_PER_PAGE}`).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        } else {
            updateNewsSpinner(listId, false);
            resolve(null);
        }
    });
}

function updateResultNewsList(listId, result, partType) {
    let newsList = [];
    try {
        newsList = result.map(news => ({partType: partType, ...news}));
        ALL_NEWS_LIST = [...ALL_NEWS_LIST, ...newsList];
    } catch {
        updateNewsSpinner(listId, false);
        console.log(`Failed to get competitor news : ${partType}`);
    }

    return newsList;
}

function updateStockNews(queryType, siteId, keywordList, siteItemList) {
    return new Promise(function (resolve, reject) {
        const listId = 'stock-newslist';
        const listElement = document.getElementById(listId);
        const pageNumber = Number(listElement.dataset.pageNumber);
        const moreBtnEl = listElement.parentElement.parentElement.querySelector('.btn-list-more');
        moreBtnEl.classList.add('disabled');

        updateAnalysisNews(queryType, PART_TYPE_NEWS_STOCK_DISCLOSURE, siteId, siteItemList, listId,
            ITEM_TYPE_STOCK_NEWS, pageNumber).then(response => {
            if (response) {
                if (response.first) {
                    listElement.innerHTML = ''
                }

                if (response.last) {
                    moreBtnEl.classList.add('disabled');
                } else {
                    moreBtnEl.classList.remove('disabled');
                    listElement.dataset.pageNumber = (pageNumber + 1).toString();
                }

                const newsList = updateResultNewsList(listId, response.content, PART_TYPE_NEWS_STOCK);
                updateNewsList(newsList).then(abstractionMap => {
                    updateNewsFileList(newsList).then(fileResultMap => {
                        updateNewsListTag(queryType, listElement, PART_TYPE_NEWS_HOMEPAGE, newsList, abstractionMap, fileResultMap);
                    });

                    if (listId) {
                        let syncDateTimeEl = document.getElementById(listId);
                        syncDateTimeEl.dataset.syncDatetime = moment().format();
                    }
                }).catch(error => {
                    console.error(error);
                    setUpdateResult(listElement, moreBtnEl, '뉴스 조회가 실패했습니다.')
                });
            } else {
                setUpdateResult(listElement, moreBtnEl, '수집된 뉴스가 없습니다.')
            }

            updateNewsSpinner(listId, false);
            resolve();
        }).catch(error => {
            setUpdateResult(listElement, moreBtnEl, '뉴스 조회가 실패했습니다.')

            updateNewsSpinner(listId, false);
            reject(error);
        });
    });
}

function updateStockDisclosure(queryType, siteId, keywordList, siteItemList) {
    return new Promise(function (resolve, reject) {
        const listId = 'stock-disclosure-list';
        const listElement = document.getElementById(listId);
        const moreBtnEl = listElement.parentElement.parentElement.querySelector('.btn-list-more');
        const pageNumber = Number(listElement.dataset.pageNumber);

        updateAnalysisNews(queryType, PART_TYPE_NEWS_STOCK_DISCLOSURE, siteId,
            siteItemList, listId, ITEM_TYPE_DISC_INFO, pageNumber).then(response => {
            if (response) {
                if (response.first) {
                    listElement.innerHTML = ''
                }

                if (response.last) {
                    moreBtnEl.classList.add('disabled');
                } else {
                    listElement.dataset.pageNumber = (pageNumber + 1).toString();
                }

                const newsList = updateResultNewsList(listId, response.content, PART_TYPE_DISCLOSURE);
                updateNewsList(newsList).then(abstractionMap => {
                    updateNewsFileList(newsList).then(fileResultMap => {
                        updateNewsListTag(queryType, listElement, PART_TYPE_DISCLOSURE, newsList, abstractionMap, fileResultMap);
                    });
                }).catch(error => {
                    console.error(error);
                    setUpdateResult(listElement, moreBtnEl, '뉴스 조회가 실패했습니다.')
                });
            } else {
                setUpdateResult(listElement, moreBtnEl, TEXT_NO_DATA_COLLECTED);
            }

            updateNewsSpinner(listId, false);
            resolve();
        }).catch(error => {
            setUpdateResult(listElement, moreBtnEl, '정보 조회가 실패했습니다.');
            updateNewsSpinner(listId, false);
            reject(error);
        });
    });
}

function updateHomepageNews(queryType, siteId, keywordList, siteItemList) {
    return new Promise(function (resolve, reject) {
        const listId = 'homepage-news-list';
        const listElement = document.getElementById(listId);
        const pageNumber = Number(listElement.dataset.pageNumber);
        const moreBtnEl = listElement.parentElement.parentElement.querySelector('.btn-list-more');
        moreBtnEl.classList.add('disabled');

        updateAnalysisNews(queryType, PART_TYPE_NEWS_HOMEPAGE, siteId, siteItemList,
            listId, ITEM_TYPE_COMP_NEWS, pageNumber).then(response => {
            if (response) {
                const newsList = updateResultNewsList(listId, response.content, PART_TYPE_NEWS_HOMEPAGE);

                updateHomepageNewsContents(newsList, 'homepage-news-list',
                    response.first, response.last, response.number).then(abstractionMap => {
                        updateNewsFileList(newsList).then(fileResultMap => {
                            updateNewsListTag(queryType, listElement, PART_TYPE_NEWS_HOMEPAGE, newsList, abstractionMap, fileResultMap);
                        });

                        let syncDateTimeEl = document.getElementById('sync-homepage-news-second-datetime');
                        syncDateTimeEl.dataset.syncDatetime = moment().format();
                        syncDateTimeEl.innerText = TEXT_JUST_BEFORE;
                    }).catch(error => {
                        setUpdateResult(listElement, moreBtnEl, '뉴스 조회가 실패했습니다.');
                    });
            } else {
                setUpdateResult(listElement, moreBtnEl, '수집된 뉴스가 없습니다.');
            }

            updateNewsSpinner(listId, false);
            resolve();
        }).catch(error => {
            setUpdateResult(listElement, moreBtnEl, '뉴스 조회가 실패했습니다.');
            updateNewsSpinner(listId, false);
            reject(error);
        });
    });
}

function updatePowerAdministrationNews(queryType, siteId, keywordList) {
    return new Promise(function (resolve, reject) {
        if (!siteId) {
            reject(new Error('Failed to get power administration news'));
            return;
        }

        if (isEnableContentPart(queryType, PART_TYPE_NEWS_POWER_ADMIN) === false) {
            resolve();
            return;
        }

        const elementId = 'power-administration-news-list';
        let el = document.getElementById(elementId);

        el.innerHTML = '';
        updateNewsSpinner(elementId, true);

        getApiService('/api/konan/tag/power').then(response => {
            if (response) {
                const newsList = JSON.parse(response).result;
                updateNewsList(newsList).then(abstractionMap => {
                    updateNewsFileList(newsList).then(fileResultMap => {
                        updateNewsListTag(queryType, el, PART_TYPE_NEWS_POWER_ADMIN, newsList, abstractionMap, fileResultMap);
                    });

                    let syncDateTimeEl = document.getElementById('sync-power-admin-news-datetime');
                    syncDateTimeEl.dataset.syncDatetime = moment().format();
                    syncDateTimeEl.innerText = TEXT_JUST_BEFORE;
                }).catch(error => {
                    console.error(error);
                    setUpdateResult(el, null, '뉴스 조회가 실패했습니다.')
                });
            } else {
                setUpdateResult(el, null, '수집된 뉴스가 없습니다.')
            }

            updateNewsSpinner(elementId, false);
            resolve();
        }).catch(error => {
            setUpdateResult(el, null, '뉴스 조회가 실패했습니다.')
            updateNewsSpinner(elementId, false);
            reject(error);
        });
    });
}

function updateVocData(queryType, searchInfo, results, resultListExtraData, totalCount) {
    const elementId = 'voc-list';
    let el = document.getElementById(elementId);

    el.innerHTML = '';
    updateNewsSpinner(elementId, true);

    updateNewsListTag(queryType, el, PART_TYPE_VOC, results, [], []);

    let syncDateTimeEl = document.getElementById('sync-voc-datetime');
    syncDateTimeEl.dataset.syncDatetime = moment().format();
    syncDateTimeEl.innerText = TEXT_JUST_BEFORE;

    updateNewsSpinner(elementId, false);

    const vocListEl = document.getElementById('voc-list');
    const pageEl = vocListEl.parentElement.querySelector('nav .pagination');

    if (searchInfo.pageNavIsUpdate) {
        updatePageNavigation(queryType, pageEl, searchInfo, totalCount);
    }
}

function updateVocList(queryType, siteId, keywordList) {
    if (!siteId) {
        reject(new Error('Failed to get VOC'));
        return;
    }

    if (isEnableContentPart(queryType, PART_TYPE_VOC) === false) {
        resolve();
        return;
    }

    let searchInfo = new SearchInfo();
    searchInfo.searchFunction = searchData;
    searchInfo.searchFunctionCallback = updateVocData;
    searchInfo.searchStartDate = moment().subtract(2, 'months').format('YYYY-MM-DD');
    searchInfo.searchEndDate = moment().format('YYYY-MM-DD');
    searchInfo.searchSize = 5;
    searchInfo.pageNavItemCountPerPage = 10;
    searchInfo.pageNavIsClickFirstPage = false;
    searchInfo.pageNavAnchorId = 'voc-list-anchor';
    searchInfo.searchKeywords = keywordList.join(' ');
    searchInfo.searchFunction(PART_TYPE_VOC, searchInfo).then(response => {
        const jsonData = JSON.parse(response);
        const totalCount = jsonData.hits.total.value;
        const result = jsonData.hits.hits.map(item => ({
            analysisId: item._id,
            title: item._source.title ? item._source.title : removePrefixComma(item._source.voc_contents_for_all_category),
            publishedAt: item._source.meeting_date,
            content: removePrefixComma(item._source.voc_contents_for_all_category),
            source: item._source.info_source,
            originalData: item._source
        }));
        updateVocData(PART_TYPE_VOC, searchInfo, result, [], totalCount);
    }).catch(error => {
       console.error(error);
    });
}

function updateStockNewsPanel(parentEl, selectedDate) {
    parentEl.innerHTML = '';

    ALL_NEWS_LIST.forEach(news => {
        if (convertDateTime(news.publishedAt, false) === selectedDate) {
            updateNewsList([news]).then(abstractionMap => {
                updateNewsFileList([news]).then(fileResultMap => {
                    updateNewsListTag('', parentEl, news.partType, [news], abstractionMap, fileResultMap);
                });
            }).catch(error => {
                console.error(error);
            });
        }
    });
}

function selectSideMenu(event) {
    const activeEls = document.querySelectorAll('.sub-menu li.active');
    for (let activeEl of activeEls) {
        activeEl.classList.remove('active');
    }

    const liEl = event.target.parentElement;
    liEl.classList.add('active');
    localStorage.setItem('activeQueryType', liEl.dataset.queryType)
    localStorage.setItem('activeSideMenuItemId', liEl.dataset.subItemId);
}

function  updateContentLayout(isForeign) {
    const contentEl = document.getElementById('content');

    // 해외 사이트 조회와 동일하게 국내 사이트에 수주 정보 항목 삭제
    ['stockNews', 'disClosure'].forEach(id => {
        const el = document.getElementById(id);
        el.style.height = '826px';
    });
    // 스타일 값으로 인해 국내 사이트에도 동일하게 적용
    contentEl.classList.add('overseas');

    // 공시 정보 활성/비활성화
    const navTab1El = document.getElementById('nav-tab1');
    const navTab2El = document.getElementById('nav-tab2');
    const paneTab1El = document.getElementById('navTab1');
    const paneTab2El = document.getElementById('navTab2');

    navTab1El.classList.add('active')
    navTab1El.setAttribute('aria-selected', 'true');
    paneTab1El.classList.add('active');
    paneTab1El.classList.add('show');

    navTab2El.classList.remove('active')
    navTab2El.setAttribute('aria-selected', 'false');
    paneTab2El.classList.remove('active');
    paneTab2El.classList.remove('show');

    if (isForeign) {
        navTab2El.style.display = 'none';
    } else {
        navTab2El.style.display = 'block';
    }

    $(".overseas").find(".cont-group>.col-50.right>.cont-division").removeClass("brb-line-inside")
}

function collectRelatedsiteIds(arr, parentId) {
    return arr.reduce((acc, company) => {
        if (company.parentCompany) {
            if (company.parentCompany.id === parentId) {
                acc.push(company.id);
                acc.concat(collectRelatedsiteIds(companyList, company.id));
            }
        }
        return acc;
    }, SELECTED_SITE_IDS);
};

function isKeywordRelatedQueryType(queryType) {
    if ([QUERY_TYPE_NEWS, QUERY_TYPE_CLIENT].includes(queryType)) {
        return true;
    } else {
        return false;
    }
}

function parseAnalysisItemList(queryType, result) {
    let itemList = [];
    if (!isKeywordRelatedQueryType(queryType)) {
        const siteList = result;
        if (siteList.length === 0) {
            return [];
        }

        for (let site of siteList) {
            SITE_INFO_MAP[site.siteId] = site;
        }

        siteList.sort(function (first, second) {
            return ((first.parentId === 0) && (second.parentId !== 0)) ? -1 : 0;
        });
        itemList = siteList;
    } else {
        const keywordObject = JSON.parse(result);
        for (let keyword of keywordObject) {
            let item = {
                parentId: 0,
                keyword: keyword
            };
            itemList.push(item);
        }

        itemList.sort(function (first, second) {
            return (first.keyword < second.keyword) ?
                -1 : (first.keyword == second.keyword) ? 0 : 1;
        });
    }
    return itemList;
}

function getAnalysisItemId(queryType, item) {
    return !isKeywordRelatedQueryType(queryType) ? item.siteId : item.keyword;
}

function getAnalysisSubItemId(queryType, item) {
    return !isKeywordRelatedQueryType(queryType) ? item.companyId : item.keyword;
}

function setAnalysisItemLink(queryType, aEl, item) {
    if (!isKeywordRelatedQueryType(queryType)) {
        aEl.innerText = item.hostName;
        aEl.dataset.siteName = item.hostName;
        aEl.dataset.itemId = item.siteId;
        aEl.dataset.stockCode = item.stockCode;
        aEl.dataset.isForeign = item.isForeign;
    } else {
        aEl.innerText = item.keyword;
        aEl.dataset.itemId = item.keyword;
    }
}

function updateAllData(queryType, itemId, isForeign) {
    if (queryType === QUERY_TYPE_NEWS) {
       updateNewsAllData(queryType, itemId)
    } else if (queryType === QUERY_TYPE_CLIENT) {
        updateClientAllData(itemId);
    } else if (queryType === QUERY_TYPE_INTEREST) {
        updateInterestAllData(queryType, itemId);
    } else {
        updateSiteAllData(queryType, itemId, isForeign);
        document.getElementById('content');
    }
}

function updateSideTree(queryType, isExpand) {
    const activeQueryType = localStorage.getItem('activeQueryType');
    const activeSideMenuItemId = localStorage.getItem('activeSideMenuItemId');

    const url = (queryType !== QUERY_TYPE_NEWS && queryType !== QUERY_TYPE_CLIENT) ?
        QUERY_TYPE_TO_API_URL[queryType] : `${QUERY_TYPE_TO_API_URL[queryType]}/${queryType}`;

    getApiService(url).then(response => {
        let itemList = parseAnalysisItemList(queryType, response);

        const mainEl = document.getElementById(`${queryType.toLowerCase()}-side-menu`);
        mainEl.innerText = '';
        if (isExpand && itemList.length) {
            mainEl.classList.add('show');
        }

        if (itemList.length) {
            const collapseEl = mainEl.previousElementSibling;
            if (!isExpand) collapseEl.classList.add('collapsed');
            collapseEl.setAttribute('aria-expanded', 'false');

            const iconEl = mainEl.parentElement.querySelector('.ico');
            iconEl.removeAttribute('style');
        }

        let totalCount = 0;
        const parentEl = document.getElementById(`${queryType.toLowerCase()}-side-menu`);
        for(let item of itemList) {
            const liEl = createElement(parentEl, 'li');
            liEl.dataset.queryType = queryType;
            liEl.dataset.itemId = getAnalysisItemId(queryType, item);
            liEl.dataset.subItemId = getAnalysisSubItemId(queryType, item);
            if (item.isForeign) {
                liEl.dataset.isForeign = item.isForeign;
            }
            if ((liEl.dataset.queryType === activeQueryType) &&
                (liEl.dataset.subItemId === activeSideMenuItemId)) {
                liEl.classList.add('active');
                SELECTED_SITE_IDS = [liEl.dataset.itemId];
                const isForeign = liEl.dataset.isForeign ? JSON.parse(liEl.dataset.isForeign) : false;
                updateContent(queryType, liEl.dataset.itemId, isForeign);
            }

            const aEl = createElement(liEl, 'a', [], {'href': '#'});
            setAnalysisItemLink(queryType, aEl, item);
            aEl.addEventListener("click", function (event) {
                selectSideMenu(event);
                const isForeign = event.target.dataset.isForeign ?
                    JSON.parse(event.target.dataset.isForeign) : false;
                updateContent(queryType, event.target.dataset.itemId, isForeign);
            }, false);

            totalCount += item.newCount;
            createElementWithText(
                aEl,
                'span',
                ['total-count'],
                {},
                item.newCount !== 0 ? item.newCount.toString() : ''
            );
        }
        const totalCountEl = parentEl.parentElement.querySelector('div span.total-count');
        totalCountEl.innerText = totalCount !== 0 ? totalCount.toString() : '';
    }).catch(err => {
        console.error(err);
    });
}

function updateContent(queryType, itemId, isForeign) {
    updateAllData(queryType, itemId);

    if ([
        QUERY_TYPE_NEWS,
        QUERY_TYPE_CLIENT,
        QUERY_TYPE_INTEREST
    ].includes(queryType) === false) {
        updateContentLayout(isForeign);
    }
}

function createStockChart() {
    STOCK_CHART = Highcharts.chart('stock-chart', {
        title: {
            text: ''
        },
        xAxis: {
            type: "datetime",
            labels: { format: '{value:%Y-%m-%d}' }
        },
        yAxis: [{
            title: {
                enabled: false
            }
        }, {
            opposite: true,
            title: {
                enabled: false
            }
        }],
        tooltip: {
            shared: true
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                trackByArea: true,
                events: {
                    click: function(event) {
                        const panelNewsWarpEl = document.getElementById('stock_001');
                        const newStockNewsPanelDate = moment(event.point.x).format('YYYY-MM-DD');

                        let showPanel = true;
                        if ((STOCK_CHART.series[1].data[event.point.index].y === 0) ||
                            (STOCK_NEWS_PANEL_DATE === newStockNewsPanelDate)) {
                            showPanel = false;
                        }

                        if (showPanel) {
                            STOCK_NEWS_PANEL_DATE = newStockNewsPanelDate;
                            updateStockNewsPanel(document.querySelector('#relatedNewsStock .list-ul'),
                                STOCK_NEWS_PANEL_DATE);
                            panelNewsWarpEl.classList.add('active');
                        } else {
                            if (panelNewsWarpEl.classList.contains('active')) {
                                panelNewsWarpEl.classList.remove('active');
                                STOCK_NEWS_PANEL_DATE = '';
                            }
                        }
                    }
                }
            }
        },
        series: [{
            name: 'Stock Close',
            data: [],
            type: 'area',
            yAxis: 0,
            id: 'stock-series',
            tooltip: { valueDecimals: 2 },
            color:'rgba(95,65,203,1)',
            lineWidth: 1,
            fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [ [0, 'rgba(95,65,203,0.35)'], [1, 'rgba(95,65,203,0.05)'] ]
            },
        }, {
            name: 'News Count',
            data: [],
            type: 'area',
            yAxis: 1,
            color: 'rgba(21, 126, 251, 1)',
            lineWidth: 1,
            fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [ [0, 'rgba(21, 126, 251, 0.35)'], [1, 'rgba(21, 126, 251, 0.05)'] ]
            },
        }],
    });
}