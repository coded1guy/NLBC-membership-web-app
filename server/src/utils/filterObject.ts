/*
this function filters out items from an object and returns a cleaned object

NB: the items are the properties and their value
*/
const filterObject = (obj:object, filterItems=["password"]) => {
    let filteredObject:object = {}; // the filtered object to be returned
    // each entry is a property - value pair
    const entries = Object.entries(obj);
    // these are the properties to be filtered from the obj
    const removeKeys = filterItems;
    for (let [property, value] of entries) {
        console.log(property, value);
        if(!removeKeys.includes(property)) {
            filteredObject[property] = value;
        }
    }
    return filteredObject;
}
export default filterObject;
