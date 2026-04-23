const MockGuessLikeData = {
    areaId: "65",
    areaName: "猜你喜欢",
    isShow: "0",
    moduleList: [
        {
            floorId: "157",
            moduleId: "M0001-3",
            showRule: "1",
            adverList: [
                {
                    actionType: "1",
                    actionUrl:
                        "https://dev.coc.10086.cn/coc2/web-kataobao2/ktb-web-flowdb4welfare/index.html?pageId=1783414625802850304&channelId=P00000035986",
                    advBusiType: "666",
                    isLabel: null,
                    isShare: "0",
                    location: "1",
                    markId: "257654",
                    markName: "1分钱会员",
                    imageUrl:
                        "https://res.app.coc.10086.cn/group2/M00/06/B9/CtFOW2eS99aAYiqeAAAMwm978TY278.png",
                    searchTerms: null,
                    moods: null,
                    lableStyle: null,
                    cornerTitle: null,
                    cornerShow: null,
                    iconCode: null,
                    pCode: "P00000025118",
                },
                {
                    actionType: "1",
                    actionUrl:
                        "https://dev.coc.10086.cn/coc2/web-promotion/quick-receive-v3/index.html?pageId=1483705578201546752&channelId=P00000035984",
                    advBusiType: "666",
                    isLabel: null,
                    isShare: "0",
                    location: "2",
                    markId: "257658",
                    markName: "宽带预约",
                    imageUrl:
                        "https://res.app.coc.10086.cn/group2/M00/06/B9/CtFOW2eS-7iAMKPIAAAKHuunaG4722.png",
                    searchTerms: null,
                    moods: null,
                    lableStyle: null,
                    cornerTitle: null,
                    cornerShow: null,
                    iconCode: null,
                    pCode: "P00000025119",
                },
                {
                    actionType: "1",
                    actionUrl:
                        "https://h.app.coc.10086.cn/cmcc-app/uni-zone/packageArea/packageArea.html?pageId=1538797930025873408&channelId=P00000035987",
                    advBusiType: "666",
                    isLabel: null,
                    isShare: "0",
                    location: "3",
                    markId: "257698",
                    markName: "套餐办理",
                    imageUrl:
                        "https://res.app.coc.10086.cn/group2/M00/06/B9/CtFOJ2eTBTSAFwW3AAAKnq1xQSM664.png",
                    searchTerms: null,
                    moods: null,
                    lableStyle: null,
                    cornerTitle: null,
                    cornerShow: null,
                    iconCode: null,
                    pCode: "P00000025120",
                },
                {
                    actionType: "1",
                    actionUrl:
                        "https://dev.coc.10086.cn/coc2/web-kataobao2/ktb-web-parenting/index.html?pageId=1874661124400578560&channelId=P00000025121",
                    advBusiType: "666",
                    isLabel: null,
                    isShare: "0",
                    location: "4",
                    markId: "257906",
                    markName: "副卡送会员",
                    imageUrl:
                        "https://res.app.coc.10086.cn/group2/M00/06/BB/CtFOJ2eTOJ6Ad0nrAAASMAmc1Dk232.png",
                    searchTerms: null,
                    moods: null,
                    lableStyle: null,
                    cornerTitle: null,
                    cornerShow: null,
                    iconCode: null,
                    pCode: "P00000025121",
                },
            ],
        },
        {
            floorId: "223",
            moduleId: "M0001-1",
            showRule: null,
            adverList: [
                {
                    actionType: "1",
                    actionUrl:
                        "https://dev.coc.10086.cn/coc2/web-kataobao2/ktb-web-parenting/index.html?pageId=1874661124400578560&channelId=P00000027493",
                    advBusiType: "666",
                    isLabel: "0",
                    isShare: "0",
                    location: "1",
                    markId: "257988",
                    markName: "家庭副卡可定位送会员",
                    imageUrl:
                        "https://res.app.coc.10086.cn/group1/M00/06/C5/CtFOBmei2bKAJ7xXAAInz_QnfCY415.png",
                    searchTerms: null,
                    moods: null,
                    lableStyle: null,
                    cornerTitle: null,
                    cornerShow: null,
                    iconCode: null,
                    pCode: "P00000027493",
                },
            ],
        },
    ],
};

