// 首页重构手机号白名单
const HomeNewPhoneList = ['15759181887', '13815835589', '13373982398', '18236968722', '19839976614', '19520974064', '13520251274', '18137783152', '15138846522', '13567195169', '13588855511', '13175038083', '15858217054', '15967102267', '15857149002', '15967108077', '13857159527', '18868185918', '19864693650', '15981883818',
]

// 全部页活动分类改版手机号白名单
const ActivePhoneList = ['15759181887', '13815835589', '13373982398', '18236968722', '19839976614', '19520974064', '13520251274', '18137783152', '15138846522', '13567195169', '13588855511', '13175038083', '15858217054', '15967102267', '15857149002', '15967108077', '13857159527', '18868185918', '19864693650', '15981883818', '19700728187', '13803427165',
]

// 热门搜索兜底数据
const rmssData = {
    "code": "000000",
    "msg": "操作成功",
    "info": null,
    "data": [
        {
            "itemId": null,
            "title": "云盘会员日",
            "num": "999999",
            "addressUrl": "https://caiyun.feixin.10086.cn:7071/portal/cloudCircle/index.html?path=mCloudDay&sourceid=1071",
            "actionType": "1",
            "originType": 1
        },
        {
            "itemId": null,
            "title": "QQ音乐会员",
            "num": "899999",
            "addressUrl": "https://dev.coc.10086.cn/coc/canvas/package-h5-canvas/online/QQmusic2024?pageId=1739538735795634176&channelId=P00000005603",
            "actionType": "1",
            "originType": 1
        },
        {
            "itemId": null,
            "title": "爱奇艺+15GB",
            "num": "699999",
            "addressUrl": "https://chinamobileapp/rn/common/XDS00002?personalPageId=2025040311323609702000634&channelId=P00000005603",
            "actionType": "1",
            "originType": 1
        },
        {
            "itemId": null,
            "title": "全球通5GA尊享套餐",
            "num": "299999",
            "addressUrl": "https://h.app.coc.10086.cn/activity/transferXcx/index.html?platform=cmcc&appId=6413852282228128&path=pages%2Findex%2Findex&pageId=1879370128044171264&channelId=P00000025114",
            "actionType": "1",
            "originType": 1
        },
        {
            "itemId": null,
            "title": "至臻超高清电视，全面发售",
            "num": "100000",
            "addressUrl": "https://www.ha.10086.cn/shop/tvProductDeal/index?pchannel=channel_jtapp&WT.ac_id=ss_qwrs&Code=1000000002110700006",
            "actionType": "1",
            "originType": 1
        },
        {
            "itemId": null,
            "title": " 3.5元无限畅听全曲库",
            "num": "99999",
            "addressUrl": "https://dev.coc.10086.cn/coc/canvas/pkg-h5-canvas/online/a1711357976552?pageId=1772099824477782016&channelId=P00000025112",
            "actionType": "1",
            "originType": 1
        },
        {
            "itemId": null,
            "title": "享视听游读4大会员",
            "num": "49999",
            "addressUrl": "https://dev.coc.10086.cn/coc/canvas/pkg-h5-canvas/online/a1695093554038?pageId=1703610336439296000&channelId=P00000025112",
            "actionType": "1",
            "originType": 1
        },
        {
            "itemId": "202504291537407562226890V176",
            "title": "金币乐园（4-5月）",
            "num": "49999",
            "addressUrl": "https://wap.ha.10086.cn/hnmccClientWap/act_h5/html/h5/goldService/index?channel=channel_JT&WT.ac_id=250414_RMHD&channelId=P00000054334&yx=1311685006",
            "actionType": null,
            "originType": 2
        },
        {
            "itemId": "202504291044131642214012V176",
            "title": "申请销号",
            "num": "49999",
            "addressUrl": "https://www.ha.10086.cn/shop/onlineDestory/reservationIndex?WT.ac_id=FLYHK&yx=1309096003&channelId=P00000102704",
            "actionType": null,
            "originType": 2
        },
        {
            "itemId": "20240110165204439434140V176",
            "title": "销号",
            "num": "49999",
            "addressUrl": "https://wx.10086.cn/website/spa/main/serviceGuide/new?businessId=36859142&yx=1109540005&channelId=P00000075977",
            "actionType": null,
            "originType": 2
        }
    ]
}

