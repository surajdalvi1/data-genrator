# Contentstack Data Builder - Sample Configuration

## Description

  - If the `api_key` is provided in the `credentials`, then no extra stack will be created, the provided stack will be used.
  - If the value for an entity is given 0 (zero), then that entity will not be created.
  - Content type's type web page or content block can be choosen by `content_type.config.type` with the values `page, block`.
  - Group field's number of sub-groups level can be specified in `content_type.group.config.internal_level`.
  - Asset folder configurations can be given under `asset_folder`
    - Number of folder level is specified in `asset_folder.count`.
    - Whether only the last level of folder structure or each level of folder structure contains the asset is determined by `asset_folder.asset_presence` using the values `each, last`.
  - `config` contains the process wide configurations
  - `config.freshen` is used to tell whether the previous process run created entities in `.details.yml` file needs to be cleared prior to running the process.

## Sample Config

```
{
    "endpoints": {
        "v3": {
            "cma": "https://api.contentstack.io/v3"
        }
    },
    "credentials": {
        "api_key": "api_key",
        "authtoken": "authtoken",
        "organization_uid": "organization_uid"
    },
    "data": {
        "stack": 1,
        "content_type": 2,
        "entry": 2,
        "asset": 1
    },
    "content_type": {
        "schema": {
            "singletext": 1,
            "multitext": 1,
            "rte": 1,
            "markdown": 1,
            "select": 1,
            "number": 1,
            "boolean": 1,
            "date": 1,
            "file": 1,
            "link": 1,
            "group": 1,
            "reference": 1
        },
        "config": {
            "type": "page", // Values - page, block
            "singleton": false // Values - true, false
        },
        "group": {
            "schema": {
                "date": 2
            },
            "config": {
                "internal_level": 1
            }
        }
    },
    "asset_folder": {
        "count": 3,
        "asset_presence": "each" // Values - last, each
    },
    "config": {
        "freshen": true // Values - true, false
    }
}
```