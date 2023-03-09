import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.MIXPANEL_PROJECT_TOKEN);

export const Mixpanel = {
    track: (name, props) => {
    mixpanel.track(name, props);
    },
    track_links: (query, eventName) => {
        mixpanel.track_links(query, eventName, {
            clickedUrl: document.URL,
        });
    },
}