const queryLeadInfo = (queryType, searchInfo) => {
    return new Promise(function (resolve, reject) {
        const page = searchInfo.searchPage;
        const size = searchInfo.pageNavItemCountPerPage;
        const dataType = searchInfo.extraData1;

        getApiService(`/api/user/lead/${dataType}/list?size=${size}&page=${page}`).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    })
}

function updateResultsLeadContext(queryType, searchInfo, results, totalCount) {
    const dataType = searchInfo.extraData1;
    queryLeadInfo(queryType, searchInfo).then(response => {
        const results = response.content;
        const totalCount = response.totalElements;
        const dataIds = results.map(result => result.dataId).join(',');

        const promises = [getApiService(`/api/user/lead/${dataType}?dataIds=${dataIds}`)];
        dataType !== 'voc' && promises.push(getApiService(`/api/analysis/files?analysisIds=${dataIds}`));
        dataType !== 'voc' && promises.push(getApiService(`/api/analysis/abstraction?analysisIds=${dataIds}`));
        Promise.all(promises).then(responseList => {
            const resultExtraDataMapList = {
                [RESULT_EXTRA_DATA.MY_LEAD_STATUS]: responseList[0],
                [RESULT_EXTRA_DATA.FILE]: dataType !== 'voc' ? responseList[1] : [],
                [RESULT_EXTRA_DATA.ABSTRACTION]: dataType !== 'voc' ? responseList[2] : []
            };

            updateResultsContext(
                queryType,
                searchInfo,
                results,
                resultExtraDataMapList,
                totalCount,
                dataType !== 'voc' ? 'nav-lead-collecting-tab' : 'nav-lead-voc-tab'
            )
        }).catch(error => {
            console.error(error);
        });
    });
}

function loadMyLeadList() {
    const listCountEl = document.querySelector('.form-control-sm');
    const itemCountPerPage = Number(listCountEl.value);

    ['analysis', 'voc'].forEach(dataType => {
        const searchInfo = new SearchInfo();
        searchInfo.searchFunction = queryLeadInfo;
        searchInfo.searchFunctionCallback = updateResultsLeadContext;
        searchInfo.pageNavIsUpdate = true;
        searchInfo.pageNavIsClickFirstPage = false;
        searchInfo.pageNavItemCountPerPage = itemCountPerPage;
        searchInfo.extraData1 = dataType;
        KEYWORD_LIST_FOR_MODAL = searchInfo.searchKeywordList;
        updateResultsLeadContext(QUERY_TYPE_MY_LEAD, searchInfo, [], 0);
    });
}