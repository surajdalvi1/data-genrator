'use strict';

// Variable Declarations
let _uidSuffix = 0;

class ContentTypeFields {
    constructor() {
        this._schema = [];
    }
    // Single line text field
    singletext() {
        // Contains the name of the field
        let _name = 'singletext';
        // Contains the display name
        let _displayName = `${_name} ${++_uidSuffix}`;
        // Contains the text field uid
        let _uid = `${_name}_${_uidSuffix}`;
        this._schema.push({
            "data_type": "text",
            "display_name": _displayName,
            "uid": _uid,
            "field_metadata": {
                "description": `${_name} description`,
                "placeholder": `${_name} placeholder`,
                "instruction": `${_name} instruction`
            },
            "error_messages": {
                "format": `${_name} error message`
            },
            "mandatory": false,
            "multiple": false
        });
        return this;
    }
    // Multi line text field
    multitext() {
        // Contains the name of the field
        let _name = 'multitext';
        // Contains the display name
        let _displayName = `${_name} ${++_uidSuffix}`;
        // Contains the text field uid
        let _uid = `${_name}_${_uidSuffix}`;
        this._schema.push({
            "data_type": "text",
            "display_name": _displayName,
            "uid": _uid,
            "field_metadata": {
                "description": "",
                "multiline": true
            },
            "error_messages": {
                "format": ""
            }
        });
        return this;
    }
    // Rich Text Editor
    rte() {
        // Contains the name of the field
        let _name = 'rte';
        // Contains the display name
        let _displayName = `${_name} ${++_uidSuffix}`;
        // Contains the text field uid
        let _uid = `${_name}_${_uidSuffix}`;
        this._schema.push({
            "data_type": "text",
            "display_name": _displayName,
            "uid": _uid,
            "field_metadata": {
                "allow_rich_text": true,
                "description": "",
                "multiline": false,
                "rich_text_type": "advanced"
            }
        });
        return this;
    }
    // Markdown editor
    markdown() {
        // Contains the name of the field
        let _name = 'markdown';
        // Contains the display name
        let _displayName = `${_name} ${++_uidSuffix}`;
        // Contains the text field uid
        let _uid = `${_name}_${_uidSuffix}`;
        this._schema.push({
            "data_type": "text",
            "display_name": _displayName,
            "uid": _uid,
            "field_metadata": {
                "description": "",
                "markdown": true
            }
        });
        return this;
    }
    // Dropdown box
    select() {
        // Contains the name of the field
        let _name = 'select';
        // Contains the display name
        let _displayName = `${_name} ${++_uidSuffix}`;
        // Contains the text field uid
        let _uid = `${_name}_${_uidSuffix}`;
        this._schema.push({
            "data_type": "text",
            "display_name": _displayName,
            "display_type": "dropdown",
            "enum": {
                "advanced": false,
                "choices": [{
                    "value": "first"
                }, {
                    "value": "second"
                }]
            },
            "multiple": true,
            "uid": _uid,
            "field_metadata": {
                "description": ""
            }
        });
        return this;
    }
    // Number field
    number() {
        // Contains the name of the field
        let _name = 'number';
        // Contains the display name
        let _displayName = `${_name} ${++_uidSuffix}`;
        // Contains the text field uid
        let _uid = `${_name}_${_uidSuffix}`;
        this._schema.push({
            "data_type": "number",
            "display_name": _displayName,
            "uid": _uid,
            "field_metadata": {
                "description": ""
            }
        });
        return this;
    }
    // Radio button field
    boolean() {
        // Contains the name of the field
        let _name = 'boolean';
        // Contains the display name
        let _displayName = `${_name} ${++_uidSuffix}`;
        // Contains the text field uid
        let _uid = `${_name}_${_uidSuffix}`;
        this._schema.push({
            "data_type": "boolean",
            "display_name": _displayName,
            "uid": _uid,
            "field_metadata": {
                "description": ""
            }
        });
        return this;
    }
    // Date field
    date() {
        // Contains the name of the field
        let _name = 'date';
        // Contains the display name
        let _displayName = `${_name} ${++_uidSuffix}`;
        // Contains the text field uid
        let _uid = `${_name}_${_uidSuffix}`;
        this._schema.push({
            "data_type": "isodate",
            "display_name": _displayName,
            "uid": _uid,
            "icon_class": "icon-calendar",
            "startDate": null,
            "endDate": null,
            "field_metadata": {
                "description": ""
            }
        });
        return this;
    }
    // File field
    file() {
        // Contains the name of the field
        let _name = 'file';
        // Contains the display name
        let _displayName = `${_name} ${++_uidSuffix}`;
        // Contains the text field uid
        let _uid = `${_name}_${_uidSuffix}`;
        this._schema.push({
            "data_type": "file",
            "display_name": _displayName,
            "uid": _uid,
            "icon_class": "icon-file-text-alt",
            "size": {
                "min": "",
                "max": ""
            },
            "extensions": "",
            "field_metadata": {
                "description": "",
                "rich_text_type": "standard"
            }
        });
        return this;
    }
    // Link field
    link() {
        // Contains the name of the field
        let _name = 'link';
        // Contains the display name
        let _displayName = `${_name} ${++_uidSuffix}`;
        // Contains the text field uid
        let _uid = `${_name}_${_uidSuffix}`;
        this._schema.push({
            "data_type": "link",
            "display_name": _displayName,
            "uid": _uid,
            "icon_class": "icon-link",
            "field_metadata": {
                "description": ""
            }
        });
        return this;
    }
    // Reference field
    reference(_refUid) {
        // Contains the name of the field
        let _name = 'reference';
        // Contains the display name
        let _displayName = `${_name} ${++_uidSuffix}`;
        // Contains the text field uid
        let _uid = `${_name}_${_uidSuffix}`;
        this._schema.push({
            "data_type": "reference",
            "display_name": _displayName,
            "abstract": "Link to entries of another content type",
            "reference_to": _refUid,
            "field_metadata": {
                "ref_multiple": false
            },
            "uid": _uid
        });
        return this;
    }
    // Groupping fields
    group(_groupExtractSchema) {
        // Contains the name of the field
        let _name = 'group';
        // Contains the display name
        let _displayName = `${_name} ${++_uidSuffix}`;
        // Contains the text field uid
        let _uid = `${_name}_${_uidSuffix}`;
        // Contains the group schema
        let _groupSchema = new ContentTypeFields;
        // Creates the group schema
        for (let _fieldName in _groupExtractSchema) {
            try {
                if (_fieldName === 'group') {
                    _groupSchema.group(_groupExtractSchema.group);
                }
                let _fieldCount = _groupExtractSchema[_fieldName];
                let _fieldLoopNum = 0;
                while (_fieldCount > _fieldLoopNum) {
                    _groupSchema[_fieldName]();
                    _fieldLoopNum++;
                }
            } catch (_err) {}
        }
        this._schema.push({
            "data_type": "group",
            "display_name": _displayName,
            "abstract": "Collection of multiple fields",
            "category": "Other",
            "field_metadata": {},
            "schema": _groupSchema.build(),
            "uid": _uid
        });
        return this;
    }
    // Returns the Content type schema
    build() {
        let _tempSchema = this._schema;
        this._schema = [];
        return _tempSchema;
    }
}

class ContentTypeResources extends ContentTypeFields {
    constructor() {
        super();
    }
    // For Title field
    title() {
        this._schema.push({
            "display_name": "Title",
            "uid": "title",
            "data_type": "text",
            "mandatory": true,
            "unique": true,
            "field_metadata": {
                "_default": true
            }
        });
        return this;
    }
    // For URL field
    url() {
        this._schema.push({
            "display_name": "URL",
            "uid": "url",
            "data_type": "text",
            "mandatory": true,
            "field_metadata": {
                "_default": true,
                "instruction": ""
            }
        });
        return this;
    }
}

module.exports = function (_isPage) {
    // Adds the title field to the content type
    var _resource = (new ContentTypeResources).title();
    // Checks whether the content type is a page, if so, url field will be added
    if (_isPage) {
        _resource.url();
    }
    return _resource;
}