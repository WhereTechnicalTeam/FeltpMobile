import { isDefined, isEmpty } from "@utils/validation"
import { RegionList } from "@utils/constants";

const safeConvertToString = (value) => {
    return isDefined(value) ? value.toString() : '';
}

const getDistrictListByRegion = (region) => {
    if (!isDefined(region)) return [];
    if (isEmpty(region)) return [];
    else {
        return RegionList.flatMap(r => (r.name == region) ? r.districts : []);
    }
}

export {safeConvertToString, getDistrictListByRegion}