import { isDefined, isEmpty } from "@utils/validation"
import { RegionList, levelOfHSList } from "@utils/constants";

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

const getLevelofHSById = (id) => {
    const level = levelOfHSList.filter(l => l.id == id);
    return level.length > 0 ? level[0].name : "";
}

const getRegionById = (id) => {
    const region = RegionList.filter(r => r.id == id);
    return region.length > 0 ? region[0].name : "";
}

const getDistrictById = (id) => {
    const district = RegionList.flatMap(r => r.districts.filter(d => d.id == id));
    return district.length > 0 ? district[0].name : "";
}

const includesIgnoreCase = (stringA, stringB) => {
    return stringA.toLowerCase().includes(stringB.toLowerCase())
}

export {safeConvertToString, getDistrictListByRegion, getRegionById, getDistrictById, getLevelofHSById, includesIgnoreCase}