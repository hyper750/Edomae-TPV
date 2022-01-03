export default {
    removeOptionalValues(formData) {
        const result = new FormData();
        
        // Null, undefined... values are serialized to string
        const blackListValues = [
            'undefined',
            'null'
        ];

        for(let [key, value] of formData) {
            // Set value to null if is an empty string
            if(value === '') {
                value = null;
            }

            // Avoid to include null values
            if(blackListValues.includes(value)) {
                continue;
            }
            result.set(key, value);
        }

        return result;
    },
};