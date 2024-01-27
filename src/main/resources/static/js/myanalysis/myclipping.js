const queryClippingInfo = (queryType, searchInfo) => {
    return new Promise(function (resolve, reject) {
        const page = searchInfo.searchPage;
        const size = searchInfo.pageNavItemCountPerPage;
        const dataType = searchInfo.extraData1;
        const item = searchInfo.extraData2;

        getApiService(`/api/user/clipped/${dataType}/list?tag=${item}&size=${size}&page=${page}`).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    })
}

function updateResultsClippingContext(queryType, searchInfo) {
    const dataType = searchInfo.extraData1;
    queryClippingInfo(queryType, searchInfo).then(response => {
        const results = response.content;
        const totalCount = response.totalElements;
        const dataIds = results.map(result => result.dataId).join(',');

        const promises = [getApiService(`/api/user/lead/${dataType}?dataIds=${dataIds}`)];
        dataType !== 'voc' && promises.push(getApiService(`/api/analysis/files?analysisIds=${dataIds}`));
        dataType !== 'voc' && promises.push(getApiService(`/api/analysis/abstraction?analysisIds=${dataIds}`));
        Promise.all(promises).then(responseList => {
            const resultExtraDataMapList = {
                [RESULT_EXTRA_DATA.MY_LEAD]: responseList[0],
                [RESULT_EXTRA_DATA.FILE]: dataType !== 'voc' ? responseList[1] : [],
                [RESULT_EXTRA_DATA.ABSTRACTION]: dataType !== 'voc' ? responseList[2] : [],
                [RESULT_EXTRA_DATA.REMOVE_FLAG]: searchInfo.extraData2
            };

            updateResultsContext(
                queryType,
                searchInfo,
                results,
                resultExtraDataMapList,
                totalCount,
                dataType !== 'voc' ? 'nav-clipping-collecting-tab' : 'nav-clipping-voc-tab',
            )
        }).catch(error => {
            console.error(error);
        });
    }).catch(error => {
        console.error(error);
    });
}

function updateContent(item) {
    const listTopH2El = document.querySelector('.cont-group .list-top h2');
    listTopH2El.innerText = item ? item : TEXT_MY_CLIPPING_UNCLASSIFIED_TAG;

    const listCountEl = document.querySelector('.form-control-sm');
    const itemCountPerPage = Number(listCountEl.value);

    ['analysis', 'voc'].forEach(dataType => {
        const searchInfo = new SearchInfo();
        searchInfo.searchFunction = queryClippingInfo;
        searchInfo.searchFunctionCallback = updateResultsClippingContext;
        searchInfo.pageNavIsUpdate = true;
        searchInfo.pageNavIsClickFirstPage = false;
        searchInfo.pageNavItemCountPerPage = itemCountPerPage;
        searchInfo.extraData1 = dataType;
        searchInfo.extraData2 = item;
        KEYWORD_LIST_FOR_MODAL = searchInfo.searchKeywordList;
        updateResultsClippingContext(QUERY_TYPE_MY_CLIPPING, searchInfo);
    });
}