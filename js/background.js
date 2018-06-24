(function (chrome) {
    const testSitemapUrl = 'https://www.google.com/business/sitemap.xml';
    let sitemapContent;

    function sendRequest(url, callback) {
        var xhr = new XMLHttpRequest();

        xhr.open("GET", url, true);

        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(xhr.responseText);
                    //console.log(xhr.responseText);
                } else {
                    //console.error(xhr.statusText);
                }
            }
        };

        xhr.send();

        //callback(xhr.responseText);

        //var result = xhr.responseText;
    }

    function getSuggestionsByUrl(text) {
        return [
            'https://www.google.com/',
        ];
    }

    chrome.omnibox.onInputStarted.addListener(function (suggest) {
        sendRequest(testSitemapUrl, function (data) {
            sitemapContent = data;
            console.log(sitemapContent);
        });
    });
    
    chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
        /*let customSuggestion = {
            description: text
        };

        chrome.omnibox.setDefaultSuggestion(customSuggestion);*/

        // Add suggestions to an array
        let suggestionsList = getSuggestionsByUrl(text);
        let suggestions = [];
        if (suggestionsList) {
            for (let key in suggestionsList) {
                suggestions.push({
                    content: suggestionsList[key],
                    description: suggestionsList[key]
                });
            }
        }


        // Suggest the remaining suggestions
        suggest(suggestions);
    });

    chrome.omnibox.onInputEntered.addListener(
        function(text) {
            chrome.tabs.getSelected(function (tab) {
                chrome.tabs.update(tab.id, {url: text});
            });
        }
    );
})(chrome);
