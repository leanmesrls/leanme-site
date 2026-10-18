"use client";

import { useEffect } from "react";

const GA_MEASUREMENT_ID = "G-P14BX6QJVW";
const FB_APP_ID = "966113220530889";

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbAsyncInit?: () => void;
  FB?: {
    init: (config: {
      appId: string;
      cookie: boolean;
      xfbml: boolean;
      version: string;
    }) => void;
    AppEvents: { logPageView: () => void };
  };
};

export function GoogleAnalytics() {
  useEffect(() => {
    const w = window as AnalyticsWindow;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    w.dataLayer = w.dataLayer || [];
    w.gtag = function gtag() {
      w.dataLayer?.push(arguments);
    };
    w.gtag("js", new Date());
    w.gtag("config", GA_MEASUREMENT_ID);
  }, []);

  return null;
}

export function MetaAnalytics() {
  useEffect(() => {
    const w = window as AnalyticsWindow;
    w.fbAsyncInit = () => {
      w.FB?.init({
        appId: FB_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
      w.FB?.AppEvents.logPageView();
    };

    const id = "facebook-jssdk";
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.src = "https://connect.facebook.net/it_IT/sdk.js";
    document.body.appendChild(script);
  }, []);

  return null;
}