// 精选推荐兜底数据
const jxtjData = {
    "code": "000000",
    "msg": "操作成功",
    "info": null,
    "data": {
        "rectangleList": [
            {
                "remark": null,
                "title": "蓝宝爱心站",
                "subTitle": null,
                "provCode": null,
                "pageCode": null,
                "docId": "928f654f5e35c75ab5d40bebd9ee4dfd",
                "iconUrl": "https://res.app.coc.10086.cn/group2/M00/03/3D/CtFOW2UNOAuANMVXAAFNkJ4I7k8534.jpg",
                "linkAddressUrl": "https://gongyi.coc.10086.cn/charity/open-frontend/wap/index.html#/farm?sspid=GY00001",
                "dataType": 1,
                "weekShowStatus": "1,2,3,4,5,6,7"
            },
            {
                "remark": null,
                "title": "中国移动公益",
                "subTitle": null,
                "provCode": null,
                "pageCode": null,
                "docId": "92e64f595761a6b226bd276f06b9e678",
                "iconUrl": "https://res.app.coc.10086.cn/group1/M00/04/07/CtFOBmWXyMyAax3yAAB-7I1Dnso145.png",
                "linkAddressUrl": "https://gongyi.coc.10086.cn/charity/open-frontend/wap/index.html#/?sspid=GY00001",
                "dataType": 1,
                "weekShowStatus": "1,2,3,4,5,6,7"
            },
            {
                "remark": null,
                "title": "免费领50G流量",
                "subTitle": null,
                "provCode": null,
                "pageCode": null,
                "docId": "1ee1cff52a7f0fa9e49dd80e2e8d1917",
                "iconUrl": "https://wx.10086.cn/prd-mgcenter/06ce091d623d47b68175ff48e59f3476.png",
                "linkAddressUrl": "https://plus.migu.cn/c/0fno9s",
                "dataType": 1,
                "weekShowStatus": "1,2,3,4,5,6,7"
            },
            {
                "remark": null,
                "title": "免费领50G流量",
                "subTitle": null,
                "provCode": null,
                "pageCode": null,
                "docId": "1ee1cff52a7f0fa9e49dd80e2e8d1917",
                "iconUrl": "https://wx.10086.cn/prd-mgcenter/06ce091d623d47b68175ff48e59f3476.png",
                "linkAddressUrl": "https://plus.migu.cn/c/0fno9s",
                "dataType": 1,
                "weekShowStatus": "1,2,3,4,5,6,7"
            }
        ],
        "squareList": [
            {
                "remark": null,
                "title": "天猫国际（福利社）",
                "subTitle": "福利社每个月领一次",
                "provCode": null,
                "pageCode": null,
                "docId": "834349a225be9aab9afda0c1673d82f1",
                "iconUrl": "https://res.coc.10086.cn/res/cdn/coc1/2024/10/18/1847107739052892160/澶╃尗鍥介檯150.jpg",
                "linkAddressUrl": "https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/detail?mid=267&channelCode=P00000058870&aid=10265",
                "dataType": 2,
                "weekShowStatus": "1,2,3,4,5,6,7"
            },
            {
                "remark": null,
                "title": "热门游戏权益",
                "subTitle": "加15GB",
                "provCode": null,
                "pageCode": null,
                "docId": "6ec76f2810afd29dfaa49b484a06a7c4",
                "iconUrl": "https://res.app.coc.10086.cn/group2/M00/07/06/CtFOJ2fjv8CAdBzfAACn_J4wBaw112.png",
                "linkAddressUrl": "https://dev.coc.10086.cn/coc2/web-kataobao2/ktb-web-sxw-enjoy/index.html?pageId=1662998105878511616&channelId=P00000010499&wt.ac_id=leadeon_551_3626",
                "dataType": 2,
                "weekShowStatus": "1,2,3,4,5,6,7"
            },
            {
                "remark": null,
                "title": "视频会员任选",
                "subTitle": "加专属流量",
                "provCode": null,
                "pageCode": null,
                "docId": "f4682878dff9bee65ce99c56495612f7",
                "iconUrl": "https://res.app.coc.10086.cn/group2/M00/04/17/CtFOW2WnP4mAQWd2AABN_s2njBc097.jpg",
                "linkAddressUrl": "https://dev.coc.10086.cn/coc2/web-kataobao2/ktb-web-sxk-original/index.html?pageId=1583025552892329984&channelId=P00000010495&wt.ac_id=leadeon_551_3624",
                "dataType": 2,
                "weekShowStatus": "1,2,3,4,5,6,7"
            },
            {
                "remark": null,
                "title": "WPS（权益福袋）",
                "subTitle": "权益福袋",
                "provCode": null,
                "pageCode": null,
                "docId": "c72454218f442f0dd33400fb93a95621",
                "iconUrl": "https://res.coc.10086.cn/res/cdn/coc1/2023/06/08/1666642682851971072/wps.png",
                "linkAddressUrl": "https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/detail?mid=12848&channelCode=P00000058870&aid=10164",
                "dataType": 2,
                "weekShowStatus": "1,2,3,4,5,6,7"
            },
            {
                "remark": null,
                "title": "购芒果会员",
                "subTitle": "加专属流量",
                "provCode": null,
                "pageCode": null,
                "docId": "73557c0d418511a8acedaf0c81c2b789",
                "iconUrl": "https://res.app.coc.10086.cn/group2/M00/07/06/CtFOW2fjcyCAfG-IAABEBq_qGbg190.jpg",
                "linkAddressUrl": "https://h.app.coc.10086.cn/activity/transferXcx/index.html?platform=cmcc&appId=8261535206163396&path=subPackage%2FshopDetail%2FnewCustomShopDetail%3FpersonalPageId%3D2024082018240128602000189&miniProgramType=0&channelId=P00000010500&wt.ac_id=leadeon_551_3620",
                "dataType": 2,
                "weekShowStatus": "1,2,3,4,5,6,7"
            },
            {
                "remark": null,
                "title": "10GB通用",
                "subTitle": "加视频周卡",
                "provCode": null,
                "pageCode": null,
                "docId": "fb9ffb4b5f6d7bfc1a066bf33e945609",
                "iconUrl": "https://res.app.coc.10086.cn/group1/M00/04/ED/CtFOBmZNSHaAPJFlAABsuJqIlSM149.jpg",
                "linkAddressUrl": "https://dev.coc.10086.cn/coc2/web-kataobao2/ktb-web-overbalance4sxk/index.html?pageId=1824000052021415936&channelId=P00000010498&wt.ac_id=leadeon_551_3628",
                "dataType": 2,
                "weekShowStatus": "1,2,3,4,5,6,7"
            },
            {
                "remark": null,
                "title": "数智旅行（福利社）",
                "subTitle": "福利社每个月领一次",
                "provCode": null,
                "pageCode": null,
                "docId": "80214b0f6d8999fec67b7be1c43ad67b",
                "iconUrl": "https://res.coc.10086.cn/res/cdn/coc1/2023/12/04/1731501535801982976/shuzhilvxing.jpg",
                "linkAddressUrl": "https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/detail?mid=20140&channelCode=P00000058870&aid=10265",
                "dataType": 2,
                "weekShowStatus": "1,2,3,4,5,6,7"
            },
            {
                "remark": null,
                "title": "购腾讯会员",
                "subTitle": "加专属流量",
                "provCode": null,
                "pageCode": null,
                "docId": "22deca40a3e6942e96cffbcef20a0f2e",
                "iconUrl": "https://res.app.coc.10086.cn/group2/M00/07/06/CtFOJ2fjc4uAdMH5AAAfVGFos4c942.jpg",
                "linkAddressUrl": "https://h.app.coc.10086.cn/activity/transferXcx/index.html?platform=cmcc&appId=8261535206163396&path=subPackage%2FshopDetail%2FnewCustomShopDetail%3FpersonalPageId%3D2024082016343914502000186&miniProgramType=0&channelId=P00000010497&wt.ac_id=leadeon_551_3622",
                "dataType": 2,
                "weekShowStatus": "1,2,3,4,5,6,7"
            },
            {
                "remark": null,
                "title": "爱奇艺（黄金小福袋）",
                "subTitle": "黄金小福袋",
                "provCode": null,
                "pageCode": null,
                "docId": "c91aed7c6ab9a9fb062bff86b7dbc77f",
                "iconUrl": "https://res.coc.10086.cn/res/cdn/coc1/2025/01/02/1874747080266739712/150.jpg",
                "linkAddressUrl": "https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/detail?mid=1656&channelCode=P00000058870&aid=10480",
                "dataType": 2,
                "weekShowStatus": "1,2,3,4,5,6,7"
            },
            {
                "remark": null,
                "title": "咪咕快游（铂金校园版福袋）",
                "subTitle": "权益福袋铂金校园版",
                "provCode": null,
                "pageCode": null,
                "docId": "7c9f4ac32a94e6c9790df40f13bb69a7",
                "iconUrl": "https://res.coc.10086.cn/res/cdn/coc1/2023/08/28/1696082099908034560/migukuaiyou.png",
                "linkAddressUrl": "https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/detail?mid=1643&channelCode=P00000058870&aid=12502",
                "dataType": 2,
                "weekShowStatus": "1,2,3,4,5,6,7"
            }
        ]
    }
}

