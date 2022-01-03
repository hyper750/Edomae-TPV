export default {
    removeOptionalValues(formData) {
        const result = new FormData();
        
        // Null, undefined... values are serialized to string
        const blackListValues = [
            'undefined',
            'null',
            null,
            undefined,
            '',
        ];

        for(let [key, value] of formData) {
            // Avoid to include null values
            if(blackListValues.includes(value)) {
                continue;
            }
            result.set(key, value);
        }

        return result;
    },
};