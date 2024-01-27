const CAROUSEL_TO_INDICATOR = {
    [QUERY_TYPE_NEWS]: 'carouselNewsIndicator',
    [QUERY_TYPE_CUSTOMER]: 'carouselCustomerIndicator',
    [QUERY_TYPE_COMPETITOR]: 'carouselCompetitorIndicator',
    [QUERY_TYPE_BIDDING]: 'carouselBiddingIndicator',
    [QUERY_TYPE_VOC]: 'carouselVocIndicator'
}

function searchAndUpdateContext(queryType, searchInfo) {
    const indicatorId = CAROUSEL_TO_INDICATOR[queryType];
    if (!indicatorId) {
        console.error(`invalid context type : ${queryType}`);
        return;
    }
    const indicatorEl = document.getElementById(indicatorId);
    const spinnerEl = indicatorEl.parentElement.querySelector('.spinner');
    spinnerEl.setAttribute('style', 'display: table;');

    searchInfo.searchFunction = searchData;
    searchInfo.searchFunction(queryType, searchInfo).then(response => {
        let result = [];
        let totalCount = 0;
        if (queryType === QUERY_TYPE_VOC) {
            const jsonData = JSON.parse(response);
            totalCount = jsonData.hits.total.value;

            result = jsonData.hits.hits.map(item => ({
                analysisId: item._id,
                title: item._source.title ? item._source.title : removePrefixComma(item._source.voc_contents_for_all_category),
                publishedAt: item._source.meeting_date,

                //VOC 원본링크 추가
                sourceLink: 'https://www.naver.com/VocSet(\''+item._id+'\')',

                content: removePrefixComma(item._source.voc_contents_for_all_category),
                source: item._source.info_source,
                originalData: item._source
            }));
        } else {
            totalCount = response.totalCount;
            result = response.result;
        }
        updateCarousel(queryType, searchInfo, result, totalCount);
    }).catch(error => {
        console.error(error);
        spinnerEl.setAttribute('style', 'display: none;');
    });
}

function updateCarouselMainContext(queryType, parentEl, showHeadline, dataIndex,
                                   searchKeywordList, resultList, abstractionResultMap, fileResultMap) {
    const liEl = createElement(parentEl, 'li', showHeadline ? ['headline'] : []);

    const analysisId = resultList[dataIndex].analysisId.trim();
    let title = cleanText(resultList[dataIndex].title);

    createElement(liEl, 'a', ['ellipsis'], {
        'href': '#',
        'data-toggle': 'modal',
        'data-target': '#newsModal',
        'data-part-type': QUERY_TYPE_TO_PART_TYPE[queryType] ? QUERY_TYPE_TO_PART_TYPE[queryType] : '',
        'data-query-type': queryType,
        'data-id': analysisId,
        'data-from': 'index'
        }, title
    );

    let [content, isAbstraction] = !abstractionResultMap[analysisId] ?
        [cleanText(resultList[dataIndex].content, false, false,true), false] :
        (
            abstractedResult => {
                for (let searchValue of searchKeywordList) {
                    abstractedResult = abstractedResult.replace(
                        new RegExp(`(${searchValue})`, 'ig'), '<mark>$1</mark>');
                }
                return [abstractedResult, true];
            }
        )(abstractionResultMap[analysisId]);

    createElement(liEl, 'p', ['summary'], {}, content);
    let isFile = typeof fileResultMap !== 'undefined' && !!fileResultMap[analysisId] ;
    generateArticleInfoTag(liEl, null, typeof resultList[dataIndex].source === 'string' ? resultList[dataIndex].source.trim() : "",
        convertDateTime(resultList[dataIndex].publishedAt), isAbstraction, null, null, null,
        null, isFile, resultList[dataIndex].sourceLink);
}

function updateCarousel(queryType, searchInfo, resultList, totalCount) {
    // 제목이 비어 있는 결과 삭제
    resultList = resultList.filter(result => result.title !== '');
    totalCount = resultList.length;

    if (queryType === QUERY_TYPE_VOC) {
        updateCarouselContext(queryType, searchInfo, resultList, totalCount, {});
    } else {
        const analysisIds = resultList.map(result => result.analysisId.trim()).join(',');
        getApiService(`/api/analysis/abstraction?analysisIds=${analysisIds}`).then(abstractionResultMap => {
            getApiService(`/api/analysis/files?analysisIds=${analysisIds}`).then(fileResultMap => {
                updateCarouselContext(queryType, searchInfo, resultList, totalCount, abstractionResultMap, fileResultMap);
            })
        }).catch(error => {
            console.error(error);
        });
    }
}

