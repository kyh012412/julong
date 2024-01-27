let MY_CONFIG_MAP_LIST;

const defaultMyConfigListStatus = () => ({
    isGotConfigList: false,
    searchKeyword: '',
    savedConfigList: [],
    updatedConfigList: []
});

const CURRENT_KEYWORDS_LIST = {
    common: defaultMyConfigListStatus(),
    competitor: defaultMyConfigListStatus(),
    customer: defaultMyConfigListStatus(),
    client: defaultMyConfigListStatus(),
    news: defaultMyConfigListStatus(),
    bidding: defaultMyConfigListStatus(),

    reset: function () {
        Object.keys(this).forEach(key => {
            typeof this[key] === 'object' && (this[key] = defaultMyConfigListStatus());
        });
    }
}

const CURRENT_SITES_LIST = {
    mycompany: defaultMyConfigListStatus(),
    competitor: defaultMyConfigListStatus(),
    customer: defaultMyConfigListStatus(),
    interest: defaultMyConfigListStatus(),

    reset: function () {
        Object.keys(this).forEach(key => {
            typeof this[key] === 'object' && (this[key] = defaultMyConfigListStatus());
        });
    }
}

function updateMyKeywords(categoryId) {
    const keywordType = CATEGORY_TO_KEYWORD_TYPE[categoryId];
    if (keywordType) {
        if (CURRENT_KEYWORDS_LIST[keywordType].isGotConfigList === false) {
            const queryUrl = `/api/keyword/${keywordType}`;
            getApiService(queryUrl).then(response => {
                const keywords = JSON.parse(response);
                CURRENT_KEYWORDS_LIST[keywordType].isGotConfigList = true;
                CURRENT_KEYWORDS_LIST[keywordType].savedConfigList = keywords;
                insertMyKeywords(keywords);
            });
        } else {
            insertMyKeywords(CURRENT_KEYWORDS_LIST[keywordType].updatedConfigList);
        }
    } else {
        console.log(`Invalid category Id : ${categoryId}`);
    }
}

function updateMySites(categoryId) {
    const siteType = CATEGORY_TO_SITE_TYPE[categoryId];
    if (siteType) {
        if (CURRENT_SITES_LIST[siteType].isGotConfigList === false) {
            const queryUrl = `/api/site/user/${siteType}`;
            getApiService(queryUrl).then(response => {
                const sites = response.map(site => {
                    let rObject = {...site};
                    rObject.itemId = site.companyId;
                    rObject.itemName = site.hostName;
                    return rObject;
                });
                CURRENT_SITES_LIST[siteType].isGotConfigList = true;
                CURRENT_SITES_LIST[siteType].savedConfigList = sites;
                insertMyItems(sites);
            });
        } else {
            insertMyItems(CURRENT_SITES_LIST[siteType].updatedConfigList);
        }
    } else {
        console.log(`Invalid category Id : ${categoryId}`);
    }
}