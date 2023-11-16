import { identity, pickBy } from 'lodash';

export const filterEmptyString = (params: Record<string, any>) => {
    const result: Record<string, any> = {};

    Object.entries(pickBy(params, identity)).forEach(([key, value]) => {
        result[key] =
            value !== '' && typeof value === 'string' ? value.trim() : value;
    });

    return result;
};
