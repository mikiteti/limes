const boring = {
    encrypt_array(json) {
        return JSON.stringify(json).replace("[", ",").replace("]", ",");
    },

    decrypt_array(string) {
        return JSON.parse(string.replace(",", "[").slice(0, -1) + "]");
    },

    validate_data(data) {
        const valid_names = ["name", "content", "preview", "preview_last_changed", "last_modified", "tags", "authors"];
        const names = Object.getOwnPropertyNames(data);

        let is_valid = true;

        for (const name of names) {
            if (valid_names.indexOf(name) == -1) {
                is_valid = false;
                break;
            }
        }

        return is_valid;
    },

    validate_properties(property_list) {
        const valid_properties = ["name", "password", "theme"];
        const properties = Object.getOwnPropertyNames(property_list);

        let is_valid = true;

        for (const property of properties) {
            if (valid_properties.indexOf(property) == -1) {
                is_valid = false;
                break;
            }
        }

        return is_valid;
    }
}

module.exports = boring;
