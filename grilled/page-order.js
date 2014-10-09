var pages = [
    { title: 'Before You Start', url: '/before-you-start/' },
    { title: 'Tune in to Your Reader', url: '/before-you-start/tune-in-to-your-reader/' },
    { title: 'Choose a Perspective: 1st, 2nd, or 3rd Person', url: '/before-you-start/narrative-perspective/' },
    { title: 'Make Your Verbs Work', url: '/before-you-start/make-your-verbs-work/' },
    { title: 'Tone of Voice', url: '/tone-of-voice/' },
    { title: 'Style', url: '/style/' },
    { title: 'Keep it Simple. Get Rid of Clutter.', url: '/make-your-writing-easy-to-read/keep-it-simple-get-rid-of-clutter/' },
    { title: 'Write. Read. Rewrite. Repeat.', url: '/make-your-writing-easy-to-read/write-read-rewrite-repeat/' },
    { title: 'Different Types of Content', url: '/different-types-of-content/' },
    { title: 'Client Stories', url: '/different-types-of-content/client-stories/' },
    { title: 'Insights Posts', url: '/different-types-of-content/insights-posts/' },
    { title: 'Landing Pages', url: '/different-types-of-content/landing-pages/' },
    { title: 'Marketing Emails', url: '/different-types-of-content/marketing-emails/' },
    { title: 'Website Copy', url: '/different-types-of-content/website-copy/' },
    { title: 'Tools and Recommended Reading', url: '/tools-and-recommended-reading/' },
    { title: 'ThoughtWorks Specifics', url: '/about/thoughtworks-specifics/' }

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
    },
    indexOfURL: function(url) {
        for (var i = pages.length - 1; i >= 0; i--) {
            if (pages[i].url.indexOf(url) > -1) {
                return pages[i].url;
            }
        }
        return false;
    }
};
