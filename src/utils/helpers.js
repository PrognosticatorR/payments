const moment = require("moment");
const _ = require("lodash");

class helper {
    isValidDate(dateString) {
        return moment(dateString, "DD-MM-YYYY", true).isValid();
    }
    getISODateString(dateString) {
        return moment.utc(dateString, "DD-MM-YYYY").toISOString();
    }

    sanitizeResponse(data, removeFields = [], nullTransformations = {}) {
        const sanitizeObject = (obj) => {
            _.forOwn(obj, (value, key) => {
                if (_.includes(removeFields, key)) {
                    delete obj[key];
                    return;
                }

                if (_.isNull(value) && _.has(nullTransformations, key)) {
                    obj[key] = nullTransformations[key];
                    return;
                }

                if (_.isObject(value)) {
                    sanitizeObject(value);
                }
            });
        };

        const sanitizedData = _.cloneDeepWith(data, (value) => {
            if (_.isArray(value)) {
                return _.map(value, sanitizeObject);
            }
            if (_.isObject(value)) {
                sanitizeObject(value);
                return value;
            }
        });

        return sanitizedData;
    };
}

module.exports = new helper();