// 精选推荐兜底数据 - 新版
const jxtjDataNew = {
    "code": "000000",
    "msg": "操作成功",
    "info": null,
    "data": {
        "rectangleVOList": [
            {
                "selectRecommondResultVOS": [
                    {
                        "remark": null,
                        "title": "蓝宝爱心站",
                        "subTitle": null,
                        "provCode": null,
                        "pageCode": null,
                        "docId": null,
                        "iconUrl": require('@/assets/images/' + "lbaxz.png"),
                        "linkAddressUrl": "https://gongyi.coc.10086.cn/charity/open-frontend/wap/index.html#/farm?sspid=GY00001",
                        "dataType": 1
                    }
                ],
                "position": "1"
            },
            {
                "selectRecommondResultVOS": [
                    {
                        "remark": null,
                        "title": "免费领50G流量",
                        "subTitle": null,
                        "provCode": null,
                        "pageCode": null,
                        "docId": null,
                        "iconUrl": require('@/assets/images/' + "mfl50gll.png"),
                        "linkAddressUrl": "https://plus.migu.cn/c/0fno9s",
                        "dataType": 1
                    }
                ],
                "position": "2"
            },
            {
                "selectRecommondResultVOS": [
                    {
                        "remark": null,
                        "title": "100+APP专属流量",
                        "subTitle": null,
                        "provCode": null,
                        "pageCode": null,
                        "docId": null,
                        "iconUrl": require('@/assets/images/' + "100appzsll.png"),
                        "linkAddressUrl": "https://dev.coc.10086.cn/coc/web2/quickreleaseplatformH5/danfaModule?pageId=1473947632963788800&channelId=P00000042298",
                        "dataType": 1
                    }
                ],
                "position": "3"
            },
            {
                "selectRecommondResultVOS": [
                    {
                        "remark": null,
                        "title": "24个月视频会员+超大流量",
                        "subTitle": null,
                        "provCode": null,
                        "pageCode": null,
                        "docId": null,
                        "iconUrl": require('@/assets/images/' + "24gysphy.png"),
                        "linkAddressUrl": "https://dev.coc.10086.cn/coc/web2/quickreleaseplatformH5/danfaModule?pageId=1917046048545558528&channelId=P00000042298",
                        "dataType": 1
                    }
                ],
                "position": "4"
            },
            {
                "selectRecommondResultVOS": [
                    {
                        "remark": null,
                        "title": "万能家庭副卡",
                        "subTitle": null,
                        "provCode": null,
                        "pageCode": null,
                        "docId": null,
                        "iconUrl": require('@/assets/images/' + "wnjtfk.png"),
                        "linkAddressUrl": "https://dev.coc.10086.cn/coc2/web-kataobao2/ktb-web-cutecard/index.html?pageId=1532257384428081152&channelId=P00000042298",
                        "dataType": 1
                    }
                ],
                "position": "5"
            },
            {
                "selectRecommondResultVOS": [
                    {
                        "remark": null,
                        "title": "签到有礼",
                        "subTitle": null,
                        "provCode": null,
                        "pageCode": null,
                        "docId": null,
                        "iconUrl": require('@/assets/images/' + "qdyl.png"),
                        "linkAddressUrl": "https://wx.10086.cn/qwhdhub/qwhdmark/1021122301?channelId=P00000122940",
                        "dataType": 1
                    }
                ],
                "position": "6"
            }
        ],
        "squareVOList": [
            {
                "selectRecommondResultVOS": [
                    {
                        "remark": null,
                        "title": "天猫国际（福利社）",
                        "subTitle": "福利社每个月领一次",
                        "provCode": null,
                        "pageCode": null,
                        "docId": "834349a225be9aab9afda0c1673d82f1",
                        "iconUrl": "https://res.coc.10086.cn/res/cdn/coc1/2024/10/18/1847107739052892160/澶╃尗鍥介檯150.jpg",
                        "linkAddressUrl": "https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/detail?mid=267&channelCode=P00000058870&aid=10265",
                        "dataType": 2,
                        "weekShowStatus": "1,2,3,4,5,6,7"
                    }
                ],
                "position": "1"
            },
            {
                "selectRecommondResultVOS": [
                    {
                        "remark": null,
                        "title": "热门游戏权益",
                        "subTitle": "加15GB",
                        "provCode": null,
                        "pageCode": null,
                        "docId": "6ec76f2810afd29dfaa49b484a06a7c4",
                        "iconUrl": "https://res.app.coc.10086.cn/group2/M00/07/06/CtFOJ2fjv8CAdBzfAACn_J4wBaw112.png",
                        "linkAddressUrl": "https://dev.coc.10086.cn/coc2/web-kataobao2/ktb-web-sxw-enjoy/index.html?pageId=1662998105878511616&channelId=P00000010499&wt.ac_id=leadeon_551_3626",
                        "dataType": 2,
                        "weekShowStatus": "1,2,3,4,5,6,7"
                    }
                ],
                "position": "2"
            },
            {
                "selectRecommondResultVOS": [
                    {
                        "remark": null,
                        "title": "视频会员任选",
                        "subTitle": "加专属流量",
                        "provCode": null,
                        "pageCode": null,
                        "docId": "f4682878dff9bee65ce99c56495612f7",
                        "iconUrl": "https://res.app.coc.10086.cn/group2/M00/04/17/CtFOW2WnP4mAQWd2AABN_s2njBc097.jpg",
                        "linkAddressUrl": "https://dev.coc.10086.cn/coc2/web-kataobao2/ktb-web-sxk-original/index.html?pageId=1583025552892329984&channelId=P00000010495&wt.ac_id=leadeon_551_3624",
                        "dataType": 2,
                        "weekShowStatus": "1,2,3,4,5,6,7"
                    }
                ],
                "position": "3"
            },
            {
                "selectRecommondResultVOS": [
                    {
                        "remark": null,
                        "title": "WPS（权益福袋）",
                        "subTitle": "权益福袋",
                        "provCode": null,
                        "pageCode": null,
                        "docId": "c72454218f442f0dd33400fb93a95621",
                        "iconUrl": "https://res.coc.10086.cn/res/cdn/coc1/2023/06/08/1666642682851971072/wps.png",
                        "linkAddressUrl": "https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/detail?mid=12848&channelCode=P00000058870&aid=10164",
                        "dataType": 2,
                        "weekShowStatus": "1,2,3,4,5,6,7"
                    }
                ],
                "position": "4"
            },
            {
                "selectRecommondResultVOS": [
                    {
                        "remark": null,
                        "title": "购芒果会员",
                        "subTitle": "加专属流量",
                        "provCode": null,
                        "pageCode": null,
                        "docId": "73557c0d418511a8acedaf0c81c2b789",
                        "iconUrl": "https://res.app.coc.10086.cn/group2/M00/07/06/CtFOW2fjcyCAfG-IAABEBq_qGbg190.jpg",
                        "linkAddressUrl": "https://h.app.coc.10086.cn/activity/transferXcx/index.html?platform=cmcc&appId=8261535206163396&path=subPackage%2FshopDetail%2FnewCustomShopDetail%3FpersonalPageId%3D2024082018240128602000189&miniProgramType=0&channelId=P00000010500&wt.ac_id=leadeon_551_3620",
                        "dataType": 2,
                        "weekShowStatus": "1,2,3,4,5,6,7"
                    }
                ],
                "position": "5"
            },
            {
                "selectRecommondResultVOS": [
                    {
                        "remark": null,
                        "title": "10GB通用",
                        "subTitle": "加视频周卡",
                        "provCode": null,
                        "pageCode": null,
                        "docId": "fb9ffb4b5f6d7bfc1a066bf33e945609",
                        "iconUrl": "https://res.app.coc.10086.cn/group1/M00/04/ED/CtFOBmZNSHaAPJFlAABsuJqIlSM149.jpg",
                        "linkAddressUrl": "https://dev.coc.10086.cn/coc2/web-kataobao2/ktb-web-overbalance4sxk/index.html?pageId=1824000052021415936&channelId=P00000010498&wt.ac_id=leadeon_551_3628",
                        "dataType": 2,
                        "weekShowStatus": "1,2,3,4,5,6,7"
                    }
                ],
                "position": "6"
            },
            {
                "selectRecommondResultVOS": [
                    {
                        "remark": null,
                        "title": "数智旅行（福利社）",
                        "subTitle": "福利社每个月领一次",
                        "provCode": null,
                        "pageCode": null,
                        "docId": "80214b0f6d8999fec67b7be1c43ad67b",
                        "iconUrl": "https://res.coc.10086.cn/res/cdn/coc1/2023/12/04/1731501535801982976/shuzhilvxing.jpg",
                        "linkAddressUrl": "https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/detail?mid=20140&channelCode=P00000058870&aid=10265",
                        "dataType": 2,
                        "weekShowStatus": "1,2,3,4,5,6,7"
                    }
                ],
                "position": "7"
            },
            {
                "selectRecommondResultVOS": [
                    {
                        "remark": null,
                        "title": "购腾讯会员",
                        "subTitle": "加专属流量",
                        "provCode": null,
                        "pageCode": null,
                        "docId": "22deca40a3e6942e96cffbcef20a0f2e",
                        "iconUrl": "https://res.app.coc.10086.cn/group2/M00/07/06/CtFOJ2fjc4uAdMH5AAAfVGFos4c942.jpg",
                        "linkAddressUrl": "https://h.app.coc.10086.cn/activity/transferXcx/index.html?platform=cmcc&appId=8261535206163396&path=subPackage%2FshopDetail%2FnewCustomShopDetail%3FpersonalPageId%3D2024082016343914502000186&miniProgramType=0&channelId=P00000010497&wt.ac_id=leadeon_551_3622",
                        "dataType": 2,
                        "weekShowStatus": "1,2,3,4,5,6,7"
                    }
                ],
                "position": "8"
            },
            {
                "selectRecommondResultVOS": [
                    {
                        "remark": null,
                        "title": "爱奇艺（黄金小福袋）",
                        "subTitle": "黄金小福袋",
                        "provCode": null,
                        "pageCode": null,
                        "docId": "c91aed7c6ab9a9fb062bff86b7dbc77f",
                        "iconUrl": "https://res.coc.10086.cn/res/cdn/coc1/2025/01/02/1874747080266739712/150.jpg",
                        "linkAddressUrl": "https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/detail?mid=1656&channelCode=P00000058870&aid=10480",
                        "dataType": 2,
                        "weekShowStatus": "1,2,3,4,5,6,7"
                    }
                ],
                "position": "9"
            },
            {
                "selectRecommondResultVOS": [
                    {
                        "remark": null,
                        "title": "咪咕快游（铂金校园版福袋）",
                        "subTitle": "权益福袋铂金校园版",
                        "provCode": null,
                        "pageCode": null,
                        "docId": "7c9f4ac32a94e6c9790df40f13bb69a7",
                        "iconUrl": "https://res.coc.10086.cn/res/cdn/coc1/2023/08/28/1696082099908034560/migukuaiyou.png",
                        "linkAddressUrl": "https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/detail?mid=1643&channelCode=P00000058870&aid=12502",
                        "dataType": 2,
                        "weekShowStatus": "1,2,3,4,5,6,7"
                    }
                ],
                "position": "10"
            }
        ]
    }
}

