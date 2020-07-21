var CountConfig = [
    { "table": "sys_dictionary", "field": "reference", "title": "Dictionary" },
    { "table": "item_option_new", "field": "reference", "title": "Variables" },
    { "table": "sys_script", "field": "collection", "title": "Business Rules" },
    { "table": "sys_script_client", "field": "table", "title": "Client Scripts" },
    { "table": "sys_dictionary", "field": "name", "title": "Dictionary Entries" },
    { "table": "sys_dictionary_override", "field": "name", "title": "Dictionary Overrides" },
    // { "table": "sysevent_email_action", "field": "collection ", "title": "Notifications", "query": "" },
    { "table": "sys_ui_action", "field": "table", "title": "UI Actions" },
    { "table": "sys_security_acl", "field": "name", "title": "ACL", "query": "STARTSWITH" },
    { "table": "sys_ui_policy", "field": "table", "title": "UI Policies",  },
    { "table": "sys_data_policy2", "field": "model_table", "title": "Data Policy" },
    { "table": "sys_ui_style", "field": "name", "title": "Styles" },
    { "table": "sysrule_view", "field": "table", "title": "View Rules" },
    { "table": "wf_workflow", "field": "table", "title": "Workflows" },
    { "table": "sys_hub_flow", "field": "sys_id", "title": "Flows", "query": "", "query_field":"sys_id" },
];

/* build array of titles */
var titles = CountConfig.map(function(obj) {
    return obj.title;
});

gs.print("Table" + "," + titles.join(','));

var grTables = new GlideRecord('sys_db_object');
// only include tables who's name starts with u_, but exclude m2m and Import Set Rows
grTables.addEncodedQuery('nameSTARTSWITHu_^nameNOT LIKEm2m^super_class!=ad02ce0237023100b93bd5c543990e6a');
grTables.query();
while (grTables.next()) {

    var reference_count = [];

    CountConfig.forEach(function (element) {
        var query_type = element['query'] ? element['query'] : "=";
        var query_field = element['query_field'] ? element['query_field'] : 'name';

        var gaReference = new GlideAggregate(element.table);
        gaReference.addAggregate('COUNT');
        gaReference.addQuery(element.field, query_type, grTables.getValue(query_field));
        gaReference.query();
        if (gaReference.next()) {
            reference_count.push(gaReference.getAggregate('COUNT'));
        } else {
            reference_count.push(0);
        }
    });

    gs.print(grTables.getDisplayValue() + " [" + grTables.getValue('name') + "]," + reference_count.join(','));

}