function updateCarouselContext(queryType, searchInfo, resultList, totalCount, abstractionResultMap, fileResultMap) {
    const indicatorId = CAROUSEL_TO_INDICATOR[queryType];
    if (!indicatorId) {
        console.error(`invalid context type : ${queryType}`);
        return;
    }

    const indicatorEl = document.getElementById(indicatorId);
    const noResultEl = indicatorEl.parentElement.querySelector('.no-result');
    const spinnerEl = indicatorEl.parentElement.querySelector('.spinner');

    spinnerEl.setAttribute('style', 'display: none;');
    if (totalCount === 0) {
        noResultEl.setAttribute('style', 'display: table;');
        indicatorEl.setAttribute('style', 'display: none;');
    } else {
        noResultEl.setAttribute('style', 'display: none;');
        indicatorEl.removeAttribute('style');
    }

    const parentEl = document.getElementById(indicatorId);
    parentEl.innerText = '';
    $(`#${indicatorId}`).carousel('dispose');

    const innerEl = createElement(parentEl, 'div', ['carousel-inner']);
    const indicatorsEl = createElement(parentEl, 'ol', ['carousel-indicators']);
    for (let i = 0; i < resultList.length; i += searchInfo.pageNavItemCountPerPage) {
        let indicatorEl = createElement(indicatorsEl, 'li', [], {
                'data-target': `#${indicatorId}`,
                'data-slide-to': (i / searchInfo.pageNavItemCountPerPage).toString(10)
            }
        );

        let classList = ['carousel-item'];
        if (i === 0) {
            classList.push('active');
            indicatorEl.classList.add('active');
        }
        const itemEl = createElement(innerEl, 'div', classList);
        const listUlEl = createElement(itemEl, 'ul',
            ['list-ul', 'li-50', queryType === QUERY_TYPE_NEWS ? 'h-350' : 'h-342']);

        for (let j = 0; j < searchInfo.pageNavItemCountPerPage; j++) {
            const dataIndex = i + j;
            if (dataIndex >= resultList.length) {
                break;
            }

            let showHeadline = false;
            if ((indicatorId === 'carouselNewsIndicator') && (j < 2)) {
                showHeadline = true;
            }

            updateCarouselMainContext(queryType, listUlEl, showHeadline, dataIndex,
                searchInfo.searchKeywordList, resultList, abstractionResultMap, fileResultMap);
        }
    }

    carouselControlButton(parentEl, indicatorId);
}

function carouselControlButton(parentElement, indicatorId) {
    const carouselPrev = createElement(parentElement, 'a', ['carousel-control-prev', 'control-area'], {
        'href': `#${indicatorId}`,
        'data-slide': 'prev',
        'role': 'button'
    });
    createElement(carouselPrev, 'span', ['carousel-control-prev-icon', 'control-button'], {'aria-hidden':'true'});
    createElement(carouselPrev, 'span', ['sr-only'], {}, 'Previous');
    const carouselNext = createElement(parentElement, 'a', ['carousel-control-next', 'control-area'], {
        'href': `#${indicatorId}`,
        'data-slide': 'next',
        'role': 'button'
    });
    createElement(carouselNext, 'span', ['carousel-control-next-icon', 'control-button'], {'aria-hidden':'true'});
    createElement(carouselNext, 'span', ['sr-only'], {}, 'Next');
}

function clickMoreLink(linkUrl, queryType) {
    const url = encodeURI(`${linkUrl}?queryType=${queryType}&searchKeyword=` +
        `${SEARCH_INFO_FOR_INDEX.searchKeywords}&searchStartDate=${SEARCH_INFO_FOR_INDEX.searchStartDate}` +
        `&searchEndDate=${SEARCH_INFO_FOR_INDEX.searchEndDate}` +
        `&searchAllData=false`);
    window.location.href = url;
}
