var pages = [
    { title: 'Before You Start Writing', url: '/before-you-start-writing/' },
    { title: 'Audience', url: '/before-you-start-writing/audience/' },
    { title: 'Narrative Perspective', url: '/before-you-start-writing/narrative-perspective/' },
    // { title: 'Verb Tense', url: '' },
    { title: 'Tone of Voice', url: '/tone-of-voice/' },
    { title: 'Style', url: '/style/' },
    { title: 'Simplicity and Clutter', url: '/simplicity-and-clutter/' },
    // { title: 'Prepositions draped onto verbs', url: '' },
    // { title: 'Adjectives and Adverbs that don\'t add anything', url: '' },
    // { title: 'Passive verbs that can be made active', url: '' },
    // { title: 'Phrases can be replaced with short words', url: '' },
    // { title: 'Big words when small ones will do', url: '' },
    // { title: 'Long paragraphs and sentences when short ones will do', url: '' },
    { title: 'Never Stop Rewriting', url: '/never-stop-rewriting/' },
    { title: 'Writing for Different Types of Content', url: '/writing-for-different-types-of-content/' },
    { title: 'Client Stories', url: '/writing-for-different-types-of-content/client-stories/' },
    { title: 'Insights Posts', url: '/writing-for-different-types-of-content/insights-posts/' },
    { title: 'Landing Pages', url: '/writing-for-different-types-of-content/landing-pages/' },
    { title: 'Marketing Emails', url: '/writing-for-different-types-of-content/marketing-emails/' },
    { title: 'Website Copy', url: '/writing-for-different-types-of-content/website-copy/' },
    { title: 'Common Personas', url: '/common-personas/' },
    { title: 'Tools and Recommended Reading', url: '/tools-and-recommended-reading/' }
];

module.exports = {
    indexOf: function(title) {
        for (var i = pages.length - 1; i >= 0; i--) {
            if (pages[i].title == title) {
                return i;
            }
        }

        return false;
    },
    linkAt: function(index) {
        if (index < 0 || index > pages.length - 1) {
            return false;
        }

        return pages[index];
    }
};