// 精彩内容兜底数据
const jcnrData = {
    "code": "000000",
    "msg": "操作成功",
    "info": null,
    "data": [
        {
            "feedCoverUrl": "https://res.app.coc.10086.cn/activity_cmcc-cs_cn/cmlive/prd-cmlive-vc/img/upload/20250514/44af6e63d7644e36be40429f37cd69b8.png",
            "videoUrl": "https://h.app.coc.10086.cn/activity/transferXcx/index.html?platform=cmcc&appId=5557947218813229&path=subPackage%2Ffeed%2Findex%3Fid%3D61675%26channelId%3D45%26cmliveChannelId%3D45%26belongChannelId%3D45&miniProgramType=0",
            "videoName": "高速跑100油耗才32-33，卡友去厂家定制的车什么配置？"
        },
        {
            "feedCoverUrl": "https://res.app.coc.10086.cn/activity_cmcc-cs_cn/cmlive/prd-cmlive-vc/img/upload/20250515/70f9f760513c4a33af0667ea0afe9d14.png",
            "videoUrl": "https://h.app.coc.10086.cn/activity/transferXcx/index.html?platform=cmcc&appId=5557947218813229&path=subPackage%2Ffeed%2Findex%3Fid%3D62014%26channelId%3D45%26cmliveChannelId%3D45%26belongChannelId%3D45&miniProgramType=0",
            "videoName": "途昂Pro首搭五代EA888不到30万买地表最强2.0T"
        },
        {
            "feedCoverUrl": "https://res.app.coc.10086.cn/activity_cmcc-cs_cn/cmlive/prd-cmlive-vc/img/upload/20250515/a89957554cac47cbafe7b05c19fdf83b.png",
            "videoUrl": "https://h.app.coc.10086.cn/activity/transferXcx/index.html?platform=cmcc&appId=5557947218813229&path=subPackage%2Ffeed%2Findex%3Fid%3D61984%26channelId%3D45%26cmliveChannelId%3D45%26belongChannelId%3D45&miniProgramType=0",
            "videoName": "包下魔都整条步行街，给各地车友们来一次终身难忘的旅行！"
        },
        {
            "feedCoverUrl": "https://p26-custom0015-sign.onewsimg.com/tos-cn-p-0015/oY1A80n78lGjRHGTB9UeABAAVL2EICDbglheDD~tplv-04612y3svt-port:336:428.jpeg?lk3s=4f490a55&scene=torchlight&x-expires=1800517208&x-signature=SXah6e7oxlORPetuamrvCaRu8Rk%3D",
            "videoUrl": "https://h.app.coc.10086.cn/activity/transferXcx/index.html?platform=cmcc&appId=5557947218813229&path=subPackage%2Ffeed%2Findex%3Fid%3D16057%26channelId%3D36%26cmliveChannelId%3D36%26belongChannelId%3D36&miniProgramType=0",
            "videoName": "你有没有为你朋友拍照拼过命？#拍照#原"
        },
        {
            "feedCoverUrl": "https://p11-custom0015-sign.onewsimg.com/tos-cn-i-dy/ff84f363617740e68dc917c0d728a398~tplv-04612y3svt-port:336:428.jpeg?lk3s=4f490a55&scene=torchlight&x-expires=1800517582&x-signature=SEkmOFgpxm3t7qLGM%2Bc2mUUjF5k%3D",
            "videoUrl": "https://h.app.coc.10086.cn/activity/transferXcx/index.html?platform=cmcc&appId=5557947218813229&path=subPackage%2Ffeed%2Findex%3Fid%3D24997%26channelId%3D50%26cmliveChannelId%3D50%26belongChannelId%3D50&miniProgramType=0",
            "videoName": "温馨提醒：您还有两个小时就到了头发生长最"
        },
        {
            "feedCoverUrl": "https://res.app.coc.10086.cn/activity_cmcc-cs_cn/cmlive/prd-cmlive-vc/img/upload/20250515/e55e9afea3c140d1abb2b57fd0eb5cb1.png",
            "videoUrl": "https://h.app.coc.10086.cn/activity/transferXcx/index.html?platform=cmcc&appId=5557947218813229&path=subPackage%2Ffeed%2Findex%3Fid%3D62034%26channelId%3D63%26cmliveChannelId%3D63%26belongChannelId%3D63&miniProgramType=0",
            "videoName": "热门游戏推荐：天天八段锦第七式"
        },
        {
            "feedCoverUrl": "https://res.app.coc.10086.cn/activity_cmcc-cs_cn/cmlive/prd-cmlive-vc/img/upload/20250515/0aacc8903e2a4f7791876e63ad1386eb.png",
            "videoUrl": "https://h.app.coc.10086.cn/activity/transferXcx/index.html?platform=cmcc&appId=5557947218813229&path=subPackage%2Ffeed%2Findex%3Fid%3D62006%26channelId%3D45%26cmliveChannelId%3D45%26belongChannelId%3D45&miniProgramType=0",
            "videoName": "都有人开始用AI工具辅助面试了？#程序"
        },
        {
            "feedCoverUrl": "https://p11-custom0015-sign.onewsimg.com/tos-cn-i-dy/06fe6a5c072249d0bb3b23dc4a5b77c9~tplv-04612y3svt-port:336:428.jpeg?lk3s=4f490a55&scene=torchlight&x-expires=1806393644&x-signature=IYoFJXiBCcydn0BvbAEwdluK3vc%3D",
            "videoUrl": "https://h.app.coc.10086.cn/activity/transferXcx/index.html?platform=cmcc&appId=5557947218813229&path=subPackage%2Ffeed%2Findex%3Fid%3D58289%26channelId%3D33%26cmliveChannelId%3D33%26belongChannelId%3D33&miniProgramType=0",
            "videoName": "起猛了，居然有人cosAI大模型！？"
        },
        {
            "feedCoverUrl": "https://res.app.coc.10086.cn/activity_cmcc-cs_cn/cmlive/prd-cmlive-vc/img/upload/20250514/28f7eedc71c84507bdc4351b6afacc1d.jpg",
            "videoUrl": "https://h.app.coc.10086.cn/activity/transferXcx/index.html?platform=cmcc&appId=5557947218813229&path=subPackage%2Ffeed%2Findex%3Fid%3D61833%26channelId%3D63%26cmliveChannelId%3D63%26belongChannelId%3D63&miniProgramType=0",
            "videoName": "热门游戏推荐：少年西游记2"
        }
    ]
}

