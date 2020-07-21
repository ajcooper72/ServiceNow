var SearchConfig = [
    { "title": "Script Include", "table": "sys_script_include", "search_fields": ["script"] },
    { "title": "Client Script", "table": "sys_script_client", "search_fields": ["script"] },
    { "title": "Widget", "table": "sp_widget", "search_fields": ["script", "client_script"] },
    { "title": "Business Rule", "table": "sys_script", "search_fields": ["script", "condition"] },
];

var regex = new RegExp(/["'][\d\w]{32}["']/g);

SearchConfig.forEach(function (searchConfig) {
    var grSearch = new GlideRecord(searchConfig.table);
    grSearch.addActiveQuery();
    grSearch.query();
    while (grSearch.next()) {

        searchConfig.search_fields.forEach(function (search_field) {
            var field_value = '' + grSearch.getValue(search_field);
            var matches = field_value.match(regex);
            if (matches) {
                var filtered_matches = [];
                matches.forEach(function (match) {
                    var regex_2 = new RegExp(/[\d]{1,}/g);
                    if (match.match(regex_2)) filtered_matches.push(match);
                });
                if (filtered_matches.length > 0) gs.print("[" + searchConfig.title + "] " + grSearch.name + ": " + search_field + " (" + filtered_matches + ")");

            }
        });
    }
}); 
