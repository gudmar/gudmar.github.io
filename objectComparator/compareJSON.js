class ObjectCompare{
    static isPrimitive(a){
        let primitives = ["number", "string", "boolean", "bigint", "undefined", "null", "symbol"]
        for(let type of primitives){
            if (typeof(a) == type){
                return true
            } 
        }
        return false
    }

    static areEqualEnumerable(a, b){
        return ObjectCompare._areEqual(a, b, Object.keys)
    }


    static areEqualEnumerableArrayValuesCompare(a, b){
        return ObjectCompare._areEqual(a, b, Object.keys, ObjectCompare.haveArraysSameValues)
    }


    static areEqualNotEnumerable(a, b) {
        return  ObjectCompare._areEqual(a, b, Reflect.ownKeys)
    }


    static areEqualNotEnumerableArrayValueCompare(a, b) {
        return  ObjectCompare._areEqual(a, b, Reflect.ownKeys, ObjectCompare.haveArraysSameValues)
    }


    static areFunctionsEqual(a, b){
        // Do not use JSON.stringify, as it often returns undefined while converting functions
        return a.toString() == b.toString()
    }


    static areMapsEqual(a, b) {
        let enumerate = function(a) {
            let arr = [];
            let keys = a.keys();
            for (let key of keys) {
                arr.push(key)
            }
            return arr
        }
        let getPropValue = function(obj, key){
            return obj.get(key)
        }
        return ObjectCompare._areObjectsEqual(a, b, enumerate, getPropValue, Reflect.ownKeys)
    }

    static areSetsEqual(a, b) {
        let enumerate = function(a) {
            let arr = [];
            let keys = a.keys();
            for (let key of keys) {
                arr.push(key)
            }
            return arr
        }
        let getPropValue = function(obj, key){
            return obj.has(key)
        }
        return ObjectCompare._areObjectsEqual(a, b, enumerate, getPropValue, Reflect.ownKeys)
    }


    static areDatesEqual(a, b){
        return a.toString() == b.toString()
    }


    static areArraysEqual(a, b, keyEnumerateMethod = Object.keys){
        // Arrays are indentical in identical order. JSON.stringify cannot be used due to nested objects !!
        let comparationMethod = function(a, b, index){
            return ObjectCompare._areEqual(a[index], b[index], keyEnumerateMethod)
        }
        return ObjectCompare.compareArrays(a, b, comparationMethod)
    }


    static haveArraysSameValues(a, b, keyEnumerateMethod = Object.keys){
        // Arrays are indentical in identical order. JSON.stringify cannot be used due to nested objects !!
        let comparationMethod = function(a, b, index){
            return doesAincludeB(a, b[index], keyEnumerateMethod)
        }
        let doesAincludeB = function(aArray, b) {
            let aLen = aArray.length;
            let isElementInArray = false;
            for (let item of aArray) {
                if (ObjectCompare._areEqual(item, b, keyEnumerateMethod, ObjectCompare.haveArraysSameValues)) {isElementInArray = true}
            }
            return isElementInArray
        }
        return ObjectCompare.compareArrays(a, b, comparationMethod)
    }


    static compareArrays(a, b, arrayElementsComparationMethod){
        if (!ObjectCompare.areArrays([a, b])) {
            throw new TypeError(`${ObjectCompare.constructor.name}: areArraysEqual: arguments should be arrays`)
        } else if (!ObjectCompare._areAllOfEqualType([a, b])) {
            return false;
        } else {
            let aLen = a.length;
            let bLen = b.length;
            let nrOfCommonKeys = 0;
            if (aLen != bLen) {
                return false;
            } else {
                for (let index = 0; index < aLen; index++){
                    if (arrayElementsComparationMethod(a, b, index)) {
                        nrOfCommonKeys++;
                    } 
                }
                return nrOfCommonKeys == bLen ? true : false
            }      
    
        }
    }


    static areNull(arr) {
        return ObjectCompare._areOfSpecificType_iterable(arr, (element) => {return element === null ? true : false})
    }


    static areSpecialNumberValues(arr) {
        let isSpecialNumber = function(a){
            if (typeof(a) != 'number') {
                return false
            } else {
                return a === Number.POSITIVE_INFINITY || isNaN(a) || a === Number.NEGATIVE_INFINITY ? true : false
            }
        }
        return ObjectCompare._areOfSpecificType_iterable(arr, isSpecialNumber)
    }

    static arePrimitivesEqual(a, b){
        if (ObjectCompare.isPrimitive(a) && ObjectCompare.isPrimitive(b)) {
            return (a == b)
        }
    }

    static areArrays(arrayOfArgs){
        return ObjectCompare._areOfSpecificType(arrayOfArgs, 'Array')
    }


    static areFunctions(arrayOfArgs){
        return ObjectCompare._areOfSpecificType(arrayOfArgs, 'Function')
    }


    static areMaps(arrayOfArgs) {
        return ObjectCompare._areOfSpecificType(arrayOfArgs, 'Map')
    }


    static areSets(arrayOfArgs) {
        return ObjectCompare._areOfSpecificType(arrayOfArgs, 'Set')
    }


    static areDates(arrayOfArgs) {
        return ObjectCompare._areOfSpecificType(arrayOfArgs, 'Date')
    }

    static compareSpecialNumberValues(a, b) {
        try {
            if (!ObjectCompare.areSpecialNumberValues([a, b])) {
                throw new TypeError(`${ObjectCompare.constructor.name}: compareSpacialNumberValues: at least one passed item is not infinity/-infinity or NaN`)
            } else {
                if (isNaN(a) && isNaN(b)) {
                    return true
                } else {
                    return a === b
                }
            }
        } catch (e) {
        }
    }


    static _areEqual(a, b, keyEnumerateMethod, arrayCompareMethod = ObjectCompare.areArraysEqual){
        // dates, bigInts, Map, Set
        if (!ObjectCompare._areAllOfEqualType([a, b])) {
            return false;
        } 
        else if (ObjectCompare.areNull([a, b])) {
            return true;
        }
        else if (ObjectCompare.areSpecialNumberValues([a, b])) {
            return ObjectCompare.compareSpecialNumberValues(a, b);
        }
        else if (ObjectCompare.isPrimitive(a) && ObjectCompare.isPrimitive(b)) { 
            return ObjectCompare.arePrimitivesEqual(a, b)
        } 
        else if (ObjectCompare.areFunctions([a, b])) {
            return ObjectCompare.areFunctionsEqual(a, b)
        } 
        else if (ObjectCompare.areDates([a, b])) {
            return ObjectCompare.areDatesEqual(a, b)
        } 
        else if (ObjectCompare.areMaps([a, b])) {
            return ObjectCompare.areMapsEqual(a, b)
        }        
        else if (ObjectCompare.areSets([a, b])) {
            return ObjectCompare.areSetsEqual(a, b)
        }  
        else if (ObjectCompare.areArrays([a, b])){
            return arrayCompareMethod(a, b, keyEnumerateMethod)
        } 
        else {
            return ObjectCompare._areObjectsEqual(a, b, keyEnumerateMethod)
        }
    }


    static _isVariableOfSpecificType(variable, constructorName){
        return variable.constructor.name == constructorName ? true : false
    }


    static _areOfSpecificType_iterable(arr, isElementOfSpecificType){
        let nrOfSpecificTypeVals = 0;
        arr.forEach(element => {
           if(isElementOfSpecificType(element)) nrOfSpecificTypeVals++;
        });
        return nrOfSpecificTypeVals == arr.length ? true : false
    }

    static _areOfSpecificType(arrayOfVars, constructorName){
        for (let arg of arrayOfVars) {
            if (!ObjectCompare._isVariableOfSpecificType(arg, constructorName)) {
                return false;
            }
        }
        return true;        
    }


    static _areAllOfEqualType(arrayOfArgs){
        if (arrayOfArgs.length < 2) {
            return true
        } else {
            let type = typeof(arrayOfArgs[0])
            for (let a of arrayOfArgs) {
                if (typeof(a) != type) {
                    return false
                }
            }
        }
        return true;
    }


    static _areObjectsEqual(a, b, keyEnumerateMethod, propValueGetter = (obj, key) => {return obj[key]}, childrenKeyEnumarateMethod){
        let keysA = keyEnumerateMethod(a);
        let keysB = keyEnumerateMethod(b);  
        childrenKeyEnumarateMethod = childrenKeyEnumarateMethod == undefined ? keyEnumerateMethod : childrenKeyEnumarateMethod;
        let nrOfEqualKeys = 0;      
        // if (!ObjectCompare.haveArraysSameValues(keysA, keysB, ObjectCompare.arePrimitivesEqual)) {
        if (!ObjectCompare.areEqualNotEnumerable(keysA, keysB)) {
            return false;
        } else {
            let lenA = keysA.length;
            let lenB = keysB.length;
            for (let key of keysA) {
                if (ObjectCompare._areEqual(propValueGetter(a, key), propValueGetter(b, key), childrenKeyEnumarateMethod)) {
                    nrOfEqualKeys++;
                } else {
                    return false
                }
            }
            return ((nrOfEqualKeys == lenA) && (nrOfEqualKeys == lenB)) ? true : false
        }
    }
}