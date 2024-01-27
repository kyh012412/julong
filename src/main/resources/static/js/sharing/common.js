const querySharingInfo = (searchInfo) => {
    return new Promise(function (resolve, reject) {
        const page = searchInfo.searchPage;
        const size = searchInfo.pageNavItemCountPerPage;
        const dataType = searchInfo.extraData1;
        const url = `${searchInfo.extraData2}/${dataType}?size=${size}&page=${page}`;

        getApiService(url).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    })
}

function updateResultsSharingContext(queryType, searchInfo, results, totalCount) {
    const apiQueryType = searchInfo.extraData1;

    querySharingInfo(searchInfo).then(response => {
        const resultList = response.content;
        const totalCount = response.totalElements;
        const dataIds = resultList.map(result => result.dataId).join(',');

        const promiseList = [
            getApiService(`/api/recommend/count/${apiQueryType}?dataIds=${dataIds}`),
            getApiService(`/api/recommend/${apiQueryType}?dataIds=${dataIds}`),
            getApiService(`/api/user/clipped/${apiQueryType}?dataIds=${dataIds}`),
            getApiService(`/api/share/count/${apiQueryType}?dataIds=${dataIds}`),
            getApiService(`/api/user/lead/${apiQueryType}?dataIds=${dataIds}`)
        ];
        if (queryType === QUERY_TYPE_OTHER_SHARING) {
            promiseList.push(getApiService(`/api/share/to/member/${apiQueryType}?dataIds=${dataIds}`))
        }
        if (apiQueryType !== 'voc') {
            promiseList.push(getApiService(`/api/analysis/files?analysisIds=${dataIds}`))
            promiseList.push(getApiService(`/api/analysis/abstraction?analysisIds=${dataIds}`))
        }

        Promise.all(promiseList).then(responseList => {
            const resultExtraDataMapList = {
                [RESULT_EXTRA_DATA.ALL_RECOMMEND]: responseList[0],
                [RESULT_EXTRA_DATA.MY_RECOMMEND]: responseList[1],
                [RESULT_EXTRA_DATA.MY_CLIPPING_ANALYSIS]: responseList[2],
                [RESULT_EXTRA_DATA.MY_SHARING]: responseList[3],
                [RESULT_EXTRA_DATA.MY_LEAD]: responseList[4],
                [RESULT_EXTRA_DATA.OTHER_SHARING]: queryType !== QUERY_TYPE_OTHER_SHARING
                    ? [] : responseList[5],
                [RESULT_EXTRA_DATA.FILE]: apiQueryType === 'voc'
                    ? [] : responseList[responseList.length-2],
                [RESULT_EXTRA_DATA.ABSTRACTION]: apiQueryType === 'voc'
                    ? [] : responseList[responseList.length-1],
            };

            updateResultsContext(
                queryType,
                searchInfo,
                resultList,
                resultExtraDataMapList,
                totalCount,
                apiQueryType !== 'voc' ? 'nav-sharing-collecting-tab' : 'nav-sharing-voc-tab'
            );
        }).catch(error => {
            console.error(error);
        });
    });
}