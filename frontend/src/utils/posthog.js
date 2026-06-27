let isInitialized = false;

/**
 * Initializes PostHog analytics using the official CDN loader snippet.
 * This keeps the website completely decoupled from npm package dependencies, 
 * avoiding bundle bloat and ensuring the website builds and functions 
 * perfectly even without the library installed or if it fails to load.
 * 
 * Enabled features:
 * - Web Analytics (Pageviews, UTMs, referrer, etc.)
 * - Autocapture (Click & form submission events)
 * - Session Replay (User session recording)
 * - Heatmaps (Toolbar integrations)
 * - Web Vitals (FCP, LCP, INP, CLS, TTFB performance tracking)
 */
export const initPostHog = () => {
  if (isInitialized) return;

  const token = import.meta.env.VITE_POSTHOG_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

  if (!token) {
    console.warn('[PostHog] VITE_POSTHOG_KEY environment variable is not defined. Analytics is disabled.');
    return;
  }

  try {
    // Official PostHog asynchronous script injection snippet (CDN Loader)
    (function(t, e) {
      var o, n, p, r;
      e.__SV || (window.posthog && window.posthog.__loaded) || (
        window.posthog = e,
        e._i = [],
        e.init = function(i, s, a) {
          function g(t, e) {
            var o = e.split(".");
            2 === o.length && (t = t[o[0]], e = o[1]);
            t[e] = function() {
              t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
            };
          }
          (p = t.createElement("script")).type = "text/javascript";
          p.crossOrigin = "anonymous";
          p.async = true;
          // Dynamically fetch the latest client-side recording and capture script from PostHog assets
          p.src = s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js";
          (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r);
          var u = e;
          for (void 0 !== a ? u = e[a] = [] : a = "posthog", u.people = u.people || [], u.toString = function(t) {
            var e = "posthog";
            return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e;
          }, u.people.toString = function() {
            return u.toString(1) + ".people (stub)";
          }, u.o = function(t, e) {
            u[e] = function() {
              u.push([t].concat(Array.prototype.slice.call(arguments, 0)));
            };
          }, o = [
            "capture", "identify", "alias", "people.set", "people.set_once", "people.posthog.set_province",
            "people.increment", "people.append", "people.union", "people.track_charge", "people.clear_charges",
            "people.delete_user", "people.remove", "opt_in_capturing", "opt_out_capturing", "has_opted_in_capturing",
            "has_opted_out_capturing", "clear_opt_in_out_capturing", "debug", "get_property", "getSessionProperty",
            "get_distinct_id", "get_sid", "get_groups", "get_session_replay_url", "reloadFeatureFlags",
            "get_feature_flag", "get_feature_flag_payload", "is_feature_enabled", "register", "register_once",
            "unregister", "set_config", "reset", "person_defined", "onFeatureFlags", "get_surveys",
            "get_active_surveys", "render_survey", "click_survey", "dismiss_survey", "set_person", "add_group",
            "remove_group", "track_pageview", "track_events", "track_group_analytics", "get_session_id",
            "set_group", "get_session_replay_url"
          ], n = 0; n < o.length; n++) g(u, o[n]);
          e._i.push([i, s, a]);
        },
        e.__SV = 1
      );
    })(document, window.posthog || []);

    window.posthog.init(token, {
      api_host: host,
      autocapture: true,
      capture_pageview: true,
      capture_performance: true, // Captures Web Vitals (FCP, LCP, INP, CLS, TTFB)
      enable_session_recording: true, // Enables Session Replay & Heatmaps
      session_recording: {
        maskAllInputs: false, // Record form interaction for UX/usability details
        maskInputOptions: {
          password: true, // Automatically mask password inputs
        },
      },
      persistence: 'localStorage',
    });
    isInitialized = true;
    console.log('[PostHog] Initialized successfully via CDN.');
  } catch (err) {
    console.error('[PostHog] Failed to initialize PostHog:', err);
  }
};

/**
 * Identify an authenticated user.
 */
export const identifyUser = (userId, email, properties = {}) => {
  if (!isInitialized || !window.posthog) return;
  try {
    window.posthog.identify(userId, {
      email,
      ...properties,
    });
  } catch (err) {
    console.warn('[PostHog] Failed to identify user:', err);
  }
};

/**
 * Capture custom events with relevant contextual properties.
 */
export const captureEvent = (eventName, properties = {}) => {
  if (!isInitialized || !window.posthog) return;
  try {
    window.posthog.capture(eventName, properties);
  } catch (err) {
    console.warn('[PostHog] Failed to capture event:', err);
  }
};

/**
 * Clear user state on logout.
 */
export const resetUser = () => {
  if (!isInitialized || !window.posthog) return;
  try {
    window.posthog.reset();
  } catch (err) {
    console.warn('[PostHog] Failed to reset user:', err);
  }
};