// 首页重构-猜你喜欢1--移动优选
const GuessLike1NewData = [
    {
        actionType: "1",
        actionUrl:
            "https://dev.coc.10086.cn/coc2/web-kataobao2/ktb-web-flowdb4welfare/index.html?pageId=1783414625802850304&channelId=P00000035986",
        advBusiType: "666",
        isLabel: null,
        isShare: "0",
        location: "1",
        markId: "257654",
        markName: "1分钱会员",
        imageUrl:
            "https://res.app.coc.10086.cn/group2/M00/06/B9/CtFOW2eS99aAYiqeAAAMwm978TY278.png",
        searchTerms: null,
        moods: null,
        lableStyle: null,
        cornerTitle: null,
        cornerShow: null,
        iconCode: null,
        pCode: "P00000025118",
    },
    {
        actionType: "1",
        actionUrl:
            "https://dev.coc.10086.cn/coc2/web-promotion/quick-receive-v3/index.html?pageId=1483705578201546752&channelId=P00000035984",
        advBusiType: "666",
        isLabel: null,
        isShare: "0",
        location: "2",
        markId: "257658",
        markName: "宽带预约",
        imageUrl:
            "https://res.app.coc.10086.cn/group2/M00/06/B9/CtFOW2eS-7iAMKPIAAAKHuunaG4722.png",
        searchTerms: null,
        moods: null,
        lableStyle: null,
        cornerTitle: null,
        cornerShow: null,
        iconCode: null,
        pCode: "P00000025119",
    },
    {
        actionType: "1",
        actionUrl:
            "https://h.app.coc.10086.cn/cmcc-app/uni-zone/packageArea/packageArea.html?pageId=1538797930025873408&channelId=P00000035987",
        advBusiType: "666",
        isLabel: null,
        isShare: "0",
        location: "3",
        markId: "257698",
        markName: "套餐办理",
        imageUrl:
            "https://res.app.coc.10086.cn/group2/M00/06/B9/CtFOJ2eTBTSAFwW3AAAKnq1xQSM664.png",
        searchTerms: null,
        moods: null,
        lableStyle: null,
        cornerTitle: null,
        cornerShow: null,
        iconCode: null,
        pCode: "P00000025120",
    },
    {
        actionType: "1",
        actionUrl:
            "https://dev.coc.10086.cn/coc2/web-kataobao2/ktb-web-parenting/index.html?pageId=1874661124400578560&channelId=P00000025121",
        advBusiType: "666",
        isLabel: null,
        isShare: "0",
        location: "4",
        markId: "257906",
        markName: "副卡送会员",
        imageUrl:
            "https://res.app.coc.10086.cn/group2/M00/06/BB/CtFOJ2eTOJ6Ad0nrAAASMAmc1Dk232.png",
        searchTerms: null,
        moods: null,
        lableStyle: null,
        cornerTitle: null,
        cornerShow: null,
        iconCode: null,
        pCode: "P00000025121",
    },
]

// 首页重构-猜你喜欢2--移动优选通栏
const GuessLike2NewData = [
    {
        actionType: "1",
        actionUrl:
            "https://dev.coc.10086.cn/coc2/web-kataobao2/ktb-web-parenting/index.html?pageId=1874661124400578560&channelId=P00000027493",
        advBusiType: "666",
        isLabel: "0",
        isShare: "0",
        location: "1",
        markId: "257988",
        markName: "家庭副卡可定位送会员",
        imageUrl:
            "https://res.app.coc.10086.cn/group1/M00/06/C5/CtFOBmei2bKAJ7xXAAInz_QnfCY415.png",
        searchTerms: null,
        moods: null,
        lableStyle: null,
        cornerTitle: null,
        cornerShow: null,
        iconCode: null,
        pCode: "P00000027493",
    },
];

export { MockGuessLikeData, GuessLike1NewData, GuessLike2NewData };
