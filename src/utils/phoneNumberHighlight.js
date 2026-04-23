const phoneNumberHighlightMap = [
  { "tagCategory": "发达号", "highRule": "尾号919", "tagId": "4025", "regex": /919$/ },
  { "tagCategory": "发达号", "highRule": "尾号819", "tagId": "4024", "regex": /819$/ },
  { "tagCategory": "发达号", "highRule": "尾号619", "tagId": "4023", "regex": /619$/ },
  { "tagCategory": "发达号", "highRule": "尾号519", "tagId": "4022", "regex": /519$/ },
  { "tagCategory": "发达号", "highRule": "尾号916", "tagId": "4021", "regex": /916$/ },
  { "tagCategory": "发达号", "highRule": "尾号816", "tagId": "4020", "regex": /816$/ },
  { "tagCategory": "发达号", "highRule": "尾号616", "tagId": "4019", "regex": /616$/ },
  { "tagCategory": "发达号", "highRule": "尾号516", "tagId": "4018", "regex": /516$/ },
  { "tagCategory": "发达号", "highRule": "尾号918", "tagId": "4017", "regex": /918$/ },
  { "tagCategory": "发达号", "highRule": "尾号818", "tagId": "4016", "regex": /818$/ },
  { "tagCategory": "发达号", "highRule": "尾号618", "tagId": "4015", "regex": /618$/ },
  { "tagCategory": "发达号", "highRule": "尾号518", "tagId": "4014", "regex": /518$/ },
  { "tagCategory": "发达号", "highRule": "尾号889", "tagId": "3013", "regex": /889$/ },
  { "tagCategory": "发达号", "highRule": "尾号669", "tagId": "3012", "regex": /669$/ },
  { "tagCategory": "发达号", "highRule": "尾号996", "tagId": "3011", "regex": /996$/ },
  { "tagCategory": "发达号", "highRule": "尾号886", "tagId": "3010", "regex": /886$/ },
  { "tagCategory": "发达号", "highRule": "尾号998", "tagId": "3009", "regex": /998$/ },
  { "tagCategory": "发达号", "highRule": "尾号668", "tagId": "3008", "regex": /668$/ },
  { "tagCategory": "发达号", "highRule": "包含998", "tagId": "3007", "regex": /998/ },
  { "tagCategory": "发达号", "highRule": "包含988", "tagId": "3006", "regex": /988/ },
  { "tagCategory": "发达号", "highRule": "包含688", "tagId": "3005", "regex": /688/ },
  { "tagCategory": "发达号", "highRule": "包含588", "tagId": "3004", "regex": /588/ },
  { "tagCategory": "发达号", "highRule": "包含188", "tagId": "3003", "regex": /188/ },
  { "tagCategory": "发达号", "highRule": "包含866", "tagId": "3002", "regex": /866/ },
  { "tagCategory": "发达号", "highRule": "包含668", "tagId": "3001", "regex": /668/ },
  { "tagCategory": "发达号", "highRule": "包含5656", "tagId": "2012", "regex": /5656/ },
  { "tagCategory": "发达号", "highRule": "包含1616", "tagId": "2011", "regex": /1616/ },
  { "tagCategory": "发达号", "highRule": "包含7878", "tagId": "2009", "regex": /7878/ },
  { "tagCategory": "发达号", "highRule": "包含6868", "tagId": "2008", "regex": /6868/ },
  { "tagCategory": "发达号", "highRule": "尾号899", "tagId": "1027", "regex": /899$/ },
  { "tagCategory": "发达号", "highRule": "尾号699", "tagId": "1026", "regex": /699$/ },
  { "tagCategory": "发达号", "highRule": "尾号988", "tagId": "1025", "regex": /988$/ },
  { "tagCategory": "发达号", "highRule": "尾号688", "tagId": "1024", "regex": /688$/ },
  { "tagCategory": "发达号", "highRule": "尾号588", "tagId": "1023", "regex": /588$/ },
  { "tagCategory": "发达号", "highRule": "尾号188", "tagId": "1022", "regex": /188$/ },
  { "tagCategory": "发达号", "highRule": "尾号966", "tagId": "1021", "regex": /966$/ },
  { "tagCategory": "发达号", "highRule": "尾号866", "tagId": "1020", "regex": /866$/ },
  { "tagCategory": "发达号", "highRule": "包含8686", "tagId": "2013", "regex": /8686/ },
  { "tagCategory": "发达号", "highRule": "包含9898", "tagId": "2010", "regex": /9898/ },
  { "tagCategory": "发达号", "highRule": "尾号9898", "tagId": "1012", "regex": /9898$/ },
  { "tagCategory": "发达号", "highRule": "尾号7878", "tagId": "1011", "regex": /7878$/ },
  { "tagCategory": "发达号", "highRule": "尾号6868", "tagId": "1010", "regex": /6868$/ },
  { "tagCategory": "发达号", "highRule": "尾号5858", "tagId": "1009", "regex": /5858$/ },
  { "tagCategory": "发达号", "highRule": "包含5858", "tagId": "2007", "regex": /5858/ },
  { "tagCategory": "发达号", "highRule": "包含1818", "tagId": "2006", "regex": /1818/ },
  { "tagCategory": "发达号", "highRule": "尾号1818", "tagId": "1008", "regex": /1818$/ },
  { "tagCategory": "吉祥号", "highRule": "尾号3344", "tagId": "1007", "regex": /3344$/ },
  { "tagCategory": "吉祥号", "highRule": "尾部ABAB，如1616，2323", "tagId": "1005", "regex": /(\d)(\d)\1\2$/ },
  { "tagCategory": "吉祥号", "highRule": "尾部ABBA，如1331，2552", "tagId": "1004", "regex": /(\d)(\d)\2\1$/ },
  { "tagCategory": "吉祥号", "highRule": "尾部A9，A不等于4", "tagId": "4006", "regex": /([0-35-9])9$/ },
  { "tagCategory": "吉祥号", "highRule": "尾部A8，A不等于4", "tagId": "4005", "regex": /([0-35-9])8$/ },
  { "tagCategory": "吉祥号", "highRule": "尾部A6，A不等于4", "tagId": "4004", "regex": /([0-35-9])6$/ },
  { "tagCategory": "吉祥号", "highRule": "内含AA", "tagId": "4003", "regex": /(\d)\1/ },
  { "tagCategory": "吉祥号", "highRule": "尾部AAB，A,B除4", "tagId": "3014", "regex": /([0-35-9])\1([0-35-9])$/ },
  { "tagCategory": "吉祥号", "highRule": "内含ABC递增或递减", "tagId": "2014", "regex": /(?:012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210)/ },
  { "tagCategory": "吉祥号", "highRule": "内含ABAB", "tagId": "2005", "regex": /(\d)(\d)\1\2/ },
  { "tagCategory": "吉祥号", "highRule": "包含3344", "tagId": "2004", "regex": /3344/ },
  { "tagCategory": "吉祥号", "highRule": "内含AABB，6、8、9", "tagId": "2003", "regex": /([689])\1([689])\2/ },
  { "tagCategory": "吉祥号", "highRule": "内含AABB", "tagId": "2002", "regex": /(\d)\1(\d)\2/ },
  { "tagCategory": "吉祥号", "highRule": "内含AAA", "tagId": "2001", "regex": /(\d)\1\1/ },
  { "tagCategory": "吉祥号", "highRule": "尾部AA，且A=6、8、9", "tagId": "1019", "regex": /([689])\1$/ },
  { "tagCategory": "吉祥号", "highRule": "尾部AA", "tagId": "1018", "regex": /(\d)\1$/ },
  { "tagCategory": "吉祥号", "highRule": "尾部ABC,ABC为递增或递减", "tagId": "1013", "regex": /(?:012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210)$/ },
  { "tagCategory": "吉祥号", "highRule": "尾部AAAB", "tagId": "1006", "regex": /(\d)\1\1([0-9])$/ },
  { "tagCategory": "生日号", "highRule": "区间1201-1231", "tagId": "5022", "regex": /12(?:0[1-9]|1\d|2\d|30|31)/ },
  { "tagCategory": "生日号", "highRule": "区间1101-1130", "tagId": "5021", "regex": /11(?:0[1-9]|1\d|2\d|30)/ },
  { "tagCategory": "生日号", "highRule": "区间1001-1031", "tagId": "5020", "regex": /10(?:0[1-9]|1\d|2\d|30|31)/ },
  { "tagCategory": "生日号", "highRule": "区间0901-0930", "tagId": "5019", "regex": /09(?:0[1-9]|1\d|2\d|30)/ },
  { "tagCategory": "生日号", "highRule": "区间0801-0831", "tagId": "5018", "regex": /08(?:0[1-9]|1\d|2\d|30|31)/ },
  { "tagCategory": "生日号", "highRule": "区间0701-0731", "tagId": "5017", "regex": /07(?:0[1-9]|1\d|2\d|30|31)/ },
  { "tagCategory": "生日号", "highRule": "区间0601-0630", "tagId": "5016", "regex": /06(?:0[1-9]|1\d|2\d|30)/ },
  { "tagCategory": "生日号", "highRule": "区间0501-0531", "tagId": "5015", "regex": /05(?:0[1-9]|1\d|2\d|30|31)/ },
  { "tagCategory": "生日号", "highRule": "区间0401-0430", "tagId": "5014", "regex": /04(?:0[1-9]|1\d|2\d|30)/ },
  { "tagCategory": "生日号", "highRule": "区间0301-0331", "tagId": "5013", "regex": /03(?:0[1-9]|1\d|2\d|30|31)/ },
  { "tagCategory": "生日号", "highRule": "区间0201-0229", "tagId": "5012", "regex": /02(?:0[1-9]|1\d|2[0-9])/ },
  { "tagCategory": "生日号", "highRule": "区间0101-0131", "tagId": "5011", "regex": /01(?:0[1-9]|1\d|2\d|30|31)/ },
  { "tagCategory": "心动号", "highRule": "包含920", "tagId": "1033", "regex": /920/ },
  { "tagCategory": "心动号", "highRule": "包含7758", "tagId": "1034", "regex": /7758/ },
  { "tagCategory": "心动号", "highRule": "包含521", "tagId": "5024", "regex": /521/ },
  { "tagCategory": "心动号", "highRule": "包含520", "tagId": "5023", "regex": /520/ },
  { "tagCategory": "心动号", "highRule": "尾号521", "tagId": "4013", "regex": /521$/ },
  { "tagCategory": "心动号", "highRule": "尾号520", "tagId": "4012", "regex": /520$/ },
  { "tagCategory": "心动号", "highRule": "包含520", "tagId": "1032", "regex": /520/ },
  { "tagCategory": "心动号", "highRule": "尾号8983", "tagId": "4031", "regex": /8983$/ },
  { "tagCategory": "心动号", "highRule": "尾号7758", "tagId": "4030", "regex": /7758$/ },
  { "tagCategory": "心动号", "highRule": "尾号512", "tagId": "4011", "regex": /512$/ },
  { "tagCategory": "心动号", "highRule": "尾号511", "tagId": "4010", "regex": /511$/ },
  { "tagCategory": "心动号", "highRule": "尾号510", "tagId": "4009", "regex": /510$/ },
  { "tagCategory": "心动号", "highRule": "尾号121", "tagId": "4008", "regex": /121$/ },
  { "tagCategory": "心动号", "highRule": "尾号120", "tagId": "4007", "regex": /120$/ },
  { "tagCategory": "心动号", "highRule": "包含1314", "tagId": "5025", "regex": /1314/ },
  { "tagCategory": "心动号", "highRule": "尾号1314", "tagId": "4026", "regex": /1314$/ },
  { "tagCategory": "心动号", "highRule": "包含1314", "tagId": "1031", "regex": /1314/ },
  { "tagCategory": "心动号", "highRule": "尾号5230", "tagId": "4029", "regex": /5230$/ },
  { "tagCategory": "心动号", "highRule": "尾号2014", "tagId": "4028", "regex": /2014$/ },
  { "tagCategory": "心动号", "highRule": "尾号2013", "tagId": "4027", "regex": /2013$/ },
  { "tagCategory": "学霸号", "highRule": "尾号211", "tagId": "4002", "regex": /211$/ },
  { "tagCategory": "学霸号", "highRule": "尾号985", "tagId": "4001", "regex": /985$/ },
  { "tagCategory": "学霸号", "highRule": "包含211", "tagId": "1036", "regex": /211/ },
  { "tagCategory": "学霸号", "highRule": "包含985", "tagId": "1035", "regex": /985/ }
];

function checkPhoneNumberMatch(phoneNumber, regex) {
  try {
    const match = regex.exec(phoneNumber);
    if (match) {
      return {
        matchedText: match[0],       // 匹配到的文本
        startIndex: match.index,     // 匹配开始位置
        endIndex: match.index + match[0].length - 1  // 匹配结束位置
      };
    } else {
      return null;  // 不匹配时返回 null
    }
  } catch (error) {
    console.log(error);
    return null
  }
}

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const checkHighlightNumber = (numberItem, userInfo = {}) => {
  let regex = ''
  const { tagId = '', tagCategory = '', number = '' } = numberItem
  if (tagCategory === '家乡号' && userInfo.loginCity) {
    const city = String(userInfo.loginCity).trim();
    try {
      const escaped = escapeRegExp(city);
      regex = new RegExp(escaped); // 例如 city="123" -> /123/
      console.log('构造家乡号正则成功', regex);
    } catch (e) {
      console.warn('构造家乡号正则失败', e);
      regex = null;
    }
  }else if (tagCategory && tagId){
    regex = phoneNumberHighlightMap.find(item => {
      return item.tagCategory === tagCategory && item.tagId === tagId
    })?.regex
  }
  
  return checkPhoneNumberMatch(number, regex)
}