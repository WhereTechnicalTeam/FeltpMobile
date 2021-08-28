import { isDefined, isEmpty } from "@utils/validation"
import { RegionList } from "@utils/constants";
import { levelOfHSList } from "./constants";

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
    const level = levelOfHSList.map(l => {
        if(l.id == id) return l.name
    });
    return level[0];
}

const getRegionById = (id) => {
    const region = RegionList.filter(r => {
        if(r.id == id) return r.name
    });
    return region[0];
}

const getDistrictById = (id) => {
    const district = RegionList.flatMap(r => r.districts.map(d => {
        if(d.id == id) return d.name
    }));
    return district[0];
}

export {safeConvertToString, getDistrictListByRegion}