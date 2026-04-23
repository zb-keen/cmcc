<template>

  <div style="overflow:auto;height:100%">
      <van-field
        v-model="message1"
        rows="1"
        autosize
        label=""
        type="textarea"
        placeholder="请输入明文或密文"
      />
      <div class="operator">
        <van-button type="primary" size="mini" @click="encrypt()">加密</van-button>
        <van-button type="primary" size="mini" @click="decrypt()">解密</van-button>
      </div>
      <van-field
        v-model="message2"
        rows="1"
        autosize
        label=""
        type="textarea"
        placeholder="加密或解密后字符"
      />
    <h3 class="operator" style="font-size:14px; margin-top: 30px;">url-markName-Base64加密解密</h3>
    <van-field
      v-model="message3"
      rows="1"
      autosize
      label=""
      type="textarea"
      placeholder="请输入明文或密文"
    />
    <div class="operator">
      <van-button type="primary" size="mini" @click="handleBaseEncode()">加密</van-button>
      <van-button type="primary" size="mini" @click="handleBaseDecode()">解密</van-button>
    </div>
    <van-field
      v-model="message4"
      rows="1"
      autosize
      label=""
      type="textarea"
      placeholder="加密或解密后字符"
    />
    <h3 class="operator" style="font-size:14px; margin-top: 30px;">url-keyword-encodeURI加密解密</h3>
    <van-field
      v-model="message5"
      rows="1"
      autosize
      label=""
      type="textarea"
      placeholder="请输入明文或密文"
    />
    <div class="operator">
      <van-button type="primary" size="mini" @click="handleEncode()">加密</van-button>
      <van-button type="primary" size="mini" @click="handleDecode()">解密</van-button>
    </div>
    <van-field
      v-model="message6"
      rows="1"
      autosize
      label=""
      type="textarea"
      placeholder="加密或解密后字符"
    />
  </div>
</template>

<script>
import { Toast } from 'vant'
import { encryptByAES, decryptByAES} from '@/utils/crypto'
let Base64 = require('js-base64').Base64;
export default {
  name:'',
  components: {

  },
  data () {
    return {
      message1: '',
      message2: '',
      message3: '',
      message4: '',
      message5: '',
      message6: ''
    }
  },
  mounted() {

  },
  methods: {
    encrypt(){
      if(this.message1 === ''){
        Toast('请输入明文或密文')
        return
      }
      this.message2 = encryptByAES(this.message1);

    },
    decrypt(){
      if(this.message1 === ''){
        Toast('请输入明文或密文')
        return
      }
      this.message2 = decryptByAES(this.message1);
    },
    handleBaseEncode(){
      if(this.message3 === ''){
        Toast('请输入明文或密文')
        return
      }
      this.message4 =  Base64.encode(this.message3);
    },
    handleBaseDecode(){
      if(this.message3 === ''){
        Toast('请输入明文或密文')
        return
      }
      this.message4 =  Base64.decode(this.message3);
    },
    handleEncode(){
      if(this.message5 === ''){
        Toast('请输入明文或密文')
        return
      }
      this.message6 =  encodeURI(this.message5);
    },
    handleDecode(){
      if(this.message5 === ''){
        Toast('请输入明文或密文')
        return
      }
      this.message6 =  decodeURI(this.message5);
    }
  }
}

</script>
<style scoped lang='scss'>
.operator{
  padding: 30px;
}
::v-deep textarea{
  max-height: 300px;
}
</style>
