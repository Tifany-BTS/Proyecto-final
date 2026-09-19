interface Window {
  mixpanel?: {
    track: (event: string, properties?: Record<string, unknown>, callback?: () => void) => void;
    get_distinct_id?: () => string;
    get_config?: (key: string) => unknown;
  };
}

function pbTrack(event: string, properties?: Record<string, unknown>, callback?: () => void): void {
  if (window.mixpanel) {
    window.mixpanel.track(event, properties, callback);
  } else {
    callback?.();
  }
}

// mixpanel.track() only queues the event — the SDK's own timer decides when
// to actually send it, on the order of several seconds later. That's fine
// for a normal click, but not before a same-tab redirect (e.g. right after
// login/registro), since the page can unload before that timer ever fires
// and the event is silently dropped. This sends a duplicate copy straight to
// Mixpanel's HTTP API via sendBeacon, which is guaranteed to be handed off
// to the browser before the current task ends, so it survives the redirect.
// Token must match the one in the mixpanel.init(...) snippet in <head>.
const PB_MIXPANEL_TOKEN = "5527143090a1745ffa4d53ac5b917d31";

function pbTrackBeforeNavigate(event: string, properties?: Record<string, unknown>): void {
  pbTrack(event, properties);

  const mp = window.mixpanel;
  if (!mp || typeof mp.get_distinct_id !== "function" || typeof navigator.sendBeacon !== "function") return;

  const token = (typeof mp.get_config === "function" ? mp.get_config("token") : undefined) || PB_MIXPANEL_TOKEN;
  const payload = [
    {
      event,
      properties: {
        ...properties,
        token,
        distinct_id: mp.get_distinct_id(),
        $current_url: window.location.href,
        time: Date.now() / 1000,
      },
    },
  ];

  const body = new Blob([`data=${encodeURIComponent(JSON.stringify(payload))}`], {
    type: "application/x-www-form-urlencoded",
  });
  navigator.sendBeacon("https://api-js.mixpanel.com/track/?ip=1", body);
}