// 周边生活兜底数据
const zbshData = {
    "code": "000000",
    "msg": "操作成功",
    "info": null,
    "data": {
        "shopFoodList": [
            {
                "id": "755779807",
                "shopName": "北京百盛店",
                "area": "西城区",
                "salesPageId": "1171",
                "salesPageName": "喜茶",
                "salesPageCdnUrl": "https://res.coc.10086.cn/res/cdn/coc1/2025/03/06/1897578476651671552/喜茶150.jpg",
                "oneCid": "21",
                "oneCname": "美食餐饮",
                "twoCid": "1078",
                "twoCname": "甜品饮品",
                "skuList": [
                    {
                        "skuId": "33336",
                        "skuName": "喜茶好礼券（15元）",
                        "skuShowName": "喜茶15元好礼券",
                        "skuPrice": 1500,
                        "skuVipPrice": null
                    },
                    {
                        "skuId": "33337",
                        "skuName": "喜茶好礼券（20元）",
                        "skuShowName": "喜茶20元好礼券",
                        "skuPrice": 2000,
                        "skuVipPrice": null
                    },
                    {
                        "skuId": "33339",
                        "skuName": "喜茶好礼券（30元）",
                        "skuShowName": "喜茶30元好礼券",
                        "skuPrice": 3000,
                        "skuVipPrice": null
                    },
                    {
                        "skuId": "33340",
                        "skuName": "喜茶好礼券（50元）",
                        "skuShowName": "喜茶50元好礼券",
                        "skuPrice": 5000,
                        "skuVipPrice": null
                    }
                ],
                "detailUrl": "https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/detail?mid=1171&channelCode=P00000092338",
                "distance": "405"
            },
            {
                "id": "755049733",
                "shopName": "华荣公寓店",
                "area": "西城区",
                "salesPageId": "301",
                "salesPageName": "瑞幸咖啡",
                "salesPageCdnUrl": "https://res.coc.10086.cn/res/cdn/coc1/2023/05/15/1658005324633841664/ruixingkafei.png",
                "oneCid": "21",
                "oneCname": "美食餐饮",
                "twoCid": "1078",
                "twoCname": "甜品饮品",
                "skuList": [
                    {
                        "skuId": "31928",
                        "skuName": "瑞幸咖啡服务饮品券（26元）",
                        "skuShowName": "瑞幸咖啡26元券",
                        "skuPrice": 2600,
                        "skuVipPrice": 1850
                    },
                    {
                        "skuId": "31929",
                        "skuName": "瑞幸咖啡服务饮品券（29元）",
                        "skuShowName": "瑞幸咖啡29元券",
                        "skuPrice": 2900,
                        "skuVipPrice": 2050
                    },
                    {
                        "skuId": "31930",
                        "skuName": "瑞幸咖啡服务饮品券（32元）",
                        "skuShowName": "瑞幸咖啡32元券",
                        "skuPrice": 3200,
                        "skuVipPrice": 2250
                    },
                    {
                        "skuId": "31935",
                        "skuName": "瑞幸咖啡服务饮品券（35元）",
                        "skuShowName": "瑞幸咖啡35元券",
                        "skuPrice": 3500,
                        "skuVipPrice": 2450
                    }
                ],
                "detailUrl": "https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/detail?mid=301&channelCode=P00000092338",
                "distance": "418"
            },
            {
                "id": "755779805",
                "shopName": "北京三里河店",
                "area": "西城区",
                "salesPageId": "1171",
                "salesPageName": "喜茶",
                "salesPageCdnUrl": "https://res.coc.10086.cn/res/cdn/coc1/2025/03/06/1897578476651671552/喜茶150.jpg",
                "oneCid": "21",
                "oneCname": "美食餐饮",
                "twoCid": "1078",
                "twoCname": "甜品饮品",
                "skuList": [
                    {
                        "skuId": "33336",
                        "skuName": "喜茶好礼券（15元）",
                        "skuShowName": "喜茶15元好礼券",
                        "skuPrice": 1500,
                        "skuVipPrice": null
                    },
                    {
                        "skuId": "33337",
                        "skuName": "喜茶好礼券（20元）",
                        "skuShowName": "喜茶20元好礼券",
                        "skuPrice": 2000,
                        "skuVipPrice": null
                    },
                    {
                        "skuId": "33339",
                        "skuName": "喜茶好礼券（30元）",
                        "skuShowName": "喜茶30元好礼券",
                        "skuPrice": 3000,
                        "skuVipPrice": null
                    },
                    {
                        "skuId": "33340",
                        "skuName": "喜茶好礼券（50元）",
                        "skuShowName": "喜茶50元好礼券",
                        "skuPrice": 5000,
                        "skuVipPrice": null
                    }
                ],
                "detailUrl": "https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/detail?mid=1171&channelCode=P00000092338",
                "distance": "588"
            },
            {
                "id": "755776962",
                "shopName": "北京金融街购物中心店",
                "area": "西城区",
                "salesPageId": "1171",
                "salesPageName": "喜茶",
                "salesPageCdnUrl": "https://res.coc.10086.cn/res/cdn/coc1/2025/03/06/1897578476651671552/喜茶150.jpg",
                "oneCid": "21",
                "oneCname": "美食餐饮",
                "twoCid": "1078",
                "twoCname": "甜品饮品",
                "skuList": [
                    {
                        "skuId": "33336",
                        "skuName": "喜茶好礼券（15元）",
                        "skuShowName": "喜茶15元好礼券",
                        "skuPrice": 1500,
                        "skuVipPrice": null
                    },
                    {
                        "skuId": "33337",
                        "skuName": "喜茶好礼券（20元）",
                        "skuShowName": "喜茶20元好礼券",
                        "skuPrice": 2000,
                        "skuVipPrice": null
                    },
                    {
                        "skuId": "33339",
                        "skuName": "喜茶好礼券（30元）",
                        "skuShowName": "喜茶30元好礼券",
                        "skuPrice": 3000,
                        "skuVipPrice": null
                    },
                    {
                        "skuId": "33340",
                        "skuName": "喜茶好礼券（50元）",
                        "skuShowName": "喜茶50元好礼券",
                        "skuPrice": 5000,
                        "skuVipPrice": null
                    }
                ],
                "detailUrl": "https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/online/detail?mid=1171&channelCode=P00000092338",
                "distance": "623"
            }
        ],
        "movieList": [
            {
                "filmDetailUrl": "https://movie.miguvideo.com/mgyy/site/prd/detail.html?pageId=138b3f0226834d48b09d940591d3e76a&cid=9004035080&filmId=71264&filmName=触碰你&tokentype=ANDT&sourceid=012010&channelId=MGYYB000008",
                "filmName": "触碰你",
                "imgUrl": "https://wapx.cmvideo.cn/publish/oes-content/images/9004/035/080/9004035080/202504141114_786358_HSJ720V.jpg",
                "score": "8.5"
            },
            {
                "filmDetailUrl": "https://movie.miguvideo.com/mgyy/site/prd/detail.html?pageId=138b3f0226834d48b09d940591d3e76a&cid=9004034048&filmId=71233&filmName=此心安处&tokentype=ANDT&sourceid=012010&channelId=MGYYB000008",
                "filmName": "此心安处",
                "imgUrl": "https://wapx.cmvideo.cn/publish/oes-content/images/9004/034/048/9004034048/202503191133_335619_HSJ720V.jpg",
                "score": "8.7"
            },
            {
                "filmDetailUrl": "https://movie.miguvideo.com/mgyy/site/prd/detail.html?pageId=138b3f0226834d48b09d940591d3e76a&cid=9004032505&filmId=71181&filmName=猫猫的奇幻漂流&tokentype=ANDT&sourceid=012010&channelId=MGYYB000008",
                "filmName": "猫猫的奇幻漂流",
                "imgUrl": "https://wapx.cmvideo.cn/publish/oes-content/images/9004/032/505/9004032505/202501201710_834984_HSJ720V.jpg",
                "score": "9.1"
            },
            {
                "filmDetailUrl": "https://movie.miguvideo.com/mgyy/site/prd/detail.html?pageId=138b3f0226834d48b09d940591d3e76a&cid=9004035799&advanceId=9004035799&filmId=71295&filmName=孤独摇滚（下）&tokentype=ANDT&sourceid=012010&channelId=MGYYB000008",
                "filmName": "孤独摇滚（下）",
                "imgUrl": "https://wapx.cmvideo.cn/publish/oes-content/images/9004/035/799/9004035799/202504301400_718695_HSJ720V.jpg",
                "score": "9.1"
            },
            {
                "filmDetailUrl": "https://movie.miguvideo.com/mgyy/site/prd/detail.html?pageId=138b3f0226834d48b09d940591d3e76a&cid=9004034377&advanceId=9004034377&filmId=71243&filmName=水饺皇后&tokentype=ANDT&sourceid=012010&channelId=MGYYB000008",
                "filmName": "水饺皇后",
                "imgUrl": "https://wapx.cmvideo.cn/publish/oes-content/images/9004/034/377/9004034377/202505130939_202105_HSJ720V.jpg",
                "score": "8.8"
            }
        ]
    }
}

