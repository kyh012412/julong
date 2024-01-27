function parseAnalysisItemList(result, key) {
    let itemList = [];
    for (let data of result) {
        let item = {
            parentId: 0,
            [key]: data
        };
        itemList.push(item);
    }

    itemList.sort(function (first, second) {
        return (first.data < second.data) ?
            -1 : (first.data == second.data) ? 0 : 1;
    });
    return itemList;
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

function updateSideTreeItem(queryType, itemList, key, sideMenuId, isExpand) {
    const activeQueryType = localStorage.getItem('activeQueryType');
    const activeSideMenuItemId = localStorage.getItem('activeSideMenuItemId');

    const mainEl = document.getElementById(sideMenuId);
    if (!mainEl) {
        updateContent(TEXT_MY_CLIPPING);
        return;
    }

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

    const parentEl = document.getElementById(sideMenuId);
    for(let item of itemList) {
        const liEl = createElement(parentEl, 'li');
        liEl.dataset.queryType = queryType;
        liEl.dataset.itemId = item[key] ? item[key] : '';
        liEl.dataset.subItemId = item[key] ? item[key] : '';

        if ((liEl.dataset.queryType === activeQueryType) &&
            (liEl.dataset.subItemId === activeSideMenuItemId)) {
            liEl.classList.add('active');
            updateContent(liEl.dataset.itemId);
        }

        const aEl = createElement(liEl, 'a', [], {'href': 'javascript:void(0)'});
        let itemName = item[key];
        if (queryType === QUERY_TYPE_MY_CLIPPING) {
            itemName = itemName? itemName: TEXT_MY_CLIPPING_UNCLASSIFIED_TAG;
        }
        aEl.innerText = itemName;
        aEl.dataset.itemId = item[key] ? item[key] : '';
        aEl.addEventListener("click", function (event) {
            selectSideMenu(event);
            updateContent(event.target.dataset.itemId);
        }, false);

        createElementWithText(
            aEl,
            'span',
            ['total-count'],
            {},
            queryType === QUERY_TYPE_MY_CLIPPING ? item['count'] : '');
    }
}
function updateSideTree(queryType, apiUrl, key, sideMenuId, isExpand) {
    if (queryType !== QUERY_TYPE_MY_CLIPPING) {
        getApiService(apiUrl).then(response => {
            const itemList = parseAnalysisItemList(JSON.parse(response), key);
            updateSideTreeItem(queryType, itemList, key, sideMenuId, isExpand);
        }).catch(err => {
            console.error(err);
        });
    } else {
        getApiService(`/api/user/clipped/tags`).then(response => {
            const itemList = response.map(item => ({
                ...item,
                parentId: 0
            }))
            updateSideTreeItem(queryType, itemList, key, sideMenuId, isExpand);
        }).catch(err => {
            console.error(err);
        });
    }
}

function loadSideMenu(queryType, apiUrl, key, sideMenuId) {
    updateSideTree(queryType, apiUrl, key, sideMenuId, true);

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