<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';
  import SocketService from '/@/utils/http/websocket';

  // support Multi-language
  const { getAntdLocale } = useLocale();
  const data = <any>{
    socketServe: SocketService.Instance,
  };
  SocketService.Instance.connect();
  data.socketServe = SocketService.Instance;
  data.socketServe.registerCallBack('callback1', data.socketServe);
  const sendData = () => {
    data.socketServe.send('发送数据');
    console.log('发送数据');
  };

  // Listening to page changes and dynamically changing site titles
  useTitle();
  sendData();
</script>