// 精选推荐长图-前端资源数据
const rectangleData = [
    {
        "remark": null,
        "title": "蓝宝爱心站",
        "subTitle": null,
        "provCode": null,
        "pageCode": null,
        "docId": null,
        "iconUrl": "lbaxz.png",
        "linkAddressUrl": "https://gongyi.coc.10086.cn/charity/open-frontend/wap/index.html#/farm?sspid=GY00001",
        "dataType": 1
    },
    {
        "remark": null,
        "title": "免费领50G流量",
        "subTitle": null,
        "provCode": null,
        "pageCode": null,
        "docId": null,
        "iconUrl": "mfl50gll.png",
        "linkAddressUrl": "https://plus.migu.cn/c/0fno9s",
        "dataType": 1
    },
    {
        "remark": null,
        "title": "100+APP专属流量",
        "subTitle": null,
        "provCode": null,
        "pageCode": null,
        "docId": null,
        "iconUrl": "100appzsll.png",
        "linkAddressUrl": "https://dev.coc.10086.cn/coc/web2/quickreleaseplatformH5/danfaModule?pageId=1473947632963788800&channelId=P00000042298",
        "dataType": 1
    },
    {
        "remark": null,
        "title": "24个月视频会员+超大流量",
        "subTitle": null,
        "provCode": null,
        "pageCode": null,
        "docId": null,
        "iconUrl": "24gysphy.png",
        "linkAddressUrl": "https://dev.coc.10086.cn/coc/web2/quickreleaseplatformH5/danfaModule?pageId=1917046048545558528&channelId=P00000042298",
        "dataType": 1
    },
    {
        "remark": null,
        "title": "万能家庭副卡",
        "subTitle": null,
        "provCode": null,
        "pageCode": null,
        "docId": null,
        "iconUrl": "wnjtfk.png",
        "linkAddressUrl": "https://dev.coc.10086.cn/coc2/web-kataobao2/ktb-web-cutecard/index.html?pageId=1532257384428081152&channelId=P00000042298",
        "dataType": 1
    },
    {
        "remark": null,
        "title": "签到有礼",
        "subTitle": null,
        "provCode": null,
        "pageCode": null,
        "docId": null,
        "iconUrl": "qdyl.png",
        "linkAddressUrl": "https://wx.10086.cn/qwhdhub/qwhdmark/1021122301?channelId=P00000122940",
        "dataType": 1
    },
]

// 周三充值日
const zsczData = {
    "remark": null,
    "title": "周三充值日",
    "subTitle": null,
    "provCode": null,
    "pageCode": null,
    "docId": null,
    "iconUrl": "zsczr.png",
    "linkAddressUrl": "https://wx.10086.cn/hlwyxhdhub/act-wedrecharge/index.html?pageId=1849008675699650560&channelId=P00000005603",
    "dataType": 1
}

// 客群数据
const kequnData = {
    "remark": null,
    "title": "29元80GB大流量卡",
    "subTitle": null,
    "provCode": null,
    "pageCode": null,
    "docId": null,
    "iconUrl": "29y80gdll.png",
    "linkAddressUrl": "https://dev.coc.10086.cn/coc/web2/quickreleaseplatformH5/danfaModule?pageId=1846004209371983872&channelId=P00000042298",
    "dataType": 1
}

export {
    ActivePhoneList,
    HomeNewPhoneList,
    rmssData,
    jxtjData,
    rectangleData,
    zsczData,
    kequnData,
    jcnrData,
    jxtjDataNew,
    zbshData
};