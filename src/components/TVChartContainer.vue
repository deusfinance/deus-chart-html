<template>
  <div class="TVChartContainer" :id="containerId" />
</template>

<script>
import { widget } from "../charting_library.min";

function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export default {
  name: "TVChartContainer",
  tvWidget: null,
  data() {
    return {
      containerId: "tv_chart_container",
    };
  },
  mounted() {
    const widgetOptions = {
      symbol: "deus/eth",
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
        process.env.VUE_APP_DATAFEED_URL
      ),
      interval: "60m",
      container_id: "tv_chart_container",
      library_path: "/charting_library/",

      locale: getLanguageFromURL() || "en",
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_api_version: "1.1",
      client_id: "DEUS",
      user_id: "public_user_id",
      fullscreen: true,
      autosize: true,
      theme: "Dark",
    };

    const tvWidget = new widget(widgetOptions);
    this.tvWidget = tvWidget;

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        const button = tvWidget.createButton();

        button.setAttribute("title", "Click to show a notification popup");
        button.classList.add("apply-common-tooltip");

        button.addEventListener("click", () =>
          tvWidget.showNoticeDialog({
            title: "Notification",
            body: "TradingView Charting Library API works correctly",
            callback: () => {
              // eslint-disable-next-line no-console
              console.log("Noticed!");
            },
          })
        );

        button.innerHTML = "Check API";
      });
    });
  },
  destroyed() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  },
};
</script>

<style lang="scss" scoped>
.TVChartContainer {
  height: 100vh;
}
</style>
