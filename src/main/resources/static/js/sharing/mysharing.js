function loadMySharingList() {
    const listCountEl = document.querySelector('.form-control-sm');
    const itemCountPerPage = Number(listCountEl.value);

    ['analysis', 'voc'].forEach(dataType => {
        const searchInfo = new SearchInfo();
        searchInfo.searchFunction = querySharingInfo;
        searchInfo.searchFunctionCallback = updateResultsSharingContext;
        searchInfo.searchPage = 0;
        searchInfo.pageNavIsUpdate = true;
        searchInfo.pageNavIsClickFirstPage = false;
        searchInfo.pageNavItemCountPerPage = itemCountPerPage;
        searchInfo.extraData1 = dataType;
        searchInfo.extraData2 = `/api/share/fromUser`;
        updateResultsSharingContext(QUERY_TYPE_MY_SHARING, searchInfo, [], 0);
    });
}